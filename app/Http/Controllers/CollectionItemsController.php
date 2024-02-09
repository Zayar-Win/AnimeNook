<?php

namespace App\Http\Controllers;

use App\Http\Requests\CollectionitemRequest;
use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Collection;
use App\Models\CollectionItems;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Http\Request;

class CollectionItemsController extends Controller
{
    public function saveOrUnSave(Group $group, Collection $collection, CollectionitemRequest $request)
    {
        $validatedData = $request->validated();
        $itemType = null;
        $data = null;
        if ($validatedData['type'] === 'anime') {
            $itemType = Anime::class;
            $data = Anime::find($validatedData['id']);
        }
        if ($validatedData['type'] === 'manga') {
            $itemType = Manga::class;
            $data = Manga::find($validatedData['id']);
        }
        if ($validatedData['type'] === 'chapter') {
            $itemType = Chapter::class;
            $data = Chapter::find($validatedData['id']);
        }
        $collectionItem = $data->collectionItems()->where('user_id', auth()->id())->first();
        if ($data->isSaveByCurrentUser) {
            $collectionItem->delete();
            return back()->with('success', 'Item remove from your ' . $collection->name . ' list.');
        }


        CollectionItems::create([
            'collection_id' => $collection->id,
            'item_type' => $itemType,
            'user_id' => auth()->user()->id,
            'item_id' => $validatedData['id']
        ]);
        return back()->with('success', 'Saved item in your ' . $collection->name . ' list.');
    }
}
