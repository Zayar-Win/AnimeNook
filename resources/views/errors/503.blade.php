<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Maintenance - AnimeNook</title>
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
            color: #ffffff;
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
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        h1 {
            margin: 8px 0 0;
            font-size: 34px;
            font-weight: 900;
            line-height: 1.15;
        }

        .icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 14px;
            border-radius: 999px;
            border: 1px solid rgba(237, 100, 0, 0.45);
            background: rgba(237, 100, 0, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ed6400;
        }

        .icon svg {
            width: 28px;
            height: 28px;
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
        <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-7 7a1 1 0 0 0 0 1.4l3 3a1 1 0 0 0 1.4 0l7-7a1 1 0 0 0 0-1.4z" />
                <path d="M16 8 18 6" />
                <path d="M3 21l3-3" />
                <path d="M12 15l-3-3" />
                <path d="M2 2l20 20" />
            </svg>
        </div>
        <p class="badge">Maintenance</p>
        <h1>We'll be back shortly</h1>
        <p>
            AnimeNook is temporarily down for maintenance.
            Please check back in a few minutes.
        </p>
    </main>
</body>

</html>
