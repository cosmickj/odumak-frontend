<template>
  <div class="drop-shadow-md bg-slate-100 w-[38rem] p-6">
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
        v-model="studentName"
        class="grow"
        type="text"
        placeholder="이름을 입력해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">성별:</p>
      <SelectButton
        class=""
        v-model="selectedGender"
        :options="gender"
        optionLabel="label"
      />
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
        v-model="studentPhone"
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
        v-model="studentAddress"
        type="text"
        placeholder="주소를 입력해주세요."
      />
    </div>

    <div class="flex items-center p-3">
      <p class="text-2xl w-[6.5rem] mr-4">비고:</p>
      <InputText class="grow" type="text" />
    </div>

    <div class="mt-6 flex justify-end">
      <Button class="p-button-warning p-button-lg">저장하기</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedGrade = ref('');
const grade = [
  { label: '3학년', value: '3' },
  { label: '4학년', value: '4' },
];

const selectedGroup = ref('');
const group = [
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

const studentName = ref('');

const selectedGender = ref('');
const gender = [
  { label: '남자', value: 'male' },
  { label: '여자', value: 'female' },
];

const selectedBirth = ref<Date>();

const studentPhone = ref('');

const selectedTeacher = ref('');

const studentAddress = ref('');
</script>

<style scoped></style>
