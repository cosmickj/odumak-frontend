<template>
  <main class="overflow-auto flex flex-col h-full p-4">
    <CheckerHeader @submit="onSubmit" />

    <Calendar
      touchUI
      v-model="attendanceDate"
      class="my-5"
      input-class="text-center"
      placeholder="날짜를 선택해주세요"
      :max-date="maxDate"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="getAttendances"
    />

    <ProgressSpinner v-if="isLoading" />

    <section v-else>
      <CheckerTeachers
        v-if="userData.role.system === 'admin'"
        :attendances="attendances"
        :attendance-date="attendanceDate"
      />

      <CheckerStudents
        v-else-if="
          userData.role.teacher === 'head' ||
          userData.role.teacher === 'assistant'
        "
        :attendances="attendances"
      />

      <Dialog
        v-else
        modal
        header="담임이 아닙니다"
        v-model:visible="visible"
        :breakpoints="{ '450px': '85vw' }"
        @hide="navigateHome"
      >
        <p>출석 체크는 담임, 부담임 선생님만 이용할 수 있습니다.</p>

        <template #footer>
          <Button
            label="알겠습니다"
            class="p-button-info"
            icon="pi pi-check"
            @click="navigateHome"
          />
        </template>
      </Dialog>
    </section>
  </main>
</template>

<script setup lang="ts">
import CheckerHeader from './_partials/CheckerHeader.vue';
import CheckerStudents from './_partials/CheckerStudents.vue';
import CheckerTeachers from './_partials/CheckerTeachers.vue';

import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useAttendanceStore } from '@/store/attendance';
import { getPreviousSunday } from '@/utils/useCalendar';
import type { AttendanceData } from '@/types';

const router = useRouter();
const userStore = useUserStore();
const attendanceStore = useAttendanceStore();

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const isLoading = ref(false);
const attendances = ref<AttendanceData[]>([]);

const visible = ref(true);

const userData = computed(() => userStore.userData!);

const RequestJobMap = {
  admin: 'teacher' as const,
  head: 'student' as const,
  assistant: 'student' as const,
  common: null,
};
const requestJob = computed(() => RequestJobMap[userData.value.role.teacher!]);

const getAttendances = async () => {
  try {
    isLoading.value = true;

    if (!requestJob.value) {
      return;
    }

    // CONTINUE: role에 따른 출석 입력 데이터 변경처리
    // if (requestJob.value === 'teacher') {
    //   await attendanceStore.fetchAttendances({
    //     attendanceDate: attendanceDate.value,
    //     church: userData.value.church!,
    //     department: userData.value.department!,
    //     job: requestJob.value,
    //   });
    // } else if (requestJob.value === 'student') {
    await attendanceStore.fetchAttendancesByGradeGroup({
      attendanceDate: attendanceDate.value,
      church: userData.value.church!,
      department: userData.value.department!,
      grade: userData.value.grade!,
      group: userData.value.group!,
      job: requestJob.value,
    });
    // }

    attendances.value = attendanceStore.attendancesRecord.daily;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await getAttendances());

const onSubmit = () => {
  try {
    attendances.value.forEach(async (attendance) => {
      if (attendance.uid) {
        await attendanceStore.modifyAttendance({
          uid: attendance.uid,
          attendance: {
            status: attendance.attendance.status,
          },
        });
      } else {
        await attendanceStore.addAttendance({
          name: attendance.name,
          church: attendance.church,
          department: attendance.department,
          grade: attendance.grade,
          group: attendance.group,
          job: attendance.job,
          attendance: {
            date: attendanceDate.value,
            status: attendance.attendance.status,
          },
          createdBy: userData.value.name,
        });
      }
    });

    alert('저장되었습니다!');
  } catch (error) {
    console.log(error);
  }
};

const navigateHome = () => router.push({ name: 'HomeView' });
</script>
