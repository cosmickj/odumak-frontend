<template>
  <form class="overflow-auto grow flex flex-col" @submit.prevent="handleSubmit">
    <div class="overflow-auto">
      <div
        v-for="(student, idx) in modelValue"
        class="flex bg-white shadow my-2 px-3 py-5"
        :class="{ 'bg-red-300/25': !hasAttendance(student.targetIdx) }"
        :key="idx"
      >
        <div class="flex flex-col w-2/5 text-xl items-center justify-center">
          <span>{{ student.name }}</span>
          <span v-if="!hasAttendance(student.targetIdx)" class="text-red-700">
            입력 필요
          </span>
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

    <Button
      class="p-button-warning p-button-lg w-full rounded-full"
      label="제출하기"
      type="submit"
      :disabled="isDisabled"
    />
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DataSource } from '@/types';

const props = defineProps<{
  attendanceDate: Date;
  checksum: string;
  modelValue: DataSource[];
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

watch(
  () => props.modelValue,
  (newVal) => {
    if (JSON.stringify(newVal) !== props.checksum) {
      isChanged.value = true;
    } else isChanged.value = false;
  },
  { deep: true }
);

const isChanged = ref(false);

const isAllEntered = computed(() => {
  return !props.modelValue.map((d) => d.targetIdx).includes(-1);
});

const isDisabled = computed(() => {
  if (isAllEntered.value && !isChanged.value) return true;
  else return false;
});

const hasAttendance = (index: number) => {
  if (index >= 0) return true;
  return false;
};

const handleSubmit = () => emit('submit');
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
