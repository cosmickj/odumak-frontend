<template>
  <div class="container">
    <div class="mb-12">
      <Button
        class="p-button-success mr-2"
        icon="pi pi-plus"
        label="추가하기"
        @click="openModalForAddStudent"
      />
      <Button
        class="p-button-danger"
        icon="pi pi-trash"
        label="삭제하기"
        :disabled="!selectedStudents.length"
        @click="setDeleteStudentsDialog(true)"
      />
    </div>
  </div>

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        :value="dataSource"
        v-model:selection="selectedStudents"
        lazy
        rowHover
        sortMode="multiple"
        removableSort
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
            <span v-if="column.formatter">
              {{ column.formatter(slotProps.data[column.field]) }}
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
                @click="openModalForEditStudent(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mx-6"
                @click="openModalForDeleteStudent(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <StudentDialog
    :dialog="addEditDialog"
    :selected-student="selectedStudent"
    @submit="onSubmit"
  />

  <StudentDelete
    :dialog="deleteStudentDialog"
    :selected-student="selectedStudent"
    @cancel="closeModalForDeleteStudent"
    @confirm="deleteStudent"
  />

  <StudentsDelete
    :dialog="deleteStudentsDialog"
    :selected-students="selectedStudents"
    @cancel="setDeleteStudentsDialog(false)"
    @confirm="deleteStudents"
  />
</template>

<script setup lang="ts">
import StudentDialog from './components/StudentDialog.vue';
import StudentDelete from './components/StudentDelete.vue';
import StudentsDelete from './components/StudentsDelete.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { Student, SubmitType, Teacher } from '@/types';
import { async } from '@firebase/util';

const accountStore = useAccountStore();
const memberStore = useMemberStore();

const dataSource = ref();

const isLoading = ref(false);

const getMembers = async () => {
  try {
    isLoading.value = true;
    dataSource.value = await memberStore.fetchMembers({
      church: accountStore.userData?.church,
      department: accountStore.userData?.department,
      position: 'student',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const formatGender = (value: 'male' | 'female') => {
  if (value === 'male') return '남자';
  else if (value === 'female') return '여자';
};

const formatBirth = (seconds: number | undefined) => {
  if (seconds) return new Date(seconds * 1000);
  else return;
};

// prettier-ignore
const columns = ref([
  { field: 'grade', header: '학년', sortable: true, formatter: undefined },
  { field: 'group', header: '학급', sortable: true, formatter: undefined },
  { field: 'name', header: '이름', sortable: true, formatter: undefined },
  { field: 'gender', header: '성별', sortable: false, formatter: formatGender },
  { field: 'phone', header: '연락처', sortable: false, formatter: undefined },
  { field: 'teacher', header: '담당 교사', sortable: true, formatter: undefined },
  { field: 'address', header: '주소', sortable: true, formatter: undefined },
  { field: 'remark', header: '비고', sortable: false, formatter: undefined },
]);

const selectedColumns = ref(columns.value);

const onToggle = (value: any) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
};

interface SelectedStudent extends Student {
  index: number;
}

const selectedStudents = ref<SelectedStudent[]>([]);

const selectedStudent: SelectedStudent = reactive({
  address: '',
  gender: 'male',
  grade: '',
  group: '',
  index: 0,
  name: '',
  phone: '',
  remark: '',
  teacher: '',
  registeredAt: new Date(),
});

watch(selectedStudent, async (student) => {
  if (student.grade && student.group) {
    const result = (await memberStore.fetchMembers({
      church: accountStore.userData?.church,
      department: accountStore.userData?.department,
      position: 'teacher',
      grade: student.grade,
      group: student.group,
      role: 'main',
    })) as Teacher[]; // TODO: as 제거하기

    if (result[0]?.name) {
      selectedStudent.teacher = result[0]?.name;
    } else {
      const msg = '담당 교사가 없는 학급입니다. 다시 선택해주세요.';
      selectedStudent.teacher = msg;
    }
  }
});

const rules = computed(() => ({
  name: { required },
}));
const v$ = useVuelidate(rules, selectedStudent);

// || 생성 혹은 수정하기
const addEditDialog = reactive({
  label: '',
  status: false,
});

const openModalForEditStudent = (student: SelectedStudent) => {
  selectedStudent.address = student.address;
  selectedStudent.gender = student.gender;
  selectedStudent.grade = student.grade;
  selectedStudent.group = student.group;
  selectedStudent.name = student.name;
  selectedStudent.phone = student.phone;
  selectedStudent.remark = student.remark;
  selectedStudent.teacher = student.teacher;

  addEditDialog.status = true;
  addEditDialog.label = '수정하기';
};

const openModalForAddStudent = () => {
  selectedStudent.address = '';
  selectedStudent.gender = 'male';
  selectedStudent.grade = '';
  selectedStudent.group = '';
  selectedStudent.name = '';
  selectedStudent.phone = '';
  selectedStudent.remark = '';
  selectedStudent.teacher = '';
  selectedStudent.registeredAt = new Date();

  addEditDialog.status = true;
  addEditDialog.label = '추가하기';
};

const addStudent = async () => {
  await memberStore.createMember({
    church: accountStore.userData?.church,
    department: accountStore.userData?.department,
    position: 'student',
    ...selectedStudent,
  });
  alert('추가되었습니다.');
};

const editStudent = async () => {
  await memberStore.modifyMember({
    church: accountStore.userData?.church,
    department: accountStore.userData?.department,
    position: 'student',
    ...selectedStudent,
  });
  alert('수정되었습니다.');
};

const onSubmit = async ({ submitType }: { submitType: SubmitType }) => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  if (submitType === 'ADD') await addStudent();
  else if (submitType === 'EDIT') await editStudent();

  addEditDialog.status = false;
  await getMembers();
};

// || 삭제하기
const deleteStudentDialog = reactive({
  label: '',
  status: false,
});

const deleteStudentsDialog = reactive({
  label: '',
  status: false,
});

const openModalForDeleteStudent = (student: SelectedStudent) => {
  selectedStudent.address = student.address;
  selectedStudent.gender = student.gender;
  selectedStudent.grade = student.grade;
  selectedStudent.group = student.group;
  selectedStudent.index = student.index;
  selectedStudent.name = student.name;
  selectedStudent.phone = student.phone;
  selectedStudent.remark = student.remark;
  selectedStudent.teacher = student.teacher;

  deleteStudentDialog.status = true;
};

const closeModalForDeleteStudent = () => {
  selectedStudent.address = '';
  selectedStudent.gender = 'male';
  selectedStudent.grade = '';
  selectedStudent.group = '';
  selectedStudent.index = 0;
  selectedStudent.name = '';
  selectedStudent.phone = '';
  selectedStudent.remark = '';
  selectedStudent.teacher = '';
  selectedStudent.registeredAt = new Date();

  deleteStudentDialog.status = false;
};

const deleteStudent = async () => {
  await memberStore.removeMember({
    church: accountStore.userData?.church,
    department: accountStore.userData?.department,
    position: 'student',
    index: selectedStudent.index,
  });

  deleteStudentDialog.status = false;

  await getMembers();
};

const setDeleteStudentsDialog = (flag: boolean) => {
  deleteStudentsDialog.status = flag;
};

const deleteStudents = async () => {
  for await (const student of selectedStudents.value) {
    await memberStore.removeMember({
      church: accountStore.userData?.church,
      department: accountStore.userData?.department,
      position: 'student',
      index: student.index,
    });
  }

  setDeleteStudentsDialog(false);
};

onMounted(async () => await getMembers());
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
