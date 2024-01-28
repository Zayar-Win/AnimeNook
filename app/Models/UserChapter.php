<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserChapter extends Model
{
    use HasFactory;

    public function chapterable()
    {
        return $this->morphTo();
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}
