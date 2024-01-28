<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    use HasFactory, HasSlug;

    protected $with = ['status', 'tags'];
    protected $guarded = [];

    protected $appends = ['latestWatchedChapter'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getLatestWatchedChapterAttribute()
    {
        $group = request()->route('group');
        $latestWatchedChapter = $this->chapters()->join('user_chapters', function ($query) use ($group) {
            $query->on('chapters.id', '=', 'user_chapters.chapter_id')
                ->where('user_chapters.group_id', $group->id)
                ->where('user_chapters.user_id', 1);
        })->first();


        return $latestWatchedChapter;
    }

    public function getIsLikeByCurrentUserAttribute()
    {
        if (!auth()->check()) {
            return false;
        }
        return $this->likeUsers()->where('user_id', auth()->id())->exists();
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function chapters()
    {
        return $this->morphMany(Chapter::class, 'chapterable');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggables');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function ratings()
    {
        return $this->morphMany(Rating::class, 'ratingable');
    }

    public function likes()
    {
        return $this->morphMany(Likeable::class, 'likeable');
    }

    public function likeUsers()
    {
        return $this->morphToMany(User::class, 'likeable');
    }
}
