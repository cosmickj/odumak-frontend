<template>
  <AdminDataTableHeader
    :selection="selectionRef"
    @export="exportDataTable"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />

  <DataTable
    lazy
    rowHover
    ref="dataTableRef"
    :value="dataSource"
    :loading="isLoading"
    v-model:selection="selectionRef"
    responsiveLayout="scroll"
    @update:selection="handleUpdateSelection"
  >
    <Column class="w-12" selectionMode="multiple" :exportable="false" />

    <Column
      v-for="(column, idx) in selectedColumns"
      :field="column.field"
      :header="column.header"
      :key="idx"
      :style="`min-width: ${column.minWidth}rem`"
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
</template>

<script setup lang="ts">
import AdminDataTableHeader from '@/views/Admin/AdminDataTableHeader.vue';

import { ref, watch } from 'vue';

import type DataTable from 'primevue/datatable';
import type { MemberData, UserData } from '@/types';

const props = defineProps<{
  dataSource: MemberData[] | UserData[];
  isLoading: boolean;
  selectedColumns: any;
  selection: MemberData[];
}>();

const emit = defineEmits(['add', 'edit', 'delete', 'toggle']);

const handleAdd = () => emit('add');

const handleEdit = () => emit('edit');

const handleDelete = () => emit('delete');

const dataTableRef = ref<DataTable | null>(null);

const exportDataTable = () => {
  if (dataTableRef.value) dataTableRef.value.exportCSV();
};

// 상위 컴포넌트에서 받아온 props에 twoway-binding을 하기 위해서는 한 번 더 감싸줘야한다
// TODO: 더 깔끔한 방법이 있을지 고민해보자
const selectionRef = ref(props.selection);

watch(
  () => props.selection,
  (newValue) => (selectionRef.value = newValue),
  { deep: true }
);

const handleUpdateSelection = () => emit('toggle', selectionRef.value);
</script>
