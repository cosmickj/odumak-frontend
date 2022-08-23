<template>
  <section class="flex flex-col justify-center">
    <div class="grid grid-cols-1 gap-2 px-8">
      <div>
        <div>교회</div>
        <Dropdown
          class="w-full"
          v-model="church"
          :options="churchOptions"
          optionLabel="name"
          optionValue="value"
          placeholder="교회 선택"
          :disabled="true"
        />
      </div>

      <div>
        <div>소속</div>
        <Dropdown
          class="w-full"
          v-model="department"
          :options="departmentOptions"
          optionLabel="name"
          optionValue="value"
          placeholder="소속 선택"
          :disabled="true"
        />
      </div>

      <div class="my-6 border border-slate-300"></div>

      <div>
        <div>이메일</div>
        <InputText
          v-model="email"
          class="w-full"
          :class="{ 'p-invalid': error.email.status }"
          placeholder="이메일을 입력하세요."
          type="email"
          required
        />
      </div>

      <div>
        <div>비밀번호</div>
        <Password
          v-model="password"
          class="w-full"
          :class="{ 'p-invalid': error.password.status }"
          inputStyle="width:inherit;"
          placeholder="비밀번호를 입력하세요."
          :feedback="false"
          toggleMask
        />
      </div>

      <div>
        <div>비밀번호 확인</div>
        <Password
          v-model="confirmedPassword"
          class="w-full"
          :class="{ 'p-invalid': error.confirmedPassword.status }"
          inputStyle="width:inherit;"
          placeholder="비밀번호를 입력하세요."
          :feedback="false"
          toggleMask
        />
      </div>

      <div class="my-6 border border-slate-300"></div>

      <div>
        <div>이름</div>
        <InputText
          v-model="name"
          class="w-full"
          :class="{ 'p-invalid': error.name.status }"
          type="text"
          placeholder="이름을 입력하세요."
        />
      </div>

      <div>
        <div>담당</div>
        <SelectButton
          v-model="role"
          class="grid grid-cols-3"
          :options="roleOptions"
          optionLabel="name"
          optionValue="value"
          placeholder="담당 학년"
        />
      </div>

      <Transition>
        <div v-if="role === 'main' || role === 'sub'">
          <div>학년반</div>
          <div class="grid grid-cols-3 gap-3">
            <Dropdown
              v-model="grade"
              :options="gradeOptions"
              optionLabel="name"
              optionValue="value"
              :disabled="isNew"
              placeholder="담당 학년"
            />
            <Dropdown
              v-model="group"
              :options="groupOptions"
              optionLabel="name"
              optionValue="value"
              :disabled="isNew"
              placeholder="담당 학급"
            />

            <div class="self-center">
              <Checkbox v-model="isNew" inputId="isNew" :binary="true" />
              <label for="isNew" class="ml-2 text-lg">새친구</label>
            </div>
          </div>
        </div>
      </Transition>

      <Button
        class="mt-5 p-button-warning p-button-rounded"
        label="회원가입"
        :loading="isLoading"
        loadingIcon="pi pi-spinner pi-spin"
        @click="onSubmit"
      />

      <div class="mt-3 flex items-center justify-evenly">
        <span class="text-xl">계정이 있으신가요?</span>
        <RouterLink
          :to="{ name: 'AccountLogin' }"
          class="text-xl text-yellow-500"
        >
          로그인
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TheYoungeunBasic from '@/components/TheYoungeunBasic.vue';

import { computed, reactive, ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';

import {
  churchOptions,
  departmentOptions,
  gradeOptions,
  groupOptions,
  roleOptions,
} from './data';

const account = useAccountStore();
const router = useRouter();

const church = ref('영은교회');
const department = ref('초등부');
const email = ref('');
const password = ref('');
const confirmedPassword = ref('');
const name = ref('');
const role = ref('common');
const grade = ref('3');
const group = ref('1');

const isNew = ref(false);
const isLoading = ref(false);

watch(role, (newVal, oldVal) => {
  if (newVal === 'common' && (oldVal === 'main' || oldVal === 'sub')) {
    grade.value = '-1';
    group.value = '-1';
  } else if ((newVal === 'main' || newVal === 'sub') && oldVal === 'common') {
    grade.value = '3';
    group.value = '1';
    isNew.value = false;
  }
});

watch(isNew, (newVal, oldVal) => {
  if (newVal) {
    grade.value = '0';
    group.value = '0';
  }
});

const rules = computed(() => ({
  email: { required },
  password: { required },
  confirmedPassword: { required },
  name: { required },
}));

const v$ = useVuelidate(rules, {
  email,
  password,
  confirmedPassword,
  name,
});

const error = computed(() => ({
  email: {
    status: v$.value.email.$error,
  },
  password: {
    status: v$.value.password.$error,
  },
  confirmedPassword: {
    status: v$.value.confirmedPassword.$error,
  },
  name: {
    status: v$.value.name.$error,
  },
}));

const onSubmit = async () => {
  try {
    isLoading.value = true;

    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      return;
    }
    console.log(church.value);
    console.log(department.value);
    console.log(email.value);
    console.log(password.value);
    console.log(confirmedPassword.value);
    console.log(name.value);
    console.log(role.value);
    console.log(grade.value);
    console.log(group.value);
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    isLoading.value = false;
  }

  //   try {
  //     // TODO: 초기화 점검하기, 또 추가되거나 깔끔하게 되어야할 로직 살피기
  //     isAllFilled.value = true;
  //     isValidated.value = true;

  //     if (!Object.values(signupForm).every((value) => value)) {
  //       isAllFilled.value = false;
  //       return;
  //     }
  //     if (!isPasswordLongerThanSix.value) {
  //       return;
  //     }
  //     if (!isPasswordSame.value) {
  //       return;
  //     }

  //     isLoading.value = true;

  //     const signupRet = await account.signup(signupForm);
  //     if (!signupRet) {
  //       return;
  //     }
  //     // 회원가입 실패
  //     if (!signupRet.isSuccess) {
  //       throw new Error(signupRet.message);
  //     }
  //     // 회원가입 성공
  //     else if (signupRet.isSuccess) {
  //       await account.createUser({
  //         uid: signupRet.result.user.uid,
  //         ...signupForm,
  //       });
  //       await account.loginAccount({
  //         email: signupForm.email,
  //         password: signupForm.password,
  //       });
  //       router.push({ name: 'HomeView' });
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       isValidated.value = false;
  //       errorMessage.value = error.message;
  //     }
  //   } finally {
  //     isLoading.value = false;
  //   }
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
