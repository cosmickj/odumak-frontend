<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-100 text-black">
    <div class="absolute top-8 left-0 flex w-full px-8 justify-between">
      <slot name="header"></slot>

      <Button
        class="p-button-danger p-button-outlined p-button-rounded"
        icon="pi pi-times"
        @click="handleVisible"
      />
    </div>

    <div
      class="overflow-auto w-screen h-screen px-8 pt-20 border border-sky-600"
    >
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
