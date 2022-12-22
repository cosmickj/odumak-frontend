<template>
  <div class="container">
    <div class="mb-5 flex justify-between">
      <div class="flex gap-x-3">
        <Button
          class="p-button-success p-button-lg"
          icon="pi pi-plus"
          label="추가하기"
          :disabled="isDisabled"
          @click="handleAdd"
        />
        <Button
          class="p-button-warning p-button-lg"
          icon="pi pi-user-edit"
          label="수정하기"
          :disabled="!isDisabled"
          @click="handleEdit"
        />
        <Button
          class="p-button-danger p-button-lg"
          icon="pi pi-trash"
          label="삭제하기"
          :disabled="!isDisabled"
          @click="handleDelete"
        />
      </div>

      <div class="flex">
        <Button
          class="p-button-help p-button-lg"
          icon="pi pi-external-link"
          label="내보내기"
          @click="handleExport"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  selectedRows: any;
}>();

const emit = defineEmits(['export', 'add', 'edit', 'delete']);

const handleAdd = () => emit('add');

const handleEdit = () => emit('edit');

const handleDelete = () => emit('delete');

const handleExport = () => emit('export');

const isDisabled = computed(() => props.selectedRows.body.length > 0);
</script>
