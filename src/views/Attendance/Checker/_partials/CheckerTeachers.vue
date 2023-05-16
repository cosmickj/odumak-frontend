<template>
  <div
    v-for="(attendance, i) in attendances"
    class="mt-[-1px] p-2 border border-slate-300 items-center justify-between"
    :key="i"
  >
    <div class="flex items-center justify-between">
      <span>{{ attendance.name }}</span>

      <Button
        v-if="attendance.role !== 'common'"
        icon="pi pi-chevron-down"
        class="p-button-rounded p-button-text p-button-secondary p-button-sm"
        @click="getSubAttendances(attendance)"
      />
    </div>

    <SelectButton
      v-model="attendance.attendance.status"
      class="flex [&>*:nth-child(1)]:flex-1 xs:[&>*:nth-child(2)]:flex-1 [&>*:nth-child(3)]:flex-1"
      :options="[
        { name: '현장', value: 'offline' },
        { name: '온라인', value: 'online' },
        { name: '결석', value: 'absence' },
      ]"
      option-label="name"
      option-value="value"
    />
  </div>

  <Dialog
    modal
    v-model:visible="visible"
    class="p-dialog-custom"
    header="담당 학생 출석 체크"
    :style="{ width: '360px' }"
    :breakpoints="{ '641px': '95vw' }"
  >
    <CheckerStudents :attendances-template="subAttendances" />

    <template #footer>
      <Button
        label="저장"
        severity="warning"
        size="small"
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import CheckerStudents from './CheckerStudents.vue';
import { ref } from 'vue';
import { useAttendanceStore } from '@/store/attendance';
import type { AttendanceData } from '@/types';

const props = defineProps<{
  attendances: AttendanceData[];
  attendanceDate: Date;
}>();

const attendanceStore = useAttendanceStore();

const visible = ref(false);
const isLoading = ref(false);
const subAttendances = ref<AttendanceData[]>([]);

const getSubAttendances = async (attd: AttendanceData) => {
  try {
    isLoading.value = true;

    await attendanceStore.fetchAttendances({
      church: attd.church!,
      department: attd.department!,
      job: 'student',
      attendanceDate: props.attendanceDate,
    });

    subAttendances.value = attendanceStore.attendancesRecord.daily;

    visible.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
.p-dialog-custom .p-dialog-content {
  padding: unset;
}
@media (max-width: 320px) {
  .p-dialog-custom .p-dialog-content {
    font-size: 12px;
  }
  .p-dialog-custom .p-component {
    font-size: 12px;
  }
}
</style>
