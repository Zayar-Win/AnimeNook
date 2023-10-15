<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function userLogin(Group $group, LoginRequest $request)
    {
        $data = $request->validated();
        $user = User::where('group_id', $group->id)->where('email', $data['email'])->first();
        if ($user) {
            $isPasswordCorrect = Hash::check($data['password'], $user->password);
            if (!$isPasswordCorrect) {
                return back()->withErrors(['password' => 'Password doesn\'t match.']);
            }
            auth()->login($user);
            return redirect(route('group.home'))->with('success', 'Welcome back from our website');
        }
    }
    public function userRegister(Group $group, RegisterRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['group_id'] = $group->id;
        User::create($data);
        return redirect(route('group.home'))->with('success', 'Welcome from our website.');
    }
    public function userLogout()
    {
        auth()->logout();
        return back()->with('success', 'See you later');
    }
}
