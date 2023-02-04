<template>
  <TheDialog :is-dialog-visible="isDialogVisible" @close="handleClose">
    <template #header>
      <div class="flex gap-x-4 items-center">
        <Button
          class="p-button-success p-button-sm"
          label="인원 추가"
          @click="handleAddRow"
        />
        <Button
          class="p-button-warning p-button-sm"
          label="제출하기"
          @click="handleSubmit"
        />
      </div>
    </template>

    <div class="shrink-0 w-full max-w-sm py-6 rounded-xl bg-slate-300">
      <div class="flex gap-x-5 mx-6">
        <div class="flex-1">
          <p>이름</p>
          <InputText v-model="name" class="w-full" />
        </div>

        <div class="flex-1 flex flex-col">
          <p>성별</p>
          <div class="flex-1 flex items-center">
            <RadioButton
              name="gender"
              value="male"
              input-id="male"
              v-model="gender"
            />
            <label for="male">남자</label>

            <RadioButton
              class="ml-2"
              name="gender"
              value="female"
              input-id="female"
              v-model="gender"
            />
            <label for="female">여자</label>
          </div>
        </div>
      </div>

      <div class="flex gap-x-5 mx-6">
        <div class="flex-1">
          <p>생년월일</p>
          <Calendar
            class="w-full"
            v-model="birth"
            date-format="yy년 mm월 dd일"
            showButtonBar
          />
        </div>

        <div class="flex-1">
          <p>초등부 등록일</p>
          <Calendar
            class="w-full"
            v-model="registeredAt"
            date-format="yy년 mm월 dd일"
            showButtonBar
          />
        </div>
      </div>

      <div class="flex gap-x-5 mx-6 mb-2">
        <div class="flex-1">
          <p>학년</p>
          <Dropdown
            v-model="grade"
            class="w-full"
            :options="GRADE_OPTIONS"
            option-label="label"
            option-value="value"
            placeholder="학년"
          />
        </div>

        <div class="flex-1">
          <p>학급</p>
          <Dropdown
            v-model="group"
            class="w-full"
            placeholder="학급"
            option-label="label"
            option-value="value"
            :options="GROUP_OPTIONS"
          />
        </div>
      </div>

      <div class="flex gap-x-5 mx-6 mb-2">
        <div class="flex-1">
          <p>주소</p>
          <InputText v-model="name" class="w-full" />
        </div>
      </div>

      <div class="flex gap-x-5 mx-6 mb-2">
        <div class="flex-1">
          <p>연락처</p>
          <InputText v-model="name" class="w-full" />
        </div>

        <div class="flex-1">
          <p>비고</p>
          <InputText v-model="name" class="w-full" />
        </div>
      </div>

      <div class="flex justify-end gap-x-2 mx-6 mt-3">
        <Button label="삭제하기" class="p-button-danger p-button-sm" />
        <Button label="복사하기" class="p-button-help p-button-sm" />
      </div>
    </div>
  </TheDialog>
</template>

<script setup lang="ts">
import TheDialog from '@/components/TheDialog.vue';

import { ref } from 'vue';
import { GRADE_OPTIONS, GROUP_OPTIONS } from '@/constants/common';

import type { MemberData } from '@/types';

const props = defineProps<{
  isDialogVisible: boolean;
  memberList: MemberData[];
  errors: any;
}>();

// CONTINUE HERE: emit 용어 및 crud 기능 다시 붙이기
const emit = defineEmits(['addRow', 'copyRow', 'deleteRow', 'submit', 'close']);

const handleClose = (payload: boolean) => emit('close', payload);
const handleAddRow = () => emit('addRow');
const handleCopyRow = (index: number) => emit('copyRow', index);
const handleDeleteRow = (index: number) => emit('deleteRow', index);
const handleSubmit = () => emit('submit');

//
const name = ref('');
const gender = ref('male');
const birth = ref(new Date());
const grade = ref('3');
const group = ref('1');
const registeredAt = ref(new Date());

const isError = (index: number, key: string) => {
  if (props.errors && props.errors[index][key].length > 0) return true;
  else return false;
};

const isChecked = ref(false);
</script>
