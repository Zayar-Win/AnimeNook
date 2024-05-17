<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $appends = ['type'];

    public function chapterable()
    {
        return $this->morphTo();
    }

    public function getTypeAttribute()
    {
        if ($this->chapterable_type === 'App\Models\Anime') {
            return 'anime';
        } else {
            return 'manga';
        }
    }


    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
