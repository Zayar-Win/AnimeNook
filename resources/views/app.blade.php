<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
        use App\Models\Group;
            $group = request()->route('group');
            if(gettype($group) === 'string'){
                $group = Group::where('subdomain',$group)->first();
            }
        @endphp
        <style>
            :root {
            --primary-color: {{ $group->groupSetting->primary_color ?? '#ED6400' }};
            /* Default primary color */
            --secondary-color: {{ $group->secondary_color ?? 'black' }};
            /* Default secondary color */
        }
        </style>
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
    <script type="text/javascript">
    var ouo_token = 'ANeq6B81';
    var exclude_domains = ['example.com', 'http://localhost:8000']; 
</script>
<script src="//cdn.ouo.io/js/full-page-script.js"></script>
</html>
