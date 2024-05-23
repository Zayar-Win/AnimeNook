<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OuoFailNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public $message)
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
        return ['slack'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toSlack(object $notifiable)
    {
        $message = "*Group Name*  \n" . $this->message['group_name'] . "\n\n";
        $message .= "*Link*  \n" . $this->message['link'] . "\n\n";
        $message .= "*Message*  \n" .  $this->message['message'] . "\n\n";

        return (new SlackMessage)
            ->error()
            ->attachment(function ($attachment) use ($message) {
                $attachment
                    ->title('Ouo Link Generate Fail Alert')
                    ->content($message);
            });
    }
}
