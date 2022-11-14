<template>
  <div class="container">
    <div class="mb-5 flex justify-between">
      <div class="flex gap-x-3">
        <Button
          class="p-button-success p-button-lg"
          icon="pi pi-plus"
          label="추가하기"
          :disabled="selectedStudents.collection.length != 0"
          @click="openDialogToAddStudent"
        />
        <Button
          class="p-button-warning p-button-lg"
          icon="pi pi-user-edit"
          label="수정하기"
          :disabled="selectedStudents.collection.length == 0"
          @click="openDialogToEditStudent"
        />
        <Button
          class="p-button-danger p-button-lg"
          icon="pi pi-trash"
          label="삭제하기"
          :disabled="selectedStudents.collection.length == 0"
          @click="openDialogToDeleteStudents"
        />
      </div>

      <div class="flex">
        <Button
          class="p-button-help p-button-lg"
          icon="pi pi-external-link"
          label="내보내기"
          @click="exportCSV"
        />
      </div>
    </div>
  </div>

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        ref="dataTableRef"
        v-model:selection="selectedStudents.collection"
        :loading="isLoading"
        :value="dataSource"
        lazy
        rowHover
        removableSort
        sortMode="multiple"
        responsiveLayout="scroll"
      >
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
      </DataTable>
    </div>
  </div>

  <StudentDialog
    :dialog="addEditDialog"
    :errors="errors"
    :selected-students="selectedStudents.collection"
    @add-row="addSelectedStudent"
    @copy-row="copySelectedStudent"
    @delete-row="deleteSelectedStudent"
    @hide="clearSelectedStudents"
    @submit="submitSelectedStudents"
  />

  <StudentsDelete
    :dialog="deleteStudentsDialog"
    :selected-students="selectedStudents.collection"
    @cancel="deleteStudentsDialog.status = false"
    @confirm="deleteStudents"
  />
</template>

<script setup lang="ts">
import StudentDialog from './components/AdminStudentDialog.vue';
import StudentsDelete from './components/AdminStudentsDelete.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { formatGender } from '@/utils/useFormat';
import { v4 as uuidv4 } from 'uuid';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { CustomColumn, SubmitType, Student, Teacher } from '@/types';
import type DataTable from 'primevue/datatable';

const accountStore = useAccountStore();
const memberStore = useMemberStore();

const dataTableRef = ref<DataTable | null>(null);

const exportCSV = () => {
  if (dataTableRef.value) {
    dataTableRef.value.exportCSV();
    console.log(dataTableRef.value);
  }
};

// DataTable에 들어갈 데이터 가져오기
const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    console.log(accountStore.userData);

    if (accountStore.userData) {
      const result = await memberStore.fetchAll({
        church: accountStore.userData.church,
        department: accountStore.userData.department,
        position: 'student',
      });
      console.log(result);

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
  { field: 'grade', header: '학년', sortable: true, format: undefined },
  { field: 'group', header: '학급', sortable: true, format: undefined },
  { field: 'name', header: '이름', sortable: true, format: undefined },
  { field: 'gender', header: '성별', sortable: false, format: formatGender },
  { field: 'phone', header: '연락처', sortable: false, format: undefined },
  { field: 'address', header: '주소', sortable: true, format: undefined },
  { field: 'remark', header: '비고', sortable: false, format: undefined },
]);

const selectedColumns = ref(columns.value);

const onToggle = (value: any) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
};

const initSelectedStudent: Student = {
  _id: '',
  grade: '',
  group: '',
  teacher: '',
  name: '',
  birth: new Date(`${new Date().getFullYear() - 10 + 1}-01-01`),
  gender: 'male',
  phone: '',
  address: '',
  registeredAt: new Date(),
  remark: '',
};

const selectedStudent = reactive({ ...initSelectedStudent }); // TODO: 해당 변수 제거 검토

const selectedStudents = reactive({ collection: [] as Student[] });

const clearSelectedStudent = () => {
  // TODO: 3번째 매개변수에 대해서 타입체킹이 되지 않는다
  return Object.assign({}, initSelectedStudent, { _id: uuidv4() });
};

const clearSelectedStudents = () => {
  v.value.$reset();
  selectedStudents.collection.splice(0, selectedStudents.collection.length);
};

const rules = {
  collection: {
    $each: helpers.forEach({
      name: { required },
      grade: { required },
      group: { required },
    }),
  },
};

const v = useVuelidate(rules, selectedStudents);

const errors = computed(() => v.value.$errors[0]?.$response?.$errors);

// || 생성 혹은 수정하기
const addEditDialog: { label: SubmitType; status: boolean } = reactive({
  label: '추가하기',
  status: false,
});

const openDialogToAddStudent = () => {
  addEditDialog.status = true;
  addEditDialog.label = '추가하기';
  addSelectedStudent();
};

const addSelectedStudent = () => {
  const _student = clearSelectedStudent();
  selectedStudents.collection.push(_student);
};

const copySelectedStudent = (index: number) => {
  const target = selectedStudents.collection[index];
  const _student = Object.assign({}, target, { _id: uuidv4() });
  selectedStudents.collection.push(_student);
};

const deleteSelectedStudent = (index: number) => {
  selectedStudents.collection.splice(index, 1);
};

const openDialogToEditStudent = () => {
  addEditDialog.status = true;
  addEditDialog.label = '수정하기';
};

const submitSelectedStudents = async (submitType: SubmitType) => {
  try {
    const isFormCorrect = await v.value.collection.$validate();
    if (!isFormCorrect) return;

    if (submitType === '추가하기') {
      await addStudent();
    } else {
      await editStudent();
    }
  } catch (error) {
    console.log(error);
  } finally {
    addEditDialog.status = false;
    await getMembers();
  }
};

const addStudent = async () => {
  try {
    if (accountStore.userData) {
      await memberStore.create({
        church: accountStore.userData.church,
        department: accountStore.userData.department,
        position: 'student',
        members: selectedStudents.collection,
      });
      alert('추가되었습니다.');
    }
  } catch (error) {
    console.log(error);
  }
};

const editStudent = async () => {
  if (accountStore.userData) {
    await memberStore.modify({
      church: accountStore.userData.church,
      department: accountStore.userData.department,
      position: 'student',
      ...selectedStudent,
    });
    alert('수정되었습니다.');
  }
};

// || 삭제하기
const deleteStudentsDialog = reactive({
  label: '',
  status: false,
});

const openDialogToDeleteStudents = () => {
  deleteStudentsDialog.label = '삭제하기';
  deleteStudentsDialog.status = true;
};

const deleteStudents = async () => {
  try {
    const ids = selectedStudents.collection.map((student) => student._id);

    // if (accountStore.userData) {
    await memberStore.remove({
      church: '테스트',
      department: '테스트',
      // church: accountStore.userData?.church,
      // department: accountStore.userData?.department,
      position: 'student',
      ids,
    });

    deleteStudentsDialog.status = false;
    await getMembers();
    // }
  } catch (error) {
    console.log(error);
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
