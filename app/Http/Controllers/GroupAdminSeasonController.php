<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Season;
use Illuminate\Http\Request;

class GroupAdminSeasonController extends Controller
{
    public function animeSeasonCreate(Group $group,Anime $anime){
        return inertia('Group/Admin/Seasons/SeasonForm',[
            'serie' => $anime,
            'type' => 'anime'
        ]);
    }
    public function mangaSeasonCreate(Group $group,Manga $manga){
        return inertia('Group/Admin/Seasons/SeasonForm',[
            'serie' => $manga,
            'type' => 'manga'
        ]);
    }

    public function store(Request $request,Group $group){
        $validatedData = request()->validate([
            'title' => 'required|min:5|max:255',
            'season_number' => 'required|numeric',
            'type' => 'required',
            'serie' => 'required'
        ]);
        $type = request()->type;

        $isAlreadyExists = Season::where('group_id',$group->id)->where('seasonable_id', $validatedData['serie']['id'])->where('seasonable_type',$type === 'anime' ? Anime::class : Manga::class)->where('season_number',$validatedData['season_number'])->exists();
        if($isAlreadyExists){
            return back()->withErrors(['season_number' => 'This season already created.']);
        }
        Season::create([
            'title'=> $validatedData['title'],
            'season_number' => $validatedData['season_number'],
             'group_id'  => $group->id,
             'seasonable_id' => $validatedData['serie']['id'],
             'seasonable_type' => $type === 'anime' ? Anime::class : Manga::class
        ]);
        return back()->with('success','New Season Created');
    }

    public function animeSeasonEdit(Group $group,Anime $anime,Season $season){
        return inertia('Group/Admin/Seasons/SeasonForm',[
            'serie' => $anime,
            'type' => 'anime',
            'season' => $season
        ]);
    }
    public function mangaSeasonEdit(Group $group,Manga $manga,Season $season){
        return inertia('Group/Admin/Seasons/SeasonForm',[
            'serie' => $manga,
            'type' => 'manga',
            'season' => $season
        ]);
    }

    public function seasonUpdate(Group $group,Season $season){
        $validatedData = request()->validate([
            'title' => 'required|min:5|max:255',
            'season_number' => 'required|numeric',
            'type' => 'required',
            'serie' => 'required'
        ]);
        $type = request()->type;

        $isAlreadyExists = Season::where(function($query) use($group,$validatedData,$season,$type) {
            return $query->where(function ($query) use ($group,$validatedData,$type) {
                $query->where('group_id',$group->id)->where('seasonable_id', $validatedData['serie']['id'])->where('seasonable_type',$type === 'anime' ? Anime::class : Manga::class)->where('season_number',$validatedData['season_number']);
            });
        })->where('id','!=',$season->id)->exists();
        if($isAlreadyExists){
            return back()->withErrors(['season_number' => 'This season already created.']);
        }
        $season->update([
            'title'=> $validatedData['title'],
            'season_number' => $validatedData['season_number'],
        ]);
        return back()->with('success','New Season Updated');
    }


    public function delete(Request $request,Group $group,Season $season){
        $seasonChapters = $season->chapters;
        foreach($seasonChapters as $chapter){
            $chapter->update(['season_id' => null]);
        }
        $season->delete();
        return back()->with('success','Season deleted successful.');
    }
}
