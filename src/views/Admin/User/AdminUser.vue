<template>
  <AdminUserDataTable
    :loading="loading"
    :users="users"
    v-model:users-selection="usersSelection"
    @accept="acceptUsers"
    @reject="rejectUsers"
  />
</template>

<script setup lang="ts">
import AdminUserDataTable from './AdminUserDataTable.vue';

import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user';
import type { UserData } from '@/types';

const userStore = useUserStore();

const loading = ref(true);
const users = ref<UserData[]>([]);
const usersSelection = ref<UserData[]>([]);

const fetchUsers = async () => {
  if (!userStore.userData) {
    return;
  }

  users.value = await userStore.fetchMultipleByChurchAndDepartment({
    church: userStore.userData.church!,
    department: userStore.userData.department!,
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

const acceptUsers = () => {
  usersSelection.value.forEach(async (user) => {
    if (user.uid) {
      await userStore.modifySingle({
        uid: user.uid,
        keyName: 'isAccepted',
        keyValue: true,
      });
    }
  });
};

const rejectUsers = () => {
  usersSelection.value.forEach(async (user) => {
    if (user.uid) {
      await userStore.modifySingle({
        uid: user.uid,
        keyName: 'isRejected',
        keyValue: true,
      });
    }
  });
};
</script>

<style scoped></style>
