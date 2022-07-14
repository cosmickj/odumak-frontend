<template>
  <div class="flex flex-col justify-center items-center">
    <router-link
      class="p-2"
      :class="{ 'bg-yellow-500 rounded-full': isImportant }"
      :to="{ name: routeName, params: { position } }"
    >
      <i class="pi" :class="icon" style="font-size: 2rem"></i>
    </router-link>
    <span>{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  isImportant?: boolean;
  routeName: string;
  position?: string;
  title: string;
}>();
</script>
