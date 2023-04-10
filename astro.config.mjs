import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import glsl from 'vite-plugin-glsl';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
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
