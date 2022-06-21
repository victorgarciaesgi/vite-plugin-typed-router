# 🚗🚦 Vite plugin vue router typed

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-vue-router-typed.svg
[npm-version-href]: https://www.npmjs.com/package/vite-plugin-vue-router-typed
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-vue-router-typed.svg
[npm-total-downloads-src]: https://img.shields.io/npm/dt/vite-plugin-vue-router-typed.svg
[npm-downloads-href]: https://www.npmjs.com/package/vite-plugin-vue-router-typed

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm downloads][npm-total-downloads-src]][npm-downloads-href]
<img src='https://img.shields.io/npm/l/simple-graphql-to-typescript.svg'>

> Provide a type safe router to any Vue 3 app with auto-generated typed definitions for route names and autocompletion for route params

- 🔺 Uses Nuxt 3 file base routing
- 🏎 Provides a `useTypedRouter` composable that returns the typed router an object containing a tree of your routes
- 🚦 Provides auto-completion and strict typing for route params in `push` and `replace` methods

# Installation


```bash
pnpm i -D vite-plugin-vue-typed-router vue-router
# or
npm install -D vite-plugin-vue-typed-router vue-router
```

# Configuration

First, register the module in the `nuxt.config.ts`

```ts
import TypedRouter from 'nuxt-typed-router';

export default defineNuxtConfig({
  buildModules: [TypedRouter],
  nuxtTypedRouter: {
    // options
  },
});
```