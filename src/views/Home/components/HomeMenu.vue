<template>
  <router-link
    class="rounded-lg"
    :to="{ name: routeName, params: { job, type } }"
  >
    <div class="relative h-full p-4 text-base">
      <p>
        <span>{{ 누구 }}</span>
        <span class="font-bold">{{ 분류 }}</span>
      </p>

      <p>출석현황</p>

      <span class="absolute bottom-4 right-4">
        <i class="pi pi-angle-right"></i>
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  job: string;
  routeName: string;
  type: string;
}>();

const 누구 = computed(() => {
  if (props.job === 'student') return '학생';
  else if (props.job === 'teacher') return '교사';
});

const 분류 = computed(() => {
  if (props.type === 'daily') return '일일';
  else if (props.type === 'total') return '누적';
});
</script>

<style scoped></style>
