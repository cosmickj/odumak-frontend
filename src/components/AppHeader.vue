<template>
  <header class="relative py-4 text-center shadow-[0_1px_9px_-2px_rgba(0,0,0,0.5)]">
    <RouterLink class="absolute left-2 top-1/2 -translate-y-1/2" :to="{ name: routeName }">
      <Avatar icon="pi pi-angle-left" size="large" />
    </RouterLink>

    <span class="text-xl">{{ header }}</span>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  header: string;
  routeName: string;
}>();
</script>
