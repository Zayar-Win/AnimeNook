<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Group $group)
    {
        $animes = Anime::where('group_id', $group->id)->where('name', 'LIKE', '%' . request('search') . '%')->paginate(4);
        $mangas = Manga::where('group_id', $group->id)->where('name', 'LIKE', '%' . request('search') . '%')->paginate(4);
        return [
            'animes' => $animes,
            'mangas' => $mangas
        ];
    }
}
