<template>
  <button type="button" @click="navigate">Click me to navigate</button>
</template>

<script setup lang="ts">
import { useTypedRouter } from '../generated';

const { router } = useTypedRouter();

function navigate() {
  router.push({ name: 'parent-child-two-profile' });
}
</script>
