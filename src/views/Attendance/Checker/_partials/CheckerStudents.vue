<template>
  <div
    v-for="(member, i) in attendancesTemplate"
    class="flex mt-[-1px] p-2 border border-slate-300 items-center justify-around checker-students-cont"
    :key="i"
  >
    <span>{{ member.name }}</span>

    <SelectButton
      v-model="member.attendance.status"
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
  attendancesTemplate: AttendanceData[] | undefined;
}>();
</script>

<style scoped>
@media (max-width: 320px) {
  .checker-students-cont {
    font-size: 12px;
  }
  :deep(.p-component) {
    font-size: 12px;
  }
}
</style>
