/* eslint-disable no-undef */
import "./bootstrap";
import "../css/app.css";
import "react-quill/dist/quill.snow.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "react-datepicker/dist/react-datepicker.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

export function formateDate(
    dateString,
    format = { month: "2-digit", day: "2-digit", year: "numeric" },
    sperator = "."
) {
    let date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", format)
        .format(date)
        .replaceAll("/", sperator);
}

window.route = route;

const PRIMARY_COLOR_FALLBACK = "#ED6400";

function sanitizePrimaryColor(raw) {
    if (typeof raw !== "string") return null;
    const t = raw.trim();
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(t)
        ? t
        : null;
}

function syncPrimaryColorFromInertiaPage(page) {
    const g = page?.props?.group;
    const raw =
        g?.group_setting?.primary_color ?? g?.groupSetting?.primary_color;
    const color = sanitizePrimaryColor(raw) ?? PRIMARY_COLOR_FALLBACK;
    document.documentElement.style.setProperty("--primary-color", color);
}

const appRoot = document.getElementById("app");
if (appRoot?.dataset?.page) {
    try {
        syncPrimaryColorFromInertiaPage(JSON.parse(appRoot.dataset.page));
    } catch {
        document.documentElement.style.setProperty(
            "--primary-color",
            PRIMARY_COLOR_FALLBACK,
        );
    }
}

document.addEventListener("inertia:success", (event) => {
    syncPrimaryColorFromInertiaPage(event.detail.page);
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        let page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        );
        page = page.default;
        // need to add UserLayout here
        // let defaultLayout = name.startsWith('TechMarket/Admin')
        //     ? (page) => <AdminLayout>{page}</AdminLayout>
        //     : undefined;
        // if (page.layout === 'undefined' || !page.layout) {
        //     page.layout = defaultLayout;
        // }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
