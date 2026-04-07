<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;

class MentionUserController extends Controller
{
    public function index(Request $request, Group $group)
    {
        $q = trim((string) $request->get('q', ''));
        $users = User::query()
            ->where('group_id', $group->id)
            ->where('id', '!=', auth()->id())
            ->when(strlen($q) >= 1, function ($query) use ($q) {
                $query->where('name', 'like', '%'.$q.'%');
            })
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name', 'profile_picture']);

        return response()->json(['users' => $users]);
    }
}
