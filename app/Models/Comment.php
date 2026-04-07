<?php

namespace App\Models;

use App\Support\CommentMentionLinker;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['isLikeByCurrentUser', 'display_body'];

    protected $casts = [
        'mentioned_user_ids' => 'array',
    ];

    /**
     * Linkified HTML for Inertia (computed; not a DB column).
     */
    public function getDisplayBodyAttribute(): string
    {
        $body = (string) ($this->attributes['body'] ?? '');
        if (! self::bodyMayContainMention($body)) {
            return $body;
        }

        $group = request()->route('group');
        if (is_string($group)) {
            $group = Group::where('subdomain', $group)->first();
        }
        if (! $group instanceof Group) {
            return $body;
        }

        return CommentMentionLinker::linkifyBodyHtml(
            $body,
            $group,
            $this->mentioned_user_ids,
            null
        );
    }

    private static function bodyMayContainMention(string $body): bool
    {
        if ($body === '') {
            return false;
        }
        if (str_contains($body, '@')) {
            return true;
        }
        if (preg_match('/&#64;|&#x40;|&commat;/i', $body) === 1) {
            return true;
        }

        return str_contains(html_entity_decode($body, ENT_QUOTES | ENT_HTML5, 'UTF-8'), '@');
    }

    public function commentable()
    {
        return $this->morphTo();
    }

    public function likes()
    {
        return $this->morphMany(Likeable::class, 'likeable');
    }

    public function getIsLikeByCurrentUserAttribute()
    {
        return $this->likes()->where('user_id', auth()->id())->exists();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likeUsers()
    {
        return $this->morphToMany(User::class, 'likeable');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
