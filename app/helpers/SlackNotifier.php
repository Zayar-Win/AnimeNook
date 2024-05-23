<?php

namespace App\helpers;

use Illuminate\Notifications\Notifiable;

class SlackNotifier
{
    use Notifiable;

    public function __construct(public $webhook = null)
    {
    }

    public static function send($payload)
    {
        $notifier = new static;
        if (isset($payload['webhook'])) {
            $notifier->webhook = $payload['webhook'];
        }
        return $notifier->notify($payload['notification']);
    }

    public function routeNotificationForSlack(): string
    {
        return $this->webhook ?? config('services.slack.webhook_url');
    }
}
