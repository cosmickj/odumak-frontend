<template>
  <form
    class="overflow-auto grow flex flex-col"
    :class="{ 'p-5 bg-slate-200 rounded-lg': isSub }"
    @submit.prevent="handleSubmit"
  >
    <div class="overflow-auto">
      <div
        v-for="(student, idx) in modelValue"
        class="flex bg-white shadow my-2 px-3 py-5"
        :key="idx"
      >
        <div
          class="flex w-2/5 text-3xl items-center justify-center"
          :class="$attrs.class"
        >
          {{ student.name }}
        </div>

        <div class="grid grid-cols-3 gap-3 w-3/5">
          <div class="aspect-square text-xl">
            <input
              v-model="student.status"
              :id="`absence-${student.name}`"
              class="hidden w-0 h-0 attendance-button"
              value="absence"
              type="radio"
            />
            <label
              class="opacity-40 flex h-full rounded-lg items-center justify-center cursor-pointer absence"
              :for="`absence-${student.name}`"
            >
              결석
            </label>
          </div>

          <div class="aspect-square text-xl">
            <input
              v-model="student.status"
              :id="`online-${student.name}`"
              class="hidden w-0 h-0 attendance-button"
              value="online"
              type="radio"
            />
            <label
              class="opacity-40 flex h-full rounded-lg items-center justify-center cursor-pointer online"
              :for="`online-${student.name}`"
            >
              온라인
            </label>
          </div>

          <div class="aspect-square text-xl">
            <input
              v-model="student.status"
              class="hidden w-0 h-0 attendance-button"
              :id="`offline-${student.name}`"
              value="offline"
              type="radio"
            />
            <label
              class="opacity-40 flex h-full rounded-lg items-center justify-center cursor-pointer offline"
              :for="`offline-${student.name}`"
            >
              현장
            </label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <Button
        v-if="!documentId"
        class="w-full rounded-full p-button-warning p-button-lg"
        label="제출하기"
        type="submit"
      />

      <Button
        v-else
        class="w-full rounded-full p-button-danger p-button-lg"
        label="수정하기"
        type="submit"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { DataSource } from '@/types';

const props = defineProps<{
  attendanceDate: Date;
  documentId: string;
  isSub?: boolean;
  modelValue: DataSource[];
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const handleSubmit = async () => emit('submit');
</script>

<style scoped>
.attendance-button:checked + label {
  opacity: 1;
  font-weight: 700;
  animation: jelly 0.6s ease;
}
.absence {
  border: 2px solid #ff4032;
}
.online {
  border: 2px solid #fbc02d;
}
.offline {
  border: 2px solid #4caf50;
}
.attendance-button:checked + .absence {
  background-color: #ff4032;
}
.attendance-button:checked + .online {
  background-color: #fbc02d;
}
.attendance-button:checked + .offline {
  background-color: #4caf50;
  color: white;
}
</style>
