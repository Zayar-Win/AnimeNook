/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const FRONTEND_ERROR_ENDPOINT = "/api/frontend-errors";
const FRONTEND_DEDUPE_TTL_MS = 60000;
const frontendErrorCache = new Map();

function isFrontendErrorReportingEnabled() {
    return (
        import.meta.env.PROD &&
        import.meta.env.VITE_ERROR_REPORTING_ENABLED === "true"
    );
}

function pruneFrontendErrorCache(now) {
    for (const [key, expiresAt] of frontendErrorCache.entries()) {
        if (expiresAt <= now) {
            frontendErrorCache.delete(key);
        }
    }
}

function shouldSendFrontendError(fingerprint) {
    const now = Date.now();
    pruneFrontendErrorCache(now);

    const expiresAt = frontendErrorCache.get(fingerprint);
    if (expiresAt && expiresAt > now) {
        return false;
    }

    frontendErrorCache.set(fingerprint, now + FRONTEND_DEDUPE_TTL_MS);
    return true;
}

function normalizeText(value, limit = 1000) {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    return trimmed.slice(0, limit);
}

function sendFrontendError(payload) {
    if (!isFrontendErrorReportingEnabled()) {
        return;
    }

    const fingerprint = [payload.kind, payload.message, payload.url]
        .filter(Boolean)
        .join("|")
        .slice(0, 500);

    if (!shouldSendFrontendError(fingerprint)) {
        return;
    }

    const body = JSON.stringify({
        ...payload,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        release: import.meta.env.VITE_APP_NAME || "unknown",
        sent_at: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(FRONTEND_ERROR_ENDPOINT, blob);
        return;
    }

    fetch(FRONTEND_ERROR_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body,
        keepalive: true,
    }).catch(() => {
        // Silently ignore reporting failures.
    });
}

window.__reportFrontendError = sendFrontendError;

window.addEventListener("error", (event) => {
    const message = normalizeText(event.message || event.error?.message, 500);

    if (!message) {
        return;
    }

    sendFrontendError({
        kind: "runtime_error",
        message,
        source: normalizeText(event.filename, 500),
        line: Number.isFinite(event.lineno) ? event.lineno : null,
        column: Number.isFinite(event.colno) ? event.colno : null,
        stack: normalizeText(event.error?.stack, 3000),
    });
});

window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
        normalizeText(reason?.message, 500) ||
        normalizeText(typeof reason === "string" ? reason : null, 500) ||
        "Unhandled promise rejection";

    sendFrontendError({
        kind: "unhandled_rejection",
        message,
        stack: normalizeText(reason?.stack, 3000),
    });
});

window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url || null;

        if (
            status >= 500 &&
            requestUrl &&
            !requestUrl.includes(FRONTEND_ERROR_ENDPOINT)
        ) {
            sendFrontendError({
                kind: "request_error",
                message: normalizeText(error.message, 500) || "Request failed",
                status,
                method: normalizeText(error?.config?.method?.toUpperCase(), 32),
                url: normalizeText(requestUrl, 1000),
            });
        }

        return Promise.reject(error);
    }
);

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });
