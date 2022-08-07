<template>
  <section class="h-screen p-8 bg-slate-100 flex flex-col">
    <checker-header :user-data="userData" />

    <calendar
      v-if="userData?.role === 'teacher' || userData?.role === 'admin'"
      v-model="attendanceDate"
      class="pt-5"
      :touchUI="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      placeholder="날짜를 선택해주세요"
      input-class="text-center"
      @date-select="requestAttendance"
    />

    <the-finger
      v-if="userData?.role !== 'common' && !attendanceDate"
      class="pt-5"
    />

    <the-loader v-if="isLoading" />

    <!-- 선생님일 때 -->
    <!-- TODO: 이 부분을 담임(main)과 부담임(sub) 모두로 설정하자 -->
    <checker-students
      v-if="userData?.role === 'teacher' && attendanceDate"
      v-model="dataSource"
      :document-id="documentId"
      :attendance-date="attendanceDate"
      @submit="submitAttendance"
    />

    <!-- 관리자일 때 -->
    <checker-teachers
      v-else-if="userData?.role === 'admin' && attendanceDate"
      v-model="dataSource"
      :document-id="documentId"
      :attendance-date="attendanceDate"
      @submit="submitAttendance"
    />

    <!-- 일반교사일 때 -->
    <div
      v-else-if="userData?.role === 'common'"
      class="grow flex justify-center items-center"
    >
      <p class="text-xl">담당 학급이 있는 선생님만 이용할 수 있습니다.</p>
    </div>
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
import type { Student, Teacher } from '@/types';

const account = useAccountStore();
const attendance = useAttendanceStore();
const member = useMemberStore();

const userData = computed(() => account.userData);

const isLoading = ref(false);

const documentId = ref('');

const dataSource = ref<Student[] | Teacher[]>([]);

const attendanceDate = ref<Date>();

const requestAttendance = async () => {
  try {
    documentId.value = '';
    dataSource.value = [];
    const role = userData.value?.role;
    // 교사의 학생 출석 입력
    if (role === 'teacher') {
      const members = await member.fetchMembers({
        church: userData.value?.church,
        department: userData.value?.department,
        grade: userData.value?.grade,
        group: userData.value?.group,
        position: 'student',
        role,
      });

      const result = await attendance.fetchAttendance({
        attendanceDate: attendanceDate.value,
        church: userData.value?.church,
        department: userData.value?.department,
        grade: userData.value?.grade,
        group: userData.value?.group,
        members,
        position: 'student',
        role,
      });

      documentId.value = result!.documentId;
      dataSource.value = result!.attendanceRecord;
    }
    // 관리자의 교사 출석 입력
    else if (role === 'admin') {
      const members = await member.fetchMembers({
        church: userData.value?.church,
        department: userData.value?.department,
        position: 'teacher',
        role,
      });

      const result = await attendance.fetchAttendance({
        attendanceDate: attendanceDate.value,
        church: userData.value?.church,
        department: userData.value?.department,
        members,
        position: 'teacher',
        role,
      });
      documentId.value = result!.documentId;
      dataSource.value = result!.attendanceRecord;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const submitAttendance = async () => {
  try {
    const role = userData.value?.role!;
    const position = getPositionFromRole(role);

    let response;
    if (role === 'admin') {
      response = await attendance.addAttendance({
        documentId: documentId.value,
        attendanceDate: attendanceDate.value,
        createUser: userData.value?.name,
        church: userData.value?.church,
        department: userData.value?.department,
        position,
        records: dataSource.value,
      });
    }
    // role === 'teacher'
    else {
      response = await attendance.addAttendance({
        documentId: documentId.value,
        attendanceDate: attendanceDate.value,
        createUser: userData.value?.name,
        church: userData.value?.church,
        department: userData.value?.department,
        grade: userData.value?.grade,
        group: userData.value?.group,
        position,
        records: dataSource.value,
      });
    }

    documentId.value = response.documentId;
    alert(response.message);
  } catch (error) {
    console.log(error);
  }
};
</script>
