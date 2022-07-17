<template>
  <div class="h-full p-5 flex flex-col">
    <div class="relative flex justify-center items-center">
      <!-- 뒤로 가기 -->
      <button class="h-full w-12 absolute left-0 cursor-pointer">
        <router-link class="h-full w-full flex justify-center items-center" :to="{ name: 'HomeView' }">
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
        class="w-full pt-5"
        :touchUI="true"
        :showIcon="true"
        :disabledDays="[1, 2, 3, 4, 5, 6]"
        @date-select="requestAttendance('student')"
      />

      <CheckerStudents
        v-if="attendanceDate"
        v-model="dataSource"
        :document-id="documentId"
        :attendance-date="attendanceDate"
        @on-uploaded:data-source="setDocumentId"
      />

      <TheFinger v-else class="pt-5" />
    </template>
    <!-- :writer="user" -->

    <!-- 관리자일 때 -->
    <template v-else-if="userData?.role === 'admin'">
      <div class="flex justify-center text-2xl mt-5">
        <div>{{ userData?.name }}</div>
      </div>

      <Calendar
        v-model="attendanceDate"
        class="w-full pt-5 border-round"
        :touchUI="true"
        :showIcon="true"
        :disabledDays="[1, 2, 3, 4, 5, 6]"
        @date-select="requestAttendance('teahcer')"
      />

      <CheckerTeachers
        v-if="attendanceDate"
        v-model="dataSource"
        :document-id="documentId"
        :attendance-date="attendanceDate"
        @on-uploaded:teachers-attendance="setDocumentId"
      />

      <TheFinger v-else class="pt-5" />
    </template>

    <!-- 일반 회원일 때 -->
    <template v-else>
      <div class="grow flex justify-center items-center">
        <p class="text-xl">담당 학급이 있는 선생님만 이용할 수 있습니다.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TheFinger from '@/components/TheFinger.vue';
import CheckerStudents from './components/CheckerStudents.vue';
import CheckerTeachers from './components/CheckerTeachers.vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import type { Student, Teacher } from '@/types';

const account = useAccountStore();
const attendance = useAttendanceStore();

const userData = computed(() => account.userData);

const attendanceDate = ref<Date>();
const documentId = ref('');
const dataSource = ref<Student[] | Teacher[]>([]);

const requestAttendance = async (type: 'student' | 'teahcer') => {
  if (type === 'student') {
    const result = await attendance.fetchStudentsAttendance({
      date: attendanceDate.value,
      grade: userData.value?.grade,
      group: userData.value?.group,
      teacher: userData.value?.name,
    });

    result.studentsAttendance.forEach((student: Student) => {
      if (!student.attendance) student.attendance = 'offline';
    });

    documentId.value = result.documentId;
    dataSource.value = result.studentsAttendance;
  } else {
    const result = await attendance.fetchTeachersAttendance({
      date: attendanceDate.value,
    });

    result.teachersAttendance.forEach((teacher: Teacher) => {
      if (!teacher.attendance) teacher.attendance = 'offline';
    });

    documentId.value = result.documentId;
    dataSource.value = result.teachersAttendance;
  }
};

const setDocumentId = ({ id }: { id: string }) => {
  documentId.value = id;
};
</script>
