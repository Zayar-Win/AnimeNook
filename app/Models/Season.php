<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function seasonable(){
        return $this->morphTo();
    }

    public function chapters(){
        return $this->hasMany(Chapter::class);
    }

    
}
