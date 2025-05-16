import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path'; // Ya tienes esto, ¡perfecto!
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            // Tu alias existente para Ziggy (mantenlo)
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),

            // ====> AÑADE ESTA LÍNEA PARA EL ALIAS '@' <====
            '@': resolve(__dirname, 'resources/js'),
        },
    },
});
