<template>
  <button type="button" @click="navigate">Click me to navigate</button>
</template>

<script setup lang="ts">
import { useTypedRouter } from '../generated';

const { router, routes } = useTypedRouter();
function navigate() {
  router.push({ name: routes.childTwo.profile.id.index, params: { id: '1' } });
}
</script>
