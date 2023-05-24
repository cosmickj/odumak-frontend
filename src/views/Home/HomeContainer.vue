<template>
  <section class="relative px-4 py-8">
    <header class="mb-8 text-xl">
      <p>안녕하세요!</p>
      <div class="flex items-center justify-between">
        <span>
          <strong>{{ userData?.name }}</strong> 선생님
        </span>

        <span
          v-if="userData?.provider === 'naver'"
          class="px-2 py-1 bg-[#2db400] text-white uppercase text-sm rounded"
        >
          {{ userData?.provider }} 연동
        </span>

        <span
          v-else-if="userData?.provider === 'kakao'"
          class="px-2 py-1 bg-[#fee500] text-black uppercase text-sm rounded"
        >
          {{ userData?.provider }} 연동
        </span>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3">
      <HomeMenu
        class="bg-blue-300 text-blue-700"
        job="student"
        type="daily"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-green-300 text-green-700"
        job="teacher"
        type="daily"
        route-name="AttendanceTrackerDaily"
      />

      <HomeMenu
        class="bg-orange-300 text-orange-700"
        job="student"
        type="total"
        route-name="AttendanceTrackerTotal"
      />

      <HomeMenu
        class="bg-yellow-300 text-yellow-700"
        job="teacher"
        type="total"
        route-name="AttendanceTrackerTotal"
      />

      <RouterLink
        v-if="userData?.role === 'admin'"
        class="bg-purple-300 text-purple-700 rounded-lg"
        :to="{ name: 'AdminStudent' }"
      >
        <div class="relative w-full h-full px-4 py-6 text-lg">
          <p class="text-sm">이동하기</p>
          <p class="font-bold">관리자 페이지</p>
          <span class="absolute top-6 right-4">
            <i class="pi pi-angle-right"></i>
          </span>
        </div>
      </RouterLink>
    </div>

    <Button
      rounded
      class="absolute bottom-4 right-4"
      severity="info"
      label="새친구 등록하기"
      icon="pi pi-user-plus"
      @click="visible = true"
    />

    <Dialog
      modal
      v-model:visible="visible"
      class="w-1/2"
      header="새친구 등록하기"
      position="bottom"
      :draggable="false"
      :breakpoints="{ '640px': '90vw' }"
    >
      <template #default>
        <div v-for="(student, idx) in newStudents.body" :key="idx">
          <div class="flex gap-x-5 mb-2">
            <div class="flex-1">
              <p>이름</p>
              <InputText v-model="student.name" class="w-full" />
            </div>

            <div class="flex-1 flex flex-col">
              <p>성별</p>
              <div class="flex-1 flex items-center">
                <RadioButton
                  v-model="student.gender"
                  input-id="male"
                  name="gender"
                  value="male"
                />
                <label for="male">남자</label>

                <RadioButton
                  class="ml-2"
                  v-model="student.gender"
                  input-id="female"
                  name="gender"
                  value="female"
                />
                <label for="female">여자</label>
              </div>
            </div>
          </div>

          <div class="flex gap-x-5 mb-2">
            <div class="flex-1">
              <p>학년</p>
              <Dropdown
                v-model="student.grade"
                class="w-full"
                :options="GRADE_OPTIONS"
                option-label="label"
                option-value="value"
                placeholder="학년"
              />
            </div>

            <div class="flex-1">
              <p>학급</p>
              <Dropdown
                v-model="student.group"
                class="w-full"
                placeholder="학급"
                option-label="label"
                option-value="value"
                :options="GROUP_OPTIONS"
              />
            </div>
          </div>

          <div class="flex mb-2">
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span>생년월일</span>
                <div class="flex gap-2 items-center justify-between">
                  <span>나중에 입력</span>
                  <InputSwitch
                    v-model="student.birthLater"
                    @change="toggleBirth(idx)"
                  />
                </div>
              </div>

              <Calendar
                class="w-full"
                v-model="student.birth"
                date-format="yy년 mm월 dd일"
                placeholder="생년월일을 입력해주세요"
                :disabled="student.birthLater"
                showButtonBar
              />
            </div>
          </div>

          <div class="flex mb-2">
            <div class="flex-1">
              <p>초등부 첫 출석 주일</p>
              <Calendar
                class="w-full"
                v-model="student.registeredAt"
                date-format="yy년 mm월 dd일"
                showButtonBar
              />
            </div>
          </div>

          <div class="flex gap-x-5 mb-2">
            <div class="flex-1">
              <p>주소</p>
              <InputText v-model="student.address" class="w-full" />
            </div>
          </div>

          <div class="flex gap-x-5 mb-2">
            <div class="flex-1">
              <p>연락처</p>
              <InputText v-model="student.phone" class="w-full" />
            </div>

            <div class="flex-1">
              <p>비고</p>
              <InputText v-model="student.remark" class="w-full" />
            </div>
          </div>

          <div class="flex justify-end gap-x-2 mt-4">
            <Button label="삭제하기" class="p-button-danger p-button-sm" />
          </div>
        </div>
      </template>

      <template #footer>
        <Button size="small" severity="success" label="인원 추가" />
        <Button size="small" severity="help" label="복사하기" />
        <Button size="small" severity="warning" label="제출하기" />
      </template>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import HomeMenu from './_partials/HomeMenu.vue';

import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { GRADE_OPTIONS, GROUP_OPTIONS } from '@/constants/common';
import type { MemberData } from '@/types';

const { userData } = useUserStore();

const visible = ref(false);
const errors = ref<any[]>([]);
// const members = ref<any[]>([]);

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

const newStudents = reactive<{ body: MemberData[] }>({
  body: [initSelectedStudent],
});

const createNewStudent = (data: MemberData) => Object.assign({}, data);

const addNewStudent = () => {
  newStudents.body.push(createNewStudent(initSelectedStudent));
};

const isInvalid = (index: number, key: string) => {
  if (errors.value && errors.value[index][key].length > 0) {
    return true;
  }
  return false;
};

const toggleBirth = (index: number) => {
  // const member = members.value[index];
  // if (member.birthLater) {
  //   member.birth = null;
  // } else {
  //   const date = new Date();
  //   const grade = member.grade ? ~~member.grade + 6 : 9;
  //   const year = date.getFullYear() - grade;
  //   date.setFullYear(year);
  //   date.setMonth(0);
  //   date.setDate(1);
  //   member.birth = date;
  // }
};
</script>
