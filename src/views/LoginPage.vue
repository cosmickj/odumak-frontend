<template>
  <main id="login">
    <div class="login__wrapper">
      <div class="login__container">
        <YoungeunBasic></YoungeunBasic>

        <template v-if="authIsReady">
          <form @submit.prevent="onSubmit">
            <InputText
              v-model="form.eamil"
              class="w-100"
              id="email"
              type="text"
              placeholder="이메일을 입력하세요"
              required
            ></InputText>

            <div class="pt-10">
              <InputText
                v-model="form.password"
                class="w-100"
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              ></InputText>
            </div>

            <div class="pt-20">
              <Button
                label="로그인"
                type="submit"
                class="btn-block p-button-warning p-button-raised"
              ></Button>
            </div>

            <div v-if="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="pt-16 ask-container">
              <span class="fz-12">계정이 없으신가요?</span>
              <router-link to="/signup">
                <span class="fz-12">회원가입</span>
              </router-link>
            </div>
          </form>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import YoungeunBasic from "@/components/YoungeunBasic.vue";

export default defineComponent({
  components: { YoungeunBasic },
  setup() {
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
    return {
      form,
      errorMessage,
      onSubmit,
      authIsReady: computed(() => store.state.user.authIsReady),
    };
  },
});
</script>

<style scoped>
@import url("@/css/views/LoginPage.css");
</style>
