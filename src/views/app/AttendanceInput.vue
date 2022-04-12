<template>
  <div id="input-attendance">
    <div class="input-attendance__container">
      <div class="title__container">
        <span class="title">출석 입력하기</span>
        <span class="fz-16">3-1</span>
        <!-- <span class="fz-16">{{ userInfo.name }} 선생님</span> -->
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

      <form
        v-if="attendanceDate && studentsAttendanceStatus"
        @submit.prevent="onSubmit"
      >
        <AttendanceInputTeacher
          v-model="teacherAttendanceStatus"
        ></AttendanceInputTeacher>
        <AttendanceInputStudents
          v-model="studentsAttendanceStatus"
        ></AttendanceInputStudents>

        <Button
          v-if="!attendanceRecord"
          type="submit"
          label="제출하기"
          class="btn-block p-button-warning p-button-raised"
        />
        <Button
          v-else
          type="submit"
          label="수정하기"
          class="btn-block p-button-danger p-button-raised"
        />
      </form>

      <AppFingerUpper v-else></AppFingerUpper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Student from "@/types/Student";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import AttendanceInputTeacher from "@/components/AttendanceInputTeacher.vue";
import AttendanceInputStudents from "@/components/AttendanceInputStudents.vue";

export default defineComponent({
  name: "InputAttendanceLayout",
  components: {
    AppFingerUpper,
    AttendanceInputTeacher,
    AttendanceInputStudents,
  },
  setup() {
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
    return {
      userInfo,
      attendanceDate,
      attendanceRecord,
      teacherAttendanceStatus,
      studentsAttendanceStatus,
      onAttendanceDateSelect,
      onSubmit,
    };
  },
});
</script>

<style scoped>
/* #input-attendance {
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
}
.input-attendance__container {
  padding: var(--container-padding);
}
.title__container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  font-size: 1.6rem;
  color: var(--color-black);
} */
</style>
