import { createApp } from 'vue';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import routes from '~pages';

console.log(routes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).mount('#app');
