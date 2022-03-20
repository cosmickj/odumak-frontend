<template>
  <template v-if="students">
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
      class="p-button-success p-button-raised btn-block"
      label="다음"
      @click="moveStage('teacher')"
    />
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import Student from "@/types/Student";

export default defineComponent({
  name: "InputAttendanceStudents",
  setup() {
    const store = useStore();
    const students = computed<Student[]>(() => store.state.attendance.students);
    const moveStage = (stage: string) =>
      store.commit("attendance/SET_STAGE", stage);
    return {
      students,
      moveStage,
    };
  },
});
</script>

<style scoped>
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
