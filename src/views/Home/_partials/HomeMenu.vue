<template>
  <RouterLink class="rounded-lg" :to="{ name: routeName, params: { job } }">
    <div class="relative px-4 py-6">
      <p class="text-sm">출석현황</p>
      <p class="text-xl">
        <span class="font-bold">{{ who }}</span>
        <span class="ml-1">{{ what }}</span>
      </p>

      <span class="absolute right-4 top-6">
        <i class="pi pi-angle-right"></i>
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Job } from '@/types';

const props = defineProps<{
  job: Job;
  type: 'daily' | 'total';
  routeName: string;
}>();

const WhoMap = { student: '학생', teacher: '교사' };
const who = computed(() => WhoMap[props.job]);

const WhatMap = { daily: '일일', total: '누적' };
const what = computed(() => WhatMap[props.type]);
</script>
