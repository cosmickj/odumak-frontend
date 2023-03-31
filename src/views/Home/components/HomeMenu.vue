<template>
  <RouterLink
    class="aspect-square rounded-lg"
    :to="{ name: routeName, params: { job } }"
  >
    <div class="relative h-full p-3 text-base">
      <p>
        <span>{{ who }}</span>
        <span class="font-bold">{{ what }}</span>
      </p>

      <p>출석현황</p>

      <span class="absolute bottom-4 right-4">
        <i class="pi pi-angle-right"></i>
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  job: 'student' | 'teacher';
  type: 'daily' | 'total';
  routeName: string;
}>();

const WhoMap = { student: '학생', teacher: '교사' };
const who = computed(() => WhoMap[props.job]);

const WhatMap = { daily: '일일', total: '누적' };
const what = computed(() => WhatMap[props.type]);
</script>
