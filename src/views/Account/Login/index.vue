<template>
  <section class="flex flex-col pt-20 text-xs">
    <h1 class="mb-3 px-7 text-xl">아이들과 가까워지는 시간</h1>
    <p class="mb-8 px-7">오늘도 여러분의 섬김에 감사합니다</p>

    <form @submit.prevent="loginWithEmail">
      <div class="mx-7 mb-2">
        <InputText
          v-model="loginForm.email"
          class="w-full p-inputtext-sm"
          id="email"
          type="text"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div class="mx-7 mb-2">
        <Password
          v-model="loginForm.password"
          class="w-full p-inputtext-sm"
          id="password"
          placeholder="비밀번호를 입력하세요"
          inputStyle="width:inherit;"
          :feedback="false"
          toggleMask
        />
      </div>

      <!-- 로그인 버튼 -->
      <div class="mx-7 my-3">
        <Button
          class="w-full p-button-warning p-button-sm"
          label="로그인"
          :loading="isLoading"
          loadingIcon="pi pi-spinner pi-spin"
          type="submit"
        />
      </div>

      <div v-if="isError" class="mx-7 my-3">
        <span class="text-red-500">
          이메일 또는 비밀번호를 다시 확인하세요. 등록되지 않은 이메일이거나,
          이메일 또는 비밀번호를 잘못 입력하셨습니다.
        </span>
      </div>

      <div class="mx-7 mt-8 flex justify-evenly items-center">
        <span>계정이 없으신가요?</span>
        <router-link :to="{ name: 'AccountSignup' }">
          <span class="text-yellow-500">회원가입</span>
        </router-link>
      </div>
    </form>

    <div class="relative flex flex-col justify-center px-7 my-12">
      <div class="separator bg-slate-300"></div>
      <span class="absolute inset-x-0 w-fit mx-auto px-3 bg-slate-100">
        또는
      </span>
    </div>

    <div class="flex justify-center">
      <img
        class="mx-4 cursor-pointer oauth-btn"
        :src="loginKakao"
        alt="카카오 로그인"
      />
      <img
        id="naver_id_login"
        class="mx-4 cursor-pointer oauth-btn"
        :src="loginNaver"
        alt="네이버 로그인"
        @click="loginWithNaver"
      />
    </div>

    <Teleport to="#modal">
      <Transition name="modal">
        <div
          v-if="isModalOpen"
          class="absolute inset-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div ref="modal" class="bg-white rounded-lg shadow-lg">
            <div class="px-28 py-10">
              <p>원할한 출석 관리를 위해</p>
              <p><span>회원가입</span>을 진행해주세요.</p>
            </div>

            <div class="flex items-center justify-end px-10 pb-5">
              <router-link :to="{ name: 'AccountLogin' }" @click="closeModal">
                <Button
                  label="이미 계정이 있어요"
                  class="p-button-text p-button-plain"
                />
              </router-link>

              <router-link :to="{ name: 'AccountSignup' }">
                <Button label="좋아요" type="button" class="p-button-warning" />
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue';
import loginKakao from '@/assets/images/login-kakao.png';
import loginNaver from '@/assets/images/login-naver.png';

import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import type { VueCookies } from 'vue-cookies/types/index';

const router = useRouter();
const account = useAccountStore();
const $cookies = inject<VueCookies>('$cookies');

const isModalOpen = ref(false);

onMounted(() => {
  // if (!$cookies?.get('has_account')) {
  //   setTimeout(() => (isModalOpen.value = true), 800);
  // }

  const naver_id_login = new window.naver_id_login(
    import.meta.env.VITE_NAVER_CLIENT_ID,
    import.meta.env.VITE_NAVER_CALLBACK_URL
  );
  var state = naver_id_login.getUniqState();
  naver_id_login.setState(state);
  naver_id_login.init_naver_id_login();
});

const closeModal = () => {
  $cookies?.set('has_account', true, '14d');
  isModalOpen.value = false;
};

const isLoading = ref(false);
const isError = ref(false);

const initLoginForm = {
  email: '',
  password: '',
};
const loginForm = reactive({ ...initLoginForm });

const loginWithEmail = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    await account.login({
      email: loginForm.email.trimEnd(),
      password: loginForm.password.trimEnd(),
    });
    router.push({ name: 'HomeView' });
  } catch (error) {
    isLoading.value = false;
    isError.value = true;
  }
};

const loginWithNaver = () => {
  const id = '#naver_id_login_anchor';
  const target = document.querySelector(id) as HTMLAnchorElement;
  target.click();
};
</script>

<style scoped>
.separator {
  height: 1px;
}
.oauth-btn {
  max-width: 48px;
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
