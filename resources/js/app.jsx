import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
