<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6217477979568177"
        crossorigin="anonymous"></script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6217477979568177"
        crossorigin="anonymous"></script>
    <meta charset="utf-8">
    <script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6217477979568177"
        crossorigin="anonymous"></script>

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'AnimeNook') }}</title>

    @php
    use App\Models\Group;
    $group = request()->route('group');
    if(gettype($group) === 'string'){
    $group = Group::where('subdomain',$group)->first();
    }
    @endphp
    <style>
        :root {
            --primary-color: {
                    {
                    $group->groupSetting->primary_color ?? '#ED6400'
                }
            }

            ;

            /* Default primary color */
            --secondary-color: {
                    {
                    $group->secondary_color ?? 'black'
                }
            }

            ;
            /* Default secondary color */
        }
    </style>
    <!-- Fonts -->
    <link rel="shortcut icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE3eqXFJ5p0I63-LffwzHVorIJob3GgUMSjQ&usqp=CAU" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    <amp-auto-ads type="adsense"
        data-ad-client="ca-pub-6217477979568177">
    </amp-auto-ads>
    @inertia
</body>
<script type="text/javascript">
    var ouo_token = 'ANeq6B81';
    var exclude_domains = ['example.com', 'http://localhost:8000'];
</script>
<script src="//cdn.ouo.io/js/full-page-script.js"></script>

</html>