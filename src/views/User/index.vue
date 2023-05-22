<template>
  <section v-if="userStore.isAuthReady" class="overflow-auto bg-slate-200">
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
          {{ userStore.userData?.name }}님의 정보
        </p>

        <!-- <RouterLink :to="{ name: 'UserEditView' }">
          <Button class="p-button-text p-button-secondary" label="수정" />
        </RouterLink> -->
      </div>
    </header>

    <div class="bg-slate-100">
      <div class="flex flex-col gap-2 px-4 py-3 items-center text-xs">
        <Avatar
          :image="userStore.userData?.profileImage || youngeunElementLogo"
          size="xlarge"
          shape="circle"
        />

        <span v-if="userStore.userData?.isAccepted">승인 완료</span>
        <span v-else class="text-red-600">승인 대기</span>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
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

      <div class="flex px-4 py-2 items-center justify-between">
        <span>이메일</span>
        <span>{{ userStore.userData?.email }}</span>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
        <span>가입 방식</span>
        <span
          v-if="userStore.userData?.provider === 'naver'"
          class="px-2 py-1 bg-[#2db400] text-white uppercase text-sm rounded"
        >
          {{ userStore.userData?.provider }} 연동
        </span>

        <span
          v-else-if="userStore.userData?.provider === 'kakao'"
          class="px-2 py-1 bg-[#fee500] text-black uppercase text-sm rounded"
        >
          {{ userStore.userData?.provider }} 연동
        </span>
      </div>
    </div>

    <div class="mt-3 bg-slate-100">
      <div class="flex px-4 py-2 font-semibold items-center justify-between">
        <span>소속 정보</span>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
        <span>교회 이름</span>
        <span :class="{ 'text-gray-400': isNan(church) }">
          {{ church }}
        </span>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
        <span>봉사 부서</span>
        <span :class="{ 'text-gray-400': isNan(department) }">
          {{ department }}
        </span>
      </div>

      <div class="px-4 py-2">
        <p class="h-[1px] bg-slate-200"></p>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
        <span>담임 여부</span>
        <span :class="{ 'text-gray-400': isNan(role) }">
          {{ role }}
        </span>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
        <span>담당 학년</span>
        <span :class="{ 'text-gray-400': isNan(grade) }">
          {{ grade }}
        </span>
      </div>

      <div class="flex px-4 py-2 items-center justify-between">
        <span>담당 학급</span>
        <span :class="{ 'text-gray-400': isNan(group) }">
          {{ group }}
        </span>
      </div>
    </div>

    <div class="mt-3 bg-slate-100 text-red-500">
      <div
        class="flex px-4 py-2 items-center justify-between cursor-pointer"
        @click="logoutUser"
      >
        <span>로그아웃</span>
        <i class="pi pi-sign-out"></i>
      </div>
    </div>

    <div class="mt-3 mb-6 bg-slate-100">
      <div class="flex px-4 py-2 items-center justify-between">
        <span>탈퇴하기</span>
        <i class="pi pi-angle-right cursor-pointer" @click="deleteUser"></i>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

import youngeunElementLogo from '@/assets/images/youngeun-element-logo.png';

const router = useRouter();
const userStore = useUserStore();

const church = computed(() => {
  const _church = userStore.userData?.church;
  if (_church) return _church;
  else return '없음';
});

const department = computed(() => {
  const _department = userStore.userData?.department;
  if (_department) return _department;
  else return '없음';
});

const role = computed(() => {
  const _role = userStore.userData?.role;
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
  const _grade = userStore.userData?.grade;

  if (_grade === 'na') return '없음';
  else if (_grade) return _grade + '학년';
});

const group = computed(() => {
  const _group = userStore.userData?.group;

  if (_group === 'na') return '없음';
  else if (_group) return _group + '학급';
});

const isNan = (str: string | undefined) => {
  if (str === '없음') return true;
  else return false;
};

const logoutUser = async () => {
  try {
    if (confirm('로그아웃 하시겠습니까?')) {
      await userStore.logout();
      router.push({ name: 'AccountLogin' });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async () => {
  try {
    if (confirm('정말로 탈퇴하시겠습니까?')) {
      await userStore.deleteSingle();
      router.push({ name: 'AccountLogin' });
    }
  } catch (error) {
    alert('다시 로그인 후 시도해주세요.');
  }
};
</script>
