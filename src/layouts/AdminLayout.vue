<template>
  <router-view v-if="account.isAuthReady" />
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/account.js';

const account = useAccountStore();
</script>
