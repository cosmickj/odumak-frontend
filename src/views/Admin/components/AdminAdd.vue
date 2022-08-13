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
        :params="(params as AddStudentParams)"
        @close="handleClose"
        @create="handleCreate"
        @edit="handleEdit"
      />

      <AdminAddTeacher
        v-if="memberPosition === 'teacher'"
        :params="(params as AddTeacherParams)"
        @close="handleClose"
        @create="handleCreate"
        @edit="handleEdit"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AdminAddStudent from './AdminAddStudent.vue';
import AdminAddTeacher from './AdminAddTeacher.vue';

import { computed } from 'vue';

import type {
  AddStudentParams,
  AddTeacherParams,
  MemberPosition,
} from '@/types';

const props = defineProps<{
  isOpened: boolean;
  memberPosition: MemberPosition;
  params?: AddStudentParams | AddTeacherParams;
}>();

const emit = defineEmits(['open', 'close', 'create', 'edit']);

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
const handleCreate = (params: AddStudentParams) => emit('create', params);
/**
 * TODO
 * - 현재 payload와 params가 섞여있어서 굉장히 데이터 흐름을 추적하기 힘들다.
 */
const handleEdit = (params: any) => emit('edit', params);
</script>
