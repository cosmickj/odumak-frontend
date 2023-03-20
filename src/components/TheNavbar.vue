<template>
  <div class="flex bg-white rounded-t-xl items-center justify-evenly">
    <TheNavbarItem icon="pi pi-home" route-name="HomeView" />

    <TheNavbarItem
      icon="pi pi-plus"
      route-name="AttendanceChecker"
      :important="true"
    />

    <TheNavbarItem
      :class="coachMarkClass"
      icon="pi pi-user"
      route-name="UserView"
    />

    <TheCoachMark :is-visible="isCoachMarkVisible" @close="closeCoachMark">
      <Card class="relative mb-24 bg-white w-5/6">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-xl">추가 정보 입력 필요</span>

            <Button
              icon="pi pi-times"
              class="p-button-text p-button-secondary p-button-sm"
              @click="closeCoachMark"
            />
          </div>
        </template>

        <template #content>
          <div class="text-lg break-keep">
            출석 입력을 위해 필요한
            <span class="text-yellow-500">추가 정보를 입력</span>해주세요.
          </div>
        </template>
      </Card>
    </TheCoachMark>
  </div>
</template>

<script setup lang="ts">
import TheCoachMark from '@/components/TheCoachMark.vue';
import TheNavbarItem from '@/components/TheNavbarItem.vue';

import { computed, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useAccountStore } from '@/store/account';

const cookies = useCookies(['odmk_notice_later']);
const { accountData } = useAccountStore();

const isClosed = ref(cookies.get('odmk_notice_later') || false);

const isCoachMarkVisible = computed(() => {
  if (isClosed.value) {
    return false;
  }
  if (!accountData) {
    return false;
  }
  if (
    !accountData.church ||
    !accountData.department ||
    !accountData.grade ||
    !accountData.group
  ) {
    return true;
  }
  return false;
});

const coachMarkClass = computed(() => {
  if (isCoachMarkVisible.value) {
    return 'z-10 bg-opacity-90 bg-white rounded-full shadow-[0_0_1px_12px_rgba(255,255,255,0.3),0_0_1px_22px_rgba(255,255,255,0.1)]';
  }
  return null;
});

const closeCoachMark = () => {
  isClosed.value = true;
};

onBeforeRouteLeave((to) => {
  if (to.name === 'UserView') {
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    cookies.set('odmk_notice_later', true, {
      expires,
    });

    closeCoachMark();
  }
});
</script>

<style scoped>
.p-component.p-card::after {
  position: absolute;
  right: 10%;
  content: '';
  border-top: 10px solid white;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-bottom: 0 solid transparent;
}
</style>
