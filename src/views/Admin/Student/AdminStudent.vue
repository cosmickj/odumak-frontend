<template>
  <AdminDataTable
    :loading="isLoading"
    :data-source="members"
    :data-target="'student'"
    :column-state="{ birth: true }"
    @add="addStudents"
    @edit="editStudent"
    @delete="deleteStudents"
  />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import type { Member } from '@/models';
import { useMemberStore } from '@/store/member';
import { useUserStore } from '@/store/user';
import AdminDataTable from '../_partials/AdminDataTable.vue';

const userStore = useUserStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const members = ref<Member[]>([]);

const fetchStudents = async () => {
  try {
    isLoading.value = true;

    const { church, department } = userStore.userData || {};

    if (church && department) {
      members.value = await memberStore.fetchAll({
        church,
        department,
        job: 'student',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await fetchStudents());

const toast = useToast();

const addStudents = async (members: Member[]) => {
  try {
    const { church, department } = userStore.userData || {};

    if (church && department) {
      memberStore.createMultiple({ church, department, members });
      await fetchStudents();

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

const editStudent = async (payload: Required<Member>) => {
  try {
    const { uid, ...params } = payload;

    await memberStore.modifySingle({ uid, ...params });
    await fetchStudents();

    toast.add({
      severity: 'success',
      summary: `${params.name}`,
      detail: '수정되었습니다',
      life: 1000,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteStudents = async (members: Member[]) => {
  try {
    const uids = members.map((member) => member.uid);

    await memberStore.removeMultiple({ uids });
    await fetchStudents();

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
