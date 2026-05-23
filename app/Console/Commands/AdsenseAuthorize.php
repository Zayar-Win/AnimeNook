<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class AdsenseAuthorize extends Command
{
    protected $signature = 'adsense:authorize';

    protected $description = 'One-time Google OAuth flow to get a long-lived AdSense refresh token';

    private const SCOPE = 'https://www.googleapis.com/auth/adsense.readonly';
    private const REDIRECT_URI = 'http://localhost';

    public function handle(): int
    {
        $clientId = config('services.adsense.client_id');
        $clientSecret = config('services.adsense.client_secret');

        if (! $clientId || ! $clientSecret) {
            $this->error('ADSENSE_CLIENT_ID and ADSENSE_CLIENT_SECRET must be set in .env');
            $this->line('(They can share the same values as GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)');
            return self::FAILURE;
        }

        $authUrl = 'https://accounts.google.com/o/oauth2/auth?' . http_build_query([
            'client_id'     => $clientId,
            'redirect_uri'  => self::REDIRECT_URI,
            'response_type' => 'code',
            'scope'         => self::SCOPE,
            'access_type'   => 'offline',
            'prompt'        => 'consent',  // Forces a fresh refresh token even if previously authorized
        ]);

        $this->newLine();
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info('Step 1 — Make sure http://localhost is in your Google Cloud Console');
        $this->line('         Authorized Redirect URIs for this OAuth 2.0 client.');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->newLine();
        $this->info('Step 2 — Open this URL in your browser:');
        $this->newLine();
        $this->line($authUrl);
        $this->newLine();
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info('Step 3 — After you click "Allow", the browser will redirect to');
        $this->line('         http://localhost/?code=XXXX  (it will show "can\'t connect")');
        $this->line('         Copy the value of the "code" parameter from the URL bar.');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->newLine();

        $code = $this->ask('Paste the authorization code here');

        if (! $code) {
            $this->error('No code provided. Aborting.');
            return self::FAILURE;
        }

        $this->line('Exchanging code for tokens...');

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code'          => trim($code),
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri'  => self::REDIRECT_URI,
            'grant_type'    => 'authorization_code',
        ]);

        if (! $response->successful()) {
            $this->error('Token exchange failed: ' . $response->body());
            return self::FAILURE;
        }

        $refreshToken = (string) ($response->json('refresh_token') ?? '');

        if ($refreshToken === '') {
            $this->error('Google did not return a refresh token.');
            $this->line('This usually means the app was already authorized without prompt=consent.');
            $this->line('Try revoking access at https://myaccount.google.com/permissions and run this command again.');
            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Success! Your new refresh token:');
        $this->newLine();
        $this->line("ADSENSE_REFRESH_TOKEN={$refreshToken}");
        $this->newLine();

        if ($this->confirm('Automatically write this to your .env file?', true)) {
            $this->writeToEnv($refreshToken);
        } else {
            $this->line('Copy the line above into your .env file manually.');
        }

        return self::SUCCESS;
    }

    private function writeToEnv(string $refreshToken): void
    {
        $envPath = base_path('.env');
        if (! file_exists($envPath)) {
            $this->error('.env file not found at ' . $envPath);
            return;
        }

        $current = file_get_contents($envPath);
        $escaped = addcslashes($refreshToken, '$\\');

        if (str_contains($current, 'ADSENSE_REFRESH_TOKEN=')) {
            $updated = preg_replace(
                '/^ADSENSE_REFRESH_TOKEN=.*/m',
                'ADSENSE_REFRESH_TOKEN=' . $escaped,
                $current
            );
        } else {
            $updated = rtrim($current) . "\nADSENSE_REFRESH_TOKEN=" . $escaped . "\n";
        }

        file_put_contents($envPath, $updated);
        $this->info('.env updated. Run `php artisan config:clear` to apply the change.');
    }
}
