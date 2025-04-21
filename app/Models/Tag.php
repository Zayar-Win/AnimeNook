<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory, HasSlug;
    protected $guarded = [];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function animes()
    {
        return $this->morphedByMany(Anime::class, 'taggable');
    }
    public function mangas()
    {
        return $this->morphedByMany(Manga::class, 'taggable');
    }

    public function blogs()
    {
        return $this->morphedByMany(Blog::class, 'taggable');
    }
}
