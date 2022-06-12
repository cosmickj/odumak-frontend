<template>
  <div class="account-view" :class="isPopup ? 'account-view--hide' : ''">
    <AppYoungeunBasic />
    <div class="mt-5">
      <form @submit.prevent="onSubmit">
        <div class="mx-7 mb-2">
          <InputText
            v-model="loginForm.email"
            class="w-full border-round"
            id="email"
            type="text"
            placeholder="이메일을 입력하세요"
            required
          ></InputText>
        </div>

        <div class="mx-7 mb-2">
          <InputText
            v-model="loginForm.password"
            class="w-full border-round"
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
          ></InputText>
        </div>

        <div class="mx-7 my-3">
          <Button type="submit" class="p-button-warning w-full justify-content-center">
            <span v-if="!isLoading">로그인</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </Button>
        </div>

        <div v-if="errorMessage" class="mx-7 my-3">
          <span class="text-pink-500">
            이메일 또는 비밀번호를 다시 확인하세요. 등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못
            입력하셨습니다.
          </span>
        </div>

        <div class="mx-7 mt-4 mb-2 flex justify-content-evenly align-items-center">
          <span>계정이 없으신가요?</span>
          <router-link :to="{ name: 'AccountSignup' }">
            <span class="text-yellow-500 font-bold">회원가입</span>
          </router-link>
        </div>
      </form>
    </div>
  </div>

  <div class="popup" :class="isPopup ? 'popup--show' : ''">
    <div class="text-2xl">
      <p>안녕하세요 선생님!</p>
      <p>원할한 출석 관리를 위해</p>
      <p><span>회원가입</span>을 진행해주세요.</p>
    </div>

    <router-link :to="{ name: 'AccountSignup' }" @click="togglePopup">
      <Button label="좋아요" type="button" class="p-button-warning"></Button>
    </router-link>

    <router-link :to="{ name: 'AccountLogin' }" @click="togglePopup">
      <span class="underline text-yellow-600">이미 계정이 있어요</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { VueCookies } from "vue-cookies/types/index";
import AppYoungeunBasic from "@/components/AppYoungeunBasic.vue";

const store = useStore();
const router = useRouter();
const $cookies = inject<VueCookies>("$cookies");

const isPopup = ref(false);

onMounted(() => {
  if (!$cookies?.get("popup_checked")) {
    setTimeout(() => {
      isPopup.value = !isPopup.value;
    }, 1000);
  }
});

const togglePopup = () => {
  $cookies?.set("popup_checked", true);

  isPopup.value = false;
};

const initLoginForm = {
  email: "",
  password: "",
};
const loginForm = reactive({ ...initLoginForm });
const isLoading = ref(false);
const errorMessage = ref(false);

const onSubmit = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = false;
    await store.dispatch("account/login", loginForm);
    router.push({ name: "AppHome" });
  } catch (error: any) {
    isLoading.value = false;
    errorMessage.value = true;
  }
};
</script>

<style scoped>
.popup {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 160px;
  background-color: #fff;
  border: 3px solid var(--yellow-500);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
}
.popup--show {
  top: 50%;
  visibility: visible;
  opacity: 1;
  transition: 0.5s;
}
.account-view--hide {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}
</style>
