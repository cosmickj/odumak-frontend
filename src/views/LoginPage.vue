<template>
  <main id="login" class="min-h-screen flex flex-column justify-content-center">
    <div class="flex justify-content-center">
      <div class="flex flex-column">
        <YoungeunBasic></YoungeunBasic>

        <template v-if="authIsReady">
          <form @submit.prevent="onSubmit">
            <InputText
              v-model="form.eamil"
              class="w-full"
              id="email"
              type="text"
              placeholder="이메일을 입력하세요"
              required
            ></InputText>

            <div>
              <InputText
                v-model="form.password"
                class="w-full"
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              ></InputText>
            </div>

            <div>
              <Button
                label="로그인"
                type="submit"
                class="p-button-warning p-button-raised w-full"
              ></Button>
            </div>

            <div v-if="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="flex justify-content-evenly align-items-center">
              <span>계정이 없으신가요?</span>
              <router-link to="/signup">
                <span>회원가입</span>
              </router-link>
            </div>
          </form>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import YoungeunBasic from "@/components/YoungeunBasic.vue";

const store = useStore();
const router = useRouter();
const form = ref({
  eamil: null,
  password: null,
});
const errorMessage = ref(null);
const onSubmit = async () => {
  try {
    await store.dispatch("user/login", {
      email: form.value.eamil,
      password: form.value.password,
    });
    router.push("/main");
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};
const authIsReady = computed(() => store.state.user.authIsReady);
</script>

<style scoped></style>
