<template>
  <div class="overflow-y-auto h-screen px-16 py-10 bg-slate-100">
    <div class="overflow-hidden rounded-2xl drop-shadow-md">
      <DataTable
        class="select-none"
        :value="studendList"
        removableSort
        sortMode="multiple"
        responsive-layout="stack"
        breakpoint="450px"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span>영은교회 초등부 학생 리스트</span>
            <Button class="p-button-warning" @click="addColumn">컬럼 추가</Button>
          </div>
        </template>

        <Column
          v-for="(col, idx) of columns"
          :key="idx"
          :field="col.field"
          :header="col.header"
          :body-style="`width: ${columnWidth}%;`"
          sortable
        >
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" class="sm:w-full" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAttendanceStore } from '@/store/attendance';
import { Student } from '@/types';
import { DataTableCellEditCompleteEvent } from 'primevue/datatable/DataTable';
import { computed } from '@vue/reactivity';

const attendace = useAttendanceStore();

const documentId = ref('');
const studendList = ref<Student[]>([]);

onMounted(async () => {
  const result = await attendace.fetchStudentList();
  documentId.value = result.documentId;
  studendList.value = result.members;
});

const onCellEditComplete = (ev: DataTableCellEditCompleteEvent) => {
  // console.log(documentId.value);
  // console.log(ev.field);
  // console.log(ev.index);
  // console.log(ev.newValue);
};

const columns = ref([
  { field: 'grade', header: '학년' },
  { field: 'group', header: '학급' },
  { field: 'name', header: '이름' },
  { field: 'teacher', header: '담당교사' },
]);

const columnWidth = computed(() => 100 / columns.value.length);

const addColumn = () => {
  columns.value.push({
    field: 'hello',
    header: 'HELLO',
  });
};
</script>

<style scoped>
:deep(.p-cell-editing) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
