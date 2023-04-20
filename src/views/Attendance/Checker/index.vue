<template>
  <main class="overflow-auto flex flex-col h-full p-5">
    <CheckerHeader @submit="onSubmit" />

    <template v-if="accountData.isAccepted">
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
          v-if="accountData.role === 'admin'"
          :attendances="attendances"
        />
        <CheckerStudents
          v-else-if="accountData.role === 'main' || accountData.role === 'sub'"
          :attendances-template="attendances"
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
    </template>

    <template v-else>
      <Dialog
        modal
        header="승인이 필요합니다"
        v-model:visible="visible"
        :breakpoints="{ '450px': '85vw' }"
        @hide="navigateHome"
      >
        <p>서기 선생님의 승인 이전에는 출석 체크를 할 수 없습니다.</p>

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
import CheckerHeader from './components/CheckerHeader.vue';
import CheckerStudents from './components/CheckerStudents.vue';
import CheckerTeachers from './components/CheckerTeachers.vue';

import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import type { AttendanceData } from '@/types';

const router = useRouter();
const accountStore = useAccountStore();
const attendanceStore = useAttendanceStore();

// https://bobbyhadz.com/blog/javascript-get-previous-sunday
const getPreviousSunday = (date = new Date()) => {
  const _date = new Date();
  _date.setDate(date.getDate() - date.getDay());
  _date.setHours(0, 0, 0, 0);
  return _date;
};

const maxDate = getPreviousSunday();
const attendanceDate = ref<Date>(getPreviousSunday());

const isLoading = ref(false);
const attendances = ref<AttendanceData[]>([]);

const visible = ref(true);

const accountData = computed(() => accountStore.accountData!);

const RequestJobMap = {
  admin: 'teacher' as const,
  main: 'student' as const,
  sub: 'student' as const,
  common: null,
};
const requestJob = computed(() => RequestJobMap[accountData.value.role!]);

const getAttendances = async () => {
  try {
    isLoading.value = true;

    if (!requestJob.value) {
      return;
    }

    await attendanceStore.fetchAttendances({
      church: accountData.value.church!,
      department: accountData.value.department!,
      job: requestJob.value,
      attendanceDate: attendanceDate.value,
    });

    attendances.value = attendanceStore.attendancesRecord.daily;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getAttendances();
});

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
          createdBy: accountData.value.name,
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
