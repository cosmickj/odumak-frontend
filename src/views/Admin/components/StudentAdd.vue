<template>
  <div class="w-[38rem] p-6 bg-slate-200 drop-shadow-md">
    <div class="flex justify-end px-2">
      <div class="cursor-pointer" @click="handleClose">
        <i class="pi pi-times-circle text-3xl text-red-600"></i>
      </div>
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">학년:</p>
      <Dropdown
        class="grow"
        v-model="selectedGrade"
        :options="grade"
        option-label="label"
        placeholder="학년을 선택해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">학급:</p>
      <Dropdown
        class="grow"
        v-model="selectedGroup"
        :options="group"
        option-label="label"
        placeholder="학급을 선택해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">이름:</p>
      <InputText
        class="grow"
        v-model="inputtedName"
        type="text"
        placeholder="이름을 입력해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">성별:</p>
      <SelectButton v-model="selectedGender" :options="gender" optionLabel="label" />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">생년월일:</p>
      <Calendar
        class="grow"
        v-model="selectedBirth"
        placeholder="생년월일을 선택해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">연락처:</p>
      <InputText
        class="grow"
        v-model="inputtedPhone"
        type="number"
        placeholder="연락처를 구분자(-) 없이 입력해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">교사:</p>
      <InputText
        class="grow"
        v-model="selectedTeacher"
        type="text"
        placeholder="담당 교사를 입력해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">주소:</p>
      <InputText
        class="grow"
        v-model="inputtedAddress"
        type="text"
        placeholder="주소를 입력해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">비고:</p>
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
import { ref } from 'vue';
import { Option, State } from '@/types';

const emit = defineEmits(['close', 'submit']);

const selectedGrade = ref<Option>();
const selectedGroup = ref<Option>();
const inputtedName = ref('');
const selectedGender = ref<Option>();
const selectedBirth = ref<Date>();
const inputtedPhone = ref('');
const selectedTeacher = ref('');
const inputtedAddress = ref('');
const inputtedRemark = ref('');

const grade: Option[] = [
  { label: '3학년', value: '3' },
  { label: '4학년', value: '4' },
];

const group: Option[] = [
  { label: '1반', value: '1' },
  { label: '2반', value: '2' },
  { label: '3반', value: '3' },
  { label: '4반', value: '4' },
  { label: '5반', value: '5' },
  { label: '6반', value: '6' },
  { label: '7반', value: '7' },
  { label: '8반', value: '8' },
  { label: '9반', value: '9' },
  { label: '10반', value: '10' },
];

const gender: Option[] = [
  { label: '남자', value: 'male' },
  { label: '여자', value: 'female' },
];

const handleClose = () => emit('close');

const handleSubmit = () => {
  const state: State = {
    grade: selectedGrade.value?.value || null,
    group: selectedGroup.value?.value || null,
    name: inputtedName.value,
    gender: selectedGender.value?.value || null,
    birth: selectedBirth.value || null,
    phone: inputtedPhone.value,
    teacher: selectedTeacher.value,
    address: inputtedAddress.value,
    remark: inputtedRemark.value,
  };
  emit('submit', state);
};
</script>
