<template>
  <div class="overflow-auto h-[calc(100%_-_6rem)] p-8 bg-slate-100">
    <div class="text-3xl text-center">{{ title }} 출석현황</div>

    <Calendar
      v-model="attendanceDate"
      class="w-full pt-5"
      :touchUI="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      :placeholder="'날짜를 선택해주세요'"
      input-class="text-center"
      @date-select="onAttendanceDateSelect"
    />

    <TheFinger v-if="!attendanceDate" />

    <div class="mt-8 text-center" v-else-if="attendanceDate && isLoading">
      <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
    </div>

    <TrackerStudentsDaily
      v-if="position === 'students'"
      :attendance-date="attendanceDate"
      :is-loading="isLoading"
      :students-attendance="studentsAttendance"
    />

    <TrackerTeachersDaily
      v-if="position === 'teachers'"
      :attendance-date="attendanceDate"
      :is-loading="isLoading"
      :teachers-attendance="teachersAttendance"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAttendanceStore } from '@/store/attendance';

import TheFinger from '@/components/TheFinger.vue';
import TrackerStudentsDaily from './components/TrackerStudentsDaily.vue';
import TrackerTeachersDaily from './components/TrackerTeachersDaily.vue';

import type { Student, Teacher } from '@/types';

const route = useRoute();
const attendance = useAttendanceStore();

const position = computed(() => route.params.position);
const type = computed(() => route.params.type);
const title = computed(() => {
  let result = [];

  if (position.value === 'students') {
    result.push('학생');
  } else if (position.value === 'teachers') {
    result.push('교사');
  }
  if (type.value === 'daily') {
    result.push('일일');
  } else if (type.value === 'total') {
    result.push('누적');
  }
  return result.join(' ');
});

const isLoading = ref(false);
const attendanceDate = ref<Date>();

const studentsAttendance = ref<Student[]>([]);
const teachersAttendance = ref<Teacher[]>([]);

const onAttendanceDateSelect = async () => {
  try {
    isLoading.value = true;
    const params = { date: attendanceDate.value };

    if (position.value === 'students') {
      const result = await attendance.fetchStudentsAttendanceByDate(params);
      studentsAttendance.value = result;
    } else {
      const result = await attendance.fetchTeachersAttendanceByDate(params);
      teachersAttendance.value = result;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
:deep(.p-column-header-content) {
  justify-content: center;
}
</style>
