<template>
  <section class="flex flex-col h-full p-8">
    <CheckerHeader :user-data="accountStore.userData" />

    <Calendar
      v-if="isTeacher(accountStore.userData?.role)"
      v-model="attendanceDate"
      class="pt-5"
      input-class="text-center"
      touchUI
      placeholder="날짜를 선택해주세요"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="getAttendances"
    />

    <TheFinger
      v-if="
        (isTeacher(accountStore.userData?.role) ||
          isAdmin(accountStore.userData?.role)) &&
        !attendanceDate
      "
      class="pt-5"
    />

    <TheLoader v-if="isLoading" />

    <!-- 일반교사일 때 -->
    <div
      v-if="!isTeacher(accountStore.userData?.role) && attendanceDate"
      class="grow flex items-center justify-center text-xl"
    >
      <p>담당 학급이 있는 선생님만 이용할 수 있습니다.</p>
    </div>

    <!-- 선생님일 때 -->
    <CheckerStudents
      v-else-if="isTeacher(accountStore.userData?.role) && attendanceDate"
      v-model="dataSource"
      :attendance-date="attendanceDate"
      :checksum="copyDataSource"
      @submit="submitAttendance"
    />

    <!-- 관리자일 때 -->
    <CheckerTeachers
      v-else-if="isAdmin(accountStore.userData?.role) && attendanceDate"
      v-model="dataSource"
      :attendance-date="attendanceDate"
      @submit="submitAttendance"
    />
  </section>
</template>

<script setup lang="ts">
import TheFinger from '@/components/TheFinger.vue';
import TheLoader from '@/components/TheLoader.vue';
import CheckerHeader from './components/CheckerHeader.vue';
import CheckerStudents from './components/CheckerStudents.vue';
import CheckerTeachers from './components/CheckerTeachers.vue';

import { ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import type { AttendanceStatus, TeacherRole, DataSource } from '@/types';

const accountStore = useAccountStore();
const attendanceStore = useAttendanceStore();
const memberStore = useMemberStore();

const isLoading = ref(false);

const dataSource = ref<DataSource[]>([]);
const copyDataSource = ref('');

const attendanceDate = ref<Date>();

const getAttendances = async () => {
  try {
    isLoading.value = true;
    dataSource.value = [];
    copyDataSource.value = '';

    if (!accountStore.userData) return;

    const targetMembers = await memberStore.fetchByGradeGroup({
      church: accountStore.userData.church,
      department: accountStore.userData.department,
      grade: accountStore.userData.grade,
      group: accountStore.userData.group,
    });

    // TODO: 추후 아래 로직을 attendace.ts의 action으로 분리하자
    targetMembers.forEach((member) => {
      let status: AttendanceStatus = 'offline';
      let createdAt = new Date();
      createdAt.setHours(0, 0, 0, 0);

      const targetIdx = member.attendances.findIndex((attd) => {
        const recordedAttendanceDate = attd.attendedAt.toDate().getTime();
        const selectedAttendaceDate = attendanceDate.value?.getTime();

        return recordedAttendanceDate === selectedAttendaceDate;
      });

      if (targetIdx !== -1) {
        status = member.attendances[targetIdx].status;
        createdAt = member.attendances[targetIdx].createdAt.toDate();
      }

      if (attendanceDate.value && member.uid) {
        dataSource.value.push({
          uid: member.uid,
          name: member.name,
          attendedAt: attendanceDate.value,
          status,
          targetIdx,
          createdAt,
        });
      }
    });

    copyDataSource.value = JSON.stringify(dataSource.value);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const submitAttendance = async () => {
  try {
    if (!accountStore.userData) return;

    await attendanceStore.addAttendances({
      attendances: dataSource.value,
      church: accountStore.userData.church,
      checksum: copyDataSource.value,
      department: accountStore.userData.department,
      grade: accountStore.userData.grade,
      group: accountStore.userData.group,
    });
  } catch (error) {
    console.log(error);
  }
};

const isTeacher = (role: TeacherRole | undefined) => {
  if (role === 'main' || role === 'sub') {
    return true;
  }
  return false;
};

const isAdmin = (role: TeacherRole | undefined) => {
  if (role === 'admin') {
    return true;
  }
  return false;
};
</script>
