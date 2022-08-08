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

    <Column field="gender" header="gender" />

    <Column field="phone" header="phone" />

    <Column field="teacher" header="teacher" />

    <Column field="birth" header="birth">
      <template #body="{ data }">
        {{ translateBirth(data.birth?.seconds) }}
      </template>
    </Column>

    <Column field="address" header="address" headerStyle="min-width: 30rem" />

    <Column field="remark" header="remark" />
  </DataTable>
</template>

<script setup lang="ts">
import type { DataTableRowClickEvent } from 'primevue/datatable/DataTable';

const props = defineProps<{
  dataSource: any;
  isLoading: boolean;
}>();

const emit = defineEmits(['rowClick']);

const translateBirth = (seconds: number | undefined) => {
  if (seconds) {
    return new Date(seconds * 1000);
  } else {
    return;
  }
};

const handleRowClick = (ev: DataTableRowClickEvent) => {
  if (ev.data.birth) {
    ev.data.birth = translateBirth(ev.data.birth.seconds);
  }
  emit('rowClick', ev.data);
};
</script>
