<template>
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
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

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

<style scoped></style>
