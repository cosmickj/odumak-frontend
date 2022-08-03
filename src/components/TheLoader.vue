<template>
  <div
    v-if="isLoading"
    class="z-50 fixed inset-0 bg-zinc-500/50 flex items-center justify-center"
  >
    Loading......
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean;
}>();
</script>
