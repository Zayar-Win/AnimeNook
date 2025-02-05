<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupSetting extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'social_links' => 'object'
    ];
}
