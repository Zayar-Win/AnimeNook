<?php

namespace App\Http\Controllers;

use App\helpers\ShortenLinkGenerator;
use App\helpers\SlackNotifier;
use App\helpers\Uploader;
use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\OuoFailLink;
use App\Models\Status;
use App\Notifications\NewEpisodeUpload;
use App\Notifications\OuoFailNotification;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class GroupAdminAnimeController extends Controller
{
    public function __construct(private Uploader $uploader)
    {
    }
    public function index(Group $group)
    {
        $animes  = $group->animes()->with('status')->latest()->paginate(15);
        return inertia('Group/Admin/Animes/Index', [
            'animes' => $animes
        ]);
    }

    public function create(Group $group)
    {
        return inertia("Group/Admin/Animes/AnimeForm", [
            'type' => 'create',
            'statuses' => Status::all()
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
            'description' => ['required']
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        if (isset($validatedData['background_image']) && gettype($validatedData['background_image']) !== 'string') {
            $validatedData['background_image'] = $this->uploader->upload($validatedData['background_image'], 'animes');
        }
        if (isset($validatedData['transparent_background']) && gettype($validatedData['transparent_background']) !== 'string') {
            $validatedData['transparent_background'] = $this->uploader->upload($validatedData['transparent_background'], 'animes');
        }
        $validatedData['group_id'] = $group->id;
        Anime::create($validatedData);
        return redirect(route('group.admin.animes'))->with('success', 'Anime Series Created Successful.');
    }

    public function edit(Group $group, Anime $anime)
    {
        $episodes = Chapter::where('chapterable_type', Anime::class)->where('chapterable_id', $anime->id)->paginate(10);
        return inertia('Group/Admin/Animes/AnimeForm', [
            'anime' => $anime,
            'type' => 'edit',
            'episodes' => $episodes,
            'statuses' => Status::all()
        ]);
    }

    public function update(Group $group, Anime $anime)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['required'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required']
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        if (isset($validatedData['background_image']) && gettype($validatedData['background_image']) !== 'string') {
            $validatedData['background_image'] = $this->uploader->upload($validatedData['background_image'], 'animes');
        }
        if (isset($validatedData['transparent_background']) && gettype($validatedData['transparent_background']) !== 'string') {
            $validatedData['transparent_background'] = $this->uploader->upload($validatedData['transparent_background'], 'animes');
        }
        $anime->update($validatedData);
        return redirect(route('group.admin.animes'))->with('success', 'Anime Series updated Successful.');
    }

    public function delete(Group $group, Anime $anime)
    {
        $anime->delete();
        return back()->with('success', 'Anime Deleted Successful.');
    }

    public function episodeCreate(Group $group, Anime $anime)
    {
        return inertia('Group/Admin/Animes/EpisodeForm', [
            'anime' => $anime
        ]);
    }

    public function episodeStore(Group $group, Anime $anime)
    {
        $isOuoGenerateFail = false;
        $validatedData = request()->validate([
            'thumbnail' => ['required', 'image'],
            'title' => ['required'],
            'link' => ['required'],
            'description' => ['nullable'],
            'chapter_number' => ['required']
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        $validatedData['group_id'] = $group->id;
        $validatedData['chapterable_id'] = $anime->id;
        $validatedData['chapterable_type'] = Anime::class;

        $validatedData['type']  = 'link';
        $generator = new ShortenLinkGenerator();
        $link = $validatedData['link'];
        try {
            $link = $generator->generate($validatedData['link']);
        } catch (Exception $e) {
            $isOuoGenerateFail = true;
            $message = [
                'group_name' => $group->name,
                'link' => $link,
                'message' => 'Ouo Link Generation fail.Check shortenlink api or regenerate ouo link.'
            ];
            SlackNotifier::send([
                'notification' => new OuoFailNotification($message)
            ]);
        }
        $validatedData['chapter_link'] = $link;
        unset($validatedData['link']);
        $chapter = Chapter::create($validatedData);
        Notification::send($group->users, new NewEpisodeUpload($chapter, $group, $anime));
        if ($isOuoGenerateFail) {
            OuoFailLink::create([
                'group_id' => $group->id,
                'chapter_id' => $chapter->id
            ]);
        }
        return redirect(route('group.admin.animes.edit', ['anime' => $anime]))->with('success', 'Chpater created Successful.');
    }

    public function editEpisode(Group $group, Anime $anime, Chapter $episode)
    {
        return inertia('Group/Admin/Animes/EpisodeForm', [
            'episode' => $episode,
            'type' => 'edit',
            'anime' => $anime
        ]);
    }

    public function updateEpisode(Group $group, Anime $anime, Chapter $episode)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['required'],
            'chapter_number' => ['required'],
            'title' => ['required'],
            'description' => ['required'],
            'link' => ['required'],
        ]);
        if (gettype($validatedData['thumbnail']) !== 'string') {
            $validatedData['thumbnail'] =  $this->uploader->upload($validatedData['thumbnail'], 'animes');
        }
        $validatedData['group_id'] = $group->id;
        $link = $validatedData['link'];
        if ($episode->chapter_link !== $validatedData['link']) {
            $generator = new ShortenLinkGenerator();
            try {
                $link = $generator->generate($link);
            } catch (Exception $e) {
                $failLink = OuoFailLink::where('chapter_id', $episode->id)->first();
                if (!$failLink) {
                    OuoFailLink::create([
                        'group_id' => $group->id,
                        'chapter_id' => $episode->id
                    ]);
                }
                $message = [
                'group_name' => $group->name,
                'link' => $link,
                'message' => 'Ouo Link Generation fail.Check shortenlink api or regenerate ouo link.'
            ];
            SlackNotifier::send([
                'notification' => new OuoFailNotification($message)
            ]);
            }
            $validatedData['chapter_link'] = $link;
        } else {
            $validatedData['chapter_link'] = $link;
        }
        unset($validatedData['link']);
        $validatedData['chapterable_type'] = Anime::class;
        $validatedData['chapterable_id'] = $anime->id;
        $validatedData['type'] = 'link';
        $episode->update($validatedData);
        return redirect(route('group.admin.animes.edit', ['anime' => $anime]))->with('success', 'Episode udpated successful.');
    }

    public function deleteEpisode(Group $group, Anime $anime, Chapter $episode)
    {
        $episode->delete();
        return back()->with('success', 'Delete episode Successful.');
    }
}
