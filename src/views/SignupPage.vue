<template>
  <div id="signup" class="min-h-screen flex flex-column justify-content-center">
    <div class="flex justify-content-center">
      <div class="flex flex-column">
        <YoungeunBasic></YoungeunBasic>

        <form @submit.prevent="onSubmit">
          <div class="pb-1">
            <InputText
              v-model="signupForm.email"
              class="w-full"
              type="email"
              placeholder="이메일을 입력하세요."
            />
            <div class="flex w-30rem overflow-x-auto pt-1 pb-1">
              <div class="bg-white border-round p-1 mr-2" @click="appendEmail">
                <span>@gmail.com</span>
              </div>
              <p class="bg-white border-round p-1 mr-2">@naver.com</p>
              <p class="bg-white border-round p-1 mr-2">@hotmail.com</p>
              <p class="bg-white border-round p-1 mr-2">@yahoo.com</p>
              <p class="bg-white border-round p-1 mr-2">@outlook.com</p>
            </div>
          </div>

          <div class="pb-1">
            <Password
              v-model="signupForm.password"
              class="w-full"
              toggleMask
              placeholder="비밀번호를 입력하세요."
            >
              <template #footer>
                <div class="mt-3">
                  영문 대소문자+숫자를 조합하여 8자리 이상 입력하세요.
                </div>
              </template>
            </Password>
          </div>

          <div class="pb-1">
            <Password
              v-model="signupForm.confirmedPassword"
              class="w-full"
              :feedback="false"
              placeholder="비밀번호를 한 번 더 입력하세요."
            />
          </div>

          <div class="pb-1">
            <InputText
              v-model="signupForm.name"
              class="w-full"
              type="text"
              placeholder="이름을 입력하세요."
            />
          </div>

          <div class="flex pb-2">
            <div class="w-full flex justify-content-evenly">
              <div class="flex align-items-center pr-2">
                <RadioButton
                  v-model="signupForm.grade"
                  id="third-grade"
                  name="grade"
                  value="3"
                />
                <label for="third-grade">3학년</label>
              </div>

              <div class="flex align-items-center pr-2">
                <RadioButton
                  v-model="signupForm.grade"
                  id="forth-grade"
                  name="grade"
                  value="4"
                />
                <label for="forth-grade">4학년</label>
              </div>
            </div>

            <div class="w-full">
              <Dropdown
                class="w-full"
                v-model="signupForm.group"
                :options="group"
                optionLabel="name"
                optionValue="value"
                placeholder="담당 학급을 선택하세요."
              />
            </div>
          </div>

          <Button
            class="p-button-warning p-button-raised w-full"
            label="회원가입"
            type="submit"
          ></Button>

          <div class="flex justify-content-evenly align-items-center pt-3">
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
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { db } from "@/firebase/config";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import YoungeunBasic from "@/components/YoungeunBasic.vue";
import RadioButton from "primevue/radiobutton";
import Dropdown from "primevue/dropdown";
import Password from "primevue/password";

const group = ref([
  { name: "1반", value: "1" },
  { name: "2반", value: "2" },
  { name: "3반", value: "3" },
  { name: "4반", value: "4" },
  { name: "5반", value: "5" },
  { name: "6반", value: "6" },
  { name: "7반", value: "7" },
  { name: "8반", value: "8" },
  { name: "9반", value: "9" },
  { name: "10반", value: "10" },
]);

const store = useStore();
const router = useRouter();
const initSignupForm = {
  email: "",
  password: "",
  confirmedPassword: "",
  name: "",
  grade: "3",
  group: "",
};
const signupForm = reactive({ ...initSignupForm });

const appendEmail = () => {
  signupForm.email = signupForm.email + "@hello.com";
};

const createUser = async (uid: string) => {
  // await setDoc(doc(db, "users", uid), {
  //   email: form.email,
  //   name: form.name,
  //   createdAt: serverTimestamp(),
  // });
};

const onSubmit = async () => {
  if (signupForm.password !== signupForm.confirmedPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    signupForm.password = "";
    signupForm.confirmedPassword = "";
  }

  // try {
  //   const uid = await store.dispatch("user/signup", {
  //     email: form.email,
  //     password: form.password,
  //   });
  //   await createUser(uid);
  //   router.push("/login");
  // } catch (error) {
  //   console.log(error);
  // }
};
</script>

<style>
.p-password > input {
  width: inherit;
}
</style>
