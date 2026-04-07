<?php

namespace App\Notifications;

use App\Models\Group;
use App\Models\User;
use App\Support\GroupRoute;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminNewUserNotification extends Notification
{
    use Queueable;

    public function __construct(public User $newUser, public Group $group) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'notification_type' => 'admin_new_user',
            'group_id' => $this->group->id,
            'link' => GroupRoute::url($this->group, 'group.admin.users'),
            'thumbnail' => $this->newUser->profile_picture,
            'name' => 'New member',
            'title' => $this->newUser->name.' joined',
            'subtitle' => $this->newUser->email,
        ];
    }
}
