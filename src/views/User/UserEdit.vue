<template>
  <main v-if="isAuthReady" class="overflow-auto">
    <div
      class="z-10 sticky top-0 left-0 flex px-5 py-2 bg-slate-50 items-center justify-between"
    >
      <RouterLink :to="{ name: 'UserView' }">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-secondary"
        />
      </RouterLink>

      <span
        class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-xl"
      >
        내 정보 수정
      </span>
    </div>

    <div class="text-sm">
      <section class="bg-slate-50">
        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="displayName">이름</label>
          <InputText
            v-model="form.displayName"
            id="displayName"
            class="p-inputtext-sm"
          />
        </div>

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="birth">생년월일</label>
          <InputText id="birth" placeholder="생년월일" class="p-inputtext-sm" />
        </div>

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="phone">휴대폰 번호</label>
          <InputText
            id="phone"
            placeholder="휴대폰 번호"
            class="p-inputtext-sm"
          />
        </div>
      </section>

      <section class="mt-6 bg-slate-50">
        <p class="px-5 py-2 text-base font-semibold">교회 정보</p>

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="church">교회 이름</label>
          <Dropdown
            v-model="form.church"
            :options="CHURCH_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="교회 이름"
          />
        </div>

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="department">봉사 부서</label>
          <Dropdown
            v-model="form.department"
            :options="DEPARTMENT_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="봉사 부서"
          />
        </div>

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="role">담임 여부</label>
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

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="grade">담당 학년</label>
          <Dropdown
            v-model="form.grade"
            :options="GRADE_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="담당 학년"
          />
        </div>

        <div class="flex flex-col px-5 pb-1">
          <label class="mb-2" for="group">담당 학급</label>
          <Dropdown
            v-model="form.group"
            :options="GROUP_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="담당 학급"
          />
        </div>
      </section>

      <section class="mt-6 px-5 py-4 bg-slate-50">
        <Button
          class="w-full p-button-warning p-button-sm"
          label="수정하기"
          @click="submitForm"
        />
      </section>
    </div>
  </main>
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
