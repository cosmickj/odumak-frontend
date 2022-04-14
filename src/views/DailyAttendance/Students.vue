<template>
  <DataTable
    ref="dt"
    class="p-datatable-sm"
    scrollHeight="calc(100vh - 230px)"
    removableSort
    :value="studentsDailyAttendance"
    :scrollable="true"
    :filters="filter"
  >
    <template #header>
      <div class="flex justify-content-between">
        <div style="text-align: left">
          <Button
            icon="pi pi-external-link"
            class="p-button-sm p-button-secondary"
            label="엑셀저장"
            @click="exportCSV"
          />
        </div>
        <div class="flex justify-content-end align-items-center">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filter.global.value"
              class="p-inputtext-sm"
              placeholder="검색하기"
            />
          </span>
        </div>
      </div>
    </template>
    <Column field="class" header="학년반" :sortable="true"></Column>
    <Column field="teacher" header="담임" :sortable="true"></Column>
    <Column field="name" header="학생" :sortable="true"></Column>
    <Column field="attendance" header="출결" :sortable="true"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { FilterMatchMode } from "primevue/api";

interface Filter {
  global: {
    value: string;
    matchMode: string;
  };
}

defineProps({
  studentsDailyAttendance: {
    type: Array,
    // required: true,
  },
});

const dt = ref<any>(null);
const filter = ref<Filter>({
  global: { value: "", matchMode: FilterMatchMode.CONTAINS },
});

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>

<style scoped></style>
