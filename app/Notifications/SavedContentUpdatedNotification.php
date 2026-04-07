<?php

namespace App\Notifications;

use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SavedContentUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(public Chapter $chapter, public Group $group, public Anime|Manga $series) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'notification_type' => 'saved_content_update',
            'chapter_id' => $this->chapter->id,
            'name' => $this->series->name,
            'thumbnail' => $this->series->thumbnail,
            'title' => $this->chapter->title,
            'link' => $this->chapter->chapter_link,
            'group_id' => $this->group->id,
            'content_kind' => $this->series instanceof Manga ? 'manga' : 'anime',
        ];
    }
}
