<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{

    public function __construct(public Uploader $uploader)
    {
    }

    public function index()
    {
        $users = User::latest()->paginate(10);
        return inertia('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return inertia('Admin/Users/UserForm', [
            'type' => 'create'
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'profile_picture' => 'nullable',
            'role_id' => 'required',
            'type' => 'required|in:free,paid',
            'password' => 'required|min:6|max:20'
        ]);
        $validatedData['password'] = bcrypt($validatedData['password']);
        if (gettype($validatedData['profile_picture']) !== 'string') {
            $validatedData['profile_picture'] =  $this->uploader->upload($validatedData['profile_picture'], 'animeProfile');
        }
        User::create($validatedData);
        return redirect(route('admin.users'))->with('success', 'User Created Successful.');
    }

    public function edit(User $user)
    {
        return inertia('Admin/Users/UserForm', [
            'user' => $user,
            'type' => 'edit'
        ]);
    }

    public function update(User $user)
    {
        $validatedData = request()->validate([
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'profile_picture' => ['required'],
            'role_id' => ['required'],
            'type' => ['required', 'in:free,paid'],
            'password' => ['required', 'min:6', 'max:20']
        ]);
        if (gettype($validatedData['profile_picture']) !== 'string') {
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'], 'amineProfile');
        }
        $user->update($validatedData);
        return back()->with('success', 'User Update successful.');
    }

    public function delete(User $user)
    {
        $user->delete();
        return back()->with('success', 'User Deleted successful.');
    }
}
