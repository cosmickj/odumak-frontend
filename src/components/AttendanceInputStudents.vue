<template>
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
      class="attendance__label attendance__label__absence"
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
      class="attendance__label attendance__label__online"
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
      class="attendance__label attendance__label__offline"
    >
      <span>현장</span>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Student } from "@/store/types";

export default defineComponent({
  name: "StudentsAttendanceStatus",
  props: {
    modelValue: {
      type: Array as PropType<Student[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const students = computed<Student[]>({
      get() {
        return props.modelValue;
      },
      set(students) {
        emit("update:modelValue", students);
      },
    });
    return { students };
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
.attendance__input {
  display: none;
  height: 0;
  width: 0;
}
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
.attendance__input:checked + .attendance__label {
  opacity: 1;
  animation: jelly 0.6s ease;
  font-weight: bold;
}
.attendance__label__offline {
  background-color: #4caf50;
  color: #28334aff;
}
.attendance__label__online {
  background-color: #fbc02d;
  color: #28334aff;
}
.attendance__label__absence {
  background-color: #ff4032;
  color: #28334aff;
}
</style>
