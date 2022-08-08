<template>
  <DataTable
    class="overflow-auto w-[860px] h-[90vh] mt-[5vh] mx-auto drop-shadow-lg"
    :value="dataSource"
    :lazy="true"
    :loading="isLoading"
    :rowHover="true"
    responsiveLayout="scroll"
    @row-click="handleRowClick"
  >
    <Column field="grade" header="grade" />

    <Column field="group" header="group" />

    <Column field="name" header="name" />

    <Column field="role" header="role" />

    <Column field="remark" header="remark" />
  </DataTable>
</template>

<script setup lang="ts">
import { DataTableRowClickEvent } from 'primevue/datatable';

const props = defineProps<{
  dataSource: any;
  isLoading: boolean;
}>();

const emit = defineEmits(['rowClick']);

const handleRowClick = (ev: DataTableRowClickEvent) => {
  emit('rowClick', ev.data);
};
</script>
