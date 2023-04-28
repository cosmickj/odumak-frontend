<template>
  <section class="overflow-auto flex flex-col px-5 py-8 justify-between">
    <div>
      <div class="relative mb-5 text-2xl text-end">
        <RouterLink :to="{ name: 'AccountLogin' }">
          <Button text rounded severity="secondary" icon="pi pi-times" />
        </RouterLink>

        <h1
          class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
        >
          회원가입
        </h1>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2 text-sm">
          <p class="text-lg">회원 정보</p>

          <InputText
            v-model="name"
            class="w-full"
            :class="{ 'p-invalid': error.name.status }"
            type="text"
            placeholder="이름을 입력하세요."
          />
          <div v-if="error.name.status" class="p-error">
            {{ error.name.message }}
          </div>

          <InputText
            v-model="email"
            class="w-full"
            :class="{ 'p-invalid': error.email.status }"
            placeholder="이메일을 입력하세요."
            type="email"
            required
          />
          <div v-if="error.email.status" class="p-error">
            {{ error.email.message }}
          </div>

          <Password
            v-model="password"
            class="w-full"
            :class="{ 'p-invalid': error.password.status }"
            input-class="w-full"
            placeholder="비밀번호를 입력하세요."
            :feedback="false"
            toggleMask
          />
          <div v-if="error.password.status" class="p-error">
            {{ error.password.message }}
          </div>

          <Password
            v-model="confirmedPassword"
            class="w-full"
            :class="{ 'p-invalid': error.confirmedPassword.status }"
            input-class="w-full"
            placeholder="비밀번호를 한 번 더 입력하세요."
            :feedback="false"
            toggleMask
          />
          <div v-if="error.confirmedPassword.status" class="p-error">
            {{ error.confirmedPassword.message }}
          </div>
        </div>

        <div class="flex flex-col gap-2 text-sm">
          <p class="text-lg">교회 및 부서 정보</p>
          <Dropdown
            class="w-full"
            v-model="church"
            :options="churchOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="교회 선택"
            :disabled="true"
          />

          <Dropdown
            class="w-full"
            v-model="department"
            :options="departmentOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="소속 선택"
            :disabled="true"
          />

          <SelectButton
            v-model="role"
            class="grid grid-cols-3"
            :unselectable="false"
            :options="roleOptions"
            optionLabel="name"
            optionValue="value"
            placeholder="담당 학년"
          />

          <Transition>
            <div v-if="role === 'main' || role === 'sub'">
              <div class="grid grid-cols-3 gap-2">
                <Dropdown
                  v-model="grade"
                  :options="gradeOptions"
                  optionLabel="name"
                  optionValue="value"
                  :disabled="isNewGroup"
                  placeholder="담당 학년"
                />
                <Dropdown
                  v-model="group"
                  :options="groupOptions"
                  optionLabel="name"
                  optionValue="value"
                  :disabled="isNewGroup"
                  placeholder="담당 학급"
                />

                <div class="self-center">
                  <Checkbox
                    v-model="isNewGroup"
                    inputId="isNew"
                    :binary="true"
                  />
                  <label for="isNew" class="ml-2 text-sm">새친구 학급</label>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div>
      <Button
        :loading="isLoading"
        class="w-full p-button-warning"
        label="제출하기"
        @click="onSubmit"
      />
      <div v-if="isError" class="p-error">{{ errorMessage }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
// import { useAccountStore } from '@/store/account';
import { useUserStore } from '@/store/user';

import useVuelidate from '@vuelidate/core';
import { helpers, required, sameAs, minLength } from '@vuelidate/validators';

import {
  churchOptions,
  departmentOptions,
  gradeOptions,
  groupOptions,
  roleOptions,
} from './data';
import type { UserRole } from '@/types';

const router = useRouter();

// const accountStore = useAccountStore();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const confirmedPassword = ref('');

const name = ref('');
const church = ref('영은교회');
const department = ref('초등부');
const grade = ref('na');
const group = ref('na');
const role = ref<UserRole>('common');

const isNewGroup = ref(false);

watch(role, (newVal, oldVal) => {
  if (newVal === 'common' && (oldVal === 'main' || oldVal === 'sub')) {
    grade.value = 'na';
    group.value = 'na';
  } else if ((newVal === 'main' || newVal === 'sub') && oldVal === 'common') {
    grade.value = '3';
    group.value = '1';
    isNewGroup.value = false;
  }
});

watch(isNewGroup, (newVal) => {
  if (newVal) {
    grade.value = '0';
    group.value = '0';
  } else {
    grade.value = '3';
    group.value = '1';
  }
});

const rules = computed(() => ({
  email: { required: helpers.withMessage('이메일을 입력해주세요.', required) },
  password: {
    required: helpers.withMessage('비밀번호를 입력해주세요.', required),
    minLength: helpers.withMessage(
      '최소 6글자 이상 입력해주세요.',
      minLength(6)
    ),
  },
  confirmedPassword: {
    required: helpers.withMessage(
      '확인을 위해 비밀번호를 다시 한 번 입력해주세요.',
      required
    ),
    sameAs: helpers.withMessage(
      '비밀번호가 일치하지 않습니다.',
      sameAs(password.value)
    ),
  },
  name: {
    required: helpers.withMessage('이름을 입력해주세요.', required),
  },
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
    message: v$.value.email.$errors[0]?.$message,
  },
  password: {
    status: v$.value.password.$error,
    message: v$.value.password.$errors[0]?.$message,
  },
  confirmedPassword: {
    status: v$.value.confirmedPassword.$error,
    message: v$.value.confirmedPassword.$errors[0]?.$message,
  },
  name: {
    status: v$.value.name.$error,
    message: v$.value.name.$errors[0]?.$message,
  },
}));

const isLoading = ref(false);

const isError = ref(false);
const errorMessage = ref('');

const onSubmit = async () => {
  try {
    isLoading.value = true;

    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;

    // const signupResult = await accountStore.signup({
    //   email: email.value,
    //   password: password.value,
    //   name: name.value,
    // });

    // if (!signupResult.isSuccess) {
    //   isError.value = true;
    //   errorMessage.value = signupResult.message;
    // } else {
    //   await userStore.createSingle({
    //     uid: signupResult.result.user.uid,
    //     provider: 'email',
    //     profileImage: null,
    //     name: name.value,
    //     birth: null,
    //     church: church.value,
    //     department: department.value,
    //     grade: grade.value,
    //     group: group.value,
    //     role: role.value,
    //     phone: null,
    //     isAccepted: false,
    //     isRejected: false,
    //     rejectedReason: '',
    //   });

    //   await accountStore.login({
    //     email: email.value,
    //     password: password.value,
    //   });

    //   router.push({ name: 'HomeView' });
    // }
  } catch (error) {
    console.log((error as Error).message);
  } finally {
    isLoading.value = false;
  }
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
