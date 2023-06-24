<template>
  <header class="relative flex items-center justify-between">
    <RouterLink :to="{ name: 'HomeView' }">
      <Button text severity="secondary" icon="pi pi-angle-left" />
    </RouterLink>

    <span
      class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-xl"
    >
      출석 체크
    </span>

    <Button
      label="저장"
      size="small"
      severity="warning"
      :disabled="!isChanged"
      @click="handleSubmit"
    />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  isChanged: boolean;
}>();

const emit = defineEmits(['submit']);

const handleSubmit = () => emit('submit');
</script>
