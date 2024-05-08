<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $with = ['plan'];

    public function animes()
    {
        return $this->hasMany(Anime::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function subscribers()
    {
        return $this->hasMany(Subscriber::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function mangas()
    {
        return $this->hasMany(Manga::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }
}
