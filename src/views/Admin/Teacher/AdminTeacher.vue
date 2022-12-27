<template>
  <!-- <div class="container">
    <div class="mb-12">
      <Button
        class="p-button-success mr-2"
        icon="pi pi-plus"
        label="추가하기"
        @click="openDialogForAddTeacher"
      />
      <Button
        class="p-button-danger"
        icon="pi pi-trash"
        label="삭제하기"
        :disabled="!selectedTeachers.length"
        @click="deleteTeachersDialog.status = true"
      />
    </div>
  </div> -->

  <AdminDataTable
    :data-source="dataSource"
    :is-loading="isLoading"
    :selected-columns="selectedColumns"
    :selected-rows="selectedTeachers"
  />

  <!-- <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        v-model:selection="selectedTeachers"
        :value="dataSource"
        lazy
        rowHover
        removableSort
        sortMode="multiple"
        responsiveLayout="scroll"
        :loading="isLoading"
      >
        <template #header>
          <div>
            <span class="mr-5">*보고 싶은 컬럼을 선택하세요:</span>

            <MultiSelect
              class="w-1/4"
              :modelValue="selectedColumns"
              :options="columns"
              optionLabel="header"
              placeholder="Select Columns"
              @update:modelValue="onToggle"
            />
          </div>
        </template>

        <Column class="w-12" selectionMode="multiple" :exportable="false" />

        <Column
          v-for="(column, idx) in selectedColumns"
          :key="idx"
          :field="column.field"
          :header="column.header"
          :sortable="column.sortable"
        >
          <template #body="slotProps">
            <span v-if="column.format">
              {{ column.format(slotProps.data[column.field]) }}
            </span>

            <span v-else>
              {{ slotProps.data[column.field] }}
            </span>
          </template>
        </Column>

        <Column :exportable="false">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mx-6"
                @click="openDialogForEditTeacher(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mx-6"
                @click="openDialogForDeleteTeacher(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div> -->

  <TeacherDialog
    :dialog="addEditDialog"
    :errors="errors"
    :selected-teacher="selectedTeacher"
    @birth-change="setBirth"
    @hide="v$.$reset"
    @submit="onSubmit"
  />

  <TeacherDelete
    :dialog="deleteTeacherDialog"
    :selected-teacher="selectedTeacher"
    @cancel="closeModalForDeleteTeacher"
    @confirm="deleteTeacher"
  />

  <TeachersDelete
    :dialog="deleteTeachersDialog"
    :selected-teachers="selectedTeachers"
    @cancel="deleteTeachersDialog.status = false"
    @confirm="deleteTeachers"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '@/views/Admin/AdminDataTable.vue';
import TeacherDialog from './components/AdminTeacherDialog.vue';
import TeacherDelete from './components/AdminTeacherDelete.vue';
import TeachersDelete from './components/AdminTeachersDelete.vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { formatRole } from '@/utils/useFormat';

// import { v4 as uuidv4 } from 'uuid';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { CustomColumn, SubmitType, Teacher } from '@/types';
import type { Timestamp } from '@firebase/firestore';

const accountStore = useAccountStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    if (accountStore.accountData) {
      const result = await memberStore.fetchAll({
        church: accountStore.accountData.church,
        department: accountStore.accountData.department,
      });
      dataSource.value = result;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await getMembers());

const columns = ref<CustomColumn[]>([
  { field: 'grade', header: '담당 학년', sortable: true, format: undefined },
  { field: 'group', header: '담당 학급', sortable: true, format: undefined },
  { field: 'name', header: '이름', sortable: true, format: undefined },
  { field: 'role', header: '담임 여부', sortable: false, format: formatRole },
  { field: 'remark', header: '비고', sortable: false, format: undefined },
]);

const selectedColumns = ref(columns.value);

const onToggle = (value: any) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
};

const initSelectedTeacher: Teacher = {
  _id: '',
  grade: '',
  group: '',
  name: '',
  role: 'common',
  birth: new Date(),
  gender: 'male',
  phone: '',
  remark: '',
  registeredAt: new Date(),
};

const selectedTeacher = reactive({ ...initSelectedTeacher });
const selectedTeachers = ref<Teacher[]>([]);

const rules = computed(() => ({
  grade: { required },
  group: { required },
  name: { required },
}));

const v$ = useVuelidate(rules, selectedTeacher);

const errors = computed(() => ({
  grade: {
    status: v$.value.grade.$error,
    message: v$.value.grade.$errors[0]?.$message,
  },
  group: {
    status: v$.value.group.$error,
    message: v$.value.group.$errors[0]?.$message,
  },
  name: {
    status: v$.value.name.$error,
    message: v$.value.name.$errors[0]?.$message,
  },
}));

// || 생성 혹은 수정하기
const addEditDialog = reactive({
  label: '',
  status: false,
});

const setBirth = ({ birth }: { birth: Date }) => {
  selectedTeacher.birth = birth;
};

const openDialogForAddTeacher = () => {
  resetSelectedTeacher();
  addEditDialog.status = true;
  addEditDialog.label = '추가하기';
};

const resetSelectedTeacher = () => {
  // TODO: 3번째 매개변수에 대해서 타입체킹이 되지 않는다
  // Object.assign(selectedTeacher, initSelectedTeacher, { _id: uuidv4() });
};

const openDialogForEditTeacher = (teacher: Teacher) => {
  const _birth = teacher.birth as unknown as Timestamp;
  const _registeredAt = teacher.registeredAt as unknown as Timestamp;
  teacher.birth = new Date(_birth.seconds * 1000);
  teacher.registeredAt = new Date(_registeredAt.seconds * 1000);
  Object.assign(selectedTeacher, teacher);

  addEditDialog.status = true;
  addEditDialog.label = '수정하기';
};

const onSubmit = async ({ submitType }: { submitType: SubmitType }) => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  if (submitType === '추가하기') {
    await addTeacher();
  } else {
    await editTeacher();
  }

  addEditDialog.status = false;
  await getMembers();
};

const addTeacher = async () => {
  if (accountStore.accountData) {
    // await memberStore.create({
    //   church: accountStore.userData.church,
    //   department: accountStore.userData.department,
    //   ...selectedTeacher,
    // });
    alert('추가되었습니다.');
  }
};

const editTeacher = async () => {
  if (accountStore.accountData) {
    await memberStore.modify({
      church: accountStore.accountData.church,
      department: accountStore.accountData.department,
      position: 'teacher',
      ...selectedTeacher,
    });
    alert('수정되었습니다.');
  }
};

// || 삭제하기
const deleteTeacherDialog = reactive({
  label: '',
  status: false,
});

const openDialogForDeleteTeacher = (teacher: Teacher) => {
  selectedTeacher._id = teacher._id;
  selectedTeacher.name = teacher.name;
  deleteTeacherDialog.status = true;
};

const closeModalForDeleteTeacher = () => {
  resetSelectedTeacher();
  deleteTeacherDialog.status = false;
};

const deleteTeacher = async () => {
  if (accountStore.accountData) {
    await memberStore.remove({
      uids: [selectedTeacher._id],
    });

    deleteTeacherDialog.status = false;
    await getMembers();
  }
};

const deleteTeachersDialog = reactive({
  label: '',
  status: false,
});

const deleteTeachers = async () => {
  const ids = selectedTeachers.value.map((teacher) => {
    return teacher._id;
  });

  if (accountStore.accountData) {
    await memberStore.remove({
      uids: ids,
    });

    deleteTeachersDialog.status = false;
    await getMembers();
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
