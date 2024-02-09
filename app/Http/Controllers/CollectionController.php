<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\CollectionItems;
use App\Models\Group;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = auth()->user()->collections()->with(['collectionItems' => function ($query) {
            $query->with('item')->paginate(9);
        }])->get();
        return inertia('Group/SaveList', [
            'collections' => $collections
        ]);
    }

    public function removeSaveItem(Group $group, Collection $collection, CollectionItems $item)
    {
        $item->delete();
        return back()->with('success', 'Removed item from your collection.');
    }
}
