<template>
  <RouterLink class="text-gray-500" :to="{ name: routeName }">
    <div class="min-w-[60px] aspect-square text-center">
      <i class="text-2xl" :class="icon"></i>
      <p class="mt-1">{{ label }}</p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  routeName: string;
}>();
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  position: relative;
  color: #1e293b;
}
.router-link-active::after,
.router-link-exact-active::after {
  content: '';
  position: absolute;
  inset: auto 0 -4px 0;
  height: 3px;
  background: #1e293b;
}
</style>
