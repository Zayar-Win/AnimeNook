<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GroupAdminTagController extends Controller
{
    public function index(Group $group)
    {
        return inertia('Group/Admin/Tags/Index', [
            'tags' => $group->tags()->paginate(15)
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
