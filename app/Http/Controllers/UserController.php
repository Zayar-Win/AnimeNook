<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class UserController extends Controller
{

    public function __construct(public Uploader $uploader)
    {
        
    }

    public function showProfile(Group $group){
        return inertia('Group/Profile');
    }

    public function update(Group $group){
        $validatedData = request()->validate([
            'name' => 'required',
            'email' => ['required','email',Rule::unique('users','email')->ignore(auth()->user()->id)],
            'profile_picture' => 'nullable',
        ]);

        $user = auth()->user();
        if(gettype($validatedData['profile_picture']) !== 'string'){
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'],'amineProfile');
        }
        $user->update($validatedData);
        return back()->with('success','Update profile successful.');

    }
}
