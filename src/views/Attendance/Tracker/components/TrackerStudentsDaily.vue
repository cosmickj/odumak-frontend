<template>
  <DataTable
    v-if="attendanceDate"
    ref="dataTable"
    class="p-datatable-sm mt-5 shadow"
    :value="studentsAttendance"
    row-group-mode="rowspan"
    group-rows-by="teacher"
    responsive-layout="scroll"
    sort-mode="multiple"
    :multi-sort-meta="multiSortMeta"
  >
    <!-- 저장하기 -->
    <template #header>
      <div class="flex items-center justify-between">
        <Button
          class="p-button-sm p-button-secondary"
          icon="pi pi-download"
          label="저장하기"
          @click="exportCSV"
        />
      </div>
    </template>

    <Column
      field="teacher"
      header="선생님"
      headerClass="flex justify-center"
      bodyStyle="text-align:center"
    >
      <template #body="slotProps">
        <p class="text-xl">{{ slotProps.data.teacher }}</p>
        <p>({{ countStudents(slotProps.data.teacher) }}명)</p>
      </template>
    </Column>

    <Column field="grade" header="학년" bodyStyle="text-align:center" />

    <Column field="group" header="학급" bodyStyle="text-align:center" />

    <Column field="name" header="이름" bodyStyle="text-align:center" />

    <Column
      field="attendance"
      header="출석현황"
      headerClass="flex justify-center"
      bodyClass="flex justify-center"
    >
      <template #body="slotProps">
        <span :class="`attendance-${slotProps.data.attendance}`">
          {{ translateAttendance(slotProps.data.attendance) }}
        </span>
      </template>
    </Column>

    <template #footer>
      <div class="flex items-center justify-center">
        <span class="text-xl">총 {{ studentsAttendance.length }}명</span>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Student } from '@/types';
import { multiSortMeta } from '../data';

interface Props {
  attendanceDate: Date | undefined | null;
  studentsAttendance: Student[];
}

const props = withDefaults(defineProps<Props>(), {
  attendanceDate: null,
  isLoading: false,
  studentsAttendance: () => [],
});

const translateAttendance = (attendance: string) => {
  if (attendance === 'online') return '온라인';
  if (attendance === 'offline') return '현장';
  if (attendance === 'absence') return '결석';
  else return '미입력';
};

const countStudents = (name: string) => {
  let total = 0;
  for (let result of props.studentsAttendance) {
    if (result.teacher === name) total++;
  }
  return total;
};

const dataTable = ref();
const exportCSV = () => dataTable.value.exportCSV();
</script>

<style scoped>
.attendance-online {
  width: 40px;
  height: 24px;
  background-color: #fbc02d;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attendance-offline {
  width: 40px;
  height: 24px;
  background-color: #4caf50;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attendance-absence {
  width: 40px;
  height: 24px;
  background-color: #ff4032;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attendance-undefined {
  width: 40px;
  height: 24px;
  background-color: #cccccc;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
