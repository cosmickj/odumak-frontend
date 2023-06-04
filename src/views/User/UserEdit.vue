<template>
  <section v-if="isAuthReady" class="overflow-auto flex flex-col bg-slate-200">
    <header class="z-10 sticky top-0 left-0 px-1 pt-1 bg-slate-200">
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

    <div class="flex-1 text-xs">
      <div class="flex flex-col px-5 py-2">
        <label for="name " class="mb-1"> 이름 </label>
        <InputText
          v-model="formState.name"
          id="name"
          class="rounded-lg"
          :class="{ 'p-invalid': v$.name.$error }"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="birth" class="mb-1">생년월일</label>
        <Calendar id="birth" placeholder="생년월일" input-class="rounded-lg" />
      </div>

      <!-- <div class="flex flex-col px-5 py-2">
        <label for="phone" class="mb-1">휴대폰 번호</label>
        <InputText
          v-model="formState.phone"
          id="phone"
          placeholder="휴대폰 번호"
          type="number"
          class="rounded-lg"
        />
      </div> -->

      <p class="px-5 mt-7 mb-2 text-base font-semibold">소속 정보</p>

      <div class="flex flex-col px-5 py-2">
        <label for="church" class="mb-1">교회 이름</label>
        <Dropdown
          v-model="formState.church"
          :class="{ 'p-invalid': v$.church.$error }"
          :options="CHURCH_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="교회 이름"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="department" class="mb-1">봉사 부서</label>
        <Dropdown
          v-model="formState.department"
          :class="{ 'p-invalid': v$.department.$error }"
          :options="DEPARTMENT_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="봉사 부서"
        />
      </div>

      <div class="flex flex-col px-5 py-2">
        <label for="role" class="mb-1">담임 여부</label>
        <SelectButton
          unselectable
          v-model="formState.role"
          class="flex"
          :options="TEACHER_ROLE"
          optionLabel="label"
          optionValue="value"
          placeholder="담당 학년"
        />
      </div>

      <div v-if="formState.role !== 'common'" class="flex flex-col px-5 py-2">
        <label for="grade" class="mb-1">담당 학년</label>
        <Dropdown
          v-model="formState.grade"
          :class="{ 'p-invalid': v$.grade.$error }"
          :options="GRADE_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="담당 학년"
        />
      </div>

      <div v-if="formState.role !== 'common'" class="flex flex-col px-5 py-2">
        <label for="group" class="mb-1">담당 학급</label>
        <Dropdown
          v-model="formState.group"
          :class="{ 'p-invalid': v$.group.$error }"
          :options="GROUP_OPTIONS"
          optionLabel="label"
          optionValue="value"
          placeholder="담당 학급"
        />
      </div>
    </div>

    <div class="sticky bottom-0 mt-10 px-5 pb-4 bg-slate-200">
      <Button
        class="w-full p-button-warning"
        label="수정 완료"
        :disabled="!isChanged"
        @click="submitForm"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useUserStore } from '@/store/user';
import {
  GRADE_OPTIONS,
  GROUP_OPTIONS,
  TEACHER_ROLE,
  CHURCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from '@/constants/common';
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';

const { isAuthReady, userData } = useUserStore();
const userStore = useUserStore();

const isChanged = ref(false);
const formState = reactive({ ...userData });

watch(
  formState,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(userData)) {
      isChanged.value = true;
    } else {
      isChanged.value = false;
    }
  },
  { deep: true }
);

watch(
  () => formState.role,
  (newValue) => {
    if (newValue === 'common') {
      formState.grade = '';
      formState.group = '';
    }
  }
);

const rules = computed(() => ({
  name: {
    required: helpers.withMessage('이름을 입력해주세요.', required),
  },
  church: { required },
  department: { required },
  grade: {
    requiredIf: requiredIf(formState.role !== 'common'),
  },
  group: {
    requiredIf: requiredIf(formState.role !== 'common'),
  },
}));

// @ts-ignore
const v$ = useVuelidate(rules, formState);

const submitForm = async () => {
  try {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      return;
    }
    await userStore.modifyMultiple({
      uid: userData?.uid,
      ...formState,
    });
    alert('수정되었습니다.');
  } catch (error) {
    throw Error((error as Error).message);
  } finally {
    isChanged.value = false;
  }
};
</script>

<style scoped>
:deep(.p-button.p-component) {
  flex: 1;
}
</style>
