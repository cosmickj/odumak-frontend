<template>
  <div class="w-[38rem] p-6 bg-slate-200 drop-shadow-md">
    <div class="flex justify-between items-center px-3">
      <div class="mt-4 text-center text-red-500">* : 필수 입력 항목</div>

      <div class="cursor-pointer" @click="handleClose">
        <i class="pi pi-times-circle text-3xl text-red-600"></i>
      </div>
    </div>

    <div class="p-3 flex items-center">
      <div class="text-2xl w-[6.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>학년:</span>
      </div>
      <Dropdown
        class="grow"
        :class="{ 'p-invalid': error.grade.status }"
        v-model="selectedGrade"
        :options="grade"
        option-label="label"
        option-value="value"
        placeholder="학년을 선택해주세요."
        @click="v$.selectedGrade.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[6.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>학급:</span>
      </p>
      <Dropdown
        class="grow"
        :class="{ 'p-invalid': error.group.status }"
        v-model="selectedGroup"
        :options="group"
        option-label="label"
        option-value="value"
        placeholder="학급을 선택해주세요."
        @click="v$.selectedGroup.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <div class="text-2xl w-[6.5rem] mr-4">
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
      <div class="text-2xl w-[6.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>성별:</span>
      </div>
      <SelectButton
        :class="{ 'p-invalid': error.gender.status }"
        v-model="selectedGender"
        :options="gender"
        option-label="label"
        option-value="value"
        @click="v$.selectedGender.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[6.5rem] mr-4">생년월일:</p>
      <Calendar
        class="grow"
        v-model="selectedBirth"
        date-format="yy/mm/dd"
        placeholder="생년월일을 선택해주세요."
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[6.5rem] mr-4">연락처:</p>
      <InputText
        class="grow"
        v-model="inputtedPhone"
        type="number"
        placeholder="연락처를 구분자(-) 없이 입력해주세요."
      />
    </div>

    <div class="p-3 flex items-center">
      <div class="text-2xl w-[6.5rem] mr-4">
        <span class="text-red-500">*</span>
        <span>교사:</span>
      </div>
      <InputText
        class="grow"
        :class="{ 'p-invalid': error.teacher.status }"
        v-model="selectedTeacher"
        type="text"
        placeholder="담당 교사를 입력해주세요."
        @click="v$.selectedTeacher.$reset"
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[6.5rem] mr-4">주소:</p>
      <InputText
        class="grow"
        v-model="inputtedAddress"
        type="text"
        placeholder="주소를 입력해주세요."
      />
    </div>

    <div class="p-3 flex items-center">
      <p class="text-2xl w-[6.5rem] mr-4">비고:</p>
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
import { gender, grade, group } from '../data';

import type { AddStudentParams } from '@/types';

const props = defineProps<{
  params?: AddStudentParams;
}>();

const emit = defineEmits(['close', 'create', 'edit']);

const selectedIndex = ref(props.params?.index || null);
const selectedGrade = ref(props.params?.grade || '');
const selectedGroup = ref(props.params?.group || '');
const inputtedName = ref(props.params?.name || '');
const selectedGender = ref(props.params?.gender || '');
const selectedBirth = ref<Date | undefined>(props.params?.birth || undefined);
const inputtedPhone = ref(props.params?.phone || '');
const selectedTeacher = ref(props.params?.teacher || '');
const inputtedAddress = ref(props.params?.address || '');
const inputtedRemark = ref(props.params?.remark || '');

const rules = computed(() => ({
  selectedGrade: { required },
  selectedGroup: { required },
  inputtedName: { required },
  selectedGender: { required },
  selectedTeacher: { required },
}));

const v$ = useVuelidate(rules, {
  selectedGrade,
  selectedGroup,
  inputtedName,
  selectedGender,
  selectedTeacher,
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
  gender: {
    status: v$.value.selectedGender.$error,
  },
  teacher: {
    status: v$.value.selectedTeacher.$error,
  },
}));

const handleClose = () => emit('close');

const handleCreate = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    return;
  }

  const params: AddStudentParams = {
    grade: selectedGrade.value || null,
    group: selectedGroup.value || null,
    name: inputtedName.value,
    gender: selectedGender.value || null,
    birth: selectedBirth.value || null,
    phone: inputtedPhone.value,
    teacher: selectedTeacher.value,
    address: inputtedAddress.value,
    remark: inputtedRemark.value,
  };

  emit('create', params);
};

const handleEdit = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    return;
  }

  const params: AddStudentParams = {
    index: selectedIndex.value,
    grade: selectedGrade.value || null,
    group: selectedGroup.value || null,
    name: inputtedName.value,
    gender: selectedGender.value || null,
    birth: selectedBirth.value || null,
    phone: inputtedPhone.value,
    teacher: selectedTeacher.value,
    address: inputtedAddress.value,
    remark: inputtedRemark.value,
  };

  emit('edit', params);
};
</script>
