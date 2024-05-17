<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;


class SessionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
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

        if ($subdomain === 'admin' || !$subdomain) {
            config(['session.cookie' => Str::slug(env('APP_NAME', 'laravel'), '_') . '_session']);
        } else {
            config(['session.cookie' => $subdomain . '_session']);
        }
        return $next($request);
    }
}
