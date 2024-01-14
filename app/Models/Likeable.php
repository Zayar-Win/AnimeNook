<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Likeable extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function likeable()
    {
        return $this->morphTo();
    }
}
