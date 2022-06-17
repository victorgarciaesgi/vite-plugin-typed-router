<template>
  <button type="button" @click="navigate">Click me to navigate</button>
</template>

<script setup lang="ts">
import { useTypedRouter } from '../generated';

const { router, routes } = useTypedRouter();
function navigate() {
  // console.log($typedRouter, $routesList);
  // router.push({ name: 'activate' });
  router.push({ name: routes.activate });
}
</script>
