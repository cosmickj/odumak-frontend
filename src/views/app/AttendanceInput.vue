<template>
  <div class="h-full p-5">
    <div class="text-3xl text-center">출석 입력하기</div>
    <div class="flex justify-content-around text-2xl mt-5">
      <div v-if="authIsReady">{{ userGrade }}학년 {{ userGroup }}반</div>
      <div v-if="authIsReady">{{ userName }} 선생님</div>
    </div>

    <Calendar
      v-model="attendanceDate"
      class="w-full pt-5 border-round"
      :touchUI="true"
      :showIcon="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="onAttendanceDateSelect"
    />

    <form
      v-if="attendanceDate && studentsAttendanceStatus"
      @submit.prevent="onSubmit"
    >
      <AttendanceInputTeacher v-model="teacherAttendanceStatus" />
      <AttendanceInputStudents v-model="studentsAttendanceStatus" />
      <Button
        v-if="!attendanceRecord"
        class="p-button-warning w-full mb-5"
        type="submit"
        label="제출하기"
      />
      <Button
        v-else
        class="p-button-danger w-full mb-5"
        type="submit"
        label="수정하기"
      />
    </form>

    <AppFingerUpper v-else class="pt-5" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { Student } from "@/types/index";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import AttendanceInputTeacher from "@/components/AttendanceInputTeacher.vue";
import AttendanceInputStudents from "@/components/AttendanceInputStudents.vue";

const store = useStore();
const authIsReady = computed(() => store.state.account.authIsReady);
const userName = computed(() => store.state.account.user.name);
const userGrade = computed(() => store.state.account.user.grade);
const userGroup = computed(() => store.state.account.user.group);

const attendanceDate = ref<Date>();
const attendanceRecord = computed(() => store.state.attendance.record);

const teacherAttendanceStatus = ref("online");
const studentsAttendanceStatus = computed<Student[]>(
  () => store.state.attendance.students
);

const onAttendanceDateSelect = async () => {
  await store.dispatch("attendance/checkRecord", {
    name: userName.value,
    grade: userGrade.value,
    group: userGroup.value,
    date: attendanceDate.value,
  });
};

const onSubmit = () => {
  console.log("submitted");
};
</script>

<style>
.p-calendar > .p-button,
.p-calendar > .p-button:hover,
.p-calendar > .p-button:active {
  background: var(--yellow-500);
  border: 1px solid var(--yellow-500);
  color: var(--text-color);
}
</style>
