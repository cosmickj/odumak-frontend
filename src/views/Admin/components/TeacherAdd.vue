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
        :class="{ 'p-invalid': error.selectedTeacherRole.status }"
        v-model="selectedTeacherRole"
        :options="teacherRole"
        optionLabel="label"
        @click="v$.selectedTeacherRole.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[8.5rem] mr-4">비고:</p>
      <InputText class="grow" v-model="inputtedRemark" type="text" />
    </div>

    <div class="mt-6 flex justify-center">
      <Button class="p-button-warning p-button-lg" @click="handleSubmit">
        저장하기
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { Option, State } from '@/types/index.js';
import { grade, group, teacherRole } from '../data';

const emit = defineEmits(['close', 'submit']);

const selectedGrade = ref<Option>();
const selectedGroup = ref<Option>();
const inputtedName = ref('');
const selectedTeacherRole = ref<Option>();
const inputtedRemark = ref('');

const rules = computed(() => ({
  selectedGrade: { required },
  selectedGroup: { required },
  inputtedName: { required },
  selectedTeacherRole: { required },
}));

const v$ = useVuelidate(rules, {
  selectedGrade,
  selectedGroup,
  inputtedName,
  selectedTeacherRole,
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
  selectedTeacherRole: {
    status: v$.value.selectedTeacherRole.$error,
  },
}));

const handleClose = () => emit('close');

const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    return;
  }

  const state = {
    grade: selectedGrade.value?.value || null,
    group: selectedGroup.value?.value || null,
    name: inputtedName.value,
    role: selectedTeacherRole.value?.value || null,
    remark: inputtedRemark.value,
  };
  emit('submit', state);
};
</script>
