<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

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
        $user = User::create($data);
        auth()->login($user);
        return redirect(route('group.home'))->with('success', 'Welcome from our website.');
    }
    public function userLogout()
    {
        auth()->logout();
        return back()->with('success', 'See you later');
    }

    public function redirectGoogle(){
        $subdomain = request('subdomain');
        return Socialite::driver('google')->with(['state' => json_encode(['subdomain' => $subdomain])])->redirect();
    }

    public function callbackGoogle(){
        $googleUser = Socialite::driver('google')->stateless()->user();
        $state = request()->get('state');
        $state = json_decode($state,true);
        $subdomain = $state['subdomain'];
        if($subdomain){
            $group = Group::where('subdomain',$subdomain)->first();
        }
        $user = User::where('email',$googleUser->email)->where("group_id",$group->id)->first();
        if($user){
            auth()->login($user);
            return redirect(route('group.home',['group' => $subdomain]));
        }else{
            $hashPassword = Hash::make('12345678');
            $user = User::create([
                'name' => $googleUser->name,
                'group_id' => $group->id,
                'role_id' => 1,
                'email' => $googleUser->email,
                'password' => $hashPassword
            ]);
            auth()->login($user);
            return redirect(route('group.home',['group' => $subdomain]));
        }
}
}