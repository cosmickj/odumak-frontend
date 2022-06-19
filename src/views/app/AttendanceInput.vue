<template>
  <div v-if="authIsReady" class="h-full p-5">
    <div class="relative flex justify-content-center align-items-center">
      <!-- 뒤로 가기 버튼 -->
      <div class="h-full w-3rem absolute left-0 cursor-pointer">
        <router-link
          class="h-full w-full flex justify-content-center align-items-center"
          :to="{ name: 'AppHome' }"
        >
          <i class="pi pi-arrow-left text-3xl"></i>
        </router-link>
      </div>

      <!-- 메뉴 제목 -->
      <span class="text-3xl">출석 입력하기</span>
    </div>

    <!-- 선생님일 때 -->
    <template v-if="user.role === 'teacher'">
      <div class="flex justify-content-around text-2xl mt-5">
        <div>{{ user.grade }}학년 {{ user.group }}반</div>
        <div>{{ user.name }} 선생님</div>
      </div>

      <Calendar
        v-model="attendanceDate"
        class="w-full pt-5 border-round"
        :touchUI="true"
        :showIcon="true"
        :disabledDays="[1, 2, 3, 4, 5, 6]"
        @date-select="requestStudentsAttendance"
      />

      <div v-if="attendanceDate && studentsAttendanceStatus">
        <AttendanceInputStudents v-model="studentsAttendanceStatus" :record-id="recordId" />
      </div>

      <AppFingerUpper v-else class="pt-5" />
    </template>

    <!-- 관리자일 때 -->
    <template v-else-if="user.role === 'admin'">
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

      <AttendanceInputTeachers
        v-if="attendanceDate && teachersAttendanceStatus"
        v-model="teachersAttendanceStatus"
        :record-id="recordId"
        :attendance-date="attendanceDate"
      />

      <AppFingerUpper v-else class="pt-5" />
    </template>

    <!-- 일반 회원일 때 -->
    <template v-else>
      <div class="h-full flex justify-content-center align-items-center">
        <span class="text-2xl">담당 학급이 있는 담임 선생님만 이용할 수 있습니다.</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AttendanceInputStudents from "@/components/AttendanceInputStudents.vue";
import AttendanceInputTeachers from "@/components/AttendanceInputTeachers.vue";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import { useStore } from "vuex";
import { Student, Teacher } from "@/types";

const store = useStore();
const user = computed(() => store.state.account.user);
const authIsReady = computed(() => store.state.account.authIsReady);

const recordId = ref("");
const attendanceDate = ref<Date>();
const studentsAttendanceStatus = ref<Student[]>([]);
const teachersAttendanceStatus = ref<Teacher[]>([]);

/** ABOUT STUDENTS */
const requestStudentsAttendance = async () => {
  const result = await store.dispatch("attendance/fetchStudentsAttendance", {
    date: attendanceDate.value,
    grade: user.value.grade,
    group: user.value.group,
    teacher: user.value.name,
  });

  result.studentsAttendance.forEach((student: Student) => {
    if (!student.attendance) student.attendance = "offline";
  });

  recordId.value = result.recordId;
  studentsAttendanceStatus.value = result.studentsAttendance;
};
const submitStudentsAttendance = async () => {
  const params = {
    recordId: recordId.value,
    date: attendanceDate.value,
    grade: user.value.grade,
    group: user.value.group,
    teacher: user.value.name,
    studentsAttendance: studentsAttendanceStatus.value,
  };

  const { id } = await store.dispatch("attendance/addStudentsAttendance", params);

  if (!recordId.value) alert("제출되었습니다.");
  else alert("수정되었습니다.");

  recordId.value = id;
};

/** ABOUT TEACHERS */
// TODO: 날짜가 바뀔 때 데이터 초기화 시키기
const requestTeachersAttendance = async () => {
  const result = await store.dispatch("attendance/fetchTeachersAttendance", {
    date: attendanceDate.value,
  });

  result.teachersAttendance.forEach((teacher: Teacher) => {
    if (!teacher.attendance) teacher.attendance = "offline";
  });

  recordId.value = result.recordId;
  teachersAttendanceStatus.value = result.teachersAttendance;
};

const submitTeachersAttendance = async () => {
  const params = {
    recordId: recordId.value,
    date: attendanceDate.value,
    teachersAttendance: teachersAttendanceStatus.value,
  };

  const { id } = await store.dispatch("attendance/addTeachersAttendance", params);

  if (!recordId.value) alert("제출되었습니다.");
  else alert("수정되었습니다.");

  recordId.value = id;
};
</script>
