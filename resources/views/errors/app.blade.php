<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Error {{ $status ?? 500 }} - AnimeNook</title>
    <style>
        :root {
            color-scheme: dark;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: #0a0a0a;
            color: #fff;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .card {
            width: 100%;
            max-width: 560px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            background: #141414;
            padding: 32px 24px;
            text-align: center;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
        }

        .badge {
            margin: 0;
            color: #ed6400;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
        }

        h1 {
            margin: 8px 0 0;
            font-size: 34px;
            line-height: 1.2;
        }

        p {
            margin: 12px 0 0;
            color: #a1a1aa;
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>

<body>
    <main class="card">
        <p class="badge">Error {{ $status ?? 500 }}</p>
        <h1>
            @switch((int) ($status ?? 500))
                @case(403)
                    Access denied
                @break

                @case(404)
                    Page not found
                @break

                @case(503)
                    Service unavailable
                @break

                @default
                    Something went wrong
            @endswitch
        </h1>
        <p>
            @switch((int) ($status ?? 500))
                @case(403)
                    You do not have permission to access this page.
                @break

                @case(404)
                    The page you are looking for could not be found.
                @break

                @case(503)
                    The service is temporarily unavailable.
                @break

                @default
                    An unexpected error happened. Please try again later.
            @endswitch
        </p>
    </main>
</body>

</html>
