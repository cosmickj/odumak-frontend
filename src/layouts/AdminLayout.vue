<template>
  <main v-if="account.isAuthReady">
    <div class="p-5">
      <div class="flex justify-evenly">
        <router-link
          :to="{ name: 'AdminView', params: { position: 'student' } }"
        >
          <div class="text-3xl cursor-pointer">학생 목록 관리</div>
        </router-link>

        <router-link
          :to="{ name: 'AdminView', params: { position: 'teacher' } }"
        >
          <div class="text-3xl cursor-pointer">교사 목록 관리</div>
        </router-link>
      </div>
    </div>

    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account.js';

const account = useAccountStore();
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  color: #005a34;
  text-decoration: underline;
}
</style>
