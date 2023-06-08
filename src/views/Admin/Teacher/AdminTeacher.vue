<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="members"
    :selection="selectedMembers.body"
    :column-state="{ role: true }"
    @add="openDialogToAddTeacher"
    @edit="editMember"
    @delete="toggleIsDialogDeleteVisible"
    @select="addSelectedMembers"
  />

  <AdminDialogAdd
    :is-dialog-visible="isDialogAddVisible"
    :members="newMembers.body"
    :errors="errors"
    @add="addNewMember"
    @copy="copyNewMember"
    @delete="deleteNewMember"
    @submit="submitNewMembers"
    @close="resetNewMembers"
  />

  <AdminDialogDelete
    :is-dialog-visible="isDialogDeleteVisible"
    :selected-students="selectedMembers.body"
    @cancel="isDialogDeleteVisible = false"
    @confirm="deleteMembers"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '../_partials/AdminDataTable.vue';
import AdminDialogAdd from '../_partials/AdminDialogAdd.vue';
import AdminDialogDelete from '../_partials/AdminDialogDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useMemberStore } from '@/store/member';
import type { MemberData } from '@/types';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const members = ref<MemberData[]>([]);

const getMembers = async () => {
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

const initSelectedMember: MemberData = {
  name: '',
  birth: null,
  birthLater: true,
  gender: 'male',
  church: '',
  department: '',
  job: 'teacher',
  role: 'common',
  grade: '',
  group: '',
  isNewFriendClass: false,
  registeredAt: new Date(),
  remark: '',
};

const selectedMembers = reactive({ body: [] as MemberData[] });

const createNewMember = (obj: MemberData) => Object.assign({}, obj);

const addSelectedMembers = (payload: MemberData[]) => {
  selectedMembers.body = payload.map((d) => createNewMember(d));
};

const isDialogAddVisible = ref(false);

const openDialogToAddTeacher = () => {
  isDialogAddVisible.value = true;
  addNewMember();
};

const newMembers = reactive({ body: [] as MemberData[] });

const addNewMember = () => {
  newMembers.body.push(createNewMember(initSelectedMember));
};

const copyNewMember = (index: number) => {
  newMembers.body.push(createNewMember(newMembers.body[index]));
};

const deleteNewMember = (index: number) => {
  if (newMembers.body.length > 1) {
    newMembers.body.splice(index, 1);
  } else {
    alert('더 이상 삭제할 수 없습니다.');
  }
};

const rules = {
  body: {
    $each: helpers.forEach({
      name: { required },
      grade: { required },
      group: { required },
    }),
  },
};

const $v = useVuelidate(rules, selectedMembers);

const errors = computed(() => $v.value.$errors[0]?.$response?.$errors);

const resetNewMembers = () => {
  isDialogAddVisible.value = false;
  newMembers.body = [];
  $v.value.$reset();
};

const createNewMembers = () => {
  try {
    const { church, department } = userStore.userData || {};

    if (church && department) {
      memberStore.createMultiple({
        church,
        department,
        members: newMembers.body,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const submitNewMembers = async () => {
  try {
    const isFormCorrect = await $v.value.body.$validate();
    if (!isFormCorrect) return;

    createNewMembers();
    resetNewMembers();
    await getMembers();
  } catch (error) {
    console.log(error);
  }
};

const toast = useToast();

const editMember = async (payload: Required<MemberData>) => {
  try {
    const { uid, ...params } = payload;

    await memberStore.modifySingle({ uid, ...params });
    await getMembers();

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

const isDialogDeleteVisible = ref(false);

const toggleIsDialogDeleteVisible = () => {
  isDialogDeleteVisible.value = !isDialogDeleteVisible.value;
};

const deleteMembers = async () => {
  try {
    const uids = selectedMembers.body.map((student) => student.uid);
    memberStore.removeMultiple({ uids });

    toggleIsDialogDeleteVisible();
    await getMembers();
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => await getMembers());
</script>
