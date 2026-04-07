<?php

namespace App\Notifications;

use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Support\GroupRoute;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CommentReplyNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $reply, public Group $group) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $this->reply->loadMissing('user', 'commentable');
        $series = $this->reply->commentable;
        if (! $series) {
            return [
                'notification_type' => 'comment_reply',
                'group_id' => $this->group->id,
                'link' => GroupRoute::url($this->group, 'group.home'),
                'thumbnail' => null,
                'name' => '',
                'title' => ($this->reply->user?->name ?? 'Someone').' replied to your comment',
                'subtitle' => Str::limit(html_entity_decode(strip_tags($this->reply->body)), 140),
                'comment_id' => $this->reply->id,
            ];
        }
        $isAnime = $series instanceof Anime;
        $route = $isAnime ? 'group.anime.detail' : 'group.manga.detail';
        $key = $isAnime ? 'anime' : 'manga';
        $link = GroupRoute::url($this->group, $route, [$key => $series->slug]).'#comments';

        return [
            'notification_type' => 'comment_reply',
            'group_id' => $this->group->id,
            'link' => $link,
            'thumbnail' => $series->thumbnail,
            'name' => $series->name,
            'title' => ($this->reply->user?->name ?? 'Someone').' replied to your comment',
            'subtitle' => Str::limit(html_entity_decode(strip_tags($this->reply->body)), 140),
            'comment_id' => $this->reply->id,
        ];
    }
}
