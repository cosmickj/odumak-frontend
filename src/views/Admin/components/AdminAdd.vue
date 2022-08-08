<template>
  <div class="fixed bottom-7 right-7 bg-yellow-200 rounded-full drop-shadow">
    <div
      class="h-full flex justify-center items-center cursor-pointer select-none"
      @click="handleOpen"
    >
      <div class="p-5 text-xl">
        <span>{{ who }} 추가하기</span>
        <i class="pi pi-plus-circle ml-3 text-xl"></i>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <div
      v-if="isOpened"
      class="absolute inset-0 bg-slate-100/80 flex justify-center items-center"
    >
      <AdminAddStudent
        v-if="memberPosition === 'student'"
        @close="handleClose"
        @submit="handleSubmit"
      />

      <AdminAddTeacher
        v-if="memberPosition === 'teacher'"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AdminAddStudent from './AdminAddStudent.vue';
import AdminAddTeacher from './AdminAddStudent.vue';

import { computed } from 'vue';

import type { AddStudentParams, MemberPosition } from '@/types';

const props = defineProps<{
  isOpened: boolean;
  memberPosition: MemberPosition;
}>();

const emit = defineEmits(['open', 'close', 'submit']);

const who = computed(() => {
  if (props.memberPosition === 'student') {
    return '학생';
  } else if (props.memberPosition === 'teacher') {
    return '교사';
  } else {
    return '';
  }
});

const handleOpen = () => emit('open');
const handleClose = () => emit('close');
const handleSubmit = (params: AddStudentParams) => emit('submit', params);
</script>
