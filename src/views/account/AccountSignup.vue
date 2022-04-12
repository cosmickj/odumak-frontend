<template>
  <div class="mt-5">
    <form @submit.prevent="onSubmit">
      <div class="mx-7 mb-2">
        <InputText
          v-model="signupForm.email"
          class="w-full border-round"
          type="email"
          placeholder="이메일을 입력하세요."
          required
        />
      </div>

      <div class="mx-7 mb-2">
        <div>
          <div class="flex overflow-auto">
            <span
              class="border-1 border-400 border-round mr-2 px-2"
              v-for="(email, i) in emails"
              :key="i"
              @click="appendEmail(email)"
            >
              {{ email }}
            </span>
          </div>
        </div>
      </div>

      <div class="mx-7 mb-2">
        <Password
          v-model="signupForm.password"
          class="w-full"
          toggleMask
          placeholder="비밀번호를 입력하세요."
          required
        >
          <template #footer>
            <div class="mt-3">
              영문 대소문자+숫자를 조합하여 8자리 이상 입력하세요.
            </div>
          </template>
        </Password>
      </div>

      <div class="mx-7 mb-2">
        <Password
          v-model="confirmedPassword"
          class="w-full"
          :feedback="false"
          placeholder="비밀번호를 한 번 더 입력하세요."
          required
        />
      </div>

      <div class="mx-7 mb-2">
        <InputText
          v-model="signupForm.name"
          class="w-full border-round"
          type="text"
          placeholder="성함을 입력하세요."
          required
        />
      </div>

      <div
        class="mx-7 mb-2 flex justify-content-between align-items-center text-lg"
      >
        <div class="flex-shrink-0">
          <RadioButton
            v-model="signupForm.grade"
            id="third-grade"
            name="grade"
            value="3"
          />
          <label class="ml-2" for="third-grade">3학년</label>
        </div>

        <div class="flex-shrink-0">
          <RadioButton
            v-model="signupForm.grade"
            id="forth-grade"
            name="grade"
            value="4"
          />
          <label class="ml-2" for="forth-grade">4학년</label>
        </div>

        <div>
          <Dropdown
            v-model="signupForm.group"
            :options="group"
            optionLabel="name"
            optionValue="value"
            placeholder="학급 선택"
          />
        </div>
      </div>

      <div class="mx-7 my-3">
        <Button
          class="p-button-warning w-full"
          label="회원가입"
          type="submit"
        ></Button>
      </div>

      <div
        class="mx-7 mt-4 mb-2 flex justify-content-evenly align-items-center"
      >
        <span>계정이 있으신가요?</span>
        <router-link :to="{ name: 'AccountLogin' }">
          <span class="text-yellow-500 font-bold">로그인</span>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { db } from "@/firebase/config";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
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
const emails = ref([
  "@gmail.com",
  "@naver.com",
  "@hotmail.com",
  "@yahoo.com",
  "@outlook.com",
]);
const confirmedPassword = ref("");

const store = useStore();
const router = useRouter();

const initSignupForm = {
  email: "",
  password: "",
  name: "",
  grade: "3",
  group: "",
};
const signupForm = reactive({ ...initSignupForm });

const appendEmail = (email: string) => {
  const asperand = signupForm.email.indexOf("@");
  if (asperand > -1) {
    const emailHead = signupForm.email.slice(0, asperand);
    signupForm.email = emailHead + email;
  } else {
    signupForm.email = signupForm.email + email;
  }
};

const onSubmit = async () => {
  if (signupForm.password !== confirmedPassword.value) {
    alert("비밀번호가 일치하지 않습니다.");
  } else {
    await store.dispatch("user/signup", signupForm);
    router.push({ name: "LoginPage" });
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

const createUser = async (uid: string) => {
  // await setDoc(doc(db, "users", uid), {
  //   email: form.email,
  //   name: form.name,
  //   createdAt: serverTimestamp(),
  // });
};
</script>

<style>
.p-password > input {
  width: inherit;
  border-radius: var(--border-radius);
}
.p-dropdown {
  width: 80px;
}
</style>
