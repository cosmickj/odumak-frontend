<template>
  <div class="container">
    <div class="mb-12">
      <Button
        class="p-button-success mr-2"
        icon="pi pi-plus"
        label="추가하기"
        @click="openModalForAddStudent"
      />
      <Button class="p-button-danger" icon="pi pi-trash" label="삭제하기" />
    </div>
  </div>

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
        :value="dataSource"
        v-model:selection="selectedStudents"
        :lazy="true"
        :loading="isLoading"
        :rowHover="true"
        :row-class="() => 'cursor-pointer'"
        sortMode="multiple"
        removableSort
        responsiveLayout="scroll"
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
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <StudentDialog :modal="modal" :selected-student="selectedStudent" />
</template>

<script setup lang="ts">
import StudentDialog from './components/StudentDialog.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { Student, Teacher } from '@/types';
// import type { DataTableRowClickEvent } from 'primevue/datatable/DataTable';

const account = useAccountStore();
const member = useMemberStore();

const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    dataSource.value = await member.fetchMembers({
      church: account.userData?.church,
      department: account.userData?.department,
      position: 'student',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getMembers();
});

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

const selectedStudents = ref();

const selectedColumns = ref(columns.value);

const onToggle = (value: any) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
};

const selectedStudent = reactive<Student>({
  address: '',
  gender: 'male',
  grade: '',
  group: '',
  name: '',
  phone: '',
  remark: '',
  teacher: '',
  registeredAt: new Date(),
});

watch(selectedStudent, async (student) => {
  if (student.grade && student.group) {
    const result = (await member.fetchMembers({
      church: account.userData?.church,
      department: account.userData?.department,
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

const modal = reactive({
  status: false,
  label: '',
});

const openModalForEditStudent = (student: Student) => {
  selectedStudent.address = student.address;
  selectedStudent.gender = student.gender;
  selectedStudent.grade = student.grade;
  selectedStudent.group = student.group;
  selectedStudent.name = student.name;
  selectedStudent.phone = student.phone;
  selectedStudent.remark = student.remark;
  selectedStudent.teacher = student.teacher;

  modal.status = true;
  modal.label = '수정하기';
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

  modal.status = true;
  modal.label = '추가하기';
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}
</style>
