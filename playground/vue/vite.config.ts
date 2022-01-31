import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import TypedPages from '../../src/vue/index';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Pages(), TypedPages()],
});
