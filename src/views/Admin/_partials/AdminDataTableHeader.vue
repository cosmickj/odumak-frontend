<template>
  <div class="mb-6 flex justify-between">
    <div class="flex gap-x-3">
      <Button
        class="p-button-success p-button-sm"
        icon="pi pi-plus"
        :label="isMobile ? '' : '추가하기'"
        @click="handleAdd"
      >
      </Button>

      <Button
        class="p-button-danger p-button-sm"
        icon="pi pi-trash"
        :label="isMobile ? '' : '삭제하기'"
        :disabled="!isDisabled"
        @click="handleDelete"
      />

      <Button
        class="p-button- p-button-sm"
        icon="pi pi-angle-double-up"
        :label="isMobile ? '' : '학년 등반'"
        :disabled="!isDisabled"
        @click="handlePromotion"
      />
    </div>

    <Button
      class="p-button-help p-button-sm"
      icon="pi pi-external-link"
      :label="isMobile ? '' : '내보내기'"
      @click="handleExport"
    />
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { computed } from 'vue';
import type { Member } from '@/models';

const props = defineProps<{
  selection: Member[];
}>();

const emit = defineEmits(['export', 'add', 'delete', 'promotion']);

const handleAdd = () => emit('add');
const handleDelete = () => emit('delete');
const handleExport = () => emit('export');
const handlePromotion = () => emit('promotion');

const breakpoints = useBreakpoints(breakpointsTailwind);

const isMobile = breakpoints.smallerOrEqual('sm');

const isDisabled = computed(() => {
  if (props.selection) {
    return props.selection.length > 0;
  }
  return false;
});
</script>
