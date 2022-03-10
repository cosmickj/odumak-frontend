<template>
  <div id="signup">
    <div class="signup__wrapper">
      <div class="signup__container">
        <YoungeunBasic></YoungeunBasic>

        <!-- <div class="title fz-16">당신의 섬김에 감사합니다.</div> -->
        <form @submit.prevent="signupUser">
          <InputText
            v-model="form.name"
            class="w-100"
            type="text"
            placeholder="이름"
          ></InputText>

          <div class="pt-10">
            <InputText
              v-model="form.email"
              class="w-100"
              type="email"
              placeholder="이메일"
            ></InputText>
          </div>

          <div class="pt-10">
            <InputText
              v-model="form.password"
              class="w-100"
              type="password"
              placeholder="비밀번호"
            ></InputText>
          </div>

          <div class="pt-10">
            <InputText
              v-model="form.confirmPassword"
              class="w-100"
              type="password"
              placeholder="비밀번호 확인"
            ></InputText>
          </div>

          <div class="pt-20">
            <Button
              class="btn-block p-button-warning p-button-raised"
              label="회원가입"
              type="submit"
            ></Button>
          </div>

          <div class="pt-16 ask-container">
            <span class="fz-12">계정이 있으신가요?</span>
            <router-link to="/login">
              <span class="fz-12">로그인</span>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usersCol } from "@/firebase/config";
import { addDoc, serverTimestamp } from "@firebase/firestore";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import YoungeunBasic from "@/components/YoungeunBasic.vue";

export default defineComponent({
  components: { YoungeunBasic },
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({
      email: null,
      password: null,
      confirmPassword: null,
      name: null,
    });
    const signupUser = async () => {
      try {
        await store.dispatch("signup", {
          email: form.value.email,
          password: form.value.password,
        });
        addUser();
      } catch (error) {
        console.log(error);
      }
    };
    const addUser = () => {
      addDoc(usersCol, {
        email: form.value.email,
        name: form.value.name,
        createdAt: serverTimestamp(),
      }).then(() => {
        router.push("/main");
      });
    };
    return {
      form,
      signupUser,
    };
  },
});
</script>

<style scoped>
@import url("@/css/views/SignupPage.css");
</style>
