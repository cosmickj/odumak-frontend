<template>
  <div class="h-full p-5" v-if="authIsReady">
    <div class="text-3xl text-center">출석 입력하기</div>

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

      <form v-if="attendanceDate && studentsAttendanceStatus" @submit.prevent="submitStudentsAttendance">
        <AttendanceInputStudents v-model="studentsAttendanceStatus" />

        <Button v-if="!recordId" class="p-button-warning w-full mb-5" type="submit" label="제출하기" />
        <Button v-else class="p-button-danger w-full mb-5" type="submit" label="수정하기" />
      </form>

      <AppFingerUpper v-else class="pt-5" />
    </template>

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
        @date-select="requestTeacherAttendances"
      />

      <form v-if="attendanceDate && studentsAttendanceStatus" @submit.prevent="submitTeachersAttendance">
        <AttendanceInputTeachers v-model="teachersAttendanceStatus" />

        <Button v-if="!recordId" class="p-button-warning w-full mb-5" type="submit" label="제출하기" />
        <Button v-else class="p-button-danger w-full mb-5" type="submit" label="수정하기" />
      </form>

      <AppFingerUpper v-else class="pt-5" />
    </template>

    <template v-else>
      <div class="h-full flex justify-content-center align-items-center">
        <span class="text-2xl">담당 학급이 있는 담임 선생님만 이용할 수 있습니다.</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import AttendanceInputTeachers from "@/components/AttendanceInputTeachers.vue";
import AttendanceInputStudents from "@/components/AttendanceInputStudents.vue";
import type { Student } from "@/types";

const store = useStore();
const user = computed(() => store.state.account.user);
const authIsReady = computed(() => store.state.account.authIsReady);

const recordId = ref("");
const attendanceDate = ref<Date>();
const studentsAttendanceStatus = ref<Student[]>([]);
const teachersAttendanceStatus = ref([]);

const requestStudentsAttendance = async () => {
  const result = await store.dispatch("attendance/fetchStudentsAttendance", {
    name: user.value.name,
    grade: user.value.grade,
    group: user.value.group,
    date: attendanceDate.value,
  });

  result.studentsAttendance.forEach((student: Student) => {
    if (!student.attendance) {
      student.attendance = "offline";
    }
  });

  recordId.value = result.recordId;
  studentsAttendanceStatus.value = result.studentsAttendance;
};

const submitStudentsAttendance = async () => {
  const params = {
    date: attendanceDate.value,
    grade: user.value.grade,
    group: user.value.group,
    teacher: user.value.name,
    studentsAttendance: studentsAttendanceStatus.value,
    recordId: recordId.value,
  };
  const result = await store.dispatch("attendance/addStudentsAttendance", params);

  if (!recordId.value) {
    recordId.value = result.id;
    alert("제출되었습니다.");
  } else {
    alert("수정되었습니다.");
  }
};

const requestTeacherAttendances = async () => {
  const result = await store.dispatch("attendance/fetchTeachersAttendance", {
    date: attendanceDate.value,
  });

  result.forEach((teacher: any) => {
    if (!teacher.attendance) {
      teacher.attendance = "offline";
    }
  });

  teachersAttendanceStatus.value = result;

  // recordId.value = result.recordId;
  // studentsAttendanceStatus.value = result.studentsAttendance;
};
const submitTeachersAttendance = () => {
  console.log("submitTeachersAttendance");
};
</script>
