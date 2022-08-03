<template>
  <div class="overflow-auto h-[calc(100%_-_10rem)] select-none">
    <form
      @submit.prevent="submitStudentsAttendance"
      :class="{
        'border-x-4 border-b-4 border-slate-200 rounded-b-lg bg-slate-200': isSub,
      }"
    >
      <div
        class="attendance bg-white shadow"
        v-for="(student, i) in studentsAttendance"
        :key="i"
      >
        <div class="student__name" :class="$attrs.class">{{ student.name }}</div>

        <input
          v-model="studentsAttendance[i].attendance"
          class="attendance__input"
          type="radio"
          value="absence"
          :id="`absence-${student.name}`"
        />
        <label
          class="shadow-md attendance__label attendance__label__absence"
          :for="`absence-${student.name}`"
        >
          <span>결석</span>
        </label>

        <input
          v-model="studentsAttendance[i].attendance"
          class="attendance__input"
          type="radio"
          value="online"
          :id="`online-${student.name}`"
        />
        <label
          class="shadow-md attendance__label attendance__label__online"
          :for="`online-${student.name}`"
        >
          <span>온라인</span>
        </label>

        <input
          v-model="studentsAttendance[i].attendance"
          class="attendance__input"
          type="radio"
          value="offline"
          :id="`offline-${student.name}`"
        />
        <label
          class="shadow-md attendance__label attendance__label__offline"
          :for="`offline-${student.name}`"
        >
          <span>현장</span>
        </label>
      </div>

      <div v-if="!documentId" class="flex justify-end">
        <Button
          class="w-2/6 p-button-warning p-button-lg"
          label="제출하기"
          type="submit"
        />
      </div>

      <div v-else class="flex justify-end">
        <Button
          class="w-2/6 p-button-danger p-button-lg"
          label="수정하기"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Student, Teacher } from '@/types';
// import { useStore } from "vuex";
// const store = useStore();

const props = defineProps<{
  modelValue: Student[] | Teacher[];
  documentId: string;
  attendanceDate: Date;
  // writer: Teacher;
  isSub?: boolean;
}>();
const emit = defineEmits(['update:modelValue', 'onUploaded:studentsAttendance']);

const studentsAttendance = computed<Student[] | Teacher[]>({
  get: () => props.modelValue,
  set: (studentsAttendance) => emit('update:modelValue', studentsAttendance),
});

const submitStudentsAttendance = async () => {
  // const params = {
  //   recordId: props.recordId,
  //   date: props.attendanceDate,
  //   grade: props.writer.grade,
  //   group: props.writer.group,
  //   teacher: props.writer.name,
  //   studentsAttendance: studentsAttendance.value,
  // };
  // const { id } = await store.dispatch("attendance/addStudentsAttendance", params);
  // emit("onUploaded:studentsAttendance", { id, teacher: props.writer.name });
  // if (!props.recordId) alert("제출되었습니다.");
  // else alert("수정되었습니다.");
};
</script>

<style scoped>
.attendance {
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.attendance__input {
  display: none;
  height: 0;
  width: 0;
}
.attendance__label {
  opacity: 0.4;
  height: 40px;
  width: 40px;
  border-radius: 0.8rem;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s;
}
.attendance__label__offline {
  border: 2px solid #4caf50;
}
.attendance__label__online {
  border: 2px solid #fbc02d;
}
.attendance__label__absence {
  border: 2px solid #ff4032;
}
.attendance__input:checked + .attendance__label {
  opacity: 1;
  animation: jelly 0.6s ease;
}
.attendance__input:checked + .attendance__label.attendance__label__offline {
  background-color: #4caf50;
  color: white;
}
.attendance__input:checked + .attendance__label.attendance__label__online {
  background-color: #fbc02d;
}
.attendance__input:checked + .attendance__label.attendance__label__absence {
  background-color: #ff4032;
}
@keyframes jelly {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
</style>
