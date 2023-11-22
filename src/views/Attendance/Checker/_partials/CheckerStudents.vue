<template>
  <div
    v-for="(member, i) in attendances"
    class="checker-students-cont mt-[-1px] flex items-center justify-around border border-slate-300 p-2"
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
import type { Attendance } from '@/models';

defineProps<{
  attendances: Attendance[];
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
