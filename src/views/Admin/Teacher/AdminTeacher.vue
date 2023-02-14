<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="members"
    :selection="selectedMembers.body"
    @add="openDialogToAddTeacher"
    @edit="editSelectedMember"
    @delete="toggleIsDialogDeleteVisible"
    @toggle="addSelectedMembers"
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
import AdminDataTable from '@/views/Admin/AdminDataTable.vue';
import AdminDialogAdd from '../AdminDialogAdd.vue';
import AdminDialogDelete from '../AdminDialogDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import { useToast } from 'primevue/usetoast';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import type { MemberData } from '@/types';

const accountStore = useAccountStore();
const accountData = computed(() => accountStore.accountData!);

const memberStore = useMemberStore();

const isLoading = ref(false);
const members = ref<MemberData[]>([]);

const getMembers = async () => {
  try {
    isLoading.value = true;
    members.value = await memberStore.fetchAll({
      church: accountData.value.church,
      department: accountData.value.department,
      job: 'teacher',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const initSelectedMember: MemberData = {
  name: '',
  birth: new Date(),
  gender: 'male',
  church: '',
  department: '',
  job: 'teacher',
  grade: '',
  group: '',
  phone: '',
  address: '',
  registeredAt: new Date(),
  remark: '',
  attendances: [],
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

const _v = useVuelidate(rules, selectedMembers);

const errors = computed(() => _v.value.$errors[0]?.$response?.$errors);

const resetNewMembers = () => {
  isDialogAddVisible.value = false;
  newMembers.body = [];
  _v.value.$reset();
};

const createNewMembers = () => {
  try {
    memberStore.createMultiple({
      church: accountData.value.church,
      department: accountData.value.department,
      members: newMembers.body,
    });
  } catch (error) {
    console.log(error);
  }
};

const submitNewMembers = async () => {
  try {
    const isFormCorrect = await _v.value.body.$validate();
    if (!isFormCorrect) return;

    createNewMembers();
    resetNewMembers();
    await getMembers();
  } catch (error) {
    console.log(error);
  }
};

const toast = useToast();

const editSelectedMember = async (payload: DataTableCellEditCompleteEvent) => {
  try {
    const { data, newData, field, newValue } = payload;

    if (JSON.stringify(data) !== JSON.stringify(newData)) {
      await memberStore.modifySingle({
        uid: data.uid,
        field: field,
        value: newValue,
      });

      await getMembers();

      toast.add({
        severity: 'success',
        summary: `${data.name}`,
        detail: '수정되었습니다',
        life: 2000,
      });
    }
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
