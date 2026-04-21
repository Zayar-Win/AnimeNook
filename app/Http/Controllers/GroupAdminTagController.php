<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GroupAdminTagController extends Controller
{
    public function index(Group $group, Request $request)
    {
        $data = [
            'search' => trim((string) $request->input('search', '')),
            'sort' => $request->input('sort', 'name_asc'),
        ];

        $filters = validator($data, [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name_asc,name_desc,slug_asc,slug_desc'],
        ])->validated();

        $query = $group->tags();

        if (($filters['search'] ?? '') !== '') {
            $like = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like);
            });
        }

        $sort = $filters['sort'] ?? 'name_asc';
        [$column, $direction] = match ($sort) {
            'name_desc' => ['name', 'desc'],
            'slug_asc' => ['slug', 'asc'],
            'slug_desc' => ['slug', 'desc'],
            default => ['name', 'asc'],
        };
        $query->orderBy($column, $direction);

        $tags = $query->paginate(15)->withQueryString();

        return inertia('Group/Admin/Tags/Index', [
            'tags' => $tags,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'sort' => in_array($sort, ['name_asc', 'name_desc', 'slug_asc', 'slug_desc'], true)
                    ? $sort
                    : 'name_asc',
            ],
        ]);
    }

    public function create()
    {
        return inertia('Group/Admin/Tags/TagForm', [
            'type' => 'create'
        ]);
    }

    public function store(Group $group)
    {
        $validatedData = request()->validate([
            'name' => ['required', Rule::unique('tags', 'name')]
        ]);
        Tag::create([
            'group_id' => $group->id,
            'name' => $validatedData['name']
        ]);
        return redirect(route('group.admin.tags'))->with('success', 'New tag created.');
    }

    public function edit(Group $group, Tag $tag)
    {
        return inertia('Group/Admin/Tags/TagForm', [
            'type' => 'edit',
            'tag' => $tag
        ]);
    }

    public function update(Group $group, Tag $tag)
    {
        $validatedData = request()->validate([
            'name' => ['required', Rule::unique('tags', 'name')]
        ]);
        $tag->update([
            'name' => $validatedData['name']
        ]);
        return redirect(route('group.admin.tags'))->with('success', 'Tag update successful.');
    }

    public function delete(Group $group, Tag $tag)
    {
        $tag->delete();
        return back()->with('success', 'Tag deleted successful.');
    }
}
