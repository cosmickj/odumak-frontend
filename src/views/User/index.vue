<template>
  <section v-if="userStore.isAuthReady" class="overflow-auto bg-slate-200">
    <AppHeader :header="`${userStore.userData?.name}님의 정보`" route-name="HomeView" />

    <div class="mt-2 bg-slate-100">
      <div class="flex flex-col items-center gap-2 px-4 py-3 text-xs">
        <Avatar :image="userStore.userData?.profileImage || odumakLogo" size="xlarge" shape="circle" />

        <span v-if="userStore.userData?.isAccepted">승인 완료</span>
        <span v-else class="text-red-600">승인 대기</span>
      </div>

      <div class="flex items-center justify-between px-4 py-2">
        <span class="mr-3">이름</span>

        <span>{{ userStore.userData?.name }}</span>
      </div>

      <!-- <div class="flex px-4 py-2 items-center justify-between">
        <span>생년월일</span>
        <span>{{ userStore.userData?.birth || '없음' }}</span>
      </div> -->

      <!-- <div class="flex px-4 py-2 items-center justify-between">
        <span>휴대폰 번호</span>
        <span>{{ userStore.userData?.phone || '없음' }}</span>
      </div> -->

      <div class="flex items-center justify-between px-4 py-2">
        <span>이메일</span>
        <span>{{ userStore.userData?.email }}</span>
      </div>

      <div class="flex items-center justify-between px-4 py-2">
        <span>가입 방식</span>
        <span
          v-if="userStore.userData?.provider === 'naver'"
          class="rounded bg-[#2db400] px-2 py-1 text-sm uppercase text-white"
        >
          {{ userStore.userData?.provider }} 연동
        </span>

        <span
          v-else-if="userStore.userData?.provider === 'kakao'"
          class="rounded bg-[#fee500] px-2 py-1 text-sm uppercase text-black"
        >
          {{ userStore.userData?.provider }} 연동
        </span>
      </div>
    </div>

    <div class="mt-3 bg-slate-100">
      <div class="flex items-center justify-between px-4 py-2 font-semibold">
        <span>소속 정보</span>
      </div>

      <div class="flex items-center justify-between px-4 py-2">
        <span>교회 이름</span>
        <span :class="{ 'text-gray-400': isNan(church) }">
          {{ church }}
        </span>
      </div>

      <div class="flex items-center justify-between px-4 py-2">
        <span>봉사 부서</span>
        <span :class="{ 'text-gray-400': isNan(department) }">
          {{ department }}
        </span>
      </div>

      <div class="px-4 py-2">
        <p class="h-[1px] bg-slate-200"></p>
      </div>

      <div class="flex items-center justify-between px-4 py-2">
        <span>담임 여부</span>
        <Tag
          :value="formatTeacher(userData?.role.teacher)"
          :style="`background: ${formatTeacherColor(userData?.role.teacher)}`"
        />
      </div>

      <template v-if="userData?.role.teacher !== 'common'">
        <div class="flex items-center justify-between px-4 py-2">
          <span>담당 학년</span>
          <span :class="{ 'text-gray-400': isNan(grade) }">
            {{ grade }}
          </span>
        </div>

        <div class="flex items-center justify-between px-4 py-2">
          <span>담당 학급</span>
          <span :class="{ 'text-gray-400': isNan(group) }">
            {{ group }}
          </span>
        </div>
      </template>
    </div>

    <div class="mt-3 bg-slate-100 text-red-500">
      <div class="flex cursor-pointer items-center justify-between px-4 py-2" @click="logoutUser">
        <span>로그아웃</span>
        <i class="pi pi-sign-out"></i>
      </div>
    </div>

    <div class="mb-6 mt-3 bg-slate-100">
      <div class="flex items-center justify-between px-4 py-2">
        <span>탈퇴하기</span>
        <i class="pi pi-angle-right cursor-pointer" @click="deleteUser"></i>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { formatTeacher, formatTeacherColor } from '@/utils/useFormat';
import { NAN_TEXT } from '@/constants/common';
import AppHeader from '@/components/AppHeader.vue';
import odumakLogo from '@/assets/images/logo-transparent.png';

const router = useRouter();
const userStore = useUserStore();

const userData = computed(() => userStore.userData);

const church = computed(() => {
  return userData.value?.church ? userData.value?.church : NAN_TEXT;
});

const department = computed(() => {
  return userData.value?.department ? userData.value?.department : NAN_TEXT;
});

const grade = computed(() => {
  return userData.value?.grade ? userData.value?.grade + '학년' : NAN_TEXT;
});

const group = computed(() => {
  return userData.value?.group ? userData.value?.group + '학급' : NAN_TEXT;
});

const isNan = (txt: string | undefined) => {
  return txt === NAN_TEXT ? true : false;
};

const logoutUser = async () => {
  try {
    if (confirm('로그아웃 하시겠습니까?')) {
      await userStore.logout();
      router.push({ name: 'LoginView' });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async () => {
  try {
    if (confirm('정말로 탈퇴하시겠습니까?')) {
      await userStore.deleteSingle();
      router.push({ name: 'LoginView' });
    }
  } catch (error) {
    alert('다시 로그인 후 시도해주세요.');
  }
};
</script>
