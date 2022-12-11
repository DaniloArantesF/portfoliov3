import { defineConfig } from 'astro/config';
// import PostManager from './src/NotionIntegration';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
});
