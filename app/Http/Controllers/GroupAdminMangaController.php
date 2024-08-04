<?php

namespace App\Http\Controllers;

use App\helpers\ShortenLinkGenerator;
use App\helpers\Uploader;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use App\Models\OuoFailLink;
use App\Models\Status;
use App\Models\Tag;
use App\Models\Taggable;
use Exception;
use Illuminate\Http\Request;

class GroupAdminMangaController extends Controller
{
    public function __construct(private Uploader $uploader)
    {
    }

    public function index(Group $group)
    {
        $mangas = $group->mangas()->latest()->paginate(15);
        return inertia('Group/Admin/Mangas/Index', [
            'mangas' => $mangas,
        ]);
    }

    public function create(Group $group)
    {
        return inertia('Group/Admin/Mangas/MangaForm', [
            'type' => "create",
            'statuses' => Status::all(),
            'tags' => Tag::all()
        ]);
    }

    public function store(Group $group)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['required', 'image'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required'],
            'tag_ids' => ['required'],
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        $tag_ids = collect($validatedData['tag_ids'])->map(function ($tag) {
            return $tag['value'];
        });

        unset($validatedData['tag_ids']);
        if (isset($validatedData['background_image']) && gettype($validatedData['background_image']) !== 'string') {
            $validatedData['background_image'] = $this->uploader->upload($validatedData['background_image'], 'animes');
        }
        if (isset($validatedData['transparent_background']) && gettype($validatedData['transparent_background']) !== 'string') {
            $validatedData['transparent_background'] = $this->uploader->upload($validatedData['transparent_background'], 'animes');
        }
        $validatedData['group_id'] = $group->id;
        $manga =  Manga::create($validatedData);
        if ($tag_ids->count()) {
            foreach ($tag_ids as $id) {
                Taggable::firstOrCreate([
                    'taggable_id' => $manga->id,
                    'taggable_type' => Manga::class,
                    'tag_id' => $id
                ]);
            }
        }
        return redirect(route('group.admin.mangas'))->with('success', 'Manga Series Created Successful.');
    }

    public function edit(Group $group, Manga $manga)
    {
        $chapters = Chapter::with('season')->where('chapterable_id', $manga->id)->where("chapterable_type", Manga::class)->where('group_id', $group->id)->latest()->paginate(20);
        $manga = Manga::where('id', $manga->id)->with(['tags'])->first();
        return inertia('Group/Admin/Mangas/MangaForm', [
            'type' => 'edit',
            'manga' => $manga,
            'chapters' => $chapters,
            'statuses' => Status::all(),
            'tags' => Tag::all(),
            'seasons' => $manga->seasons()->with('seasonable')->withCount('chapters')->paginate(10)
        ]);
    }

    public function update(Group $group, Manga $manga)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['required'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required'],
            'tag_ids' => ['required']
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        $tag_ids = collect($validatedData['tag_ids'])->map(function ($tag) {
            return $tag['value'];
        });
        if ($tag_ids->count()) {
            foreach ($tag_ids as $id) {
                Taggable::firstOrCreate([
                    'taggable_id' => $manga->id,
                    'taggable_type' => Manga::class,
                    'tag_id' => $id
                ]);
            }
        }
        unset($validatedData['tag_ids']);
        if (isset($validatedData['background_image']) && gettype($validatedData['background_image']) !== 'string') {
            $validatedData['background_image'] = $this->uploader->upload($validatedData['background_image'], 'animes');
        }
        if (isset($validatedData['transparent_background']) && gettype($validatedData['transparent_background']) !== 'string') {
            $validatedData['transparent_background'] = $this->uploader->upload($validatedData['transparent_background'], 'animes');
        }
        $manga->update($validatedData);
        return redirect(route('group.admin.mangas'))->with('success', 'Manga Series updated Successful.');
    }

    public function delete(Group $group, Manga $manga)
    {
        $manga->delete();
        return back()->with('success', 'Manga deleted successful.');
    }

    public function chapterCreate(Group $group, Manga $manga)
    {
        return inertia('Group/Admin/Mangas/ChapterForm', [
            'manga' => $manga,
            'seasons' => $manga->seasons,
        ]);
    }

    public function chapterStore(Group $group, Manga $manga)
    {
        $isOuoGenerateFail = false;
        $validatedData = request()->validate([
            'thumbnail' => ['required', 'image'],
            'chapter_number' => ['required'],
            'title' => ['required'],
            'link' => ['required'],
            'description' => ['nullable'],
            'season_id' => ['required']
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        $validatedData['group_id'] = $group->id;
        $validatedData['chapterable_id'] = $manga->id;
        $validatedData['chapterable_type'] = Manga::class;
        $validatedData['type']  = 'link';
        $link = $validatedData['link'];
        $validatedData['chapter_link'] = $link;
        if ($group->plan->name !== 'premium') {
            $generator = new ShortenLinkGenerator();
            try {
                $link = $generator->generate($validatedData['link']);
            } catch (Exception $e) {
                $isOuoGenerateFail = true;
            }
        }
        $validatedData['ouo_chapter_link'] = $link;
        unset($validatedData['link']);
        $chapter = Chapter::create($validatedData);
        if ($isOuoGenerateFail) {
            OuoFailLink::create([
                'group_id' => $group->id,
                'chapter_id' => $chapter->id
            ]);
        }
        return redirect(route('group.admin.mangas.edit', ['manga' => $manga]))->with('success', 'Chpater created Successful.');
    }

    public function editChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        return inertia('Group/Admin/Mangas/ChapterForm', [
            'chapter' => $chapter,
            'type' => 'edit',
            'manga' => $manga,
            'seasons' => $manga->seasons,
        ]);
    }

    public function updateChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['required'],
            'chapter_number' => ['required'],
            'title' => ['required'],
            'description' => ['required'],
            'link' => ['required'],
            'season_id' => ['required']
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] =  $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        $validatedData['group_id'] = $group->id;
        $link = $validatedData['link'];
        if ($chapter->ouo_chapter_link !== $validatedData['link']) {
            $validatedData['chapter_link'] = $link;
            if ($group->plan->name !== 'premium') {
                $generator = new ShortenLinkGenerator();
                try {
                    $link = $generator->generate($link);
                } catch (Exception $e) {
                    $failLink = OuoFailLink::where('chapter_id', $chapter->id)->first();
                    if (!$failLink) {
                        OuoFailLink::create([
                            'group_id' => $group->id,
                            'chapter_id' => $chapter->id
                        ]);
                    }
                }
            }
            $validatedData['ouo_chapter_link'] = $link;
        } else {
            $validatedData['ouo_chapter_link'] = $link;
        }
        $validatedData['chapter_link'] = $link;
        unset($validatedData['link']);
        $validatedData['chapterable_type'] = Manga::class;
        $validatedData['chapterable_id'] = $manga->id;
        $validatedData['type'] = 'link';
        $chapter->update($validatedData);
        return redirect(route('group.admin.mangas.edit', ['manga' => $manga]))->with('success', 'Chapter udpated successful.');
    }

    public function deleteChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        $chapter->delete();
        return back()->with('success', 'Delete chapter Successful.');
    }
}
