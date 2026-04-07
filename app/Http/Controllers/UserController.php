<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use App\Models\User;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public $uploader;

    public function __construct()
    {
        $this->uploader = new Uploader;
    }

    public function showProfile(Group $group)
    {
        $user = auth()->user()->load('role');

        return inertia('Group/Profile', [
            'profileUser' => $user,
            'isOwnProfile' => true,
        ]);
    }

    /**
     * Public profile view for a group member (e.g. from comment @mentions).
     */
    public function showUserProfile(Group $group, User $user)
    {
        if ((int) $user->group_id !== (int) $group->id) {
            abort(404);
        }

        $user->load('role');
        $isSelf = auth()->check() && (int) auth()->id() === (int) $user->id;

        return inertia('Group/Profile', [
            'profileUser' => $isSelf
                ? $user
                : $user->only(['id', 'name', 'profile_picture', 'created_at', 'type'])
                    + ['role' => ['name' => $user->role?->name]],
            'isOwnProfile' => $isSelf,
        ]);
    }

    public function update(Group $group)
    {
        $validatedData = request()->validate([
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore(auth()->user()->id)],
            'profile_picture' => 'nullable',
        ]);

        $user = auth()->user();
        if (gettype($validatedData['profile_picture']) !== 'string' && gettype($validatedData['profile_picture'] !== '')) {
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'], 'amineProfile');
        }
        $user->update($validatedData);

        return back()->with('success', 'Update profile successful.');
    }
}
