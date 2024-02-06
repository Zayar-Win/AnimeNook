<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectionItems extends Model
{
    use HasFactory;

    public function item()
    {
        return $this->morphTo('item', 'item_type', 'item_id');
    }
}
