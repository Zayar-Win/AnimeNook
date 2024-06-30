<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manga extends Model
{
    use HasFactory, HasSlug;

    protected $with = ['status', 'tags'];

    protected $guarded = [];

    protected $appends = ['latestWatchedChapter', 'isSavedByCurrentUser', 'type'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getLatestWatchedChapterAttribute()
    {
        if (!auth()->check()) {
            return null;
        }
        $group = request()->route('group');
        if (gettype($group) === 'string') {
            $group = Group::where('name', $group)->first();
        }
        $latestWatchedChapter = $this->chapters()->join('user_chapters', function ($query) use ($group) {
            $query->on('chapters.id', '=', 'user_chapters.chapter_id')
                ->where('user_chapters.group_id', $group->id)
                ->where('user_chapters.user_id', 1);
        })->first();
        return $latestWatchedChapter;
    }

    public function getIsSavedByCurrentUserAttribute()
    {
        if (!auth()->check()) {
            return false;
        }
        return $this->collectionItems()->where('user_id', auth()->id())->exists();
    }

    public function getTypeAttribute()
    {
        return 'manga';
    }

    public function getIsLikeByCurrentUserAttribute()
    {
        if (!auth()->check()) {
            return false;
        }
        return $this->likes()->where('user_id', auth()->id())->exists();
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

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function ratings()
    {
        return $this->morphMany(Rating::class, 'ratingable');
    }

    public function likes()
    {
        return $this->morphMany(Likeable::class, 'likeable');
    }


    public function isLikeByUser()
    {
        return $this->likes()->where('user_id', auth()->id())->exists();
    }
    public function isViewedByCurrentUser()
    {
        if (auth()->check()) {
            return $this->views()->where('user_id', auth()->id())->exists();
        } else {
            $anonymous_identifier = request()->session()->get('anonymous_identifier');
            if ($anonymous_identifier) {

                return $this->views()->where('anonymous_identifier', $anonymous_identifier)->exists();
            } else {
                return false;
            }
        }
    }

    public function collectionItems()
    {
        return $this->morphMany(CollectionItems::class, 'item');
    }

    public function seasons(){
        return $this->morphMany(Season::class,'seasonable');
    }

    public function views()
    {
        return $this->morphMany(View::class, 'viewable');
    }
}
