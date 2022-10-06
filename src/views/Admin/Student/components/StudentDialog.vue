<template>
  <Dialog
    v-model:visible="dialog.status"
    class="w-2/5"
    modal
    maximizable
    :breakpoints="{ '450px': '75vw' }"
    :header="dialog.label"
  >
    <div class="min-w-full">
      <div class="grid grid-cols-4 gap-x-12 gap-y-5">
        <div class="col-span-2">
          <p>몇 학년 인가요?</p>
          <Dropdown
            class="w-full"
            v-model="selectedStudent.grade"
            :options="gradeList"
            option-label="name"
            option-value="value"
            placeholder="학년"
          />
        </div>

        <div class="col-span-2">
          <p>몇 반 인가요?</p>
          <Dropdown
            v-model="selectedStudent.group"
            class="w-full"
            placeholder="학급"
            option-label="name"
            option-value="value"
            :options="groupList"
          />
        </div>

        <div class="col-span-4">
          <p>이름</p>
          <InputText
            v-model="selectedStudent.name"
            class="w-full"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- <div class="col-span-4">
          <p>생년월일</p>
          <Calendar  class="w-full" v-model="selectedStudent.birth"/>
        </div> -->

        <div class="col-span-4">
          <p>성별</p>
          <div class="flex items-center">
            <RadioButton
              name="gender"
              inputId="male"
              value="male"
              v-model="selectedStudent.gender"
            />
            <label class="cursor-pointer" for="male"> 남자 어린이 </label>

            <RadioButton
              name="gender"
              inputId="female"
              value="female"
              v-model="selectedStudent.gender"
            />
            <label class="cursor-pointer" for="female"> 여자 어린이 </label>
          </div>
        </div>

        <div class="col-span-2">
          <p>연락처</p>
          <InputMask
            class="w-full"
            v-model="selectedStudent.phone"
            mask="(999)-9999-9999"
            placeholder="(010)-0000-0000"
          />
        </div>

        <div class="col-span-2">
          <p>누구의 연락처인가요?</p>
          <InputText class="w-full" placeholder="ex) 엄마, 아빠 등등" />
        </div>

        <div class="col-span-4">
          <p>담당 교사</p>
          <InputText
            class="w-full"
            disabled
            v-model="selectedStudent.teacher"
            placeholder="학년과 학급을 선택하시면 자동으로 입력됩니다."
          />
        </div>

        <div class="col-span-4">
          <p>어디 사는 친구인가요?</p>
          <InputText
            class="w-full"
            v-model="selectedStudent.address"
            placeholder="주소를 입력해주세요."
          />
        </div>

        <div class="col-span-4">
          <p>언제 초등부를 처음 나왔나요?</p>
          <Calendar
            class="w-full"
            touchUI
            v-model="selectedStudent.registeredAt"
            date-format="yy년 mm월 dd일"
          />
        </div>

        <div class="col-span-4">
          <p>비고</p>
          <InputText class="w-full" v-model="selectedStudent.remark" />
        </div>

        <div class="col-span-4">
          <Button
            v-if="dialog.label === '수정하기'"
            class="p-button-warning w-full"
            :label="dialog.label"
            @click="handleSubmit('EDIT')"
          />
          <Button
            v-else-if="dialog.label === '추가하기'"
            class="p-button-success w-full"
            :label="dialog.label"
            @click="handleSubmit('ADD')"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { SubmitType } from '@/types';
defineProps<{
  dialog: {
    status: boolean;
    label: string;
  };
  selectedStudent: any;
}>();

const emit = defineEmits(['submit']);

const gradeList = [
  { name: '3학년', value: '3' },
  { name: '4학년', value: '4' },
];

const groupList = [
  { name: '새친구', value: '0' },
  { name: '1반', value: '1' },
  { name: '2반', value: '2' },
  { name: '3반', value: '3' },
  { name: '4반', value: '4' },
  { name: '5반', value: '5' },
  { name: '6반', value: '6' },
  { name: '7반', value: '7' },
];

const handleSubmit = (submitType: SubmitType) => emit('submit', { submitType });
</script>
