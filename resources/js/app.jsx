/* eslint-disable no-undef */
import './bootstrap';
import '../css/app.css';
import 'react-quill/dist/quill.snow.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import "react-datepicker/dist/react-datepicker.css";
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export function formateDate(dateString,format={month : '2-digit',day : '2-digit', year:'numeric'},sperator='.') {
    let date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US',format).format(date).replaceAll('/',sperator);
}

window.route = route;
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve:async (name) => {
        let page = await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'))
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
        color: '#4B5563',
    },
});
