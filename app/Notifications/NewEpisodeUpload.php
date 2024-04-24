<?php

namespace App\Notifications;

use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Group;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewEpisodeUpload extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Chapter $chapter, public Group $group, public Anime $anime)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'chapter_id' => $this->chapter->id,
            'name' => $this->anime->name,
            'thumbnail' => $this->anime->thumbnail,
            'title' => $this->chapter->title,
            'link' => $this->chapter->chapter_link,
            'group_id' => $this->group->id
        ];
    }
}
