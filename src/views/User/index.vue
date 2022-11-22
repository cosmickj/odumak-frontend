<template>
  <div v-if="accountStore.isAuthReady" class="grow overflow-hidden text-2xl">
    <!-- 기본 정보 -->
    <div class="bg-slate-50">
      <div
        class="sticky top-0 left-0 flex px-8 py-4 bg-slate-50 items-center justify-between font-semibold"
      >
        <span
          class="flex min-w-[24px] aspect-square items-center justify-center cursor-pointer before:block before:w-3 before:aspect-square before:border-l-2 before:border-b-2 before:border-black before:rotate-45"
          @click="router.push({ name: 'HomeView' })"
        ></span>
        <span>{{ accountStore.userData?.displayName }}님의 정보</span>
        <span
          class="flex min-w-[24px] aspect-square items-center justify-center cursor-pointer"
          @click="router.push({ name: 'UserEditView' })"
        >
          수정
        </span>
      </div>
      <!-- TODO: 추후에 사진도 넣어보자 -->
      <div class="flex px-8 py-4 items-center justify-between">
        <span>이름</span>
        <span>{{ accountStore.userData?.displayName }}</span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>생년월일</span>
        <span>(todo) 1995.12.13</span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>휴대폰 번호</span>
        <span>(todo) 010-7636-8084</span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>이메일</span>
        <span>{{ accountStore.userData?.email }}</span>
      </div>
    </div>

    <!-- 교회 정보 -->
    <div class="mt-6 bg-slate-50">
      <div class="flex px-8 py-4 font-semibold items-center justify-between">
        <span>교회 정보</span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>교회 이름</span>
        <span :class="{ 'text-gray-400': isNan(church) }">
          {{ church }}
        </span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>봉사 부서</span>
        <span :class="{ 'text-gray-400': isNan(department) }">
          {{ department }}
        </span>
      </div>
      <div class="px-8 py-2">
        <p class="h-[1px] bg-slate-200"></p>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>담임 여부</span>
        <span :class="{ 'text-gray-400': isNan(role) }">
          {{ role }}
        </span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>담당 학년</span>
        <span :class="{ 'text-gray-400': isNan(grade) }">
          {{ grade }}
        </span>
      </div>
      <div class="flex px-8 py-4 items-center justify-between">
        <span>담당 학급</span>
        <span :class="{ 'text-gray-400': isNan(group) }">
          {{ group }}
        </span>
      </div>
    </div>

    <div class="mt-6 bg-slate-50 text-red-500">
      <div
        class="flex px-8 py-4 items-center justify-between cursor-pointer"
        @click="logoutAccount"
      >
        <span>로그아웃</span>
        <i class="pi pi-sign-out text-2xl"></i>
      </div>
    </div>

    <div class="my-8 text-xs">
      <div class="flex px-8 py-4 items-center justify-center">
        <span
          class="underline underline-offset-2 cursor-pointer"
          @click="deleteAccount"
        >
          계정을 삭제하시겠습니까?
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { computed } from 'vue';

const router = useRouter();
const accountStore = useAccountStore();

const church = computed(() => {
  const _church = accountStore.userData?.church;
  if (_church) return _church;
  else return '없음';
});

const department = computed(() => {
  const _department = accountStore.userData?.department;
  if (_department) return _department;
  else return '없음';
});

const role = computed(() => {
  const _role = accountStore.userData?.role;
  if (_role === 'admin') {
    return '관리자';
  } else if (_role === 'main') {
    return '담임';
  } else if (_role === 'sub') {
    return '부담임';
  } else if (_role === 'common') {
    return '일반';
  } else {
    return '없음';
  }
});

const grade = computed(() => {
  const _grade = accountStore.userData?.grade;
  if (_grade) return _grade + '학년';
  else return '없음';
});

const group = computed(() => {
  const _group = accountStore.userData?.group;
  if (_group) return _group + '학급';
  else return '없음';
});

const isNan = (str: string) => {
  if (str === '없음') return true;
  else return false;
};

const logoutAccount = async () => {
  try {
    if (confirm('로그아웃 하시겠습니까?')) {
      await accountStore.logout();
      router.push({ name: 'AccountLogin' });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteAccount = async () => {
  try {
    if (confirm('정말로 탈퇴하시겠습니까?')) {
      await accountStore.delete();
      router.push({ name: 'AccountLogin' });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
