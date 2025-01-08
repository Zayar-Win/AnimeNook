<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

    public $uploader;

    public function __construct()
    {
        $this->uploader = new Uploader();
    }

    public function showProfile(Group $group)
    {
        return inertia('Group/Profile');
    }

    public function update(Group $group)
    {
        $validatedData = request()->validate([
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore(auth()->user()->id)],
            'profile_picture' => 'nullable',
        ]);

        $user = auth()->user();
        if (gettype($validatedData['profile_picture']) !== 'string'&& gettype($validatedData['profile_picture'] !== '')) {
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'], 'amineProfile');
        }
        $user->update($validatedData);
        return back()->with('success', 'Update profile successful.');
    }
}
