<?php

namespace App\Notifications;

use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Support\GroupRoute;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CommentMentionNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $comment, public Group $group) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $this->comment->loadMissing('user', 'commentable');
        $series = $this->comment->commentable;
        if (! $series) {
            return [
                'notification_type' => 'comment_mention',
                'group_id' => $this->group->id,
                'link' => GroupRoute::url($this->group, 'group.home'),
                'thumbnail' => null,
                'name' => '',
                'title' => ($this->comment->user?->name ?? 'Someone').' mentioned you',
                'subtitle' => Str::limit(html_entity_decode(strip_tags($this->comment->body)), 140),
                'comment_id' => $this->comment->id,
            ];
        }
        $isAnime = $series instanceof Anime;
        $route = $isAnime ? 'group.anime.detail' : 'group.manga.detail';
        $key = $isAnime ? 'anime' : 'manga';
        $link = GroupRoute::url($this->group, $route, [$key => $series->slug]).'#comments';

        return [
            'notification_type' => 'comment_mention',
            'group_id' => $this->group->id,
            'link' => $link,
            'thumbnail' => $series->thumbnail,
            'name' => $series->name,
            'title' => ($this->comment->user?->name ?? 'Someone').' mentioned you',
            'subtitle' => Str::limit(html_entity_decode(strip_tags($this->comment->body)), 140),
            'comment_id' => $this->comment->id,
        ];
    }
}
