<template>
  <section class="px-5 py-8">
    <header class="mb-4 text-xl">
      <p>안녕하세요!</p>
      <div class="flex items-center justify-between">
        <p>
          <strong>{{ accountData?.name }}</strong> 선생님
        </p>

        <Button
          v-if="!accountData?.isAccepted"
          outlined
          class="text-xs"
          severity="danger"
          icon="pi pi-plus"
          label="추가 정보 입력하기"
          @click="toggleShow"
        />
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3">
      <RouterLink
        v-if="accountData?.role === 'admin'"
        :to="{ name: 'AdminStudent' }"
        class="col-span-2 bg-purple-300 text-purple-700 rounded-lg"
      >
        <div class="relative w-full h-full py-6 text-center">
          <p><span class="font-bold">관리자 페이지</span> 이동하기</p>
          <span class="absolute bottom-4 right-4">
            <i class="pi pi-angle-right"></i>
          </span>
        </div>
      </RouterLink>

      <HomeMenu
        class="bg-blue-300 text-blue-700"
        job="student"
        type="daily"
        icon="pi pi-users"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-green-300 text-green-700"
        job="teacher"
        type="daily"
        icon="pi pi-heart"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-red-300 text-red-700"
        job="student"
        type="total"
        icon="pi pi-users"
        route-name="AttendanceTrackerTotal"
      />

      <HomeMenu
        class="bg-yellow-300 text-yellow-700"
        job="teacher"
        type="total"
        icon="pi pi-heart"
        route-name="AttendanceTrackerTotal"
      />
    </div>

    <Dialog
      modal
      v-model:visible="isVisible"
      class="w-1/3"
      position="bottom"
      header="승인이 필요합니다"
      :breakpoints="{ '640px': '90vw' }"
    >
      <div class="break-keep">
        <span class="font-semibold"> 추가정보(교회, 당담부서, 학급 등) </span>
        를 입력해주세요.
      </div>

      <template #footer>
        <Button
          autofocus
          outlined
          class="text-xs"
          icon="pi pi-plus"
          label="추가 정보 입력하기"
          severity="danger"
          @click="toggleShow"
        />
      </template>
    </Dialog>

    <Dialog
      modal
      v-model:visible="show"
      class="w-1/2"
      header="추가 정보 입력하기"
      position="bottom"
      :breakpoints="{ '640px': '90vw' }"
      @hide="closeForm"
    >
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="church" class="mb-1">교회 이름</label>
          <Dropdown
            v-model="formState.church"
            :class="{ 'p-invalid': v$.church.$error }"
            :options="CHURCH_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="교회를 선택해주세요"
          />
        </div>

        <div class="flex flex-col">
          <label for="department" class="mb-1">봉사 부서</label>
          <Dropdown
            v-model="formState.department"
            :class="{ 'p-invalid': v$.department.$error }"
            :options="DEPARTMENT_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="부서를 선택해주세요"
          />
        </div>

        <div class="flex flex-col">
          <label for="role" class="mb-1">담임 여부</label>
          <SelectButton
            unselectable
            v-model="formState.role"
            class="flex"
            :options="TEACHER_ROLE"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div v-if="formState.role !== 'common'" class="flex flex-col">
          <label for="grade" class="mb-1">담당 학년</label>
          <Dropdown
            v-model="formState.grade"
            :class="{ 'p-invalid': v$.grade.$error }"
            :options="GRADE_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="학년을 선택해주세요"
          />
        </div>

        <div v-if="formState.role !== 'common'" class="flex flex-col">
          <label for="group" class="mb-1">담당 학급</label>
          <Dropdown
            v-model="formState.group"
            :class="{ 'p-invalid': v$.group.$error }"
            :options="GROUP_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="학급을 선택해주세요"
          />
        </div>
      </div>

      <Button
        class="w-full mt-6"
        label="승인요청"
        severity="warning"
        :loading="isLoading"
        @click="submitForm"
      />
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import HomeMenu from './components/HomeMenu.vue';
import { computed, reactive, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useAccountStore } from '@/store/account';
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import {
  GRADE_OPTIONS,
  GROUP_OPTIONS,
  TEACHER_ROLE,
  CHURCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from '@/constants/common';

const { accountData } = useAccountStore();

const isVisible = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if ((to.name as string).includes('Attendance')) {
    isVisible.value = true;
  } else {
    next();
  }
});

// TODO: 변수명 변경하기
const show = ref(false);
const formState = reactive({
  church: '',
  department: '',
  role: '',
  grade: '',
  group: '',
});

const toggleShow = () => {
  isVisible.value = false;
  show.value = true;
};

const closeForm = () => {
  formState.church = '';
  formState.department = '';
  formState.role = '';
  formState.grade = '';
  formState.group = '';

  v$.value.$reset();
};

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

const isLoading = ref(false);

const submitForm = async () => {
  try {
    isLoading.value = true;

    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      return;
    }
    // await userStore.modifyMultiple({
    //   uid: accountData?.uid,
    //   ...formState,
    // });
  } catch (error) {
    throw Error((error as Error).message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
:deep(.pi.pi-plus.p-button-icon) {
  font-size: 0.75rem;
}
</style>
