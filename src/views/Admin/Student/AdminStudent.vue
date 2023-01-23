<template>
  <AdminDataTable
    :is-loading="isLoading"
    :data-source="studentList"
    :selection="selectedStudentList.body"
    :selected-columns="selectedColumns"
    @add="openDialogToAddStudent"
    @edit="openDialogToEditStudent"
    @delete="openDialogToDeleteStudents"
    @toggle="fetchSelectedStudentList"
  />

  <AdminDialogAddEdit
    :dialog="addEditDialog"
    :errors="errors"
    :student-list="selectedStudentList.body"
    @add-row="addSelectedStudent"
    @copy-row="copySelectedStudent"
    @delete-row="deleteSelectedStudent"
    @hide="resetSelectedStudentList"
    @submit="submitSelectedStudentList"
  />

  <AdminDialogDelete
    :dialog="deleteDialog"
    :selected-student-list="selectedStudentList.body"
    @cancel="deleteDialog.isShow = false"
    @confirm="deleteStudentList"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '@/views/Admin/AdminDataTable.vue';
import AdminDialogAddEdit from '../AdminDialogAddEdit.vue';
import AdminDialogDelete from '../AdminDialogDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { formatGender } from '@/utils/useFormat';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

import type { Timestamp } from '@firebase/firestore';
import type { DataTableColumn, Dialog, DialogLabel, MemberData } from '@/types';

const accountStore = useAccountStore();
const accountData = computed(() => accountStore.accountData!);

const memberStore = useMemberStore();

const isLoading = ref(false);

const studentList = ref<MemberData[]>([]);

onMounted(async () => await getStudentList());

const getStudentList = async () => {
  try {
    isLoading.value = true;

    studentList.value = await memberStore.fetchAll({
      church: accountData.value.church,
      department: accountData.value.department,
    });

    studentList.value.forEach((student) => {
      student.birth = (student.birth as Timestamp).toDate();
      student.registeredAt = (student.registeredAt as Timestamp).toDate();
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const initSelectedStudent: MemberData = {
  name: '',
  birth: new Date(`${new Date().getFullYear() - 10 + 1}-01-01`),
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

const selectedStudentList = reactive({ body: [] as MemberData[] });

const fetchSelectedStudentList = (payload: MemberData[]) => {
  selectedStudentList.body = payload.map((d) => createNewStudent(d));
};

const resetSelectedStudentList = () => {
  selectedStudentList.body.splice(0, selectedStudentList.body.length);
  addEditDialog.isShow = false;
  v.value.$reset();
};

const createNewStudent = (obj: MemberData) => Object.assign({}, obj);

const addEditDialog = reactive<Dialog>({
  isShow: false,
  label: '추가하기',
});

// || 생성하기 or 수정하기
const openDialogToAddStudent = () => {
  addEditDialog.isShow = true;
  addEditDialog.label = '추가하기';
  addSelectedStudent();
};

const addSelectedStudent = () => {
  const newStudent = createNewStudent(initSelectedStudent);
  selectedStudentList.body.push(newStudent);
};

const copySelectedStudent = (index: number) => {
  const targetStudent = selectedStudentList.body[index];
  const newStudent = createNewStudent(targetStudent);
  selectedStudentList.body.push(newStudent);
};

const deleteSelectedStudent = (index: number) => {
  if (selectedStudentList.body.length > 1) {
    selectedStudentList.body.splice(index, 1);
  }
};

const openDialogToEditStudent = () => {
  if (selectedStudentList.body.length > 0) {
    addEditDialog.isShow = true;
    addEditDialog.label = '수정하기';
  }
};

const submitSelectedStudentList = async (dialogLabel: DialogLabel) => {
  try {
    const isFormCorrect = await v.value.body.$validate();
    if (!isFormCorrect) {
      return;
    }

    if (dialogLabel === '추가하기') {
      addSelectedStudentList();
    } else if (dialogLabel === '수정하기') {
      editSelectedStudentList();
    }

    resetSelectedStudentList();
    await getStudentList();
  } catch (error) {
    console.log(error);
  }
};

const addSelectedStudentList = () => {
  try {
    memberStore.createMultiple({
      church: accountData.value.church,
      department: accountData.value.department,
      members: selectedStudentList.body,
    });

    alert('추가되었습니다.');
  } catch (error) {
    console.log(error);
  }
};

const editSelectedStudentList = () => {
  try {
    memberStore.modifyMultiple({
      members: selectedStudentList.body,
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
    const uids = selectedStudentList.body.map((student) => student.uid);
    memberStore.removeMultiple({ uids });

    deleteDialog.isShow = false;
    await getStudentList();
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

const v = useVuelidate(rules, selectedStudentList);

const errors = computed(() => v.value.$errors[0]?.$response?.$errors);

const columns = ref<DataTableColumn[]>([
  { field: 'grade', header: '학년', sortable: true, format: undefined },
  { field: 'group', header: '학급', sortable: true, format: undefined },
  { field: 'name', header: '이름', sortable: true, format: undefined },
  { field: 'gender', header: '성별', sortable: false, format: formatGender },
  { field: 'phone', header: '연락처', sortable: false, format: undefined },
  { field: 'address', header: '주소', sortable: true, format: undefined },
  { field: 'remark', header: '비고', sortable: false, format: undefined },
]);

const selectedColumns = ref(columns.value);
</script>
