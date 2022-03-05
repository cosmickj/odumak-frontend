<template>
  <div id="login">
    <div class="login__wrapper">
      <div class="login__container">
        <div class="title">당신의 섬김에 감사합니다.</div>
        <form @submit.prevent="onSubmit">
          <div class="pt-20">
            <InputText
              v-model="form.eamil"
              class="w-100"
              id="email"
              type="text"
              placeholder="이메일을 입력하세요"
              required
            ></InputText>
          </div>

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
            <span>아직 계정이 없으신가요?</span>
            <router-link to="/signup"><span>회원가입</span></router-link>
          </div>
        </form>
        <!-- <div class="tree__wrapper">
          <span>Tree will be in here</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
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
        await store.dispatch("login", {
          email: form.value.eamil,
          password: form.value.password,
        });
        router.push("/main");
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      form,
      errorMessage,
      onSubmit,
    };
  },
});
</script>

<style scoped>
#login {
  height: 100%;
}
.login__wrapper {
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.login__container {
  max-width: 500px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--container-padding);
}
.title {
  font-size: 1.2rem;
  color: var(--color-text-white);
}
.p-float-label input:focus ~ label {
  color: yellow;
  top: -1rem;
}
.ask-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.tree__wrapper {
  border: 1px solid orange;
  flex-grow: 1;
}
</style>
