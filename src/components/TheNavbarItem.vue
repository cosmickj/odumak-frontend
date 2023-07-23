<template>
  <RouterLink class="w-16 text-center" :to="{ name: routeName }">
    <div :class="className">
      <i class="text-xl" :class="icon"></i>
    </div>
    <p class="mt-1">{{ label }}</p>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  routeName: string;
  className?: string;
}>();
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  position: relative;
}
.router-link-exact-active::after {
  content: '';
  position: absolute;
  inset: auto 0 -6px 0;
  height: 3px;
  background: #1e293b;
}
</style>
