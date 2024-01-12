<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    public function animes()
    {
        return $this->hasMany(Anime::class);
    }

    public function mangas()
    {
        return $this->hasMany(Manga::class);
    }
}
