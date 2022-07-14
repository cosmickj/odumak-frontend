<template>
  <router-link :to="{ name: routeName, params: { position, type } }" class="w-1/2">
    <Card class="mr-2">
      <template #title>
        <div><i class="pi" :class="icon" style="font-size: 2rem"></i></div>
        <div>{{ 누구 }}</div>
        <div class="text-yellow-500">{{ 분류 }}</div>
        <div>출석현황</div>
      </template>
    </Card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  routeName: string;
  position: string;
  type: string;
}>();

const 누구 = computed(() => {
  if (props.position === 'students') return '학생';
  else if (props.position === 'teachers') return '교사';
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
  justify-content: center;
  align-items: center;
}
:deep(.p-card-title) {
  text-align: center;
}
</style>
