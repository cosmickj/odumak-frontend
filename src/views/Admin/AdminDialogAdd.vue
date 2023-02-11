<template>
  <TheDialog :is-dialog-visible="isDialogVisible" @close="handleClose">
    <template #header>
      <div class="flex gap-x-4 items-center">
        <Button
          class="p-button-success p-button-sm"
          label="인원 추가"
          @click="handleAdd"
        />
        <Button
          class="p-button-warning p-button-sm"
          label="제출하기"
          @click="handleSubmit"
        />
      </div>
    </template>

    <div
      v-for="(member, idx) in members"
      class="shrink-0 w-full max-w-sm py-6 rounded-xl bg-slate-300"
      :key="idx"
    >
      <div class="flex gap-x-5 mx-6">
        <div class="flex-1">
          <p>이름</p>
          <InputText
            v-model="member.name"
            class="w-full"
            :class="{ 'p-invalid': isInvalid(idx, 'name') }"
          />
        </div>

        <div class="flex-1 flex flex-col">
          <p>성별</p>
          <div class="flex-1 flex items-center">
            <RadioButton
              v-model="member.gender"
              input-id="male"
              name="gender"
              value="male"
            />
            <label for="male">남자</label>

            <RadioButton
              class="ml-2"
              v-model="member.gender"
              input-id="female"
              name="gender"
              value="female"
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
            v-model="member.birth"
            date-format="yy년 mm월 dd일"
            showButtonBar
          />
        </div>

        <div class="flex-1">
          <p>초등부 등록일</p>
          <Calendar
            class="w-full"
            v-model="member.registeredAt"
            date-format="yy년 mm월 dd일"
            showButtonBar
          />
        </div>
      </div>

      <div class="flex gap-x-5 mx-6 mb-2">
        <div class="flex-1">
          <p>학년</p>
          <Dropdown
            v-model="member.grade"
            class="w-full"
            :class="{ 'p-invalid': isInvalid(idx, 'grade') }"
            :options="GRADE_OPTIONS"
            option-label="label"
            option-value="value"
            placeholder="학년"
          />
        </div>

        <div class="flex-1">
          <p>학급</p>
          <Dropdown
            v-model="member.group"
            class="w-full"
            :class="{ 'p-invalid': isInvalid(idx, 'group') }"
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
          <InputText v-model="member.address" class="w-full" />
        </div>
      </div>

      <div class="flex gap-x-5 mx-6 mb-2">
        <div class="flex-1">
          <p>연락처</p>
          <InputText v-model="member.phone" class="w-full" />
        </div>

        <div class="flex-1">
          <p>비고</p>
          <InputText v-model="member.remark" class="w-full" />
        </div>
      </div>

      <div class="flex justify-end gap-x-2 mx-6 mt-3">
        <Button
          label="삭제하기"
          class="p-button-danger p-button-sm"
          @click="handleDelete(idx)"
        />
        <Button
          label="복사하기"
          class="p-button-help p-button-sm"
          @click="handleCopy(idx)"
        />
      </div>
    </div>
  </TheDialog>
</template>

<script setup lang="ts">
import TheDialog from '@/components/TheDialog.vue';
import { GRADE_OPTIONS, GROUP_OPTIONS } from '@/constants/common';
import type { MemberData } from '@/types';

const props = defineProps<{
  isDialogVisible: boolean;
  members: MemberData[];
  errors: any;
}>();

const emit = defineEmits(['add', 'copy', 'delete', 'submit', 'close']);

const handleClose = (payload: boolean) => {
  if (confirm('작업한 내용이 모두 사라집니다. 정말 닫으시겠습니까?')) {
    emit('close', payload);
  }
};
const handleAdd = () => emit('add');
const handleCopy = (index: number) => emit('copy', index);
const handleDelete = (index: number) => emit('delete', index);
const handleSubmit = () => emit('submit');

const isInvalid = (index: number, key: string) => {
  if (props.errors && props.errors[index][key].length > 0) return true;
  else return false;
};
</script>
