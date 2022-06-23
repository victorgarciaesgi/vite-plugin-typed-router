# 🚗🚦 Vite plugin Typed Router

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-typed-router.svg
[npm-version-href]: https://www.npmjs.com/package/vite-plugin-typed-router
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-typed-router.svg
[npm-total-downloads-src]: https://img.shields.io/npm/dt/vite-plugin-typed-router.svg
[npm-downloads-href]: https://www.npmjs.com/package/vite-plugin-typed-router

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm downloads][npm-total-downloads-src]][npm-downloads-href]
<img src='https://img.shields.io/npm/l/simple-graphql-to-typescript.svg'>

> Provide a type safe router to any app with auto-generated typed definitions for route names and autocompletion for route params

Support for now: 

| Framework| Support |
| ---------| -- |
| Vue      | ✅ | 
| React    | ❌ |   
| Svelte   | ❌ |  

### Features for Vue

- 🔺 Uses Nuxt 3 file base routing
- 🏎 Provides a `useTypedRouter` composable that returns the typed router and an object containing a tree of your routes
- 🚦 Provides auto-completion and strict typing for route params in `push` and `replace` methods

# Installation


```bash
pnpm i -D vite-plugin-typed-router vue-router
# or
npm install -D vite-plugin-typed-router vue-router
```

# Configuration

First, register the module in the `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import TypedRouter from 'vite-plugin-typed-router';

export default defineConfig({
  plugins: [vue(), TypedRouter(/* Options */)],
});
```

In your `main.ts`, register the routes

```ts
import { createApp } from 'vue';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
// Generated routes
import routes from '~pages';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.mount('#app');

```


## Options:

```ts
export interface TypedRouterOptions {
  /** Location of your src directory
   * @default "src"
   */
  srcDir?: string;
  /** Output directory where you cant the files to be saved (ex: "./generated")
   * @default "<srcDir>/generated"
   */
  outDir?: string;
  /** Location of your pages directory
   * @default "<srcDir>/pages"
   */
  pagesDir?: string;
  /** Print the generated routes tree object in output
   * @default "true"
   */
  printRoutesTree?: boolean;
}

```

# Generated files

The module will generate 4 files each time you modify the `pages` folder :

- `~/<outDir>/__routes.ts` with the global object of the route names inside.
- `~/<outDir>/__useTypedRouter.ts` Composable tu simply access your typed routes
- `~/<outDir>/typed-router.d.ts` containing the global typecript definitions and exports

# Usage in Vue/Nuxt

<br/>

### **_Requirements_**

You can specify the output dir of the generated files in your configuration. It defaults to `<srcDir>/generated`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import TypedRouter from 'vite-plugin-typed-router';

export default defineConfig({
  plugins: [vue(), TypedRouter({outDir: 'generated'})],
});
```

# How it works

Given this structure

        ├── pages
            ├── index
                ├── content
                    ├── [id].vue
                ├── content.vue
                ├── index.vue
                ├── communication.vue
                ├── statistics.vue
                ├── [user].vue
            ├── index.vue
            ├── forgotpassword.vue
            ├── reset-password.vue
        │   └── login.vue
        └── ...

The generated route list will look like this

```ts
export const routesNames = {
  forgotpassword: 'forgotpassword' as const,
  login: 'login' as const,
  resetPassword: 'reset-password' as const,
  index: {
    index: 'index' as const,
    communication: 'index-communication' as const,
    content: {
      id: 'index-content-id' as const,
    },
    statistics: 'index-statistics' as const,
    user: 'index-user' as const,
  },
};
export type TypedRouteList =
  | 'forgotpassword'
  | 'login'
  | 'reset-password'
  | 'index'
  | 'index-communication'
  | 'index-content-id'
  | 'index-statistics'
  | 'index-user';
```

> You can disable `routesNames` object generation if you don't need it with the `printRoutesTree` option


# Usage with `useTypedRouter` hook

`useTypedRouter` is an exported composable from nuxt-typed-router. It contains a clone of `vue-router` but with strictly typed route names and params type-check

```vue
<script lang="ts">
// The path here is `~/generated` because I set `outDir: './generated'` in my module options
import { useTypedRouter } from '~/generated';

export default defineComponent({
  setup() {
    // Fully typed
    const { router, routes } = useTypedRouter();

    function navigate() {
      // Autocompletes the name and infer the params
      router.push({ name: routes.index.user, params: { user: 1 } }); // ✅ valid
      router.push({ name: routes.index.user, params: { foo: 1 } }); // ❌ invalid

      router.push({ name: 'index-user', params: { user: 1 } }); // ✅ valid
      router.push({ name: 'index-user', params: { foo: 1 } }); // ❌ invalid
      router.push({ name: 'index-foo-bar' }); // ❌ invalid
    }

    return { navigate };
  },
});
</script>
```