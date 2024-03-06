<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Status;
use Illuminate\Http\Request;

class GroupAdminMangaController extends Controller
{
    public function __construct(private Uploader $uploader)
    {
        
    }

    public function index(Group $group){
        $mangas = $group->mangas()->latest()->paginate(15);
        return inertia('Group/Admin/Mangas/Index',[
            'mangas' => $mangas
        ]);
    }

    public function create(Group $group){
        return inertia('Group/Admin/Mangas/MangaForm',[
            'type' => "create",
            'statuses' => Status::all(),
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
        Manga::create($validatedData);
        return redirect(route('group.admin.mangas'))->with('success','Manga Series Created Successful.');
    }

    public function edit(Group $group,Manga $manga){
        $chapters = Chapter::where('chapterable_id',$manga->id)->where("chapterable_type",Manga::class)->where('group_id',$group->id)->latest()->paginate(15);
        return inertia('Group/Admin/Mangas/MangaForm',[
            'type' => 'edit',
            'manga' => $manga,
            'chapters' => $chapters,
            'statuses' => Status::all()
        ]);
    }

    public function update(Group $group,Manga $manga){
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
        $manga->update($validatedData);
        return redirect(route('group.admin.mangas'))->with('success','Manga Series updated Successful.');
    }

    public function delete(Group $group,Manga $manga){
        $manga->delete();
        return back()->with('success','Manga deleted successful.');
    }

    public function chapterCreate(Group $group,Manga $manga){
        return inertia('Group/Admin/Mangas/ChapterForm',[
            'manga' => $manga
        ]);
    }
    
    public function chapterStore(Group $group , Manga $manga){
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
        $validatedData['chapterable_id'] = $manga->id;
        $validatedData['chapterable_type'] = Manga::class;
        $latestChapter = Chapter::where('group_id',$group->id)->where('chapterable_id',$manga->id)->where('chapterable_type',Manga::class)->latest()->first();
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

    public function editChapter(Group $group,Manga $manga,Chapter $chapter){
        return inertia('Group/Admin/Mangas/ChapterForm',[
            'chapter' => $chapter,
            'type' => 'edit',
            'manga' => $manga
        ]);
    }

    public function updateChapter(Group $group,Manga $manga,Chapter $chapter){
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
        $validatedData['chapterable_type'] = Manga::class;
        $validatedData['chapterable_id'] = $manga->id;
        $validatedData['type'] = 'link';
        $chapter->update($validatedData);
        return redirect(route('group.admin.mangas.edit',['manga' => $manga]))->with('success','Chapter udpated successful.');
    }

    public function deleteChapter(Group $group,Manga $manga,Chapter $chapter){
        $chapter->delete();
        return back()->with('success','Delete chapter Successful.');
    }
}
