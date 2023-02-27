<template>
  <div class="overflow-auto flex flex-col h-full p-4">
    <p class="text-2xl text-center">{{ headerText }} 일일 출석현황</p>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const job = computed(() => {
  return router.currentRoute.value.params.job as 'student' | 'teacher';
});
const HeaderTextMap = { student: '학생', teacher: '교사' };
const headerText = computed(() => HeaderTextMap[job.value]);
</script>

<style scoped></style>
