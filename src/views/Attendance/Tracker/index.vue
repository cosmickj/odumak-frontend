<template>
  <div class="overflow-auto h-[calc(100%_-_6rem)] p-8 bg-slate-100">
    <div class="text-3xl text-center">{{ title }} 출석현황</div>

    <!-- TODO: 누적 현황 작업 이후에 v-if 제거 -->
    <Calendar
      v-if="type === 'daily'"
      v-model="attendanceDate"
      class="w-full pt-5"
      :touchUI="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      :placeholder="'날짜를 선택해주세요'"
      input-class="text-center"
      @date-select="onAttendanceDateSelect"
    />

    <!-- TODO: 누적 현황 작업 이후에 v-if 제거 -->
    <TheFinger v-if="!attendanceDate && type === 'daily'" />

    <TrackerStudentsDaily
      v-if="position === 'student' && type === 'daily'"
      :attendance-date="attendanceDate"
      :students-attendance="studentsAttendance"
    />

    <TrackerTeachersDaily
      v-else-if="position === 'teacher' && type === 'daily'"
      :attendance-date="attendanceDate"
      :teachers-attendance="teachersAttendance"
    />

    <TrackerStudentsTotal
      v-else-if="position === 'student' && type === 'total'"
    />

    <TrackerTeachersTotal
      v-else-if="position === 'teacher' && type === 'total'"
    />
  </div>

  <the-loader v-if="isLoading" />
</template>

<script setup lang="ts">
import TheFinger from '@/components/TheFinger.vue';
import TheLoader from '@/components/TheLoader.vue';
import TrackerStudentsDaily from './components/TrackerStudentsDaily.vue';
import TrackerTeachersDaily from './components/TrackerTeachersDaily.vue';
import TrackerStudentsTotal from './components/TrackerStudentsTotal.vue';
import TrackerTeachersTotal from './components/TrackerTeachersTotal.vue';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAttendanceStore } from '@/store/attendance';

import type { Position, Student, Teacher } from '@/types';
import { useAccountStore } from '@/store/account';

const route = useRoute();

const account = useAccountStore();
const attendance = useAttendanceStore();

const userData = computed(() => account.userData);
const position = computed(() => route.params.position as Position);
const type = computed(() => route.params.type);

const title = computed(() => {
  let result = [];

  if (position.value === 'student') {
    result.push('학생');
  }
  //
  else if (position.value === 'teacher') {
    result.push('교사');
  }

  if (type.value === 'daily') {
    result.push('일일');
  }
  //
  else if (type.value === 'total') {
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
    const params = {
      attendanceDate: attendanceDate.value!,
      church: userData.value?.church!,
      department: userData.value?.department!,
    };

    if (position.value === 'student') {
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
