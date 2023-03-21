<template>
  <section v-if="accountStore.isAuthReady" class="overflow-auto bg-slate-200">
    <header class="sticky top-0 left-0 px-1 pt-1 bg-slate-100">
      <div class="relative flex items-center justify-between">
        <RouterLink :to="{ name: 'HomeView' }">
          <Button
            icon="pi pi-angle-left"
            class="p-button-text p-button-secondary"
          />
        </RouterLink>

        <p
          class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
        >
          {{ accountStore.accountData?.name }}님의 정보
        </p>

        <RouterLink :to="{ name: 'UserEditView' }">
          <Button class="p-button-text p-button-secondary" label="수정" />
        </RouterLink>
      </div>
    </header>

    <div class="bg-slate-100">
      <div class="flex px-5 py-3 items-center justify-center">
        <Avatar :image="youngeunElementLogo" size="xlarge" shape="circle" />
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <div class="flex">
          <span class="mr-3">이름</span>

          <span v-if="accountStore.accountData?.isAccepted">(승인 완료)</span>
          <span v-else class="text-red-600">(승인 대기)</span>
        </div>

        <span>
          {{ accountStore.accountData?.name }}
        </span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>생년월일</span>
        <span>{{ accountStore.accountData?.birth || '없음' }}</span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>휴대폰 번호</span>
        <span>{{ accountStore.accountData?.phone || '없음' }}</span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>이메일</span>
        <span>{{ accountStore.accountData?.email }}</span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <!-- TODO: CSS 적용하기 -->
        <span>가입 방식</span>
        <span>{{ accountStore.accountData?.provider.toUpperCase() }} 연동</span>
      </div>
    </div>

    <div class="mt-3 bg-slate-100">
      <div class="flex px-5 py-2 font-semibold items-center justify-between">
        <span>소속 정보</span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>교회 이름</span>
        <span :class="{ 'text-gray-400': isNan(church) }">
          {{ church }}
        </span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>봉사 부서</span>
        <span :class="{ 'text-gray-400': isNan(department) }">
          {{ department }}
        </span>
      </div>

      <div class="px-5 py-2">
        <p class="h-[1px] bg-slate-200"></p>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>담임 여부</span>
        <span :class="{ 'text-gray-400': isNan(role) }">
          {{ role }}
        </span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>담당 학년</span>
        <span :class="{ 'text-gray-400': isNan(grade) }">
          {{ grade }}
        </span>
      </div>

      <div class="flex px-5 py-2 items-center justify-between">
        <span>담당 학급</span>
        <span :class="{ 'text-gray-400': isNan(group) }">
          {{ group }}
        </span>
      </div>
    </div>

    <div class="mt-3 bg-slate-100 text-red-500">
      <div
        class="flex px-5 py-2 items-center justify-between cursor-pointer"
        @click="logoutAccount"
      >
        <span>로그아웃</span>
        <i class="pi pi-sign-out"></i>
      </div>
    </div>

    <div class="mt-3 mb-6 bg-slate-100">
      <div
        class="flex px-5 py-2 items-center justify-between cursor-pointer"
        @click="deleteAccount"
      >
        <span>탈퇴하기</span>
        <i class="pi pi-angle-right"></i>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';

import youngeunElementLogo from '@/assets/images/youngeun-element-logo.png';

const router = useRouter();
const accountStore = useAccountStore();

const church = computed(() => {
  const _church = accountStore.accountData?.church;
  if (_church) return _church;
  else return '없음';
});

const department = computed(() => {
  const _department = accountStore.accountData?.department;
  if (_department) return _department;
  else return '없음';
});

const role = computed(() => {
  const _role = accountStore.accountData?.role;
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
  const _grade = accountStore.accountData?.grade;

  if (_grade === 'na') return '없음';
  else if (_grade) return _grade + '학년';
});

const group = computed(() => {
  const _group = accountStore.accountData?.group;

  if (_group === 'na') return '없음';
  else if (_group) return _group + '학급';
});

const isNan = (str: string | undefined) => {
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
