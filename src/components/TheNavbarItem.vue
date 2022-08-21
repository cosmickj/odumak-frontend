<template>
  <RouterLink :to="{ name: routeName }">
    <div
      class="flex w-24 h-24 items-center justify-center"
      :class="{ 'button-important': isImportant }"
    >
      <i class="text-5xl" :class="icon"></i>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  routeName: string;
  isImportant?: boolean;
}>();
</script>

<style scoped>
.button-important {
  position: relative;
  bottom: 26px;
  background: rgb(234, 179, 8);
  border: 4px solid rgb(241, 245, 249);
  border-radius: 50%;
}
</style>
