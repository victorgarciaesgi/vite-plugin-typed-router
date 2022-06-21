<template>
  <button type="button" @click="navigate">Click me to navigate</button>
</template>

<script setup lang="ts">
import { useTypedRouter } from '../generated';

const { router, routes } = useTypedRouter();
function navigate() {
  router.push({ name: routes.childTwo.profile.index });
}
</script>
