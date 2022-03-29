<template>
  <div id="signup">
    <div class="signup__wrapper">
      <div class="signup__container">
        <YoungeunBasic></YoungeunBasic>

        <form @submit.prevent="onSubmit">
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
              v-model="form.confirmedPassword"
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
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { db } from "@/firebase/config";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import YoungeunBasic from "@/components/YoungeunBasic.vue";

export default defineComponent({
  components: { YoungeunBasic },
  setup() {
    const store = useStore();
    const router = useRouter();
    const initialForm = {
      email: "",
      password: "",
      confirmedPassword: "",
      name: "",
    };
    const form = reactive({ ...initialForm });
    const createUser = async (uid: string) => {
      await setDoc(doc(db, "users", uid), {
        email: form.email,
        name: form.name,
        createdAt: serverTimestamp(),
      });
    };
    const onSubmit = async () => {
      try {
        const uid = await store.dispatch("user/signup", {
          email: form.email,
          password: form.password,
        });
        await createUser(uid);
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    };
    return {
      form,
      onSubmit,
    };
  },
});
</script>

<style scoped>
@import url("@/css/views/SignupPage.css");
</style>
