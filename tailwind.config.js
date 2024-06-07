import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        screens:{
            '2xl' : '1536px',
            'xl' : '1280px',
            'lg' : '1024px',
            'md' : '768px',
            'sm' : '648px',
            'xs': '425px',
            'xxs' : '375px'
        },
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors:{
                'primary' : 'var(--primary-color)'
            },
            screens:{
                'xxs' : '330px'
            },
        },
    },

    plugins: [forms],
};
