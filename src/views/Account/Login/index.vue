<template>
  <section class="flex flex-col px-5 py-8 bg-custom justify-between">
    <div class="text-lg text-center text-[#f5e1da]">
      <h1 class="text-3xl font-bold">오두막</h1>
      <h3>아이들과 가까워지는 곳</h3>
    </div>

    <Image :src="logoTransparent" />

    <div class="flex flex-col gap-3">
      <div
        class="flex gap-2 p-2 rounded bg-[#fee500] items-center justify-center cursor-pointer select-none"
        @click="loginWithKakao"
      >
        <Image id="kakao-login-btn" :src="loginKakao" image-class="w-8" />
        <p class="leading-8 text-lg">카카오톡으로 시작하기</p>
      </div>

      <div
        class="flex gap-2 p-2 rounded bg-[#03c75a] items-center justify-center cursor-pointer select-none"
        @click="loginWithNaver"
      >
        <Image id="naver_id_login" :src="loginNaver" image-class="w-8" />
        <span class="leading-8 text-white text-lg">네이버로 시작하기</span>
      </div>
    </div>

    <!-- <div class="flex flex-col">
      <form class="flex flex-col gap-3" @submit.prevent="loginWithEmail">
        <InputText
          v-model="v$.email.$model"
          id="email"
          class="w-full"
          :class="{ 'p-invalid': v$.email.$invalid && isSubmitted }"
          type="text"
          placeholder="이메일을 입력하세요"
        />
        <p
          v-if="v$.email.$invalid && isSubmitted"
          :class="{ 'p-error': v$.email.$invalid && isSubmitted }"
        >
          이메일을 입력해주세요.
        </p>

        <Password
          toggleMask
          v-model="v$.password.$model"
          id="password"
          class="w-full"
          :class="{ 'p-invalid': v$.password.$invalid && isSubmitted }"
          :feedback="false"
          input-class="w-full"
          placeholder="비밀번호를 입력하세요"
        />
        <p
          v-if="v$.password.$invalid && isSubmitted"
          :class="{ 'p-error': v$.password.$invalid && isSubmitted }"
        >
          비밀번호를 입력해주세요.
        </p>

        <Button
          :loading="isLoading"
          class="p-button-secondary text-lg"
          type="submit"
          label="로그인"
        />
      </form>

      <div class="relative flex flex-col justify-center my-2">
        <div class="h-[1px] bg-slate-300"></div>
        <span class="absolute inset-x-0 w-fit mx-auto px-3 bg-slate-100">
          또는
        </span>
      </div>
    </div> -->

    <!-- <RouterLink
      class="flex p-2 rounded border-2 border-gray-300 items-center justify-center"
      :to="{ name: 'AccountSignup' }"
    >
      이메일 회원가입
    </RouterLink> -->

    <!-- <Dialog
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
            @click="setDialog"
          />
        </RouterLink>
      </template>
    </Dialog> -->
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCookies } from '@vueuse/integrations/useCookies';
// import { useRouter } from 'vue-router';
// import { useAccountStore } from '@/store/account';
// import { useVuelidate } from '@vuelidate/core';
// import { required } from '@vuelidate/validators';

import logoTransparent from '@/assets/images/logo-transparent.png';
import loginKakao from '@/assets/images/login-kakao.png';
import loginNaver from '@/assets/images/login-naver.png';

const cookies = useCookies(['odmk_has_account']);

const isDialogVisible = ref(false);

onMounted(() => {
  if (!cookies.get('odmk_has_account')) {
    setTimeout(() => (isDialogVisible.value = true), 500);
  }

  /*----- Setup Naver -----*/
  const naver_id_login = new window.naver_id_login(
    import.meta.env.VITE_NAVER_CLIENT_ID,
    import.meta.env.VITE_NAVER_CALLBACK_URL
  );
  const state = naver_id_login.getUniqState();
  naver_id_login.setState(state);
  naver_id_login.init_naver_id_login();
});

const loginWithKakao = () => {
  window.Kakao.Auth.authorize({
    redirectUri: import.meta.env.VITE_KAKAO_CALLBACK_URL,
  });
};

const loginWithNaver = () => {
  const id = '#naver_id_login_anchor';
  const target = document.querySelector(id) as HTMLAnchorElement;
  target.click();
};

// const router = useRouter();
// const accountStore = useAccountStore();

// const setDialog = () => {
//   cookies.set('odmk_has_account', true);
//   isDialogVisible.value = false;
// };

// const isLoading = ref(false);
// const isSubmitted = ref(false);

// const errorMessage = ref<string | undefined>('');

// const initLoginState = {
//   email: '',
//   password: '',
// };
// const loginState = reactive({ ...initLoginState });

// const rules = {
//   email: { required },
//   password: { required },
// };

// const v$ = useVuelidate(rules, loginState);

// const handleError = (message: string) => {
//   if (message.includes('auth/auth/user-not-found')) {
//     return '이메일을 다시 확인해주세요.';
//   }
//   if (message.includes('auth/wrong-password')) {
//     return '비밀번호가 다시 확인해주세요.';
//   }
//   if (message.includes('auth/too-many-requests')) {
//     return '로그인 시도 실패로 인해 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다.';
//   }
// };

// const loginWithEmail = async () => {
//   try {
//     isLoading.value = true;
//     isSubmitted.value = true;

//     const isFormValid = await v$.value.$validate();
//     if (!isFormValid) return;

//     await accountStore.login({
//       email: loginState.email.trimEnd(),
//       password: loginState.password.trimEnd(),
//     });

//     router.push({ name: 'HomeView' });
//   } catch (error) {
//     errorMessage.value = handleError((error as Error).message);
//   } finally {
//     isLoading.value = false;
//   }
// };
</script>

<style scoped>
.bg-custom {
  background: linear-gradient(
    300deg,
    #94a3b8 15%,
    #8c93ae 25%,
    #8882a2 45%,
    #867193 65%,
    #855f80 90%,
    #834d6a 100%
  );
}
</style>
