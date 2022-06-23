import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import TypedRouter from '../../dist';

export default defineConfig({
  plugins: [vue(), TypedRouter({printRoutesTree: false})],
});
