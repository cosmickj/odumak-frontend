<template>
  <p class="text-center text-xl">{{ headerText }} 누적 출석현황</p>

  <Image image-class="mt-12 rounded-lg" :src="bgUnderConstruction" />

  <div class="mt-8">
    <p>열심히 작업중입니다.</p>
    <p>조금만 기다려주세요.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import bgUnderConstruction from '@/assets/images/bg-under-construction.gif';

const router = useRouter();

const job = computed(() => {
  return router.currentRoute.value.params.job as 'student' | 'teacher';
});
const JobMap = { student: '학생', teacher: '교사' };

const headerText = computed(() => JobMap[job.value]);
</script>
