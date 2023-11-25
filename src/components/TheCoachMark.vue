<template>
  <div v-if="isVisible" class="absolute inset-0 flex flex-col items-center justify-end bg-black bg-opacity-80">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();
</script>
