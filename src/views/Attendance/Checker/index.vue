<template>
  <div class="h-full p-5">
    <div class="relative flex justify-center items-center">
      <!-- 뒤로 가기 버튼 -->
      <button class="h-full w-12 absolute left-0 cursor-pointer">
        <router-link class="h-full w-full flex justify-center items-center" :to="{ name: 'HomeView' }">
          <i class="pi pi-arrow-left text-3xl"></i>
        </router-link>
      </button>

      <!-- 메뉴 제목 -->
      <span class="text-3xl">출석 입력하기</span>
    </div>

    <!-- 선생님일 때 -->
    <!-- <template v-if="user.role === 'teacher'"> -->
    <div class="flex justify-around text-2xl mt-5">
      <!-- <div>{{ user.grade }}학년 {{ user.group }}반</div> -->
      <!-- <div>{{ user.name }} 선생님</div> -->
      <div>3학년 3반</div>
      <div>홍길동 선생님</div>
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
      @on-uploaded:data-source="setRecordId"
    />
    <!-- :writer="user" -->

    <TheFinger v-else class="pt-5" />

    <!-- 관리자일 때 -->
    <!-- <template v-else-if="user.role === 'admin'">
      <div class="flex justify-content-center text-2xl mt-5">
        <div>{{ user.name }}</div>
      </div>

      <Calendar
        v-model="attendanceDate"
        class="w-full pt-5 border-round"
        :touchUI="true"
        :showIcon="true"
        :disabledDays="[1, 2, 3, 4, 5, 6]"
        @date-select="requestTeachersAttendance"
      />

      <CheckerTheckers
        v-if="attendanceDate && teachersAttendanceStatus"
        v-model="teachersAttendanceStatus"
        :record-id="recordId"
        :attendance-date="attendanceDate"
        @on-uploaded:teachers-attendance="setRecordId"
      />

      <AppFingerUpper v-else class="pt-5" />
    </template> -->

    <!-- 일반 회원일 때 -->
    <!-- <template v-else>
      <div class="h-full flex justify-content-center align-items-center">
        <span class="text-2xl">담당 학급이 있는 담임 선생님만 이용할 수 있습니다.</span>
      </div>
    </template> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TheFinger from '@/components/TheFinger.vue';
import CheckerStudents from './components/CheckerStudents.vue';
// import CheckerTheckers from './components/CheckerTeachers.vue';
import { Student, Teacher } from '@/types';
import { useAttendanceStore } from '@/store/attendance';

const attendance = useAttendanceStore();
// const user = computed(() => store.state.account.user);
// const authIsReady = computed(() => store.state.account.authIsReady);

const attendanceDate = ref<Date>();
const documentId = ref('');
const dataSource = ref<Student[] | Teacher[]>([]);

const requestAttendance = async (type: 'student' | 'teahcer') => {
  if (type === 'student') {
    const result = await attendance.fetchStudentsAttendance({
      date: attendanceDate.value,
      grade: '3',
      group: '1',
      teacher: '강경환',
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
const setRecordId = ({ id }: { id: string }) => {
  documentId.value = id;
};
</script>
