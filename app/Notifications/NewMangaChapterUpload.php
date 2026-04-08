<?php

namespace App\Notifications;

use App\Models\Chapter;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class NewMangaChapterUpload extends Notification
{
    use Queueable;

    public function __construct(public Chapter $chapter, public Group $group, public Manga $manga) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'notification_type' => 'new_manga_chapter',
            'chapter_id' => $this->chapter->id,
            'name' => $this->manga->name,
            'thumbnail' => $this->manga->thumbnail,
            'title' => $this->chapter->title,
            'link' => URL::route('group.manga.chapter.read', [
                'group' => $this->group->subdomain,
                'manga' => $this->manga,
                'chapter' => $this->chapter,
            ], absolute: true),
            'group_id' => $this->group->id,
        ];
    }
}
