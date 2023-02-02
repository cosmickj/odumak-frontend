<template>
  <TheDialog v-model:visible="dialog.isShow" @update:visible="handleHide">
    <template #header>
      <div class="flex gap-x-4 items-center">
        <span class="text-xl">{{ dialog.label }}</span>
        <Button
          class="p-button-success p-button-sm"
          label="행 추가"
          :disabled="dialog.label !== '추가하기'"
          @click="handleAddRow"
        />
        <Button
          class="p-button-warning p-button-sm"
          label="제출하기"
          @click="handleSubmit(dialog.label)"
        />
      </div>
    </template>

    <div class="bg-slate-300 py-3 rounded-xl mb-6">
      <div class="flex gap-x-5 mx-10 my-2">
        <div class="flex-1">
          <p>이름</p>
          <InputText v-model="name" class="w-full" />
        </div>

        <div class="flex-1">
          <p>성별</p>
          <SelectButton
            v-model="gender"
            :options="[
              { label: '남자', value: 'male' },
              { label: '여자', value: 'female' },
            ]"
            optionLabel="label"
            aria-labelledby="single"
          />
        </div>

        <div class="flex-1">
          <p>생년월일</p>
          <Calendar
            v-model="birth"
            date-format="yy년 mm월 dd일"
            class="w-full"
          />
        </div>

        <div class="flex-1">
          <p>초등부에 처음 온 날</p>
          <Calendar
            v-model="registeredAt"
            date-format="yy년 mm월 dd일"
            class="w-full"
          />
        </div>
      </div>

      <div class="flex gap-x-5 mx-10 mb-2">
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

        <div class="flex-1">
          <p>연락처</p>
          <InputText v-model="name" class="w-full" />
        </div>
      </div>

      <div class="flex gap-x-5 mx-10 mb-2">
        <div class="flex-1">
          <p>주소</p>
          <InputText v-model="name" class="w-full" />
        </div>

        <div class="flex-1">
          <p>비고</p>
          <InputText v-model="name" class="w-full" />
        </div>
      </div>
    </div>
  </TheDialog>
</template>

<script setup lang="ts">
import TheDialog from '@/components/TheDialog.vue';
import { ref } from 'vue';

import { GRADE_OPTIONS, GROUP_OPTIONS } from '@/constants/common';
import type { DialogLabel, MemberData } from '@/types';

const props = defineProps<{
  dialog: {
    isShow: boolean;
    label: DialogLabel;
  };
  errors: any;
  memberList: MemberData[];
}>();

const emit = defineEmits(['addRow', 'copyRow', 'deleteRow', 'submit', 'hide']);

//
const name = ref('');
const gender = ref({ label: '남자', value: 'male' });
const birth = ref(new Date());
const grade = ref('3');
const group = ref('1');
const registeredAt = ref(new Date());

const isError = (index: number, key: string) => {
  if (props.errors && props.errors[index][key].length > 0) return true;
  else return false;
};

const isChecked = ref(false);

const handleHide = () => emit('hide');
const handleAddRow = () => emit('addRow');
const handleCopyRow = (index: number) => emit('copyRow', index);
const handleDeleteRow = (index: number) => emit('deleteRow', index);
const handleSubmit = (dialogLabel: DialogLabel) => emit('submit', dialogLabel);
</script>

<style scoped>
.grid-cols-custom {
  grid-template-columns: repeat(11, max-content);
}
</style>
