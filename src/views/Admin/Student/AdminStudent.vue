<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="students"
    :selection="selectedStudents.body"
    @add="openDialogToAddStudent"
    @edit="editStudent"
    @delete="isDialogDeleteVisible = true"
    @select="addSelectedStudents"
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
    :is-dialog-visible="isDialogDeleteVisible"
    :selected-students="selectedStudents.body"
    @cancel="isDialogDeleteVisible = false"
    @confirm="deleteStudentList"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '../_partials/AdminDataTable.vue';
import AdminDialogAdd from '../_partials/AdminDialogAdd.vue';
import AdminDialogDelete from '../_partials/AdminDialogDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useMemberStore } from '@/store/member';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import { useToast } from 'primevue/usetoast';
import type { MemberData } from '@/types';

const userStore = useUserStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const students = ref<MemberData[]>([]);

const getStudents = async () => {
  try {
    isLoading.value = true;

    const { church, department } = userStore.userData || {};

    if (church && department) {
      students.value = await memberStore.fetchAll({
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

onMounted(async () => await getStudents());

const initSelectedStudent: MemberData = {
  name: '',
  birth: null,
  birthLater: true,
  gender: 'male',
  church: '',
  department: '',
  job: 'student',
  role: null,
  grade: '',
  group: '',
  isNewFriendClass: false,
  registeredAt: new Date(),
  remark: '',
};

const createNewStudent = (obj: MemberData) => Object.assign({}, obj);

const selectedStudents = reactive<{ body: MemberData[] }>({ body: [] });

const addSelectedStudents = (payload: MemberData[]) => {
  selectedStudents.body = payload.map((d) => createNewStudent(d));
};

const isDialogAddVisible = ref(false);

const openDialogToAddStudent = () => {
  isDialogAddVisible.value = true;
  addNewStudent();
};

const newStudents = reactive<{ body: MemberData[] }>({ body: [] });

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

const rules = {
  body: {
    $each: helpers.forEach({
      name: { required },
      grade: { required },
      group: { required },
    }),
  },
};

const $v = useVuelidate(rules, newStudents);

const errors = computed(() => $v.value.$errors[0]?.$response?.$errors);

const resetNewStudents = () => {
  isDialogAddVisible.value = false;
  newStudents.body.splice(0, newStudents.body.length);
  $v.value.$reset();
};

const createNewStudents = () => {
  try {
    const { church, department } = userStore.userData || {};

    if (church && department) {
      memberStore.createMultiple({
        church,
        department,
        members: newStudents.body,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const submitNewStudents = async () => {
  try {
    const isFormCorrect = await $v.value.body.$validate();
    if (!isFormCorrect) return;

    createNewStudents();
    resetNewStudents();
    await getStudents();

    alert('추가되었습니다.');
  } catch (error) {
    alert(error);
  }
};

const toast = useToast();

const editStudent = async (payload: Required<MemberData>) => {
  try {
    const { uid, ...params } = payload;

    await memberStore.modifySingle({ uid, ...params });
    await getStudents();

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

const deleteStudentList = async () => {
  try {
    const uids = selectedStudents.body.map((student) => student.uid);
    memberStore.removeMultiple({ uids });

    toggleIsDialogDeleteVisible();
    await getStudents();
  } catch (error) {
    console.log(error);
  }
};
</script>
