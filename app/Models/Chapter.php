<?php

namespace App\Models;

use App\Traits\GroupGetter;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory,GroupGetter;
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

    protected function getChapterLinkAttribute(){
        $group = $this->group();
        if($group->plan->name === 'premium'){
            return $this->attributes['chapter_link'];
        }else{
            return $this->ouo_chapter_link;
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

    public function season(){
        return $this->belongsTo(Season::class);
        }
}
