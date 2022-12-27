<template>
  <div v-if="visible" class="fixed inset-0 bg-white">
    <Button
      class="absolute top-8 right-8 p-button-rounded p-button-danger p-button-outlined"
      icon="pi pi-times"
      @click="handleVisible"
    />
    <div class="overflow-auto w-screen h-screen p-8">
      <slot name="header"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['update:visible']);

const handleVisible = () => emit('update:visible', !props.visible);
</script>
