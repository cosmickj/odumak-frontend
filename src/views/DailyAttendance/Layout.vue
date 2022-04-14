<template>
  <div id="daily-attendance">
    <div class="daily-attendance__container">
      <div class="flex justify-content-between align-items-center">
        <h2 class="title">일일 출석 확인</h2>
        <span>3-1</span>
        <!-- <span>{{ userInfo.name }} 선생님</span> -->
      </div>

      <div class="calendar__container pt-10">
        <Calendar
          v-model="attendanceDate"
          class="w-100"
          :touchUI="true"
          :showIcon="true"
          :disabledDays="[1, 2, 3, 4, 5, 6]"
          @date-select="onAttendanceDateSelect"
        />
      </div>

      <TabView class="pt-10" v-if="attendanceDate">
        <TabPanel header="학생">
          <Students
            :studentsDailyAttendance="studentsDailyAttendance"
          ></Students>
        </TabPanel>
        <TabPanel header="교사"> Content I </TabPanel>
      </TabView>

      <FingerUpper v-else></FingerUpper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import FingerUpper from "@/components/FingerUpper.vue";
import Students from "@/views/DailyAttendance/Students.vue";

const store = useStore();
const userInfo = computed(() => store.state.user.info);
// const authIsReady = computed(() => store.state.user.authIsReady);
const attendanceDate = ref<Date | undefined>();
const studentsDailyAttendance = computed(
  () => store.state.attendance.studentsDailyAttendance
);

const onAttendanceDateSelect = async () => {
  await store.dispatch("attendance/fetchStudentsDailyAttendance", {
    date: attendanceDate.value,
  });
};
</script>

<style>
/* .p-datatable {
  border-radius: 3px;
  overflow: hidden;
}*/
.p-tabview .p-tabview-panels {
  padding: 1rem 0;
}
</style>

<style scoped>
.daily-attendance__container {
  padding: var(--container-padding);
}
</style>
