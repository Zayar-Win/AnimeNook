<?php

namespace App\Notifications;

use App\Models\Comment;
use App\Models\Group;
use App\Support\GroupRoute;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class AdminNewCommentNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $comment, public Group $group) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $this->comment->loadMissing('user');

        return [
            'notification_type' => 'admin_new_comment',
            'group_id' => $this->group->id,
            'link' => GroupRoute::url($this->group, 'group.admin.comments'),
            'thumbnail' => $this->comment->user?->profile_picture,
            'name' => 'Moderation',
            'title' => 'New comment by '.($this->comment->user?->name ?? 'User'),
            'subtitle' => Str::limit(html_entity_decode(strip_tags($this->comment->body)), 140),
            'comment_id' => $this->comment->id,
        ];
    }
}
