<template>
  <div class="p-5">
    <div class="text-3xl text-center">학생 일일 출석현황</div>

    <Calendar
      v-model="attendanceDate"
      class="w-full pt-5 border-round"
      :touchUI="true"
      :showIcon="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="onAttendanceDateSelect"
    />

    <AppFingerUpper class="pt-5" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppFingerUpper from "@/components/AppFingerUpper.vue";

const attendanceDate = ref<Date>();
const onAttendanceDateSelect = () => {
  console.log("onAttendanceDateSelect");
  // TODO: store에서 fetchAttendanceStudentDaily를 만들어주자
};
</script>

<style scoped></style>
