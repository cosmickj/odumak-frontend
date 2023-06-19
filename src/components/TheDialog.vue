<template>
  <div
    v-if="visible"
    class="z-10 fixed inset-0 flex flex-col bg-gray-100 text-black"
  >
    <div class="flex px-4 pt-4 justify-between">
      <slot name="header"></slot>

      <Button
        class="p-button-danger p-button-outlined p-button-rounded"
        icon="pi pi-times"
        @click="handleClose"
      />
    </div>

    <div class="overflow-auto flex-1 gap-4 p-4 items-start">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ visible: boolean }>();

const emit = defineEmits(['close']);

const handleClose = () => emit('close', !props.visible);
</script>
