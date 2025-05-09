import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static';
import glsl from 'vite-plugin-glsl';
import media from './scripts/Media';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), media()],
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [
      glsl({
        include: ['**/*.vs.glsl', '**/*.fs.glsl'],
        watch: false,
        // compress: true,
      }),
      tailwindcss()
    ],
    ssr: {
      noExternal: ['@radix-ui/react-tabs'],
    },
  },
  server: {
    port: 3000,
  },
});
