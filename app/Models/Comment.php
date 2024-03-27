<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['isLikeByCurrentUser'];

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
