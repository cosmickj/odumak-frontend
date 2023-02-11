<template>
  <div class="flex mb-6 justify-between">
    <div class="flex gap-x-3">
      <Button
        class="p-button-success p-button-sm"
        icon="pi pi-plus"
        label="추가하기"
        @click="handleAdd"
      />
      <Button
        class="p-button-danger p-button-sm"
        icon="pi pi-trash"
        label="삭제하기"
        :disabled="!isDisabled"
        @click="handleDelete"
      />
    </div>

    <Button
      class="p-button-help p-button-sm"
      icon="pi pi-external-link"
      label="내보내기"
      @click="handleExport"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { MemberData } from '@/types';

const props = defineProps<{
  selection: MemberData[];
}>();

const emit = defineEmits(['export', 'add', 'delete']);

const handleAdd = () => emit('add');
const handleDelete = () => emit('delete');
const handleExport = () => emit('export');

const isDisabled = computed(() => props.selection.length > 0);
</script>
