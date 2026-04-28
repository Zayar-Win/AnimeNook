<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdsenseReport extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'report_date' => 'date',
        'estimated_earnings' => 'decimal:2',
        'ctr' => 'decimal:4',
        'rpm' => 'decimal:4',
    ];
}

