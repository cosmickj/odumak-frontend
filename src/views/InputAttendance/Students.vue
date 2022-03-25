<template v-if="students">
  <!-- 선생님 출석체크 -->
  <div class="attendance teacher">
    <div>선생님께서는 어디서 예배하셨나요?</div>
    <input
      type="radio"
      id="teacher-online"
      value="online"
      v-model="teacher"
      class="attendance__input"
    />
    <label
      for="teacher-online"
      class="attendance__label attendance__label--online"
    >
      <span>온라인</span>
    </label>
    <input
      type="radio"
      id="teacher-offline"
      value="offline"
      v-model="teacher"
      class="attendance__input"
    />
    <label
      for="teacher-offline"
      class="attendance__label attendance__label--offline"
    >
      <span>현장</span>
    </label>
  </div>

  <!-- 학생 출석체크 -->
  <div v-for="(student, i) in students" :key="i" class="attendance student">
    <div class="student__name">{{ student.name }}</div>
    <div class="student__birth">{{ student.birth }}</div>
    <input
      type="radio"
      :id="`absence-${student.name}`"
      value="absence"
      v-model="students[i].attendance"
      class="attendance__input"
    />
    <label
      :for="`absence-${student.name}`"
      class="attendance__label attendance__label--absence"
    >
      <span>결석</span>
    </label>
    <input
      type="radio"
      :id="`online-${student.name}`"
      value="online"
      v-model="students[i].attendance"
      class="attendance__input"
    />
    <label
      :for="`online-${student.name}`"
      class="attendance__label attendance__label--online"
    >
      <span>온라인</span>
    </label>
    <input
      type="radio"
      :id="`offline-${student.name}`"
      value="offline"
      v-model="students[i].attendance"
      class="attendance__input"
    />
    <label
      :for="`offline-${student.name}`"
      class="attendance__label attendance__label--offline"
    >
      <span>현장</span>
    </label>
  </div>

  <!-- 버튼 영역 -->
  <Button
    label="다음"
    class="p-button-success p-button-raised btn-block"
    @click="moveStage('teacher')"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Student from "@/types/Student";

export default defineComponent({
  name: "InputAttendance",
  setup() {
    const store = useStore();
    const teacher = ref("offline");
    const students = computed<Student[]>(() => store.state.attendance.students);
    const moveStage = (stage: string) =>
      store.commit("attendance/SET_STAGE", stage);
    return {
      teacher,
      students,
      moveStage,
    };
  },
});
</script>

<style scoped>
.attendance {
  padding: 1rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 10px 0;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  background: #efefef95;
}
.attendance__label--offline {
  background-color: #4caf50;
  color: #28334aff;
}
.attendance__label--online {
  background-color: #fbc02d;
  color: #28334aff;
}
.attendance__label--absence {
  background-color: #ff4032;
  color: #28334aff;
}
/* input[type="radio"] { */
.attendance__input {
  display: none;
  height: 0;
  width: 0;
}
/* input[type="radio"] ~ label { */
.attendance__label {
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
