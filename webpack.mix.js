let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.js('src/app.js', 'assets')
    .css('src/app.css', 'assets')
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss('tailwind.config.js') ]
    })