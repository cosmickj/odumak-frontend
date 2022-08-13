<template>
  <div class="overflow-auto h-[calc(100%_-_10rem)] select-none">
    <form
      :class="{
        'border-x-4 border-b-4 border-slate-200 rounded-b-lg bg-slate-200':
          isSub,
      }"
      @submit.prevent="handleSubmit"
    >
      <div
        v-for="(student, i) in studentsAttendance"
        :key="i"
        class="attendance bg-white shadow"
      >
        <div class="student__name" :class="$attrs.class">
          {{ student.name }}
        </div>

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

const props = defineProps<{
  documentId: string;
  modelValue: any;
  attendanceDate: Date;
  isSub?: boolean;
}>();

const emit = defineEmits(['submit', 'update:modelValue']);

const studentsAttendance = computed({
  get: () => props.modelValue,
  set: (studentsAttendance) => emit('update:modelValue', studentsAttendance),
});

const handleSubmit = async () => emit('submit');
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
</style>
