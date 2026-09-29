import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/.
  // Keep the normal root base for local development and previews.
  base: process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node'
  }
});
