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
        <Button
          class="p-button-warning w-full"
          label="로그인"
          type="submit"
        ></Button>
      </div>

      <div
        class="mx-7 mt-4 mb-2 flex justify-content-evenly align-items-center"
      >
        <span>계정이 없으신가요?</span>
        <router-link :to="{ name: 'SignupPage' }">
          <span class="text-yellow-500 font-bold">회원가입</span>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "vuex";
// import { useRouter } from "vue-router";

const store = useStore();
// const router = useRouter();

const errorMessage = ref(null);
const initLoginForm = {
  email: "",
  password: "",
};
const loginForm = reactive({ ...initLoginForm });

const onSubmit = async () => {
  try {
    await store.dispatch("user/login", loginForm);
    // router.push("/main");
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped></style>
