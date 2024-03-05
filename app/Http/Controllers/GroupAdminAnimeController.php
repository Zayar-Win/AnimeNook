<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Status;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Http\Request;

class GroupAdminAnimeController extends Controller
{
    public function __construct(private Uploader $uploader)
    {
        
    }
    public function index(Group $group){
        $animes  = $group->animes()->with('status')->latest()->paginate(15);
        return inertia('Group/Admin/Animes/Index',[
            'animes' => $animes
        ]);
    }   

    public function create(Group $group){
        return inertia("Group/Admin/Animes/AnimeForm",[
            'type' => 'create',
            'statuses' => Status::all()
        ]);
    }

    public function store(Group $group){
        $validatedData = request()->validate([
            'thumbnail' => ['required','image'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required']
        ]);
        if(gettype($validatedData['thumbnail']) !== 'string'){
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'],'animes');
        }
        if(isset($validatedData['background_image']) && gettype($validatedData['background_image']) !== 'string'){
            $validatedData['background_image'] = $this->uploader->upload($validatedData['background_image'],'animes');
        }
        if(isset($validatedData['transparent_background']) && gettype($validatedData['transparent_background']) !== 'string'){
            $validatedData['transparent_background'] = $this->uploader->upload($validatedData['transparent_background'],'animes');
        }
        $validatedData['group_id'] = $group->id;
        Anime::create($validatedData);
        return redirect(route('group.admin.animes'))->with('success','Anime Series Created Successful.');
    }

    public function edit(Group $group,Anime $anime){
        $episodes = Chapter::where('chapterable_type',Anime::class)->where('chapterable_id',$anime->id)->paginate(10);
        return inertia('Group/Admin/Animes/AnimeForm',[
            'anime' => $anime,
            'type' => 'edit',
            'episodes' => $episodes,
            'statuses' => Status::all()
        ]);
    }

    public function update(Group $group,Anime $anime){
        $validatedData = request()->validate([
            'thumbnail' => ['required'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required']
        ]);
        if(gettype($validatedData['thumbnail']) !== 'string'){
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'],'animes');
        }
        if(isset($validatedData['background_image']) && gettype($validatedData['background_image']) !== 'string'){
            $validatedData['background_image'] = $this->uploader->upload($validatedData['background_image'],'animes');
        }
        if(isset($validatedData['transparent_background']) && gettype($validatedData['transparent_background']) !== 'string'){
            $validatedData['transparent_background'] = $this->uploader->upload($validatedData['transparent_background'],'animes');
        }
        $anime->update($validatedData);
        return redirect(route('group.admin.animes'))->with('success','Anime Series updated Successful.');
    }

    public function delete(Group $group,Anime $anime){
        $anime->delete();
        return back()->with('success','Anime Deleted Successful.');
    }

    public function episodeCreate(Group $group,Anime $anime){
        return inertia('Group/Admin/Animes/EpisodeForm',[
            'anime' => $anime
        ]);
    }
    
    public function episodeStore(Group $group , Anime $anime){
        $validatedData = request()->validate([
            'thumbnail' => ['required','image'],
            'title' => ['required'],
            'link' => ['required'],
            'description' => ['nullable']
        ]);
        if(gettype($validatedData['thumbnail']) !== 'string'){
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'],'animes');
        }
        $validatedData['group_id'] = $group->id;
        $validatedData['chapterable_id'] = $anime->id;
        $validatedData['chapterable_type'] = Anime::class;
        $latestChapter = Chapter::where('group_id',$group->id)->where('chapterable_id',$anime->id)->where('chapterable_type',Anime::class)->latest()->first();
        if($latestChapter){
            $validatedData['chapter_number'] = $latestChapter->chapter_number + 1;
        }else{
            $validatedData['chapter_number'] = 1;
        }

        $validatedData['type']  = 'link';
        $validatedData['chapter_link'] = $validatedData['link'];
        unset($validatedData['link']);
        Chapter::create($validatedData);
        return back()->with('success','Chpater created Successful.');
    }

    public function editEpisode(Group $group,Anime $anime,Chapter $episode){
        return inertia('Group/Admin/Animes/EpisodeForm',[
            'episode' => $episode,
            'type' => 'edit',
            'anime' => $anime
        ]);
    }

    public function updateEpisode(Group $group,Anime $anime,Chapter $episode){
        $validatedData = request()->validate([
            'thumbnail' => ['required'],
            'chapter_number' => ['required'],
            'title' => ['required'],
            'description' => ['required'],
            'link' => ['required'],
        ]);
        if(gettype($validatedData['thumbnail']) !== 'string'){
            $validatedData['thumbnail'] =  $this->uploader->upload($validatedData['thumbnail'],'animes');
        }
        $validatedData['group_id'] = $group->id;
        $validatedData['chapter_link'] = $validatedData['link'];
        unset($validatedData['link']);
        $validatedData['chapterable_type'] = Anime::class;
        $validatedData['chapterable_id'] = $anime->id;
        $validatedData['type'] = 'link';
        $episode->update($validatedData);
        return redirect(route('group.admin.animes.edit',['anime' => $anime]))->with('success','Episode udpated successful.');
    }

    public function deleteEpisode(Group $group,Anime $anime,Chapter $episode){
        $episode->delete();
        return back()->with('success','Delete episode Successful.');
    }
}
