<template>
  <section class="relative px-4 py-8">
    <header class="mb-8 text-xl">
      <p>안녕하세요!</p>
      <div class="flex items-center justify-between">
        <span>
          <strong>{{ userStore.userData?.name }}</strong> 선생님
        </span>

        <span
          v-if="userStore.userData?.provider === 'naver'"
          class="rounded bg-[#2db400] px-2 py-1 text-sm uppercase text-white"
        >
          {{ userStore.userData?.provider }} 연동
        </span>

        <span
          v-else-if="userStore.userData?.provider === 'kakao'"
          class="rounded bg-[#fee500] px-2 py-1 text-sm uppercase text-black"
        >
          {{ userStore.userData?.provider }} 연동
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
        v-if="userStore.userData?.role.system === 'admin'"
        class="rounded-lg bg-purple-300 text-purple-700"
        :to="{ name: 'AdminStudent' }"
      >
        <div class="relative h-full w-full px-4 py-6 text-lg">
          <p class="text-sm">이동하기</p>
          <p class="font-bold">관리자 페이지</p>
          <span class="absolute right-4 top-6">
            <i class="pi pi-angle-right"></i>
          </span>
        </div>
      </RouterLink>
    </div>

    <!-- <Button
      v-if="
        userStore.userData?.grade === '0' && userStore.userData?.group === '0'
      "
      raised
      rounded
      class="absolute bottom-4 right-4"
      severity="info"
      icon="pi pi-user-plus"
      label="새친구 등록하기"
      @click="visible = true"
    /> -->

    <Dialog
      modal
      v-model:visible="visible"
      class="w-1/3"
      content-class="overflow-x-hidden p-0"
      header="새친구 등록하기"
      position="bottom"
      :draggable="false"
      :breakpoints="{ '640px': '95vw' }"
      @update:visible="confirmClose"
    >
      <template #default>
        <TransitionGroup name="list">
          <div
            v-for="(student, idx) in newStudents.body"
            class="m-3 rounded-lg bg-slate-100 p-3 first:mt-0"
            :key="student.id"
          >
            <p class="mb-4 font-bold">{{ idx + 1 }}.</p>

            <div class="mb-2 flex gap-x-5">
              <div class="flex-1">
                <InputText
                  v-model="student.name"
                  class="w-full"
                  :class="{ 'p-invalid': isInvalid(idx, 'name') }"
                  placeholder="이름"
                />
              </div>

              <div class="flex flex-1 flex-col">
                <div class="flex flex-1 items-center gap-1">
                  <RadioButton v-model="student.gender" input-id="male" name="gender" value="male" />
                  <label for="male">남</label>

                  <RadioButton
                    class="ml-2"
                    v-model="student.gender"
                    input-id="female"
                    name="gender"
                    value="female"
                  />
                  <label for="female">여</label>
                </div>
              </div>
            </div>

            <div class="mb-2 flex gap-x-5">
              <div class="flex-1">
                <Dropdown
                  v-model="student.grade"
                  class="w-full"
                  :class="{ 'p-invalid': isInvalid(idx, 'grade') }"
                  :options="GRADE_OPTIONS"
                  option-label="label"
                  option-value="value"
                  placeholder="학년"
                />
              </div>

              <div class="flex-1">
                <Dropdown
                  v-model="student.group"
                  class="w-full"
                  :class="{ 'p-invalid': isInvalid(idx, 'group') }"
                  placeholder="학급"
                  option-label="label"
                  option-value="value"
                  :options="GROUP_OPTIONS"
                />
              </div>
            </div>

            <div class="mb-2 flex">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span>생년월일</span>
                  <div class="flex items-center justify-between gap-2">
                    <span>나중에 입력</span>
                    <InputSwitch v-model="student.birthLater" @change="toggleBirth(idx)" />
                  </div>
                </div>

                <Calendar
                  touch-u-i
                  showButtonBar
                  class="w-full"
                  v-model="student.birth"
                  date-format="yy년 mm월 dd일"
                  placeholder="생년월일을 입력해주세요"
                  :disabled="student.birthLater"
                />
              </div>
            </div>

            <div class="mb-2 flex">
              <div class="flex-1">
                <p>초등부 첫 출석 주일</p>
                <Calendar
                  touch-u-i
                  showButtonBar
                  class="w-full"
                  v-model="student.registeredAt"
                  date-format="yy년 mm월 dd일"
                  :max-date="maxDate"
                  :disabled-days="[1, 2, 3, 4, 5, 6]"
                />
              </div>
            </div>

            <div class="mb-2 flex gap-x-5">
              <div class="flex-1">
                <InputText v-model="student.remark" class="w-full" placeholder="비고" />
              </div>
            </div>
            <div class="mt-6 flex justify-center gap-2">
              <Button outlined size="small" severity="help" label="복사" @click="copyNewStudent(idx)" />
              <Button outlined size="small" severity="success" label="추가" @click="addNewStudent" />
              <Button
                outlined
                size="small"
                severity="danger"
                label="삭제"
                :disabled="newStudents.body.length === 1"
                @click="deleteNewStudent(idx)"
              />
            </div>
          </div>
        </TransitionGroup>
      </template>

      <template #footer>
        <div class="flex flex-wrap justify-end gap-2">
          <Button raised size="small" severity="warning" label="제출하기" @click="submitNewStudents" />
        </div>
      </template>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import { Member } from '@/models';
import { useMemberStore } from '@/store/member';
import { useUserStore } from '@/store/user';
import { getPreviousSunday } from '@/utils/useCalendar';
import { GRADE_OPTIONS, GROUP_OPTIONS } from '@/constants/common';
import HomeMenu from './HomeMenu.vue';

// import type { NewStudent } from '@/types';

const memberStore = useMemberStore();
const userStore = useUserStore();

const visible = ref(false);

const id = ref(1);
const initSelectedStudent = {
  id: 0,
  name: '',
  birth: null,
  birthLater: true,
  gender: 'male',
  church: '',
  department: '',
  job: 'student',
  isNewFriendClass: false,
  grade: '',
  group: '',
  role: { system: 'user', teacher: 'common' },
  registeredAt: getPreviousSunday(),
  remark: '',
};

const scroll = () => {
  setTimeout(() => {
    const container = document.getElementsByClassName('p-dialog-content');

    container[0].scroll({
      top: 473 * (newStudents.body.length - 1),
      left: 0,
      behavior: 'smooth',
    });
  }, 100);
};

const newStudents = reactive<{ body: any[] }>({
  body: [{ ...initSelectedStudent, id: id.value }],
});

const addNewStudent = () => {
  id.value++;
  newStudents.body.push({ ...initSelectedStudent, id: id.value });
  scroll();
};

const deleteNewStudent = (index: number) => {
  newStudents.body.splice(index, 1);
};

const copyNewStudent = (index: number) => {
  id.value++;
  newStudents.body.push({ ...newStudents.body[index], id: id.value });
  scroll();
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

const $errors = computed(() => $v.value.$errors[0]?.$response?.$errors);

const confirmClose = () => {
  if (confirm('작성한 내용이 모두 사라집니다. 정말 닫으시겠습니까?')) {
    newStudents.body = [{ ...initSelectedStudent }];
    $v.value.$reset();
    return;
  }
  visible.value = true;
};

const submitNewStudents = async () => {
  try {
    const isFormCorrect = await $v.value.body.$validate();
    if (!isFormCorrect) {
      return;
    }

    const { church, department } = userStore.userData || {};

    if (church && department) {
      const members = newStudents.body.map(({ id, ...params }) => params);
      memberStore.createMultiple({ church, department, members });
    }

    alert('추가되었습니다.');

    newStudents.body = [{ ...initSelectedStudent }];
    $v.value.$reset();
    visible.value = false;
  } catch (error) {
    alert(error);
  }
};

const isInvalid = (index: number, key: string) => {
  if ($errors.value && $errors.value[index][key].length > 0) {
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

const maxDate = getPreviousSunday();
</script>

<style scoped>
.p-dialog .p-dialog-footer button {
  margin: unset;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
