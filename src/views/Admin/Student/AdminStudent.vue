<template>
  <div class="container">
    <div class="mb-5 flex justify-between">
      <div class="flex gap-x-3">
        <Button
          class="p-button-success p-button-lg"
          icon="pi pi-plus"
          label="추가하기"
          :disabled="selectedStudents.length != 0"
        />
        <Button
          class="p-button-warning p-button-lg"
          icon="pi pi-user-edit"
          label="수정하기"
          :disabled="selectedStudents.length == 0"
        />
        <Button
          class="p-button-danger p-button-lg"
          icon="pi pi-trash"
          label="삭제하기"
          :disabled="selectedStudents.length == 0"
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

    <div class="mb-5 flex items-center">
      <FileUpload
        class="p-button-lg mr-4"
        mode="basic"
        choose-label="여러 학생 추가하기"
        accept=".csv"
        custom-upload
        auto
        @uploader="uploadTemplate"
      />

      <span class="text-xl">
        <a
          class="underline"
          :href="fileLink"
          download="여러_학생_추가하기_템플릿"
        >
          여러 학생 추가하기 템플릿 다운받기
        </a>
        <span class="text-base text-red-600">
          (절대로 템플릿을 변경하지 마세요)
        </span>
      </span>
    </div>
  </div>

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        ref="dataTableRef"
        v-model:selection="selectedStudents"
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
    :selected-student="selectedStudent"
    @hide="v$.$reset"
    @submit="onSubmit"
  />

  <!-- <StudentDelete
    :dialog="deleteStudentDialog"
    :selected-student="selectedStudent"
    @cancel="closeModalForDeleteStudent"
    @confirm="deleteStudent"
  /> -->

  <!-- TODO: 1명 / 2명 이상 선택시 보이는 글귀를 if문 처리 -->
  <StudentsDelete
    :dialog="deleteStudentsDialog"
    :selected-students="selectedStudents"
    @cancel="setDeleteStudentsDialog(false)"
    @confirm="deleteStudents"
  />
</template>

<script setup lang="ts">
import StudentDialog from './components/AdminStudentDialog.vue';
import StudentDelete from './components/AdminStudentDelete.vue';
import StudentsDelete from './components/AdminStudentsDelete.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { uploadFile } from '@/api/upload';
import { formatGender } from '@/utils/useFormat';
import { v4 as uuidv4 } from 'uuid';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, not, sameAs } from '@vuelidate/validators';
import csv from 'csvtojson';
import { CustomColumn, SubmitType, Student, Teacher } from '@/types';
import type DataTable from 'primevue/datatable';
import type { Timestamp } from '@firebase/firestore';

const accountStore = useAccountStore();
const memberStore = useMemberStore();

const dataTableRef = ref<DataTable | null>(null);

const exportCSV = () => {
  if (dataTableRef.value) {
    dataTableRef.value.exportCSV();
    console.log(dataTableRef.value);
  }
};

const fileLocation = './students-upload-template.csv';
const fileLink = new URL(fileLocation, import.meta.url).href;

const uploadTemplate = async (event: any) => {
  let formData = new FormData();
  formData.append('file', event.files[0]);

  const { data } = await uploadFile(formData);
  const result = await csv({
    noheader: false,
    output: 'json',
  }).fromString(data);
  result.splice(0, 2);

  console.log(result);
};

/**
 * DataTable에 들어갈 데이터 가져오기
 */
const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    // if (accountStore.userData) {
    const result = await memberStore.fetchAll({
      church: '테스트',
      department: '테스트',
      // church: accountStore.userData.church,
      // department: accountStore.userData.department,
      position: 'student',
    });
    dataSource.value = result;
    // }
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
  { field: 'teacher', header: '담당 교사', sortable: true, format: undefined },
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
  phoneOwner: '',
  address: '',
  registeredAt: new Date(),
  remark: '',
};

const selectedStudent = reactive({ ...initSelectedStudent });
const selectedStudents = ref<Student[]>([]);

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
  name: { required: helpers.withMessage('이름을 꼭 입력해주세요.', required) },
  grade: { required },
  group: { required },
  teacher: {
    required,
    rejected: not(sameAs('담당 교사가 없는 학급입니다. 다시 선택해주세요.')),
  },
}));

const v$ = useVuelidate(rules, selectedStudent);

const errors = computed(() => ({
  name: {
    status: v$.value.name.$error,
    message: v$.value.name.$errors[0]?.$message,
  },
  grade: {
    status: v$.value.grade.$error,
    message: v$.value.grade.$errors[0]?.$message,
  },
  group: {
    status: v$.value.group.$error,
    message: v$.value.group.$errors[0]?.$message,
  },
  teacher: {
    status: v$.value.teacher.$error,
    message: v$.value.teacher.$errors[0]?.$message,
  },
}));

// || 생성 혹은 수정하기
const addEditDialog = reactive({
  label: '',
  status: false,
});

const openModalForAddStudent = () => {
  resetSelectedStudent();

  addEditDialog.status = true;
  addEditDialog.label = '추가하기';
};

const resetSelectedStudent = () => {
  // TODO: 3번째 매개변수에 대해서 타입체킹이 되지 않는다
  Object.assign(selectedStudent, initSelectedStudent, { _id: uuidv4() });
};

const openModalForEditStudent = (student: Student) => {
  const _birth = student.birth as unknown as Timestamp;
  const _registeredAt = student.registeredAt as unknown as Timestamp;
  student.birth = new Date(_birth.seconds * 1000);
  student.registeredAt = new Date(_registeredAt.seconds * 1000);
  Object.assign(selectedStudent, student);

  addEditDialog.status = true;
  addEditDialog.label = '수정하기';
};

const onSubmit = async ({ submitType }: { submitType: SubmitType }) => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  if (submitType === 'ADD') {
    await addStudent();
  } else {
    await editStudent();
  }

  addEditDialog.status = false;
  await getMembers();
};

const addStudent = async () => {
  if (accountStore.userData) {
    await memberStore.create({
      church: accountStore.userData.church,
      department: accountStore.userData.department,
      position: 'student',
      ...selectedStudent,
    });
    alert('추가되었습니다.');
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
const deleteStudentDialog = reactive({
  label: '',
  status: false,
});

const openModalForDeleteStudent = (student: Student) => {
  selectedStudent._id = student._id;
  selectedStudent.name = student.name;
  deleteStudentDialog.status = true;
};

const closeModalForDeleteStudent = () => {
  resetSelectedStudent();
  deleteStudentDialog.status = false;
};

const deleteStudent = async () => {
  if (accountStore.userData) {
    await memberStore.remove({
      church: accountStore.userData?.church,
      department: accountStore.userData?.department,
      position: 'student',
      ids: [selectedStudent._id],
    });

    deleteStudentDialog.status = false;
    await getMembers();
  }
};

const deleteStudentsDialog = reactive({
  label: '',
  status: false,
});

const setDeleteStudentsDialog = (flag: boolean) => {
  deleteStudentsDialog.status = flag;
};

const deleteStudents = async () => {
  const ids = selectedStudents.value.map((student) => {
    return student._id;
  });

  if (accountStore.userData) {
    await memberStore.remove({
      church: accountStore.userData?.church,
      department: accountStore.userData?.department,
      position: 'student',
      ids,
    });

    setDeleteStudentsDialog(false);
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
