<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    use HasFactory, HasSlug;

    protected $appends = ['latestWatchedChapter'];


    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getLatestWatchedChapterAttribute()
    {
        $latestWatchedChapter = $this->chapters()->join('user_chapters', function ($query) {
            $query->on('chapters.id', '=', 'user_chapters.chapter_id')
                ->where('user_id', 1);
        })->first();

        return $latestWatchedChapter;
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
}
