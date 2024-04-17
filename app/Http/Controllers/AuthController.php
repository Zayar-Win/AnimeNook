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

    public function redirectGoogle()
    {
        $subdomain = request('subdomain');
        return Socialite::driver('google')->with(['state' => json_encode(['subdomain' => $subdomain])])->redirect();
    }

    public function callbackGoogle()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();
        $state = request()->get('state');
        $state = json_decode($state, true);
        $subdomain = $state['subdomain'];
        if ($subdomain) {
            $group = Group::where('subdomain', $subdomain)->first();
        }
        $user = User::where('email', $googleUser->email)->where("group_id", $group->id)->first();
        if (!$user) {
            $hashPassword = Hash::make('12345678');
            $user = User::create([
                'name' => $googleUser->name,
                'group_id' => $group->id,
                'role_id' => 1,
                'profile_picture' => $googleUser->getAvatar(),
                'email' => $googleUser->email,
                'password' => $hashPassword
            ]);
        }
        $token = $this->generateToken($user);
        cache()->remember($token, now()->addSeconds(30), function () use ($user) {
            return $user->id;
        });
        return redirect(route('group.google.oauth.login', ['group' => $subdomain, 'token' => $token]));
    }
    public function googleOauthLogin()
    {
        $token = request()->get('token');
        $user = cache()->get($token);
        if (!$user) {
            abort(401, 'Token is not valid.');
        }
        $user = User::where("id", $user)->first();
        auth()->login($user);
        return redirect(route('group.home'));
    }

    public function generateToken($user)
    {
        $salt = bin2hex(random_bytes(8));
        $data = $user->id . $salt;
        return Hash::make($data);
    }
}
