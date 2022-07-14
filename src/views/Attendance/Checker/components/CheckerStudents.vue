<template>
  <div class="overflow-auto h-[calc(100%_-_10rem)]">
    <form class="" @submit.prevent="submitStudentsAttendance">
      <!-- 학생 출석체크 -->
      <div v-for="(student, i) in studentsAttendance" :key="i" class="attendance student">
        <div class="student__name">{{ student.name }}</div>
        <input
          type="radio"
          :id="`absence-${student.name}`"
          value="absence"
          v-model="studentsAttendance[i].attendance"
          class="attendance__input"
        />
        <label :for="`absence-${student.name}`" class="attendance__label attendance__label__absence">
          <span>결석</span>
        </label>

        <input
          type="radio"
          :id="`online-${student.name}`"
          value="online"
          v-model="studentsAttendance[i].attendance"
          class="attendance__input"
        />
        <label :for="`online-${student.name}`" class="attendance__label attendance__label__online">
          <span>온라인</span>
        </label>

        <input
          type="radio"
          :id="`offline-${student.name}`"
          value="offline"
          v-model="studentsAttendance[i].attendance"
          class="attendance__input"
        />
        <label :for="`offline-${student.name}`" class="attendance__label attendance__label__offline">
          <span>현장</span>
        </label>
      </div>

      <Button
        v-if="!documentId"
        class="sticky bottom-0 w-full p-button-warning p-button-lg"
        type="submit"
        label="제출하기"
      />
      <Button v-else class="w-full p-button-danger p-button-lg" type="submit" label="수정하기" />
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
  // writer: Teacher;
  attendanceDate: Date;
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
