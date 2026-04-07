<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request, Group $group)
    {
        $notifications = $request->user()
            ->notifications()
            ->whereJsonContains('data', ['group_id' => $group->id])
            ->latest()
            ->paginate(6);

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    public function markRead(Request $request, Group $group, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->whereJsonContains('data', ['group_id' => $group->id])
            ->firstOrFail();

        if ($notification->read_at === null) {
            $notification->markAsRead();
        }

        return response()->json([
            'ok' => true,
            'read_at' => $notification->fresh()->read_at?->toIso8601String(),
        ]);
    }

    public function markAllRead(Request $request, Group $group)
    {
        $request->user()
            ->unreadNotifications()
            ->whereJsonContains('data', ['group_id' => $group->id])
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }
}
