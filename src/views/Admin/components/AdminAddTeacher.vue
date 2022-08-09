<template>
  <div class="w-[38rem] p-6 bg-slate-200 drop-shadow-md">
    <div class="flex justify-between items-center px-3">
      <div class="mt-4 text-center text-red-500">* : 필수 입력 항목</div>

      <div class="cursor-pointer" @click="handleClose">
        <i class="pi pi-times-circle text-3xl text-red-600"></i>
      </div>
    </div>

    <div class="p-3 flex items-center">
      <div class="text-2xl w-[8.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>담당 학년:</span>
      </div>
      <Dropdown
        class="grow"
        :class="{ 'p-invalid': error.grade.status }"
        v-model="selectedGrade"
        :options="grade"
        option-label="label"
        option-value="value"
        placeholder="담당 학년을 선택해주세요."
        @click="v$.selectedGrade.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[8.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>담당 학급:</span>
      </p>
      <Dropdown
        class="grow"
        :class="{ 'p-invalid': error.group.status }"
        v-model="selectedGroup"
        :options="group"
        option-label="label"
        option-value="value"
        placeholder="담당 학급을 선택해주세요."
        @click="v$.selectedGroup.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <div class="text-2xl w-[8.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>이름:</span>
      </div>
      <InputText
        class="grow"
        :class="{ 'p-invalid': error.name.status }"
        v-model="inputtedName"
        type="text"
        placeholder="이름을 입력해주세요."
        @click="v$.inputtedName.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <div class="text-2xl w-[8.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>담임 여부:</span>
      </div>
      <SelectButton
        :class="{ 'p-invalid': error.selectedRole.status }"
        v-model="selectedRole"
        :options="teacherRole"
        option-label="label"
        option-value="value"
        @click="v$.selectedRole.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[8.5rem] mr-4">비고:</p>
      <InputText class="grow" v-model="inputtedRemark" type="text" />
    </div>

    <div class="mt-6 flex justify-center">
      <Button
        v-if="!params"
        class="p-button-warning p-button-lg"
        @click="handleCreate"
      >
        저장하기
      </Button>

      <Button v-else class="p-button-danger p-button-lg" @click="handleEdit">
        수정하기
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { grade, group, teacherRole } from '../data';

import type { AddTeacherParams } from '@/types/index.js';

const props = defineProps<{
  params?: AddTeacherParams;
}>();

const emit = defineEmits(['close', 'create', 'edit']);

const selectedGrade = ref(props.params?.grade || '');
const selectedGroup = ref(props.params?.group || '');
const inputtedName = ref(props.params?.name || '');
const selectedRole = ref(props.params?.role || '');
const inputtedRemark = ref(props.params?.remark || '');

const rules = computed(() => ({
  selectedGrade: { required },
  selectedGroup: { required },
  inputtedName: { required },
  selectedRole: { required },
}));

const v$ = useVuelidate(rules, {
  selectedGrade,
  selectedGroup,
  inputtedName,
  selectedRole,
});

const error = computed(() => ({
  grade: {
    status: v$.value.selectedGrade.$error,
  },
  group: {
    status: v$.value.selectedGroup.$error,
  },
  name: {
    status: v$.value.inputtedName.$error,
  },
  selectedRole: {
    status: v$.value.selectedRole.$error,
  },
}));

const handleClose = () => emit('close');

const handleCreate = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    return;
  }

  const params: AddTeacherParams = {
    grade: selectedGrade.value || null,
    group: selectedGroup.value || null,
    name: inputtedName.value,
    role: selectedRole.value || null,
    remark: inputtedRemark.value,
  };

  emit('create', params);
};

const handleEdit = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    return;
  }

  const params: AddTeacherParams = {
    grade: selectedGrade.value || null,
    group: selectedGroup.value || null,
    name: inputtedName.value,
    role: selectedRole.value || null,
    remark: inputtedRemark.value,
  };

  emit('edit', params);
};
</script>
