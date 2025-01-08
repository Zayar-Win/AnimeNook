<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;

class NotificationController extends Controller
{
    public function index(Group $group)
    {
        dd(request('userId'));
        $userId = request()->get('userId');
        $user = User::where('id', $userId)->where('group_id', $group->id)->first();
        $notifications = $user->notifications()->whereJsonContains('data', ['group_id' => $group->id])->paginate(6);
        return response()->json([
            'notifications' => $notifications
        ]);
    }
}
