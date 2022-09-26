<template>
  <div class="wrapper">
    <div class="container">
      <div class="p-5 text-center select-none my-12">
        <RouterLink class="text-2xl cursor-pointer" :to="{ name: 'HomeView' }">
          <i class="text-2xl mr-2 pi pi-home"></i>
          홈
        </RouterLink>

        <span class="text-2xl mx-5">|</span>

        <RouterLink
          class="text-2xl cursor-pointer"
          :to="{ name: 'AdminView', params: { position: 'student' } }"
        >
          <i class="text-2xl mr-2 pi pi-user"></i>
          학생 목록
        </RouterLink>

        <span class="text-2xl mx-5">|</span>

        <RouterLink
          class="text-2xl cursor-pointer"
          :to="{ name: 'AdminView', params: { position: 'teacher' } }"
        >
          <i class="text-2xl mr-2 pi pi-pencil"></i>
          교사 목록
        </RouterLink>
      </div>
    </div>

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
      <div
        class="overflow-hidden mb-12 border border-slate-300 rounded-2xl drop-shadow-lg"
      >
        <AdminStudent
          v-if="route.params.position === 'student'"
          :data-source="dataSource"
          :is-loading="isLoading"
          @edit="openModalForEditStudent"
        />
        <!-- <AdminTeacher
          v-else
          :data-source="dataSource"
          :is-loading="isLoading"
        /> -->
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="modal.status"
    class="w-2/5"
    :breakpoints="{ '450px': '75vw' }"
    :header="modal.label"
    modal
    maximizable
  >
    <div class="min-w-full">
      <div class="grid grid-cols-4 gap-x-12 gap-y-5">
        <div class="col-span-2">
          <p>몇 학년 인가요?</p>
          <Dropdown
            class="w-full"
            v-model="selectedStudent.grade"
            :options="gradeList"
            option-label="name"
            option-value="value"
            placeholder="학년"
          />
        </div>

        <div class="col-span-2">
          <p>몇 반 인가요?</p>
          <Dropdown
            class="w-full"
            v-model="selectedStudent.group"
            :options="groupList"
            option-label="name"
            option-value="value"
            placeholder="학급"
          />
        </div>

        <div class="col-span-4">
          <p>이름</p>
          <InputText
            class="w-full"
            v-model="selectedStudent.name"
            placeholder="이름을 입력해주세요."
          />
        </div>

        <!-- <div class="col-span-4">
          <p>생년월일</p>
          <Calendar  class="w-full" v-model="selectedStudent.birth"/>
        </div> -->

        <div class="col-span-4">
          <p>성별</p>
          <div class="flex items-center">
            <RadioButton
              name="gender"
              inputId="male"
              value="male"
              v-model="selectedStudent.gender"
            />
            <label class="cursor-pointer" for="male"> 남자 어린이 </label>

            <RadioButton
              name="gender"
              inputId="female"
              value="female"
              v-model="selectedStudent.gender"
            />
            <label class="cursor-pointer" for="female"> 여자 어린이 </label>
          </div>
        </div>

        <div class="col-span-2">
          <p>연락처</p>
          <InputMask
            class="w-full"
            v-model="selectedStudent.phone"
            mask="(999)-9999-9999"
            placeholder="(010)-0000-0000"
          />
        </div>

        <div class="col-span-2">
          <p>누구의 연락처인가요?</p>
          <InputText class="w-full" placeholder="ex) 엄마, 아빠 등등" />
        </div>

        <div class="col-span-4">
          <p>담당 교사</p>
          <InputText
            class="w-full"
            disabled
            v-model="selectedStudent.teacher"
            placeholder="학년과 학급을 선택하시면 자동으로 입력됩니다."
          />
        </div>

        <div class="col-span-4">
          <p>어디 사는 친구인가요?</p>
          <InputText
            class="w-full"
            v-model="selectedStudent.address"
            placeholder="주소를 입력해주세요."
          />
        </div>

        <div class="col-span-4">
          <p>언제 초등부를 처음 나왔나요?</p>
          <Calendar
            class="w-full"
            touchUI
            v-model="selectedStudent.registeredAt"
            date-format="yy년 mm월 dd일"
          />
        </div>

        <div class="col-span-4">
          <p>비고</p>
          <InputText class="w-full" v-model="selectedStudent.remark" />
        </div>

        <div class="col-span-4">
          <Button
            v-if="modal.label === '수정하기'"
            :label="modal.label"
            class="p-button-warning w-full"
            @click="editStudent"
          />
          <Button
            v-else-if="modal.label === '추가하기'"
            :label="modal.label"
            class="p-button-success w-full"
            @click="addStudent"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
export default {
  name: 'Admin',
};
</script>

<script setup lang="ts">
import AdminStudent from './components/AdminStudent.vue';
import AdminTeacher from './components/AdminTeacher.vue';
import { useRoute } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const route = useRoute();
const position = computed(() => route.params.position);

const account = useAccountStore();
const member = useMemberStore();

const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    if (position.value === 'student' || position.value === 'teacher') {
      dataSource.value = await member.fetchMembers({
        church: account.userData?.church,
        department: account.userData?.department,
        position: position.value,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getMembers();
});

watch(position, async () => {
  await getMembers();
});

const gradeList = [
  { name: '3학년', value: '3' },
  { name: '4학년', value: '4' },
];

const groupList = [
  { name: '새친구', value: '0' },
  { name: '1반', value: '1' },
  { name: '2반', value: '2' },
  { name: '3반', value: '3' },
  { name: '4반', value: '4' },
  { name: '5반', value: '5' },
  { name: '6반', value: '6' },
  { name: '7반', value: '7' },
];

const modal = reactive({
  status: false,
  label: '',
});

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
    const result = await member.fetchMembers({
      church: account.userData?.church,
      department: account.userData?.department,
      position: 'teacher',
      grade: student.grade,
      group: student.group,
      role: 'main',
    });

    if (result) {
      if (result[0]?.name) {
        selectedStudent.teacher = result[0]?.name;
      } else {
        const msg = '담당 교사가 없는 학급입니다. 다시 선택해주세요.';
        selectedStudent.teacher = msg;
      }
    }
  }
});

interface Student {
  grade: string;
  group: string;
  name: string;
  gender: string;
  phone: string;
  teacher: string;
  address: string;
  remark: string;
  registeredAt?: Date;
}

const openModalForEditStudent = (student: Student) => {
  modal.status = true;
  modal.label = '수정하기';

  selectedStudent.address = student.address;
  selectedStudent.gender = student.gender;
  selectedStudent.grade = student.grade;
  selectedStudent.group = student.group;
  selectedStudent.name = student.name;
  selectedStudent.phone = student.phone;
  selectedStudent.remark = student.remark;
  selectedStudent.teacher = student.teacher;
};

const openModalForAddStudent = () => {
  modal.status = true;
  modal.label = '추가하기';

  selectedStudent.address = '';
  selectedStudent.gender = 'male';
  selectedStudent.grade = '';
  selectedStudent.group = '';
  selectedStudent.name = '';
  selectedStudent.phone = '';
  selectedStudent.remark = '';
  selectedStudent.teacher = '';
  selectedStudent.registeredAt = new Date();
};

const addStudent = async () => {
  await member.createMember({
    church: account.userData?.church,
    department: account.userData?.department,
    position: 'student',
    ...selectedStudent,
  });
  alert('추가되었습니다.');
};

const editStudent = () => {
  alert('수정되었습니다.');
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}
.router-link-exact-active {
  font-weight: bold;
  color: orange;
}
</style>
