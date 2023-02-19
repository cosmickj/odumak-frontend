<template>
  <header class="relative flex items-center justify-between">
    <RouterLink :to="{ name: 'HomeView' }">
      <Button
        icon="pi pi-arrow-left"
        class="p-button-text p-button-secondary"
      />
    </RouterLink>

    <span
      class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-2xl"
    >
      출석 체크
    </span>

    <Button
      class="p-button-warning p-button-sm"
      label="저장"
      @click="handleSubmit"
    />
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits(['submit']);

const handleSubmit = () => emit('submit');
</script>
