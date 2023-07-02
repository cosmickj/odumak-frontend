<template>
  <main class="overflow-auto flex flex-col h-full p-4">
    <CheckerHeader :is-changed="isChanged" @submit="saveAttendances" />

    <Calendar
      touchUI
      class="my-4"
      input-class="text-center"
      placeholder="날짜를 선택해주세요"
      v-model="attendanceDate"
      :max-date="maxDate"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="getAttendances"
    />

    <div class="flex gap-2 mb-2 text-lg">
      <span
        v-if="
          userData.role.system === 'admin' ||
          userData.role.executive === 'secretary'
        "
      >
        {{ userData.church }} {{ userData.department }} 교사
      </span>

      <span v-else-if="userData.role.system === 'user'">
        {{ formatClassName(userData.grade, userData.group) }}
      </span>

      <span>(총 {{ attendances.length }}명)</span>
    </div>

    <ProgressSpinner v-if="isLoading" />

    <template v-else>
      <CheckerTeachers
        v-if="
          userData.role.system === 'admin' ||
          userData.role.executive === 'secretary'
        "
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
    </template>
  </main>
</template>

<script setup lang="ts">
import CheckerHeader from './_partials/CheckerHeader.vue';
import CheckerStudents from './_partials/CheckerStudents.vue';
import CheckerTeachers from './_partials/CheckerTeachers.vue';

import { computed, ref, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useAttendanceStore } from '@/store/attendance';
import { getPreviousSunday } from '@/utils/useCalendar';
import { formatClassName } from '@/utils/useFormat';
import type { Attendance } from '@/models';

const router = useRouter();
const userStore = useUserStore();
const attendanceStore = useAttendanceStore();

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const isLoading = ref(false);
const attendances = ref<Attendance[]>([]);
const attendancesClone = ref<Attendance[]>([]);

const isChanged = computed(() => {
  const attd = attendances.value;
  const clone = attendancesClone.value;

  return JSON.stringify(attd) !== JSON.stringify(clone);
});

const visible = ref(true);
const userData = computed(() => userStore.userData!);

const getAttendances = async () => {
  try {
    isLoading.value = true;

    const { system, executive } = userData.value.role;
    if (system === 'admin' || executive === 'secretary') {
      await attendanceStore.fetchAttendances({
        attendanceDate: attendanceDate.value,
        church: userData.value.church,
        department: userData.value.department,
        job: 'teacher',
      });
    } else if (system === 'user') {
      await attendanceStore.fetchAttendancesByGradeGroup({
        attendanceDate: attendanceDate.value,
        church: userData.value.church,
        department: userData.value.department,
        grade: userData.value.grade,
        group: userData.value.group,
        job: 'student',
      });
    }

    attendances.value = attendanceStore.attendancesRecord.daily;
    attendancesClone.value = structuredClone(toRaw(attendances.value));
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await getAttendances());

const saveAttendances = () => {
  try {
    attendances.value.forEach(async (attd) => {
      if (attd.uid) {
        return await attendanceStore.modifyAttendance({
          uid: attd.uid,
          attendance: { status: attd.attendance.status },
        });
      }

      return await attendanceStore.addAttendance({
        memberUid: attd.memberUid,
        name: attd.name,
        church: attd.church,
        department: attd.department,
        grade: attd.grade,
        group: attd.group,
        job: attd.job,
        attendance: {
          date: attendanceDate.value,
          status: attd.attendance.status ? attd.attendance.status : 'absence',
        },
        createdBy: userData.value.name,
      });
    });

    if (confirm('저장되었습니다! 확인하러 가시겠습니까?')) {
      router.push({
        name: 'AttendanceTrackerDaily',
        params: { job: attendances.value[0].job },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const navigateHome = () => router.push({ name: 'HomeView' });
</script>
