<template>
  <section class="flex flex-col justify-center">
    <TheYoungeunBasic />

    <div class="mt-5">
      <form @submit.prevent="onSubmit">
        <div class="mx-7 mb-2">
          <InputText
            v-model="loginForm.email"
            class="w-full"
            id="email"
            type="text"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div class="mx-7 mb-2">
          <InputText
            v-model="loginForm.password"
            class="w-full"
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <!-- 로그인 버튼 -->
        <div class="mx-7 my-3">
          <Button type="submit" class="p-button-warning w-full justify-center">
            <span v-if="!isLoading" class="text-xl">로그인</span>
            <i
              v-else
              class="pi pi-spin pi-spinner"
              style="font-size: 1.25rem; line-height: 1.75rem"
            ></i>
          </Button>
        </div>

        <div v-if="isError" class="mx-7 my-3">
          <span class="text-red-500">
            이메일 또는 비밀번호를 다시 확인하세요. 등록되지 않은 이메일이거나,
            이메일 또는 비밀번호를 잘못 입력하셨습니다.
          </span>
        </div>

        <div class="mx-7 mt-8 flex justify-evenly items-center">
          <span class="text-xl">계정이 없으신가요?</span>
          <router-link :to="{ name: 'AccountSignup' }">
            <span class="text-yellow-500 text-xl">회원가입</span>
          </router-link>
        </div>
      </form>
    </div>

    <Teleport to="#modal">
      <Transition name="modal">
        <div
          v-if="isModalOpen"
          class="absolute inset-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div ref="modal" class="bg-white rounded-lg shadow-lg">
            <div class="text-2xl px-28 py-10">
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
import TheYoungeunBasic from '@/components/TheYoungeunBasic.vue';

import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import type { VueCookies } from 'vue-cookies/types/index';

const router = useRouter();
const account = useAccountStore();
const $cookies = inject<VueCookies>('$cookies');

const isModalOpen = ref(false);

onMounted(() => {
  if (!$cookies?.get('has_account')) {
    setTimeout(() => (isModalOpen.value = true), 800);
  }
});

const closeModal = () => {
  $cookies?.set('has_account', true, '14d');
  isModalOpen.value = false;
};

const initLoginForm = {
  email: '',
  password: '',
};
const loginForm = reactive({ ...initLoginForm });
const isLoading = ref(false);
const isError = ref(false);

const onSubmit = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    await account.loginAccount({
      email: loginForm.email.trimEnd(),
      password: loginForm.password.trimEnd(),
    });
    router.push({ name: 'HomeView' });
  } catch (error) {
    isLoading.value = false;
    isError.value = true;
  }
};
</script>

<style scoped>
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
