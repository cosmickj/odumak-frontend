<template>
  <div v-if="isAuthReady" class="relative text-2xl">
    <div
      class="sticky top-0 left-0 flex px-8 py-4 bg-slate-100 items-center justify-center font-semibold"
    >
      <span
        class="absolute left-8 flex min-w-[24px] aspect-square items-center justify-center cursor-pointer before:block before:w-3 before:aspect-square before:border-l-2 before:border-b-2 before:border-black before:rotate-45"
        @click="router.push({ name: 'UserView' })"
      ></span>
      <span class="leading-[30px]">내 정보 수정</span>
    </div>

    <!-- 기본 정보 -->
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="displayName">이름</label>
      <InputText v-model="form.displayName" id="displayName" />
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="birth">생년월일</label>
      <InputText id="birth" placeholder="생년월일" />
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="phone">휴대폰 번호</label>
      <InputText id="phone" placeholder="휴대폰 번호" />
    </div>

    <!-- 교회 정보 -->
    <div class="flex flex-col px-8 py-4">
      <span class="text-xl font-semibold">교회 정보</span>
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="church">교회 이름</label>
      <Dropdown
        v-model="form.church"
        :options="CHURCH_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="교회 이름"
      />
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="department">봉사 부서</label>
      <Dropdown
        v-model="form.department"
        :options="DEPARTMENT_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="봉사 부서"
      />
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="role">담임 여부</label>
      <SelectButton
        v-model="form.role"
        class="flex"
        :options="TEACHER_ROLE"
        optionLabel="label"
        optionValue="value"
        placeholder="담당 학년"
      />
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="grade">담당 학년</label>
      <Dropdown
        v-model="form.grade"
        :options="GRADE_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="담당 학년"
      />
    </div>
    <div class="flex flex-col px-8 pb-4">
      <label class="mb-2 text-xs" for="group">담당 학급</label>
      <Dropdown
        v-model="form.group"
        :options="GROUP_OPTIONS"
        optionLabel="label"
        optionValue="value"
        placeholder="담당 학급"
      />
    </div>

    <!-- 완료 버튼 -->
    <div class="absolute right-0 bottom-0 left-0 px-8 py-4">
      <Button
        class="w-full p-button-info"
        label="수정 완료"
        @click="submitForm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import {
  GRADE_OPTIONS,
  GROUP_OPTIONS,
  TEACHER_ROLE,
  CHURCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from '@/constants/common';

const router = useRouter();
const { isAuthReady, userData } = useAccountStore();

const form = reactive({ ...userData });

watch(
  form,
  () => {
    console.log('watch');
  },
  { deep: true }
);

const submitForm = () => {
  console.log(form);
};
</script>

<style scoped>
:deep(.p-button.p-component) {
  flex: 1;
}
</style>
