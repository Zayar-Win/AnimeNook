<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_CLIENT_REDIRECT', 'http://localhost:8000/auth-google-callback')
    ],

    'adsense' => [
        'client_id' => env('ADSENSE_CLIENT_ID', env('GOOGLE_CLIENT_ID')),
        'client_secret' => env('ADSENSE_CLIENT_SECRET', env('GOOGLE_CLIENT_SECRET')),
        'refresh_token' => env('ADSENSE_REFRESH_TOKEN'),
        'account_id' => env('ADSENSE_ACCOUNT_ID', 'pub-6217477979568177'),
        'channel_base_domain' => env('ADSENSE_CHANNEL_BASE_DOMAIN', 'animenook.net'),
    ],

];
