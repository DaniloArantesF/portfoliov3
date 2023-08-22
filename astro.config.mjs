import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static';
import glsl from 'vite-plugin-glsl';
// import thumbnails from './scripts/Capture';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [
      glsl({
        include: ['**/*.vs.glsl', '**/*.fs.glsl'],
        watch: false,
        // compress: true,
      }),
    ],
  },
});
