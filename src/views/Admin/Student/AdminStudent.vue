<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="studentList"
    :selection="selectedStudents.body"
    @add="openDialogToAddStudent"
    @delete="openDialogToDeleteStudents"
    @toggle="addSelectedStudents"
  />

  <AdminDialogAdd
    :is-dialog-visible="isDialogAddVisible"
    :members="newStudents.body"
    :errors="errors"
    @add="addNewStudent"
    @copy="copyNewStudent"
    @delete="deleteNewStudent"
    @submit="submitNewStudents"
    @close="resetNewStudents"
  />

  <AdminDialogDelete
    :dialog="deleteDialog"
    :selected-students="selectedStudents.body"
    @cancel="deleteDialog.isShow = false"
    @confirm="deleteStudentList"
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

import type { Dialog, MemberData } from '@/types';

const accountStore = useAccountStore();
const accountData = computed(() => accountStore.accountData!);

const memberStore = useMemberStore();

const isLoading = ref(false);

const studentList = ref<MemberData[]>([]);

const getStudentList = async () => {
  try {
    isLoading.value = true;
    studentList.value = await memberStore.fetchAll({
      church: accountData.value.church,
      department: accountData.value.department,
      job: 'student',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const initSelectedStudent: MemberData = {
  name: '',
  birth: new Date(),
  gender: 'male',
  church: '',
  department: '',
  job: 'student',
  grade: '',
  group: '',
  phone: '',
  address: '',
  registeredAt: new Date(),
  remark: '',
  attendances: [],
};

const selectedStudents = reactive({ body: [] as MemberData[] });

const addSelectedStudents = (payload: MemberData[]) => {
  selectedStudents.body = payload.map((d) => createNewStudent(d));
};

const isDialogAddVisible = ref(false);

const openDialogToAddStudent = () => {
  isDialogAddVisible.value = true;
  addNewStudent();
};

const newStudents = reactive({ body: [] as MemberData[] });

const createNewStudent = (obj: MemberData) => Object.assign({}, obj);

const addNewStudent = () => {
  newStudents.body.push(createNewStudent(initSelectedStudent));
};

const copyNewStudent = (index: number) => {
  newStudents.body.push(createNewStudent(newStudents.body[index]));
};

const deleteNewStudent = (index: number) => {
  if (newStudents.body.length > 1) {
    newStudents.body.splice(index, 1);
  } else {
    alert('더 이상 삭제할 수 없습니다.');
  }
};

const resetNewStudents = () => {
  isDialogAddVisible.value = false;
  newStudents.body = [];
  _v.value.$reset();
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

const _v = useVuelidate(rules, newStudents);

const errors = computed(() => _v.value.$errors[0]?.$response?.$errors);

const submitNewStudents = async () => {
  try {
    const isFormCorrect = await _v.value.body.$validate();
    if (!isFormCorrect) return;

    createNewStudents();
    resetNewStudents();
    await getStudentList();

    alert('추가되었습니다.');
  } catch (error) {
    alert(error);
  }
};

const createNewStudents = () => {
  try {
    memberStore.createMultiple({
      church: accountData.value.church,
      department: accountData.value.department,
      members: newStudents.body,
    });
  } catch (error) {
    console.log(error);
  }
};

const editSelectedStudentList = () => {
  try {
    memberStore.modifyMultiple({
      members: selectedStudents.body,
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

const openDialogToDeleteStudents = () => {
  deleteDialog.isShow = true;
};

const deleteStudentList = async () => {
  try {
    const uids = selectedStudents.body.map((student) => student.uid);
    memberStore.removeMultiple({ uids });

    deleteDialog.isShow = false;
    await getStudentList();
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => await getStudentList());
</script>
