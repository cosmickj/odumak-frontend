<template>
  <div class="h-screen flex flex-col p-8 bg-slate-100">
    <div class="relative flex justify-center items-center">
      <!-- 뒤로 가기 -->
      <button class="h-full w-12 absolute left-0 cursor-pointer">
        <router-link
          class="h-full w-full flex justify-center items-center"
          :to="{ name: 'HomeView' }"
        >
          <i class="pi pi-arrow-left text-3xl"></i>
        </router-link>
      </button>

      <!-- 메뉴 제목 -->
      <span class="text-3xl">출석 입력하기</span>
    </div>

    <!-- 선생님일 때 -->
    <template v-if="userData?.role === 'teacher'">
      <div class="flex justify-around text-2xl mt-5">
        <div>{{ userData?.grade }}학년 {{ userData?.group }}반</div>
        <div>{{ userData?.name }} 선생님</div>
      </div>

      <Calendar
        v-model="attendanceDate"
        class="pt-5"
        :touchUI="true"
        :disabledDays="[1, 2, 3, 4, 5, 6]"
        placeholder="날짜를 선택해주세요"
        input-class="text-center"
        @date-select="requestAttendance"
      />

      <CheckerStudents
        v-if="attendanceDate"
        v-model="dataSource"
        :document-id="documentId"
        :attendance-date="attendanceDate"
        @submit="submitAttendance"
      />

      <TheFinger v-else class="pt-5" />
    </template>

    <!-- 관리자일 때 -->
    <template v-else-if="userData?.role === 'admin'">
      <div class="flex justify-center text-2xl mt-5">
        <div>{{ userData?.name }}</div>
      </div>

      <Calendar
        v-model="attendanceDate"
        class="pt-5"
        :touchUI="true"
        :disabledDays="[1, 2, 3, 4, 5, 6]"
        placeholder="날짜를 선택해주세요"
        input-class="text-center"
        @date-select="requestAttendance"
      />

      <CheckerTeachers
        v-if="attendanceDate"
        v-model="dataSource"
        :document-id="documentId"
        :attendance-date="attendanceDate"
      />

      <TheFinger v-else class="pt-5" />
    </template>

    <!-- 일반 회원일 때 -->
    <template v-else>
      <div class="grow flex justify-center items-center">
        <p class="text-xl">담당 학급이 있는 선생님만 이용할 수 있습니다.</p>
      </div>
    </template>

    <TheLoader :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import TheFinger from '@/components/TheFinger.vue';
import TheLoader from '@/components/TheLoader.vue';
import CheckerStudents from './components/CheckerStudents.vue';
import CheckerTeachers from './components/CheckerTeachers.vue';

import { computed, ref, watch } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import type { Student, Teacher } from '@/types';

const account = useAccountStore();
const attendance = useAttendanceStore();
const member = useMemberStore();

const userData = computed(() => account.userData);

const isLoading = ref(false);

const documentId = ref('');

const dataSource = ref<Student[] | Teacher[]>([]);

const attendanceDate = ref<Date>();

watch(attendanceDate, () => {
  dataSource.value = [];
  isLoading.value = true;
});

const requestAttendance = async () => {
  const role = userData.value?.role;

  try {
    // 학생 출석 입력
    if (role === 'teacher') {
      const members = await member.fetchMembers({
        church: userData.value?.church,
        department: userData.value?.department,
        position: 'student',
      });

      const result = await attendance.fetchAttendance({
        attendanceDate: attendanceDate.value,
        church: userData.value?.church,
        department: userData.value?.department,
        position: 'student',
        members,
      });

      documentId.value = result!.documentId;
      dataSource.value = result!.attendanceRecord;
    }
    // 교사 출석 입력
    else if (role === 'admin') {
      const members = await member.fetchMembers({
        church: userData.value?.church,
        department: userData.value?.department,
        position: 'teacher',
      });

      const result = await attendance.fetchAttendance({
        attendanceDate: attendanceDate.value,
        church: userData.value?.church,
        department: userData.value?.department,
        position: 'teacher',
        members,
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
    const response = await attendance.addAttendance({
      documentId: documentId.value,
      attendanceDate: attendanceDate.value,
      createUser: userData.value?.name,
      church: userData.value?.church,
      department: userData.value?.department,
      position: 'student',
      records: dataSource.value,
    });

    documentId.value = response.documentId;
    alert(response.message);
  } catch (error) {
    console.log(error);
  }
};
</script>
