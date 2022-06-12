<template>
  <AppYoungeunBasic />
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

      <div class="mx-7 mb-2">
        <Password
          v-model="signupForm.password"
          class="w-full"
          toggleMask
          :feedback="false"
          placeholder="비밀번호를 입력하세요."
          inputStyle="width:inherit; border-radius:var(--border-radius);"
        />

        <div v-if="!isPasswordLongerThanSix && signupForm.password">
          <span class="text-pink-500">비밀번호를 6글자 이상 입력하세요.</span>
        </div>
      </div>

      <div class="mx-7 mb-2">
        <Password
          v-model="signupForm.confirmedPassword"
          class="w-full"
          toggleMask
          :feedback="false"
          placeholder="비밀번호를 다시 한번 입력하세요."
          inputStyle="width:inherit; border-radius:var(--border-radius);"
        />

        <div v-if="!isPasswordSame && signupForm.confirmedPassword">
          <span class="text-pink-500">새 비밀번호가 일치하지 않습니다.</span>
        </div>
      </div>

      <div class="mx-7 mb-2">
        <InputText
          v-model="signupForm.name"
          class="w-full border-round"
          type="text"
          placeholder="이름을 입력하세요."
        />
      </div>

      <div class="mx-7 mb-2">
        <div class="flex justify-content-around align-items-center">
          <div>담당 학급이 있으신가요?</div>

          <div class="flex align-items-center">
            <RadioButton v-model="signupForm.role" name="role" id="teacher" value="teacher" />
            <label class="ml-2" for="teacher">네</label>
          </div>

          <div class="flex align-items-center">
            <RadioButton v-model="signupForm.role" name="role" id="common" value="common" />
            <label class="ml-2" for="common">아니요</label>
          </div>
        </div>
      </div>

      <template v-if="signupForm.role === 'teacher'">
        <div class="mx-7 mb-2 flex justify-content-between align-items-center">
          <div class="flex-shrink-0 flex align-items-center">
            <RadioButton v-model="signupForm.grade" id="third-grade" name="grade" value="3" />
            <label class="ml-2" for="third-grade">3학년</label>
          </div>

          <div class="flex-shrink-0 flex align-items-center">
            <RadioButton v-model="signupForm.grade" id="forth-grade" name="grade" value="4" />
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
      </template>

      <div class="mx-7 my-3">
        <Button type="submit" class="p-button-warning w-full justify-content-center">
          <span v-if="!isLoading">회원가입</span>
          <i v-else class="pi pi-spin pi-spinner"></i>
        </Button>
      </div>

      <div v-if="!isAllFilled" class="mx-7">
        <span class="text-pink-500">위 입력사항을 모두 입력해주세요.</span>
      </div>

      <div class="mx-7 mt-4 mb-2 flex justify-content-evenly align-items-center">
        <span>계정이 있으신가요?</span>
        <router-link :to="{ name: 'AccountLogin' }">
          <span class="text-yellow-500 font-bold">로그인</span>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AppYoungeunBasic from "@/components/AppYoungeunBasic.vue";
import RadioButton from "primevue/radiobutton";
import Dropdown from "primevue/dropdown";
import Password from "primevue/password";

const store = useStore();
const router = useRouter();

const initSignupForm = {
  email: "",
  password: "",
  confirmedPassword: "",
  name: "",
  role: "common",
  grade: "n/a",
  group: "n/a",
};
const signupForm = reactive({ ...initSignupForm });

const isPasswordLongerThanSix = computed(() => {
  const regex = new RegExp("(?=.{6,})");
  if (regex.test(signupForm.password)) return true;
  else return false;
});
const isPasswordSame = computed(() => {
  if (!signupForm.password && !signupForm.confirmedPassword) return false;
  else if (signupForm.password === signupForm.confirmedPassword) return true;
  else return false;
});

watch(
  () => signupForm.role,
  (newValue) => {
    if (newValue === "teacher") {
      signupForm.grade = "";
      signupForm.group = "";
    } else {
      signupForm.grade = "n/a";
      signupForm.group = "n/a";
    }
  }
);

const isLoading = ref(false);
const isAllFilled = ref(true);

const onSubmit = async () => {
  if (!Object.values(signupForm).every((value) => value)) {
    isAllFilled.value = false;
    return;
  }

  if (!isPasswordLongerThanSix.value) {
    return;
  }

  if (!isPasswordSame.value) {
    return;
  }

  try {
    isLoading.value = true;

    const signupResult = await store.dispatch("account/signup", signupForm);

    await store.dispatch("account/createUser", { uid: signupResult.user.uid, ...signupForm });

    await store.dispatch("account/login", { email: signupForm.email, password: signupForm.password });

    router.push({ name: "AppHome" });
  } catch (error) {
    isAllFilled.value = true;
    isLoading.value = false;
    console.log(error);
  }
};

const group = [
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
];
const emails = ["@gmail.com", "@naver.com", "@hotmail.com", "@yahoo.com", "@outlook.com"];

const appendEmail = (email: string) => {
  const asperand = signupForm.email.indexOf("@");
  if (asperand > -1) {
    const emailHead = signupForm.email.slice(0, asperand);
    signupForm.email = emailHead + email;
  } else {
    signupForm.email = signupForm.email + email;
  }
};
</script>

<style>
.p-dropdown {
  width: 80px;
}
</style>
