import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import "./src/styles/index.css"

export default defineConfig({
    integrations: [react()],
    output: 'static',
    base: '/quimicaindustrialpe/',
    build: {
        format: 'directory'
    }
});

