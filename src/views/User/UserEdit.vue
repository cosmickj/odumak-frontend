<template>
  <section v-if="isAuthReady" class="overflow-auto bg-slate-200">
    <header class="sticky top-0 left-0 px-1 bg-slate-200">
      <RouterLink :to="{ name: 'UserView' }">
        <Button
          icon="pi pi-angle-left"
          class="p-button-text p-button-secondary"
        />
      </RouterLink>

      <span
        class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
      >
        내 정보 수정
      </span>
    </header>

    <div class="text-xs">
      <div class="flex flex-col px-5 py-2">
        <label for="displayName " class="mb-1">이름</label>
        <InputText
          v-model="form.displayName"
          id="displayName"
          class="rounded-lg"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="birth" class="mb-1">생년월일</label>
        <InputText id="birth" placeholder="생년월일" class="rounded-lg" />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="phone" class="mb-1">휴대폰 번호</label>
        <InputText id="phone" placeholder="휴대폰 번호" class="rounded-lg" />
      </div>

      <p class="px-5 mt-8 mb-2 text-base font-semibold">소속 정보</p>

      <div class="flex flex-col px-5 py-2">
        <label for="church" class="mb-1">교회 이름</label>
        <Dropdown
          v-model="form.church"
          :options="CHURCH_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="교회 이름"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="department" class="mb-1">봉사 부서</label>
        <Dropdown
          v-model="form.department"
          :options="DEPARTMENT_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="봉사 부서"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="role" class="mb-1">담임 여부</label>
        <SelectButton
          v-model="form.role"
          class="flex"
          :unselectable="false"
          :options="TEACHER_ROLE"
          optionLabel="label"
          optionValue="value"
          placeholder="담당 학년"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="grade" class="mb-1">담당 학년</label>
        <Dropdown
          v-model="form.grade"
          :options="GRADE_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="담당 학년"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="group" class="mb-1">담당 학급</label>
        <Dropdown
          v-model="form.group"
          :options="GROUP_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="담당 학급"
        />
      </div>

      <section class="sticky bottom-0 mt-6 px-5 pb-4 bg-slate-200">
        <Button
          class="w-full p-button-warning"
          label="수정 완료"
          @click="submitForm"
        />
      </section>
    </div>
  </section>
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
const { isAuthReady, accountData } = useAccountStore();

const form = reactive({ ...accountData });

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
