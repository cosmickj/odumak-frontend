<template>
  <router-link :to="{ name: routeName, params: { position, type } }">
    <Card>
      <template #title>
        <div><i class="text-4xl" :class="icon"></i></div>

        <div>{{ 누구 }}</div>

        <div class="text-yellow-500">{{ 분류 }}</div>

        <div>출석현황</div>
      </template>
    </Card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MemberPosition } from '@/types/index.js';

const props = defineProps<{
  icon: string;
  routeName: string;
  position: MemberPosition;
  type: string;
}>();

const 누구 = computed(() => {
  if (props.position === 'student') return '학생';
  else if (props.position === 'teacher') return '교사';
});

const 분류 = computed(() => {
  if (props.type === 'daily') return '일일';
  else if (props.type === 'total') return '누적';
});
</script>

<style scoped>
:deep(.p-card) {
  aspect-ratio: 1/1;
}
:deep(.p-card-body) {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.p-card-title) {
  text-align: center;
}
</style>
