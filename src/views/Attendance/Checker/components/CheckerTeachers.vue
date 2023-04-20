<template>
  <div
    v-for="(attendance, i) in attendances"
    class="mt-[-1px] p-2 border border-slate-300 items-center justify-between"
    :key="i"
  >
    <div class="flex items-center justify-between">
      <span>{{ attendance.name }}</span>

      <Button
        icon="pi pi-chevron-down"
        class="p-button-rounded p-button-text p-button-secondary p-button-sm"
      />
    </div>

    <SelectButton
      v-model="attendance.attendance.status"
      class="flex [&>*]:flex-1"
      :options="[
        { name: '현장', value: 'offline' },
        { name: '온라인', value: 'online' },
        { name: '결석', value: 'absence' },
      ]"
      option-label="name"
      option-value="value"
    />
  </div>
</template>

<script setup lang="ts">
import type { AttendanceData } from '@/types';

defineProps<{
  attendances: AttendanceData[];
}>();
</script>
