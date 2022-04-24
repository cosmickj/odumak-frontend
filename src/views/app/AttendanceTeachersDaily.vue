<template>
  <div class="p-5">
    <div class="text-3xl text-center">교사 일일 출석현황</div>

    <Calendar
      v-model="attendanceDate"
      class="w-full pt-5 border-round"
      :touchUI="true"
      :showIcon="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="onAttendanceDateSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const attendanceDate = ref<Date>();

const onAttendanceDateSelect = async () => {
  alert("hello world");
};
</script>

<style scoped></style>
