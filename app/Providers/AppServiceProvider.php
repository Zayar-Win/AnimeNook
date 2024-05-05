<?php

namespace App\Providers;

use App\Models\Group;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $subdomain = '';
        $localOrStaging = config('app.env') === 'local' || config('app.env') === 'staging';
        if ($localOrStaging) {
            $url = 'http' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 's' : '') . '://' . (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '');
            if ($url) {
                $parsedUrl = parse_url($url);
                $path = isset($parsedUrl['path']) ? $parsedUrl['path'] : '';
                $path = ltrim($path, '/');
                $keywords = explode('/', $path);
                $subdomain = isset($keywords[0]) ? $keywords[0] : '';
                try {
                    $group = DB::table('groups')->where('subdomain', $subdomain)->first();
                    if (!$group) {
                        // do something
                    }
                } catch (Exception $e) {
                }
            }
        } else {
            if (isset($_SERVER['HTTP_HOST'])) {
                $fullDomain = $_SERVER['HTTP_HOST'];
                $subdomain = explode('.', $fullDomain)[0];
            }
        }
        config(['session.cookie' => $subdomain ? $subdomain . '_session' : Str::slug(env('APP_NAME', 'laravel'), '_') . '_session']);
    }
}
