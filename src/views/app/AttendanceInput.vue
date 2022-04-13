<template>
  <div class="h-full p-5">
    <div class="text-3xl text-center">출석 입력하기</div>
    <div class="flex justify-content-around text-2xl mt-5">
      <div class="fz-16">3학년 1반</div>
      <!-- <div class="fz-16">{{ userInfo.name }} 선생님</div> -->
      <div class="fz-16">이경준 선생님</div>
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
        class="btn-block p-button-warning p-button-raised"
        type="submit"
        label="제출하기"
      />

      <Button
        v-else
        class="btn-block p-button-danger p-button-raised"
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
import Student from "@/types/Student";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import AttendanceInputTeacher from "@/components/AttendanceInputTeacher.vue";
import AttendanceInputStudents from "@/components/AttendanceInputStudents.vue";

const store = useStore();

const userInfo = computed(() => store.state.user.info);

const attendanceDate = ref<any>(null);
const attendanceRecord = computed(() => store.state.attendance.record);

const teacherAttendanceStatus = ref("online");
const studentsAttendanceStatus = computed<Student[]>(
  () => store.state.attendance.students
);

const onAttendanceDateSelect = async () => {
  await store.dispatch("attendance/checkRecord", {
    name: userInfo.value.name,
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
