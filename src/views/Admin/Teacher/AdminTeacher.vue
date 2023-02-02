<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="teacherList"
    :selection="selectedTeacherList.body"
    @add="openDialogToAddTeacher"
    @edit="openDialogToEditTeacher"
    @delete="openDialogToDeleteTeacherList"
    @toggle="fetchSelectedTeacherList"
  />

  <AdminDialogAddEdit
    :dialog="addEditDialog"
    :errors="errors"
    :student-list="selectedTeacherList.body"
    @add-row="addSelectedTeacher"
    @copy-row="copySelectedTeacher"
    @delete-row="deleteSelectedTeacher"
    @hide="resetSelectedTeacherList"
    @submit="submitSelectedTeacherList"
  />

  <AdminDialogDelete
    :dialog="deleteDialog"
    :selected-student-list="selectedTeacherList.body"
    @cancel="deleteDialog.isShow = false"
    @confirm="deleteTeacherList"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '@/views/Admin/AdminDataTable.vue';
import AdminDialogAddEdit from '../AdminDialogAddEdit.vue';
import AdminDialogDelete from '../AdminDialogDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { formatRole } from '@/utils/useFormat';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import type { Dialog, DialogLabel, MemberData } from '@/types';
import type { Timestamp } from '@firebase/firestore';

const accountStore = useAccountStore();
const accountData = computed(() => accountStore.accountData!);

const memberStore = useMemberStore();

const isLoading = ref(false);
const teacherList = ref<MemberData[]>([]);

onMounted(async () => await getTeacherList());

const getTeacherList = async () => {
  try {
    isLoading.value = true;

    teacherList.value = await memberStore.fetchAll({
      church: accountData.value.church,
      department: accountData.value.department,
      job: 'teacher',
    });

    teacherList.value.forEach((teacher) => {
      teacher.birth = (teacher.birth as Timestamp).toDate();
      teacher.registeredAt = (teacher.registeredAt as Timestamp).toDate();
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const initSelectedTeacher: MemberData = {
  name: '',
  birth: new Date(`${new Date().getFullYear() - 10 + 1}-01-01`),
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

const selectedTeacherList = reactive({ body: [] as MemberData[] });

const fetchSelectedTeacherList = (payload: MemberData[]) => {
  selectedTeacherList.body = payload.map((d) => createNewTeacher(d));
};

const resetSelectedTeacherList = () => {
  selectedTeacherList.body.splice(0, selectedTeacherList.body.length);
  addEditDialog.isShow = false;
  v.value.$reset();
};

const createNewTeacher = (obj: MemberData) => Object.assign({}, obj);

const addEditDialog = reactive<Dialog>({
  isShow: false,
  label: '추가하기',
});

// || 생성하기 or 수정하기
const openDialogToAddTeacher = () => {
  addEditDialog.isShow = true;
  addEditDialog.label = '추가하기';
  addSelectedTeacher();
};

const addSelectedTeacher = () => {
  const newStudent = createNewTeacher(initSelectedTeacher);
  selectedTeacherList.body.push(newStudent);
};

const copySelectedTeacher = (index: number) => {
  const targetStudent = selectedTeacherList.body[index];
  const newStudent = createNewTeacher(targetStudent);
  selectedTeacherList.body.push(newStudent);
};

const deleteSelectedTeacher = (index: number) => {
  if (selectedTeacherList.body.length > 1) {
    selectedTeacherList.body.splice(index, 1);
  }
};

const openDialogToEditTeacher = () => {
  if (selectedTeacherList.body.length > 0) {
    addEditDialog.isShow = true;
    addEditDialog.label = '수정하기';
  }
};

const submitSelectedTeacherList = async (dialogLabel: DialogLabel) => {
  try {
    const isFormCorrect = await v.value.body.$validate();
    if (!isFormCorrect) {
      return;
    }

    if (dialogLabel === '추가하기') {
      addSelectedTeacherList();
    } else if (dialogLabel === '수정하기') {
      editSelectedTeacherList();
    }

    resetSelectedTeacherList();
    await getTeacherList();
  } catch (error) {
    console.log(error);
  }
};

const addSelectedTeacherList = () => {
  try {
    memberStore.createMultiple({
      church: accountData.value.church,
      department: accountData.value.department,
      members: selectedTeacherList.body,
    });

    alert('추가되었습니다.');
  } catch (error) {
    console.log(error);
  }
};

const editSelectedTeacherList = () => {
  try {
    memberStore.modifyMultiple({
      members: selectedTeacherList.body,
    });

    alert('수정되었습니다.');
  } catch (error) {
    console.log(error);
  }
};

// || 삭제하기
const deleteDialog = reactive<Dialog>({
  isShow: false,
  label: '삭제하기',
});

const openDialogToDeleteTeacherList = () => {
  deleteDialog.isShow = true;
};

const deleteTeacherList = async () => {
  try {
    const uids = selectedTeacherList.body.map((student) => student.uid);
    memberStore.removeMultiple({ uids });

    deleteDialog.isShow = false;
    await getTeacherList();
  } catch (error) {
    console.log(error);
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

const v = useVuelidate(rules, selectedTeacherList);

const errors = computed(() => v.value.$errors[0]?.$response?.$errors);
</script>
