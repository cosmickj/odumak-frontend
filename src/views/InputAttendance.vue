<template>
  <div id="input-attendance" v-if="authIsReady">
    <div class="input-attendance__container">
      <div class="title__container" v-if="userInfo">
        <h2 class="title">출석 입력하기</h2>
        <span>3-1</span>
        <span>{{ userInfo.name }} 선생님</span>
      </div>

      <div class="calendar__container pt-10">
        <Calendar
          class="w-100"
          v-model="selectedDate"
          :touchUI="true"
          :showIcon="true"
          :disabledDays="[1, 2, 3, 4, 5, 6]"
          @date-select="fetchStudents"
        />
      </div>

      <form @submit.prevent="saveAttendance" v-if="selectedDate && students">
        <div v-for="(student, i) in students" :key="i" class="student">
          <div class="student__name">{{ student.name }}</div>
          <div class="student__birth">{{ student.birth }}</div>
          <div class="student__attendance">
            <input
              type="radio"
              :name="student.name"
              :id="`${student.name}__offline`"
              value="offline"
              v-model="students[i].attendance"
            />
            <label
              :for="`${student.name}__offline`"
              style="background: #4caf50; color: #28334aff"
            >
              <span>현장</span>
            </label>

            <input
              type="radio"
              :name="student.name"
              :id="`${student.name}__online`"
              value="online"
              v-model="students[i].attendance"
            />
            <label
              :for="`${student.name}__online`"
              style="background: #fbc02d; color: #28334aff"
            >
              <span>온라인</span>
            </label>

            <input
              type="radio"
              :name="student.name"
              :id="`${student.name}__absence`"
              value="absence"
              v-model="students[i].attendance"
            />
            <label
              :for="`${student.name}__absence`"
              style="background: #ff4032; color: #28334aff"
            >
              <span>결석</span>
            </label>
          </div>
        </div>

        <Button
          class="p-button-warning p-button-raised btn-block"
          label="제출하기"
          type="submit"
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Student from "@/types/Student";
import { addDoc } from "@firebase/firestore";
import { attendancesCol } from "@/firebase/config";

export default defineComponent({
  setup() {
    const store = useStore();
    const selectedDate = ref("");
    const students = computed<Student[]>(() => store.state.students);
    const userInfo = computed(() => store.state.userInfo);
    const saveAttendance = () => {
      const attendanceParams = {
        date: selectedDate.value,
        teacher: userInfo.value.name,
        students: students.value,
      };
      addDoc(attendancesCol, attendanceParams).then(() => {
        alert("제출되었습니다.");
        selectedDate.value = "";
      });
    };
    const fetchStudents = () => {
      store.dispatch("fetchStudents", { name: store.state.userInfo.name });
    };
    return {
      authIsReady: computed(() => store.state.authIsReady),
      selectedDate,
      students,
      userInfo,
      saveAttendance,
      fetchStudents,
    };
  },
});
</script>

<style scoped>
#input-attendance {
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
  font-size: 3rem;
  color: var(--color-white);
}
.student {
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  background: #efefef95;
}
.student__attendance {
  display: flex;
}
input[type="radio"] {
  display: none;
  height: 0;
  width: 0;
}
input[type="radio"] ~ label {
  height: 48px;
  width: 48px;
  font-size: 0.6rem;
  margin: 0 4px 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px #00000029;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.4;
}
input[type="radio"]:checked + label {
  opacity: 1;
  animation: jelly 0.6s ease;
  font-weight: bold;
}
</style>
