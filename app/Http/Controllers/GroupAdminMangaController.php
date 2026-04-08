<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Chapter;
use App\Models\ChapterImage;
use App\Models\CollectionItems;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Status;
use App\Models\Tag;
use App\Models\Taggable;
use App\Notifications\NewMangaChapterUpload;
use App\Notifications\SavedContentUpdatedNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class GroupAdminMangaController extends Controller
{
    public function __construct(private Uploader $uploader) {}

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
            'type' => 'create',
            'statuses' => Status::all(),
            'tags' => Tag::all(),
        ]);
    }

    public function store(Group $group)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['nullable', 'image'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required'],
            'tag_ids' => ['required'],
        ]);
        if (($validatedData['thumbnail'] ?? null) instanceof UploadedFile) {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        } else {
            $validatedData['thumbnail'] = null;
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
        $manga = Manga::create($validatedData);
        if ($tag_ids->count()) {
            foreach ($tag_ids as $id) {
                Taggable::firstOrCreate([
                    'taggable_id' => $manga->id,
                    'taggable_type' => Manga::class,
                    'tag_id' => $id,
                ]);
            }
        }

        return redirect(route('group.admin.mangas'))->with('success', 'Manga Series Created Successful.');
    }

    public function edit(Group $group, Manga $manga)
    {
        $chapters = Chapter::with('season')->where('chapterable_id', $manga->id)->where('chapterable_type', Manga::class)->where('group_id', $group->id)->latest()->paginate(20);
        $manga = Manga::where('id', $manga->id)->with(['tags'])->first();

        return inertia('Group/Admin/Mangas/MangaForm', [
            'type' => 'edit',
            'manga' => $manga,
            'chapters' => $chapters,
            'statuses' => Status::all(),
            'tags' => Tag::all(),
            'seasons' => $manga->seasons()->with('seasonable')->withCount('chapters')->paginate(10),
        ]);
    }

    public function update(Group $group, Manga $manga)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['nullable'],
            'background_image' => ['nullable'],
            'transparent_background' => ['nullable'],
            'name' => ['required'],
            'status_id' => ['required'],
            'description' => ['required'],
            'tag_ids' => ['required'],
        ]);
        if (array_key_exists('thumbnail', $validatedData)) {
            $thumb = $validatedData['thumbnail'];
            if ($thumb instanceof UploadedFile) {
                $validatedData['thumbnail'] = $this->uploader->upload($thumb, 'animes');
            } elseif ($thumb === null || $thumb === '') {
                $validatedData['thumbnail'] = null;
            }
        }
        $tag_ids = collect($validatedData['tag_ids'])->map(function ($tag) {
            return $tag['value'];
        });
        if ($tag_ids->count()) {
            foreach ($tag_ids as $id) {
                Taggable::firstOrCreate([
                    'taggable_id' => $manga->id,
                    'taggable_type' => Manga::class,
                    'tag_id' => $id,
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
        $validatedData = request()->validate([
            'thumbnail' => ['nullable', 'image'],
            'chapter_number' => ['required'],
            'title' => ['required'],
            'description' => ['nullable'],
            'season_id' => ['required'],
            'content_mode' => ['required', Rule::in(['images', 'pdf'])],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'max:20480'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
        ]);

        $contentMode = $validatedData['content_mode'];
        $pdfFile = request()->file('pdf');
        $imagesFromRequest = collect($validatedData['images'] ?? [])->filter(fn ($f) => $f instanceof UploadedFile);

        if ($contentMode === 'pdf') {
            if (! $pdfFile) {
                throw ValidationException::withMessages(['pdf' => 'Upload a PDF file for this chapter.']);
            }
            if ($imagesFromRequest->isNotEmpty()) {
                throw ValidationException::withMessages(['images' => 'Use either image pages or one PDF, not both.']);
            }
        } else {
            if ($pdfFile) {
                throw ValidationException::withMessages(['pdf' => 'Use either image pages or one PDF, not both.']);
            }
            if ($imagesFromRequest->isEmpty()) {
                throw ValidationException::withMessages(['images' => 'Upload at least one page image.']);
            }
        }

        if (($validatedData['thumbnail'] ?? null) instanceof UploadedFile) {
            $validatedData['thumbnail'] = $this->uploader->upload($validatedData['thumbnail'], 'animes');
        } else {
            $validatedData['thumbnail'] = null;
        }
        $validatedData['group_id'] = $group->id;
        $validatedData['chapterable_id'] = $manga->id;
        $validatedData['chapterable_type'] = Manga::class;
        $validatedData['chapter_link'] = null;
        $validatedData['ouo_chapter_link'] = null;

        if ($contentMode === 'pdf') {
            $validatedData['pdf_path'] = $this->uploader->upload($pdfFile, 'mangas');
            $validatedData['type'] = 'pdf';
        } else {
            $validatedData['pdf_path'] = null;
            $validatedData['type'] = 'link';
        }

        unset($validatedData['content_mode'], $validatedData['images'], $validatedData['pdf']);
        $chapter = Chapter::create($validatedData);

        $savedUserIds = CollectionItems::query()
            ->where('item_type', Manga::class)
            ->where('item_id', $manga->id)
            ->pluck('user_id')
            ->unique()
            ->all();

        $nonSavers = $group->users()->whereNotIn('id', $savedUserIds)->get();
        $savers = $group->users()->whereIn('id', $savedUserIds)->get();

        if ($nonSavers->isNotEmpty()) {
            Notification::send($nonSavers, new NewMangaChapterUpload($chapter, $group, $manga));
        }
        if ($savers->isNotEmpty()) {
            Notification::send($savers, new SavedContentUpdatedNotification($chapter, $group, $manga));
        }

        if ($contentMode === 'images') {
            foreach ($imagesFromRequest->values() as $index => $image) {
                $path = $this->uploader->upload($image, 'mangas');
                ChapterImage::create([
                    'chapter_id' => $chapter->id,
                    'path' => $path,
                    'order' => $index,
                ]);
            }
        }

        return redirect(route('group.admin.mangas.edit', ['manga' => $manga]))->with('success', 'Chpater created Successful.');
    }

    public function editChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        return inertia('Group/Admin/Mangas/ChapterForm', [
            'chapter' => $chapter,
            'images' => $chapter->images()->orderBy('order', 'desc')->get(),
            'type' => 'edit',
            'manga' => $manga,
            'seasons' => $manga->seasons,
        ]);
    }

    public function updateChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['nullable'],
            'chapter_number' => ['required'],
            'title' => ['required'],
            'description' => ['required'],
            'season_id' => ['required'],
            'content_mode' => ['required', Rule::in(['images', 'pdf'])],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
        ]);

        $contentMode = $validatedData['content_mode'];
        $pdfFile = request()->file('pdf');
        $imagesFromRequest = $validatedData['images'] ?? [];

        if ($contentMode === 'pdf') {
            if (! $pdfFile && ! $chapter->pdf_path) {
                throw ValidationException::withMessages(['pdf' => 'Upload a PDF file or keep the existing chapter PDF.']);
            }
            $newImageFiles = collect($imagesFromRequest)->filter(fn ($f) => $f instanceof UploadedFile);
            if ($newImageFiles->isNotEmpty()) {
                throw ValidationException::withMessages(['images' => 'Use either image pages or one PDF, not both.']);
            }
        } else {
            if ($pdfFile) {
                throw ValidationException::withMessages(['pdf' => 'Use either image pages or one PDF, not both.']);
            }
            $hasExisting = collect($imagesFromRequest)->contains(fn ($i) => is_array($i) && isset($i['id']));
            $hasNewFiles = collect($imagesFromRequest)->filter(fn ($i) => $i instanceof UploadedFile)->isNotEmpty();
            if (! $hasExisting && ! $hasNewFiles) {
                throw ValidationException::withMessages(['images' => 'Add at least one page image.']);
            }
            foreach ($imagesFromRequest as $img) {
                if ($img instanceof UploadedFile) {
                    Validator::make(
                        ['file' => $img],
                        ['file' => ['required', 'image', 'max:20480']],
                    )->validate();
                }
            }
        }

        if (array_key_exists('thumbnail', $validatedData)) {
            $thumb = $validatedData['thumbnail'];
            if ($thumb instanceof UploadedFile) {
                $validatedData['thumbnail'] = $this->uploader->upload($thumb, 'animes');
            } elseif ($thumb === null || $thumb === '') {
                $validatedData['thumbnail'] = null;
            }
        }
        $validatedData['group_id'] = $group->id;
        $validatedData['chapter_link'] = null;
        $validatedData['ouo_chapter_link'] = null;
        $validatedData['chapterable_type'] = Manga::class;
        $validatedData['chapterable_id'] = $manga->id;

        if ($contentMode === 'pdf') {
            $validatedData['type'] = 'pdf';
            if ($pdfFile) {
                if ($chapter->pdf_path) {
                    $this->uploader->remove($chapter->pdf_path);
                }
                $validatedData['pdf_path'] = $this->uploader->upload($pdfFile, 'mangas');
                $chapter->images()->each(function ($image) {
                    $this->uploader->remove($image->path);
                    $image->delete();
                });
            }
        } else {
            $validatedData['type'] = 'link';
            if ($chapter->pdf_path) {
                $this->uploader->remove($chapter->pdf_path);
            }
            $validatedData['pdf_path'] = null;
        }

        unset($validatedData['content_mode'], $validatedData['images'], $validatedData['pdf']);
        $chapter->update($validatedData);

        if ($contentMode === 'images') {
            $existingImageIdsInRequest = collect($imagesFromRequest)->filter(function ($image) {
                return is_array($image) && isset($image['id']);
            })->map(function ($image) {
                return $image['id'];
            });

            $chapter->images()->whereNotIn('id', $existingImageIdsInRequest)->each(function ($image) {
                $this->uploader->remove($image->path);
                $image->delete();
            });

            foreach ($imagesFromRequest as $index => $image) {
                if (is_array($image) && isset($image['id'])) {
                    ChapterImage::where('id', $image['id'])->update([
                        'order' => $index,
                    ]);
                }

                if ($image instanceof UploadedFile) {
                    $path = $this->uploader->upload($image, 'mangas');
                    ChapterImage::create([
                        'chapter_id' => $chapter->id,
                        'path' => $path,
                        'order' => $index,
                    ]);
                }
            }
        }

        return redirect(route('group.admin.mangas.edit', ['manga' => $manga]))->with('success', 'Chapter udpated successful.');
    }

    public function deleteChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        $chapter->delete();

        return back()->with('success', 'Delete chapter Successful.');
    }
}
