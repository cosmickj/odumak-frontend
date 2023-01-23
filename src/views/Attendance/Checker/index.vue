<template>
  <section class="flex flex-col h-full p-8">
    <CheckerHeader />

    <Calendar
      v-model="attendanceDate"
      class="pt-5"
      touchUI
      input-class="text-center"
      placeholder="날짜를 선택해주세요"
      :max-date="maxDate"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="getAttendances"
    />

    <!-- <TheLoader v-if="isLoading" />

    <div
      v-if="!isTeacher(accountStore.accountData?.role) && attendanceDate"
      class="grow flex items-center justify-center text-xl"
    >
      <p>담당 학급이 있는 선생님만 이용할 수 있습니다.</p>
    </div>

    <CheckerStudents
      v-else-if="isTeacher(accountStore.accountData?.role) && attendanceDate"
      v-model="dataSource"
      :attendance-date="attendanceDate"
      :checksum="copyDataSource"
      @submit="submitAttendance"
    />

    <CheckerTeachers
      v-else-if="isAdmin(accountStore.accountData?.role) && attendanceDate"
      v-model="dataSource"
      :attendance-date="attendanceDate"
      :checksum="copyDataSource"
      @submit="submitAttendance"
    /> -->
  </section>
</template>

<script setup lang="ts">
// import TheFinger from '@/components/TheFinger.vue';
import TheLoader from '@/components/TheLoader.vue';
import CheckerHeader from './components/CheckerHeader.vue';
import CheckerStudents from './components/CheckerStudents.vue';
import CheckerTeachers from './components/CheckerTeachers.vue';

import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import type { AttendanceStatus } from '@/types';

const accountStore = useAccountStore();
const attendanceStore = useAttendanceStore();
const memberStore = useMemberStore();

const isLoading = ref(false);

const dataSource = ref([]);
const copyDataSource = ref('');

const attendanceDate = ref<Date>(getPreviousSunday());
const maxDate = getPreviousSunday();

// https://bobbyhadz.com/blog/javascript-get-previous-sunday
function getPreviousSunday(date = new Date()) {
  const value = new Date();
  value.setDate(date.getDate() - date.getDay());
  value.setHours(0, 0, 0, 0);
  return value;
}

onMounted(() => {
  getAttendances();
});

const getAttendances = async () => {
  const role = accountStore.accountData?.role;

  if (role === 'admin') {
    //
  } else if (role === 'main' || role === 'sub') {
    //
  } else {
    //
  }

  // try {
  //   isLoading.value = true;
  //   dataSource.value = [];
  //   copyDataSource.value = '';
  //   if (!accountStore.accountData) return;
  //   const targetMembers = await memberStore.fetchByGradeGroup({
  //     church: accountStore.accountData.church,
  //     department: accountStore.accountData.department,
  //     grade: accountStore.accountData.grade,
  //     group: accountStore.accountData.group,
  //   });
  //   // TODO: 추후 아래 로직을 attendace.ts의 action으로 분리하자
  //   targetMembers.forEach((member) => {
  //     let status: AttendanceStatus = 'offline';
  //     let createdAt = new Date();
  //     createdAt.setHours(0, 0, 0, 0);
  //     const targetIdx = member.attendances.findIndex((attd) => {
  //       const recordedAttendanceDate = attd.attendedAt.toDate().getTime();
  //       const selectedAttendaceDate = attendanceDate.value?.getTime();
  //       return recordedAttendanceDate === selectedAttendaceDate;
  //     });
  //     if (targetIdx !== -1) {
  //       status = member.attendances[targetIdx].status;
  //       createdAt = member.attendances[targetIdx].createdAt.toDate();
  //     }
  //     if (attendanceDate.value && member.uid) {
  //       dataSource.value.push({
  //         uid: member.uid,
  //         name: member.name,
  //         attendedAt: attendanceDate.value,
  //         status,
  //         targetIdx,
  //         createdAt,
  //       });
  //     }
  //   });
  //   copyDataSource.value = JSON.stringify(dataSource.value);
  // } catch (error) {
  //   console.log(error);
  // } finally {
  //   isLoading.value = false;
  // }
};

const submitAttendance = async () => {
  try {
    if (!accountStore.accountData) return;

    await attendanceStore.addAttendances({
      attendances: dataSource.value,
      church: accountStore.accountData.church,
      checksum: copyDataSource.value,
      department: accountStore.accountData.department,
      grade: accountStore.accountData.grade,
      group: accountStore.accountData.group,
    });
  } catch (error) {
    console.log(error);
  }
};

const isTeacher = (role) => {
  if (role === 'main' || role === 'sub') return true;
  return false;
};

const isAdmin = (role) => {
  if (role === 'admin') return true;
  return false;
};
</script>
