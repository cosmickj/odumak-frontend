<template>
  <AdminDataTableHeader
    :selected-rows="selectedRows"
    @export="exportDataTable"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        ref="dataTableRef"
        :value="dataSource"
        :loading="isLoading"
        v-model:selection="selectedRows.body"
        lazy
        rowHover
        removableSort
        sortMode="multiple"
        responsiveLayout="scroll"
      >
        <Column class="w-12" selectionMode="multiple" :exportable="false" />

        <Column
          v-for="(column, idx) in selectedColumns"
          :field="column.field"
          :header="column.header"
          :sortable="column.sortable"
          :key="idx"
        >
          <template #body="slotProps">
            <span v-if="column.format">
              {{ column.format(slotProps.data[column.field]) }}
            </span>

            <span v-else>
              {{ slotProps.data[column.field] }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminDataTableHeader from '@/views/Admin/AdminDataTableHeader.vue';

import { ref } from 'vue';

import type DataTable from 'primevue/datatable';
import type { MemberData, UserData } from '@/types';

const props = defineProps<{
  dataSource: MemberData[] | UserData[];
  isLoading: boolean;
  selectedColumns: any;
  selectedRows: any;
}>();

const emit = defineEmits(['add', 'edit', 'delete']);

const handleAdd = () => emit('add');

const handleEdit = () => emit('edit');

const handleDelete = () => emit('delete');

const dataTableRef = ref<DataTable | null>(null);

const exportDataTable = () => {
  if (dataTableRef.value) dataTableRef.value.exportCSV();
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
