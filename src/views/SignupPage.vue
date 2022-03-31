<template>
  <div id="signup" class="min-h-screen flex flex-column justify-content-center">
    <div class="flex justify-content-center">
      <div class="flex flex-column">
        <YoungeunBasic></YoungeunBasic>

        <form @submit.prevent="onSubmit">
          <InputText
            v-model="form.name"
            class="w-full"
            type="text"
            placeholder="이름"
          ></InputText>

          <div>
            <InputText
              v-model="form.email"
              class="w-full"
              type="email"
              placeholder="이메일"
            ></InputText>
          </div>

          <div>
            <InputText
              v-model="form.password"
              class="w-full"
              type="password"
              placeholder="비밀번호"
            ></InputText>
          </div>

          <div>
            <InputText
              v-model="form.confirmedPassword"
              class="w-full"
              type="password"
              placeholder="비밀번호 확인"
            ></InputText>
          </div>

          <div>
            <Button
              class="p-button-warning p-button-raised w-full"
              label="회원가입"
              type="submit"
            ></Button>
          </div>

          <div class="flex justify-content-evenly align-items-center">
            <span>계정이 있으신가요?</span>
            <router-link to="/login">
              <span>로그인</span>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { db } from "@/firebase/config";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import YoungeunBasic from "@/components/YoungeunBasic.vue";

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
</script>

<style scoped></style>
