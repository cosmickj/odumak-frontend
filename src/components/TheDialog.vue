<template>
  <div v-if="visible" class="fixed inset-0 z-10 flex flex-col bg-gray-100 text-black">
    <div class="flex justify-between px-4 pt-4">
      <slot name="header"></slot>

      <Button
        class="p-button-danger p-button-outlined p-button-rounded"
        icon="pi pi-times"
        @click="handleClose"
      />
    </div>

    <div class="flex-1 items-start gap-4 overflow-auto p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ visible: boolean }>();

const emit = defineEmits(['close']);

const handleClose = () => emit('close', !props.visible);
</script>
