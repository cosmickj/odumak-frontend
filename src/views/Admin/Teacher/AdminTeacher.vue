<template>
  <AdminDataTable
    :loading="isLoading"
    :data-source="members"
    :data-target="'teacher'"
    :column-state="{ role: true }"
    @add="addMembers"
    @edit="editMember"
    @delete="deleteMembers"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '../_partials/AdminDataTable.vue';

import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useMemberStore } from '@/store/member';
import { useToast } from 'primevue/usetoast';
import type { MemberData } from '@/types';

const userStore = useUserStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const members = ref<MemberData[]>([]);

const fetchMembers = async () => {
  try {
    isLoading.value = true;

    const { church, department } = userStore.userData || {};

    if (church && department) {
      members.value = await memberStore.fetchAll({
        church,
        department,
        job: 'teacher',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await fetchMembers());

const toast = useToast();

const addMembers = async (members: MemberData[]) => {
  try {
    const { church, department } = userStore.userData || {};

    if (church && department) {
      memberStore.createMultiple({ church, department, members });
      await fetchMembers();

      toast.add({
        severity: 'success',
        detail: '추가되었습니다',
        life: 1000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const editMember = async (payload: Required<MemberData>) => {
  try {
    const { uid, ...params } = payload;

    await memberStore.modifySingle({ uid, ...params });
    await fetchMembers();

    toast.add({
      severity: 'info',
      summary: `${params.name}`,
      detail: '수정되었습니다',
      life: 1000,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteMembers = async (members: MemberData[]) => {
  try {
    const uids = members.map((member) => member.uid);

    await memberStore.removeMultiple({ uids });
    await fetchMembers();

    toast.add({
      severity: 'error',
      detail: '삭제되었습니다',
      life: 1000,
    });
  } catch (error) {
    console.log(error);
  }
};
</script>
