/// <reference types="vitest" />
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [Inspect()],
});
