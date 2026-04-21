<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use App\Models\Role;
use App\Models\User;
use App\Notifications\AdminNewUserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;

class GroupAdminUserController extends Controller
{
    public function __construct(public Uploader $uploader) {}

    public function index(Group $group)
    {
        $data = [
            'search' => trim((string) request('search', '')),
            'role_id' => request()->filled('role_id') ? (int) request('role_id') : null,
            'type' => request()->filled('type') && in_array(request('type'), ['free', 'paid'], true)
                ? request('type')
                : null,
        ];

        $filters = validator($data, [
            'search' => ['nullable', 'string', 'max:255'],
            'role_id' => ['nullable', 'integer', 'exists:roles,id'],
            'type' => ['nullable', 'in:free,paid'],
        ])->validated();

        $query = $group->users()->with('role');

        if (($filters['search'] ?? '') !== '') {
            $like = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like);
            });
        }

        if (! empty($filters['role_id'])) {
            $query->where('role_id', $filters['role_id']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return inertia('Group/Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'role_id' => $filters['role_id'] ?? null,
                'type' => $filters['type'] ?? null,
            ],
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        return inertia('Group/Admin/Users/UserForm', [
            'type' => 'create',
        ]);
    }

    public function edit(Group $group, User $user)
    {
        $user->makeVisible(['password']);

        return inertia('Group/Admin/Users/UserForm', [
            'type' => 'edit',
            'user' => $user,
        ]);
    }

    public function update(Group $group, User $user)
    {
        $validatedData = request()->validate([
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'profile_picture' => ['required'],
            'role_id' => ['required'],
            'type' => ['required', 'in:free,paid'],
            'password' => ['required', 'min:6', 'max:20'],
        ]);
        if (gettype($validatedData['profile_picture']) !== 'string') {
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'], 'amineProfile');
        }
        $user->update($validatedData);

        return back()->with('success', 'User Update successful.');
    }

    public function delete(Group $group, User $user)
    {
        $user->delete();

        return back()->with('success', 'User Delete Successful');
    }

    public function store(Group $group, Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'profile_picture' => 'nullable',
            'role_id' => 'required',
            'type' => 'required|in:free,paid',
            'password' => 'required|min:6|max:20',
        ]);
        $validatedData['group_id'] = $group->id;
        $validatedData['password'] = bcrypt($validatedData['password']);
        if (gettype($validatedData['profile_picture']) !== 'string') {
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'], 'animeProfile');
        }
        $user = User::create($validatedData);
        $admins = User::adminsInGroup($group->id)
            ->where('id', '!=', auth()->id())
            ->get();
        if ($admins->isNotEmpty()) {
            Notification::send($admins, new AdminNewUserNotification($user, $group));
        }

        return redirect(route('group.admin.users'))->with('success', 'User Created Successful.');
    }
}
