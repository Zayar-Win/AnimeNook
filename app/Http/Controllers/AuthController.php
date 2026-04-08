<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Group;
use App\Models\User;
use App\Notifications\AdminNewUserNotification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function userLogin(Group $group, LoginRequest $request)
    {
        $data = $request->validated();
        $user = User::where('group_id', $group->id)->where('email', $data['email'])->first();
        if ($user) {
            $isPasswordCorrect = Hash::check($data['password'], $user->password);
            if (! $isPasswordCorrect) {
                return back()->withErrors(['password' => 'Password doesn\'t match.']);
            }
            auth()->login($user);

            return Redirect::intended(route('group.home'))->with('success', 'Welcome back from our website');
        }
    }

    public function userRegister(Group $group, RegisterRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['group_id'] = $group->id;
        $user = User::create($data);
        $admins = User::adminsInGroup($group->id)->get();
        if ($admins->isNotEmpty()) {
            Notification::send($admins, new AdminNewUserNotification($user, $group));
        }
        auth()->login($user);

        return Redirect::intended(route('group.home'))->with('success', 'Welcome from our website.');
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
        $user = User::where('email', $googleUser->email)->where('group_id', $group->id)->first();
        if (! $user) {
            $hashPassword = Hash::make('12345678');
            $user = User::create([
                'name' => $googleUser->name,
                'group_id' => $group->id,
                'role_id' => 1,
                'profile_picture' => $googleUser->getAvatar(),
                'email' => $googleUser->email,
                'password' => $hashPassword,
            ]);
            $admins = User::adminsInGroup($group->id)->get();
            if ($admins->isNotEmpty()) {
                Notification::send($admins, new AdminNewUserNotification($user, $group));
            }
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
        if (! $user) {
            abort(401, 'Token is not valid.');
        }
        $user = User::where('id', $user)->first();
        auth()->login($user);

        return Redirect::intended(route('group.home'));
    }

    public function generateToken($user)
    {
        $salt = bin2hex(random_bytes(8));
        $data = $user->id.$salt;

        return Hash::make($data);
    }

    public function sendPasswordResetLink(Group $group, Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::query()
            ->where('email', $request->input('email'))
            ->where('group_id', $group->id)
            ->first();

        if (! $user) {
            return back()->with(
                'success',
                __('If an account exists for that email, we sent a reset link.'),
            );
        }

        $status = Password::broker()->sendResetLink([
            'email' => $user->email,
        ]);

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('success', __($status));
        }

        if ($status === Password::RESET_THROTTLED) {
            return back()->withErrors(['email' => __($status)]);
        }

        return back()->withErrors(['email' => __($status)]);
    }

    /**
     * Main-domain POST /forgot-password (delegates to default tenant group).
     */
    public function sendPasswordResetLinkMainDomain(Request $request): RedirectResponse
    {
        $group = Group::query()
            ->where('subdomain', config('auth.default_group_subdomain'))
            ->firstOrFail();

        return $this->sendPasswordResetLink($group, $request);
    }

    public function showResetPasswordForm(Group $group, Request $request, string $token)
    {
        return inertia('Group/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    public function resetPassword(Group $group, Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:6', 'max:30'],
        ]);

        $member = User::query()
            ->where('email', $request->input('email'))
            ->where('group_id', $group->id)
            ->first();

        if (! $member) {
            throw ValidationException::withMessages([
                'email' => __('This reset link does not match an account for this site.'),
            ]);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user) use ($request) {
                $user->forceFill([
                    'password' => $request->input('password'),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()
                ->route('group.login', ['group' => $group->subdomain])
                ->with('success', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function resetPasswordMainDomain(Request $request): RedirectResponse
    {
        $group = Group::query()
            ->where('subdomain', config('auth.default_group_subdomain'))
            ->firstOrFail();

        return $this->resetPassword($group, $request);
    }

    public function showResetPasswordFormMainDomain(Request $request, string $token): RedirectResponse
    {
        $base = route('group.password.reset', [
            'group' => config('auth.default_group_subdomain'),
            'token' => $token,
        ], true);

        $qs = $request->getQueryString();
        if ($qs !== null && $qs !== '') {
            $base .= (str_contains($base, '?') ? '&' : '?').$qs;
        }

        return redirect()->to($base);
    }
}
