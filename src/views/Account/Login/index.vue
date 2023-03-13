<template>
  <section class="flex flex-col pt-14 px-5 text-lg text-center">
    <h1 class="mb-3 text-2xl font-bold">오두막</h1>
    <p class="mb-8">아이들과 가까워지는 시간</p>

    <div class="flex flex-col justify-between">
      <div class="flex flex-col gap-3">
        <div
          class="flex gap-2 p-1 rounded bg-[#03C75A] items-center justify-center cursor-pointer select-none"
          @click="loginWithNaver"
        >
          <Image id="naver_id_login" :src="naver" alt="" image-class="w-8" />
          <span class="leading-8 text-white">네이버로 로그인</span>
        </div>

        <div
          class="flex gap-2 p-1 rounded bg-gray-200 items-center justify-center cursor-pointer select-none"
        >
          <span class="leading-8">이메일로 로그인</span>
        </div>
      </div>

      <div>
        <div
          class="flex gap-2 p-1 rounded bg-gray-200 items-center justify-center cursor-pointer select-none"
        >
          <span class="leading-8">이메일 회원가입</span>
        </div>
      </div>
    </div>
    <!-- <form @submit.prevent="loginWithEmail">
      <div class="mx-5 mb-2">
        <InputText
          autofocus
          v-model="v$.email.$model"
          id="email"
          class="w-full p-inputtext-sm"
          :class="{ 'p-invalid': v$.email.$invalid && isSubmitted }"
          type="text"
          placeholder="이메일을 입력하세요"
        />
        <p
          v-if="v$.email.$invalid && isSubmitted"
          class="mt-1"
          :class="{ 'p-error': v$.email.$invalid && isSubmitted }"
        >
          이메일을 입력해주세요.
        </p>
      </div>

      <div class="mx-5 mb-2">
        <Password
          toggleMask
          v-model="v$.password.$model"
          id="password"
          class="w-full p-inputtext-sm"
          :class="{ 'p-invalid': v$.password.$invalid && isSubmitted }"
          :feedback="false"
          inputStyle="width:inherit;"
          placeholder="비밀번호를 입력하세요"
        />
        <p
          v-if="v$.password.$invalid && isSubmitted"
          class="mt-1"
          :class="{ 'p-error': v$.password.$invalid && isSubmitted }"
        >
          비밀번호를 입력해주세요.
        </p>
      </div>

      <div class="mx-5 my-3">
        <Button
          class="w-full p-button-secondary p-button-sm"
          label="로그인"
          :loading="isLoading"
          loadingIcon="pi pi-spinner pi-spin"
          type="submit"
        />
      </div>

      <div v-if="errorMessage" class="mx-5 my-3">
        <span class="p-error">{{ errorMessage }}</span>
      </div>

      <div class="mx-5 mt-8 flex justify-evenly items-center">
        <span>계정이 없으신가요?</span>
        <RouterLink class="text-yellow-500" :to="{ name: 'AccountSignup' }">
          회원가입
        </RouterLink>
      </div>
    </form>

    <div class="relative flex flex-col justify-center px-5 my-12">
      <div class="h-[1px] bg-slate-300"></div>
      <span class="absolute inset-x-0 w-fit mx-auto px-3 bg-slate-100">
        또는
      </span>
    </div>

    <div class="flex justify-center">
      <img
        class="mx-4 cursor-pointer max-w-[48px]"
        alt="카카오 로그인"
        :src="loginKakao"
      />
      <img
        id="naver_id_login"
        class="mx-4 cursor-pointer max-w-[48px]"
        alt="네이버 로그인"
        :src="loginNaver"
        @click="loginWithNaver"
      />
    </div> -->

    <Dialog
      modal
      header="회원가입 안내"
      v-model:visible="isDialogVisible"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
    >
      <p>원할한 출석 관리를 위해 회원가입을 진행해주세요.</p>

      <template #footer>
        <Button
          class="p-button-text"
          label="이미 계정 있어요"
          @click="setDialog"
        />

        <RouterLink :to="{ name: 'AccountSignup' }">
          <Button
            class="p-button-info"
            label="좋아요"
            icon="pi pi-check"
            autofocus
          />
        </RouterLink>
      </template>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import loginKakao from '@/assets/images/login-kakao.png';
import loginNaver from '@/assets/images/login-naver.png';

import naver from '@/assets/images/naver-login-icon.png';

const cookies = useCookies(['has_account']);
const router = useRouter();
const accountStore = useAccountStore();

const isDialogVisible = ref(false);

const setDialog = () => {
  cookies.set('has_account', true);
  isDialogVisible.value = false;
};

onMounted(() => {
  if (!cookies.get('has_account')) {
    setTimeout(() => (isDialogVisible.value = true), 500);
  }

  const naver_id_login = new window.naver_id_login(
    import.meta.env.VITE_NAVER_CLIENT_ID,
    import.meta.env.VITE_NAVER_CALLBACK_URL
  );
  const state = naver_id_login.getUniqState();
  naver_id_login.setState(state);
  naver_id_login.init_naver_id_login();
});

const isLoading = ref(false);
const isSubmitted = ref(false);

const errorMessage = ref<string | undefined>('');

const initLoginState = {
  email: '',
  password: '',
};
const loginState = reactive({ ...initLoginState });

const rules = {
  email: { required },
  password: { required },
};

const v$ = useVuelidate(rules, loginState);

const handleError = (message: string) => {
  if (message.includes('auth/auth/user-not-found')) {
    return '이메일을 다시 확인해주세요.';
  }
  if (message.includes('auth/wrong-password')) {
    return '비밀번호가 다시 확인해주세요.';
  }
  if (message.includes('auth/too-many-requests')) {
    return '로그인 시도 실패로 인해 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다.';
  }
};

const loginWithEmail = async () => {
  try {
    isLoading.value = true;
    isSubmitted.value = true;

    const isFormValid = await v$.value.$validate();
    if (!isFormValid) return;

    await accountStore.login({
      email: loginState.email.trimEnd(),
      password: loginState.password.trimEnd(),
    });

    router.push({ name: 'HomeView' });
  } catch (error) {
    errorMessage.value = handleError((error as Error).message);
  } finally {
    isLoading.value = false;
  }
};

const loginWithNaver = () => {
  const id = '#naver_id_login_anchor';
  const target = document.querySelector(id) as HTMLAnchorElement;
  target.click();
};
</script>
