<template>
  <div
    v-if="isVisible"
    class="absolute inset-0 flex flex-col bg-black bg-opacity-80 items-center justify-end"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();
</script>
