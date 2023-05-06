<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="students"
    :selection="selectedStudents.body"
    @add="openDialogToAddStudent"
    @edit="editSelectedStudent"
    @delete="toggleIsDialogDeleteVisible"
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
import AdminDataTable from '@/views/Admin/_partials/AdminDataTable.vue';
import AdminDialogAdd from '../_partials/AdminDialogAdd.vue';
import AdminDialogDelete from '../_partials/AdminDialogDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useMemberStore } from '@/store/member';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import { useToast } from 'primevue/usetoast';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import type { MemberData } from '@/types';

const userStore = useUserStore();
const accountData = computed(() => userStore.userData!);

const memberStore = useMemberStore();

const isLoading = ref(false);
const students = ref<MemberData[]>([]);

const getStudents = async () => {
  try {
    isLoading.value = true;
    students.value = await memberStore.fetchAll({
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
  birth: null,
  birthLater: true,
  gender: 'male',
  church: '',
  department: '',
  job: 'student',
  role: null,
  grade: '',
  group: '',
  phone: '',
  address: '',
  registeredAt: new Date(),
  remark: '',
};

const selectedStudents = reactive({ body: [] as MemberData[] });

const createNewStudent = (obj: MemberData) => Object.assign({}, obj);

const addSelectedStudents = (payload: MemberData[]) => {
  selectedStudents.body = payload.map((d) => createNewStudent(d));
};

const isDialogAddVisible = ref(false);

const openDialogToAddStudent = () => {
  isDialogAddVisible.value = true;
  addNewStudent();
};

const newStudents = reactive({ body: [] as MemberData[] });

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
    memberStore.createMultiple({
      church: accountData.value.church,
      department: accountData.value.department,
      members: newStudents.body,
    });
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

const editSelectedStudent = async (payload: DataTableCellEditCompleteEvent) => {
  try {
    const { data, newData, field, newValue } = payload;

    if (JSON.stringify(data) !== JSON.stringify(newData)) {
      await memberStore.modifySingle({
        uid: data.uid,
        field: field,
        value: newValue,
      });

      await getStudents();

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

onMounted(async () => await getStudents());
</script>
