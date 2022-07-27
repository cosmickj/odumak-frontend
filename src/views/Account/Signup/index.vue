<template>
  <the-youngeun-basic></the-youngeun-basic>

  <div class="mt-5">
    <form @submit.prevent="onSubmit">
      <div class="mx-7 mb-2">
        <InputText
          v-model="signupForm.email"
          class="w-full"
          type="email"
          placeholder="이메일을 입력하세요."
          required
        />
      </div>

      <div class="mx-7 mb-2">
        <Password
          v-model="signupForm.password"
          class="w-full"
          toggleMask
          :feedback="false"
          placeholder="비밀번호를 입력하세요."
          inputStyle="width:inherit; border-radius:var(--border-radius);"
        />

        <div v-if="!isPasswordLongerThanSix && signupForm.password">
          <span class="text-red-500">비밀번호를 6글자 이상 입력하세요.</span>
        </div>
      </div>

      <div class="mx-7 mb-2">
        <Password
          v-model="signupForm.confirmedPassword"
          class="w-full"
          toggleMask
          :feedback="false"
          placeholder="비밀번호를 다시 한번 입력하세요."
          inputStyle="width:inherit; border-radius:var(--border-radius);"
        />

        <div v-if="!isPasswordSame && signupForm.confirmedPassword">
          <span class="text-red-500">새 비밀번호가 일치하지 않습니다.</span>
        </div>
      </div>

      <div class="mx-7 mb-2">
        <InputText
          v-model="signupForm.name"
          class="w-full"
          type="text"
          placeholder="이름을 입력하세요."
        />
      </div>

      <div class="mx-7 mb-2">
        <div class="flex justify-around items-center">
          <div class="text-xl">담당 학급이 있으신가요?</div>

          <div class="flex items-center">
            <RadioButton
              v-model="signupForm.role"
              name="role"
              id="teacher"
              value="teacher"
            />
            <label class="ml-2 text-xl cursor-pointer" for="teacher">네</label>
          </div>

          <div class="flex items-center">
            <RadioButton
              v-model="signupForm.role"
              name="role"
              id="common"
              value="common"
            />
            <label class="ml-2 text-xl cursor-pointer" for="common">아니요</label>
          </div>
        </div>
      </div>

      <div
        v-if="signupForm.role === 'teacher'"
        class="mx-7 mb-2 flex justify-between items-center"
      >
        <div class="flex-shrink-0 flex items-center" @click="setDisabled(false)">
          <RadioButton
            v-model="signupForm.grade"
            id="third-grade"
            name="grade"
            value="3"
          />
          <label class="ml-2 text-xl cursor-pointer" for="third-grade">3학년</label>
        </div>

        <div class="flex-shrink-0 flex items-center" @click="setDisabled(false)">
          <RadioButton
            v-model="signupForm.grade"
            id="forth-grade"
            name="grade"
            value="4"
          />
          <label class="ml-2 text-xl cursor-pointer" for="forth-grade">4학년</label>
        </div>

        <div class="flex-shrink-0 flex items-center" @click="setDisabled(true)">
          <RadioButton
            v-model="signupForm.grade"
            id="new-face"
            name="grade"
            value="0"
          />
          <label class="ml-2 text-xl cursor-pointer" for="new-face">새친구</label>
        </div>

        <div>
          <Dropdown
            v-model="signupForm.group"
            :options="group"
            optionLabel="name"
            optionValue="value"
            placeholder="학급 선택"
            :disabled="isDisabled"
          />
        </div>
      </div>

      <div class="mx-7 my-3">
        <Button type="submit" class="p-button-warning w-full justify-center">
          <span v-if="!isLoading" class="text-xl">회원가입</span>
          <i
            v-else
            class="pi pi-spin pi-spinner"
            style="font-size: 1.25rem; line-height: 1.75rem"
          ></i>
        </Button>
      </div>

      <div v-if="!isAllFilled" class="mx-7">
        <span class="text-red-500">위 입력사항을 모두 입력해주세요.</span>
      </div>

      <div v-if="!isValidated" class="mx-7">
        <span class="text-red-500">{{ errorMessage }}</span>
      </div>

      <div class="mx-7 mt-8 flex items-center justify-evenly">
        <span class="text-xl">계정이 있으신가요?</span>
        <router-link :to="{ name: 'AccountLogin' }">
          <span class="text-yellow-500 text-xl">로그인</span>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';

import TheYoungeunBasic from '@/components/TheYoungeunBasic.vue';

const account = useAccountStore();
const router = useRouter();

const initSignupForm = {
  church: '영은교회',
  department: '초등부',
  email: '',
  password: '',
  confirmedPassword: '',
  name: '',
  role: 'common',
  grade: '-1',
  group: '-1',
};
const signupForm = reactive({ ...initSignupForm });

const isPasswordLongerThanSix = computed(() => {
  const regex = new RegExp('(?=.{6,})');
  if (regex.test(signupForm.password)) return true;
  else return false;
});
const isPasswordSame = computed(() => {
  if (!signupForm.password && !signupForm.confirmedPassword) return false;
  else if (signupForm.password === signupForm.confirmedPassword) return true;
  else return false;
});

watch(
  () => signupForm.role,
  (newValue) => {
    if (newValue === 'teacher') {
      signupForm.grade = '';
      signupForm.group = '';
    } else {
      signupForm.grade = '-1';
      signupForm.group = '-1';
    }
  }
);

const isLoading = ref(false);
const isAllFilled = ref(true);
const isValidated = ref(true);
const errorMessage = ref('');

const onSubmit = async () => {
  isValidated.value = true; // TODO: 초기화 점검하기, 또 추가되거나 깔끔하게 되어야할 로직 살피기

  if (!Object.values(signupForm).every((value) => value)) {
    isAllFilled.value = false;
    return;
  }
  if (!isPasswordLongerThanSix.value) {
    return;
  }
  if (!isPasswordSame.value) {
    return;
  }

  try {
    isLoading.value = true;
    const signupRet = await account.signup(signupForm);
    if (!signupRet) {
      return;
    }
    // 회원가입 실패
    if (!signupRet.isSuccess) {
      throw new Error(signupRet.message);
    }
    // 회원가입 성공
    else if (signupRet.isSuccess) {
      await account.createUser({
        uid: signupRet.result.user.uid,
        ...signupForm,
      });
      await account.loginAccount({
        email: signupForm.email,
        password: signupForm.password,
      });
      router.push({ name: 'HomeView' });
    }
  } catch (error) {
    if (error instanceof Error) {
      isValidated.value = false;
      errorMessage.value = error.message;
    }
  } finally {
    isAllFilled.value = true;
    isLoading.value = false;
  }
};

const group = [
  { name: '1반', value: '1' },
  { name: '2반', value: '2' },
  { name: '3반', value: '3' },
  { name: '4반', value: '4' },
  { name: '5반', value: '5' },
  { name: '6반', value: '6' },
  { name: '7반', value: '7' },
  { name: '8반', value: '8' },
  { name: '9반', value: '9' },
  { name: '10반', value: '10' },
];

const isDisabled = ref(false);
const setDisabled = (bool: boolean) => {
  if (bool) {
    isDisabled.value = bool;
    signupForm.group = '0';
  } else {
    isDisabled.value = bool;
    signupForm.group = '';
  }
};
</script>
