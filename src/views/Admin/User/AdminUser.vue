<template>
  <AdminUserDataTable
    :loading="loading"
    :users="users"
    v-model:users-selection="usersSelection"
  />
</template>

<script setup lang="ts">
import AdminUserDataTable from './AdminUserDataTable.vue';

import { onMounted, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useUserStore } from '@/store/user';
import type { UserData } from '@/types';

const accountStore = useAccountStore();
const userStore = useUserStore();

const loading = ref(true);
const users = ref<UserData[]>([]);
const usersSelection = ref<UserData[]>([]);

const fetchUsers = async () => {
  if (!accountStore.accountData) {
    return;
  }

  users.value = await userStore.fetchMultipleByChurchAndDepartment({
    church: accountStore.accountData.church,
    department: accountStore.accountData.department,
  });
};

onMounted(async () => {
  try {
    loading.value = true;

    await fetchUsers();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
