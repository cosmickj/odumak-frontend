<template>
  <DataTable
    v-if="attendanceDate && !isLoading"
    ref="dataTable"
    class="p-datatable-sm mt-5 shadow"
    :value="teachersAttendance"
    responsive-layout="scroll"
    sort-field="name"
    :sort-order="1"
  >
    <!-- 저장하기 -->
    <template #header>
      <div class="flex items-center justify-between">
        <Button class="p-button-sm p-button-secondary" icon="pi pi-download" label="저장하기" @click="exportCSV" />
      </div>
    </template>

    <Column field="class" header="담당학급" bodyStyle="text-align:center">
      <template #body="slotProps">
        <!-- <span>{{ slotProps.data.grade }}, {{ slotProps.data.group }}</span> -->
        <span>{{ translateAssignedClass(slotProps.data.grade, slotProps.data.group) }}</span>
      </template>
    </Column>

    <Column field="name" header="이름" bodyStyle="text-align:center" />

    <Column field="attendance" header="출석현황" bodyClass="flex justify-center">
      <template #body="slotProps">
        <span :class="`attendance-${slotProps.data.attendance}`">
          {{ translateAttendance(slotProps.data.attendance) }}
        </span>
      </template>
    </Column>

    <template #footer>
      <div class="flex items-center justify-center">
        <span class="text-xl">총 {{ teachersAttendance.length }}명</span>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Teacher } from '@/types';

interface Props {
  attendanceDate: Date | undefined | null;
  isLoading: boolean;
  teachersAttendance: Teacher[];
}

const props = withDefaults(defineProps<Props>(), {
  attendanceDate: null,
  isLoading: false,
  teachersAttendance: () => [],
});

const translateAttendance = (attendance: string) => {
  if (attendance === 'online') return '온라인';
  if (attendance === 'offline') return '현장';
  if (attendance === 'absence') return '결석';
  else return '미입력';
};

const translateAssignedClass = (grade: string, group: string) => {
  if (grade === '0') {
    return '새친구';
  } else if (grade === 'n/a') {
    return '-';
  } else {
    return `${grade}학년 ${group}반`;
  }
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
