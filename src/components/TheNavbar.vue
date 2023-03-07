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

    <TheCoachMark :is-visible="isCoachMarkVisible" @close="closeCoachMark" />
  </div>
</template>

<script setup lang="ts">
import TheCoachMark from '@/components/TheCoachMark.vue';
import TheNavbarItem from '@/components/TheNavbarItem.vue';

import { computed, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useAccountStore } from '@/store/account';

const cookies = useCookies(['notice_later']);
const { accountData } = useAccountStore();

const isClosed = ref(cookies.get('notice_later') || false);

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

    cookies.set('notice_later', true, {
      expires,
    });

    closeCoachMark();
  }
});
</script>
