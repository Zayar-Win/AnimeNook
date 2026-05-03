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
use App\Models\UploadSession;
use App\Notifications\NewMangaChapterUpload;
use App\Notifications\SavedContentUpdatedNotification;
use App\Services\ChapterZipImportRegistrar;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class GroupAdminMangaController extends Controller
{
    public function __construct(
        private Uploader $uploader,
        private ChapterZipImportRegistrar $zipImportRegistrar,
    ) {}

    private function requestZipUploadId(Request $request): ?string
    {
        $raw = $request->input('zip_upload_id');
        if ($raw === null || $raw === '') {
            return null;
        }
        $id = trim((string) $raw);

        return $id !== '' ? $id : null;
    }

    private function resolveChunkUploadToUrl(Group $group, Request $request, string $target, string $maybeId): ?string
    {
        $id = trim($maybeId);
        if ($id === '' || ! Str::isUuid($id)) {
            return null;
        }

        /** @var UploadSession|null $session */
        $session = UploadSession::query()
            ->where('id', $id)
            ->where('group_id', $group->id)
            ->where('user_id', $request->user()->id)
            ->where('target', $target)
            ->first();

        if (! $session) {
            return null;
        }

        if ($session->status !== 'complete' || ! $session->stored_url) {
            throw ValidationException::withMessages([
                ($target === 'chapter-pdf' ? 'pdf' : 'images') => 'Upload is not finished yet.',
            ]);
        }

        // One-time consumption; revert endpoint can also remove it pre-submit.
        $stored = $session->stored_url;
        $session->delete();

        return $stored;
    }

    private function mixedArrayInput(Request $request, string $key): array
    {
        $input = $request->input($key, []);
        $files = $request->file($key, []);
        $max = max(
            is_array($input) ? count($input) : 0,
            is_array($files) ? count($files) : 0,
        );

        $out = [];
        for ($i = 0; $i < $max; $i++) {
            if (is_array($files) && array_key_exists($i, $files) && $files[$i] instanceof UploadedFile) {
                $out[] = $files[$i];

                continue;
            }
            if (is_array($input) && array_key_exists($i, $input)) {
                $out[] = $input[$i];
            }
        }

        return $out;
    }

    public function index(Group $group, Request $request)
    {
        $data = [
            'search' => trim((string) $request->input('search', '')),
            'status_id' => $request->filled('status_id') ? $request->input('status_id') : null,
        ];

        $filters = validator($data, [
            'search' => ['nullable', 'string', 'max:255'],
            'status_id' => ['nullable', 'integer', Rule::exists('statuses', 'id')],
        ])->validated();

        $query = $group->mangas();

        if (($filters['search'] ?? '') !== '') {
            $like = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('description', 'like', $like);
            });
        }

        if (! empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }

        $mangas = $query->latest()->paginate(15)->withQueryString();

        return inertia('Group/Admin/Mangas/Index', [
            'mangas' => $mangas,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status_id' => isset($filters['status_id']) ? (string) $filters['status_id'] : '',
            ],
            'statuses' => Status::orderBy('name')->get(['id', 'name']),
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

    public function edit(Group $group, Manga $manga, Request $request)
    {
        $seasonInput = [
            'season_search' => trim((string) $request->input('season_search', '')),
            'season_chapters' => $request->input('season_chapters', 'any'),
        ];
        $seasonValidated = validator($seasonInput, [
            'season_search' => ['nullable', 'string', 'max:255'],
            'season_chapters' => ['nullable', 'in:any,with,none'],
        ])->validated();

        $chaptersMode = $seasonValidated['season_chapters'] ?? 'any';
        if (! in_array($chaptersMode, ['any', 'with', 'none'], true)) {
            $chaptersMode = 'any';
        }

        $seasonQuery = $manga->seasons()->with('seasonable')->withCount('chapters');

        if (($seasonValidated['season_search'] ?? '') !== '') {
            $term = $seasonValidated['season_search'];
            $like = '%'.$term.'%';
            $seasonQuery->where(function ($q) use ($like, $term) {
                $q->where('title', 'like', $like);
                if (ctype_digit($term)) {
                    $q->orWhere('season_number', (int) $term);
                }
            });
        }

        if ($chaptersMode === 'with') {
            $seasonQuery->has('chapters');
        } elseif ($chaptersMode === 'none') {
            $seasonQuery->doesntHave('chapters');
        }

        $seasons = $seasonQuery->orderBy('season_number')
            ->paginate(10, ['*'], 'seasons_page')
            ->withQueryString();

        $chapters = Chapter::with('season')
            ->where('chapterable_id', $manga->id)
            ->where('chapterable_type', Manga::class)
            ->where('group_id', $group->id)
            ->latest()
            ->paginate(20, ['*'], 'chapters_page')
            ->withQueryString();

        $manga = Manga::where('id', $manga->id)->with(['tags'])->first();

        return inertia('Group/Admin/Mangas/MangaForm', [
            'type' => 'edit',
            'manga' => $manga,
            'chapters' => $chapters,
            'statuses' => Status::all(),
            'tags' => Tag::all(),
            'seasons' => $seasons,
            'seasonFilters' => [
                'search' => $seasonValidated['season_search'] ?? '',
                'chapters' => $chaptersMode,
            ],
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

    public function bulkDelete(Group $group, Request $request)
    {
        $validated = $request->validate([
            'manga_ids' => ['required', 'array', 'min:1'],
            'manga_ids.*' => ['integer'],
        ]);

        Manga::query()
            ->where('group_id', $group->id)
            ->whereIn('id', $validated['manga_ids'])
            ->delete();

        return back()->with('success', 'Selected manga deleted successfully.');
    }

    private function paginatedSeasonsForChapterForm(Manga $manga, Request $request): array
    {
        $input = [
            'season_search' => trim((string) $request->input('season_search', '')),
            'season_order' => $request->input('season_order', 'asc'),
        ];
        $filters = validator($input, [
            'season_search' => ['nullable', 'string', 'max:255'],
            'season_order' => ['nullable', 'in:asc,desc'],
        ])->validated();

        $order = ($filters['season_order'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $query = $manga->seasons()->orderBy('season_number', $order);

        if (($filters['season_search'] ?? '') !== '') {
            $term = $filters['season_search'];
            $like = '%'.$term.'%';
            $query->where(function ($q) use ($like, $term) {
                $q->where('title', 'like', $like);
                if (ctype_digit($term)) {
                    $q->orWhere('season_number', (int) $term);
                }
            });
        }

        $paginator = $query
            ->paginate(12, ['*'], 'chapter_seasons_page')
            ->withQueryString();

        return [
            $paginator,
            [
                'search' => $filters['season_search'] ?? '',
                'order' => $order,
            ],
        ];
    }

    public function chapterCreate(Group $group, Manga $manga, Request $request)
    {
        [$seasons, $seasonListFilters] = $this->paginatedSeasonsForChapterForm($manga, $request);

        return inertia('Group/Admin/Mangas/ChapterForm', [
            'manga' => $manga,
            'seasons' => $seasons,
            'seasonListFilters' => $seasonListFilters,
            'type' => 'create',
            'chapter' => null,
            'images' => [],
            'selectedSeasonSummary' => null,
        ]);
    }

    public function chapterStore(Group $group, Manga $manga)
    {
        $validatedData = request()->validate([
            'thumbnail' => ['nullable', 'image'],
            'chapter_number' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'season_id' => ['required', 'integer'],
            'content_mode' => ['required', Rule::in(['images', 'pdf'])],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable', 'image'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'zip_upload_id' => ['nullable', 'string', 'uuid'],
        ]);

        $request = request();
        $contentMode = $validatedData['content_mode'];
        $zipUploadId = $this->requestZipUploadId($request);

        $pdfInput = $request->file('pdf') instanceof UploadedFile
            ? $request->file('pdf')
            : $request->input('pdf');

        $imagesMixed = $this->mixedArrayInput($request, 'images');

        if ($contentMode === 'pdf') {
            if ($zipUploadId) {
                throw ValidationException::withMessages(['zip_upload_id' => 'ZIP import applies to image chapters only.']);
            }
            if (! $pdfInput) {
                throw ValidationException::withMessages(['pdf' => 'Upload a PDF file for this chapter.']);
            }
            if (! empty($imagesMixed)) {
                throw ValidationException::withMessages(['images' => 'Use either image pages or one PDF, not both.']);
            }
        } else {
            if ($pdfInput) {
                throw ValidationException::withMessages(['pdf' => 'Use either image pages or one PDF, not both.']);
            }
            if ($zipUploadId) {
                if (! empty($imagesMixed)) {
                    throw ValidationException::withMessages(['images' => 'Use either a ZIP archive or individual images, not both.']);
                }
            } elseif (empty($imagesMixed)) {
                throw ValidationException::withMessages(['images' => 'Upload at least one page image or a ZIP of pages.']);
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
            if ($pdfInput instanceof UploadedFile) {
                Validator::make(['pdf' => $pdfInput], ['pdf' => ['required', 'file', 'mimes:pdf', 'max:51200']])->validate();
                $validatedData['pdf_path'] = $this->uploader->upload($pdfInput, 'mangas');
            } elseif (is_string($pdfInput)) {
                $resolved = $this->resolveChunkUploadToUrl($group, $request, 'chapter-pdf', $pdfInput);
                $pdfPath = $resolved ?: trim($pdfInput);
                if ($pdfPath === '') {
                    throw ValidationException::withMessages(['pdf' => 'Invalid PDF reference.']);
                }
                $validatedData['pdf_path'] = $pdfPath;
            } else {
                throw ValidationException::withMessages(['pdf' => 'Upload a PDF file for this chapter.']);
            }
            $validatedData['type'] = 'pdf';
        } else {
            $validatedData['pdf_path'] = null;
            $validatedData['type'] = 'link';
        }

        unset($validatedData['content_mode'], $validatedData['images'], $validatedData['pdf'], $validatedData['zip_upload_id']);
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
            if ($zipUploadId) {
                $this->zipImportRegistrar->queueFromUploadSession($group, $request, $chapter, $zipUploadId);
            } else {
                foreach (array_values($imagesMixed) as $index => $image) {
                    $path = null;

                    if ($image instanceof UploadedFile) {
                        Validator::make(['file' => $image], ['file' => ['required', 'image', 'max:20480']])->validate();
                        $path = $this->uploader->upload($image, 'mangas');
                    } elseif (is_string($image)) {
                        $resolved = $this->resolveChunkUploadToUrl($group, $request, 'chapter-image', $image);
                        $path = $resolved ?: trim($image);
                    } elseif (is_array($image) && isset($image['path'])) {
                        $path = (string) $image['path'];
                    }

                    $path = is_string($path) ? trim($path) : '';
                    if ($path === '') {
                        throw ValidationException::withMessages(['images' => 'One of the uploaded images is invalid.']);
                    }

                    ChapterImage::create([
                        'chapter_id' => $chapter->id,
                        'path' => $path,
                        'order' => $index,
                    ]);
                }
            }
        }

        $successMessage = 'Chpater created Successful.';
        if ($contentMode === 'images' && $zipUploadId) {
            $successMessage .= ' Chapter pages are being imported from your ZIP in the background.';
        }

        return redirect(route('group.admin.mangas.edit', ['manga' => $manga]))->with('success', $successMessage);
    }

    public function editChapter(Group $group, Manga $manga, Chapter $chapter, Request $request)
    {
        $chapter->load('season');
        [$seasons, $seasonListFilters] = $this->paginatedSeasonsForChapterForm($manga, $request);

        $selectedSeasonSummary = $chapter->season
            ? [
                'id' => $chapter->season->id,
                'title' => $chapter->season->title,
                'season_number' => $chapter->season->season_number,
            ]
            : null;

        return inertia('Group/Admin/Mangas/ChapterForm', [
            'chapter' => $chapter,
            'images' => $chapter->images()->orderBy('order', 'asc')->get(),
            'type' => 'edit',
            'manga' => $manga,
            'seasons' => $seasons,
            'seasonListFilters' => $seasonListFilters,
            'selectedSeasonSummary' => $selectedSeasonSummary,
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
            'pdf' => ['nullable'],
            'zip_upload_id' => ['nullable', 'string', 'uuid'],
        ]);

        $request = request();
        $contentMode = $validatedData['content_mode'];
        $zipUploadId = $this->requestZipUploadId($request);

        $pdfInput = $request->file('pdf') instanceof UploadedFile
            ? $request->file('pdf')
            : $request->input('pdf');

        $imagesMixed = $this->mixedArrayInput($request, 'images');

        if ($contentMode === 'pdf') {
            if ($zipUploadId) {
                throw ValidationException::withMessages(['zip_upload_id' => 'ZIP import applies to image chapters only.']);
            }
            if (! $pdfInput && ! $chapter->pdf_path) {
                throw ValidationException::withMessages(['pdf' => 'Upload a PDF file or keep the existing chapter PDF.']);
            }
            if (! empty($imagesMixed)) {
                throw ValidationException::withMessages(['images' => 'Use either image pages or one PDF, not both.']);
            }
        } else {
            if ($pdfInput) {
                throw ValidationException::withMessages(['pdf' => 'Use either image pages or one PDF, not both.']);
            }
            if ($zipUploadId) {
                if (! empty($imagesMixed)) {
                    throw ValidationException::withMessages(['images' => 'Use either a ZIP archive or individual images, not both.']);
                }
            } else {
                $hasExisting = collect($imagesMixed)->contains(fn ($i) => is_array($i) && isset($i['id']));
                $hasNewFiles = collect($imagesMixed)->filter(fn ($i) => $i instanceof UploadedFile || is_string($i))->isNotEmpty();
                if (! $hasExisting && ! $hasNewFiles) {
                    throw ValidationException::withMessages(['images' => 'Add at least one page image or choose a ZIP of pages.']);
                }
                foreach ($imagesMixed as $img) {
                    if ($img instanceof UploadedFile) {
                        Validator::make(
                            ['file' => $img],
                            ['file' => ['required', 'image', 'max:20480']],
                        )->validate();
                    }
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
            if ($pdfInput instanceof UploadedFile) {
                if ($chapter->pdf_path) {
                    $this->uploader->remove($chapter->pdf_path);
                }
                Validator::make(['pdf' => $pdfInput], ['pdf' => ['required', 'file', 'mimes:pdf', 'max:51200']])->validate();
                $validatedData['pdf_path'] = $this->uploader->upload($pdfInput, 'mangas');
                $chapter->images()->each(function ($image) {
                    $this->uploader->remove($image->path);
                    $image->delete();
                });
            } elseif (is_string($pdfInput) && trim($pdfInput) !== '') {
                if ($chapter->pdf_path) {
                    $this->uploader->remove($chapter->pdf_path);
                }
                $resolved = $this->resolveChunkUploadToUrl($group, $request, 'chapter-pdf', $pdfInput);
                $pdfPath = $resolved ?: trim($pdfInput);
                if ($pdfPath === '') {
                    throw ValidationException::withMessages(['pdf' => 'Invalid PDF reference.']);
                }
                $validatedData['pdf_path'] = $pdfPath;
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

        unset($validatedData['content_mode'], $validatedData['images'], $validatedData['pdf'], $validatedData['zip_upload_id']);
        $chapter->update($validatedData);

        if ($contentMode === 'images') {
            if ($zipUploadId) {
                $this->zipImportRegistrar->queueFromUploadSession($group, $request, $chapter, $zipUploadId);
            } else {
                $existingImageIdsInRequest = collect($imagesMixed)->filter(function ($image) {
                    return is_array($image) && isset($image['id']);
                })->map(function ($image) {
                    return $image['id'];
                });

                $chapter->images()->whereNotIn('id', $existingImageIdsInRequest)->each(function ($image) {
                    $this->uploader->remove($image->path);
                    $image->delete();
                });

                foreach ($imagesMixed as $index => $image) {
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

                    if (is_string($image) && trim($image) !== '') {
                        $resolved = $this->resolveChunkUploadToUrl($group, $request, 'chapter-image', $image);
                        $path = $resolved ?: trim($image);
                        ChapterImage::create([
                            'chapter_id' => $chapter->id,
                            'path' => $path,
                            'order' => $index,
                        ]);
                    }
                }
            }
        }

        $successMessage = 'Chapter udpated successful.';
        if ($contentMode === 'images' && $zipUploadId) {
            $successMessage .= ' Chapter pages are being imported from your ZIP in the background.';
        }

        return redirect(route('group.admin.mangas.edit', ['manga' => $manga]))->with('success', $successMessage);
    }

    public function deleteChapter(Group $group, Manga $manga, Chapter $chapter)
    {
        $chapter->delete();

        return back()->with('success', 'Delete chapter Successful.');
    }

    public function bulkDeleteChapters(Group $group, Manga $manga, Request $request)
    {
        $validated = $request->validate([
            'chapter_ids' => ['required', 'array', 'min:1'],
            'chapter_ids.*' => ['integer'],
        ]);

        Chapter::query()
            ->where('chapterable_type', Manga::class)
            ->where('chapterable_id', $manga->id)
            ->whereIn('id', $validated['chapter_ids'])
            ->delete();

        return back()->with('success', 'Selected chapters deleted successfully.');
    }
}
