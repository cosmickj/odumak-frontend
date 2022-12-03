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
      v-if="isTeacher(accountStore.userData?.role) && !attendanceDate"
      class="pt-5"
    />

    <TheLoader v-if="isLoading" />

    <!-- 일반교사일 때 -->
    <div
      v-if="!isTeacher(accountStore.userData?.role)"
      class="grow flex items-center justify-center text-xl"
    >
      <p>담당 학급이 있는 선생님만 이용할 수 있습니다.</p>
    </div>

    <!-- 선생님일 때 -->
    <CheckerStudents
      v-if="isTeacher(accountStore.userData?.role) && attendanceDate"
      v-model="dataSource"
      :document-id="documentId"
      :attendance-date="attendanceDate"
      @submit="submitAttendance"
    />

    <!-- 관리자일 때 -->
    <CheckerTeachers
      v-if="isAdmin(accountStore.userData?.role) && attendanceDate"
      v-model="dataSource"
      :document-id="documentId"
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

import { computed, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import { getPositionFromRole } from '@/utils/position';
import type {
  AttendanceStatus,
  Teacher,
  TeacherRole,
  DataSource,
} from '@/types';

const accountStore = useAccountStore();
const attendanceStore = useAttendanceStore();
const memberStore = useMemberStore();

const isLoading = ref(false);

const documentId = ref('');

const dataSource = ref<DataSource[]>([]);

const attendanceDate = ref<Date>();

const getAttendances = async () => {
  try {
    isLoading.value = true;
    dataSource.value = [];

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

      const targetIdx = member.attendances.findIndex((attendace) => {
        // CONTINUE HERE
        console.log(typeof attendace.attendedAt.toDate());
        console.log(typeof attendanceDate.value);

        return attendace.attendedAt.toDate() === attendanceDate.value;
      });

      console.log(targetIdx);

      if (targetIdx !== -1) {
        status = member.attendances[targetIdx].status;
      }

      // TODO: 현재 이전에 입력이 아예 안되었던 친구들인지 아니면 입력되었던 친구들인지 구별이 안간다.
      if (attendanceDate.value) {
        dataSource.value.push({
          uid: member.uid,
          name: member.name,
          attendedAt: attendanceDate.value,
          status,
          targetIdx,
        });
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const submitAttendance = async () => {
  if (!accountStore.userData) return;

  await attendanceStore.addAttendance({
    attendances: dataSource.value,
    church: accountStore.userData.church,
    department: accountStore.userData.department,
    grade: accountStore.userData.grade,
    group: accountStore.userData.group,
  });

  // try {
  //   const role = userData.value?.role!;
  //   const position = getPositionFromRole(role);
  //   let response;
  //   if (role === 'admin') {
  //     response = await attendance.addAttendance({
  //       documentId: documentId.value,
  //       attendanceDate: attendanceDate.value,
  //       createUser: userData.value?.name,
  //       church: userData.value?.church,
  //       department: userData.value?.department,
  //       position,
  //       records: dataSource.value,
  //     });
  //   }
  //   // role === 'teacher'
  //   else {
  //     response = await attendance.addAttendance({
  //       documentId: documentId.value,
  //       attendanceDate: attendanceDate.value,
  //       createUser: userData.value?.name,
  //       church: userData.value?.church,
  //       department: userData.value?.department,
  //       grade: userData.value?.grade,
  //       group: userData.value?.group,
  //       position,
  //       records: dataSource.value,
  //     });
  //   }
  //   documentId.value = response.documentId;
  //   alert(response.message);
  // } catch (error) {
  //   console.log(error);
  // }
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
