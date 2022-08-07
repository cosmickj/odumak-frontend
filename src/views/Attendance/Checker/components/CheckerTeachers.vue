<template>
  <form class="grow flex flex-col select-none" @submit.prevent="handleSubmit">
    <div class="grow overflow-auto h-0">
      <div v-for="(teacher, idx) in teachersAttendance" :key="idx">
        <div class="attendance bg-white shadow">
          <div class="flex flex-col items-center">
            <!-- 교사 이름 -->
            <p>{{ teacher.name }}</p>

            <!-- 교사 담당 학급 -->
            <p v-if="teacher.grade === '0'">새친구</p>
            <p v-else-if="teacher.grade !== '-1'">
              {{ teacher.grade }}-{{ teacher.group }}
            </p>
          </div>

          <input
            v-model="teachersAttendance[idx].attendance"
            class="attendance__input"
            type="radio"
            value="absence"
            :id="`absence-${teacher.name}`"
          />
          <label
            class="shadow-md attendance__label attendance__label__absence"
            :for="`absence-${teacher.name}`"
          >
            결석
          </label>

          <input
            v-model="teachersAttendance[idx].attendance"
            class="attendance__input"
            type="radio"
            value="online"
            :id="`online-${teacher.name}`"
          />
          <label
            class="shadow-md attendance__label attendance__label__online"
            :for="`online-${teacher.name}`"
          >
            온라인
          </label>

          <input
            v-model="teachersAttendance[idx].attendance"
            class="attendance__input"
            type="radio"
            value="offline"
            :id="`offline-${teacher.name}`"
          />
          <label
            class="shadow-md attendance__label attendance__label__offline"
            :for="`offline-${teacher.name}`"
          >
            현장
          </label>

          <!-- 선생님별 학생 출석 현황 -->
          <div
            v-if="teacher.role === 'main'"
            class="w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="requestStudentsAttendance(teacher, idx)"
          >
            <i
              class="pi pi-angle-down"
              :class="{ 'pi--open': currnetIndexList.includes(idx) }"
            ></i>
          </div>

          <div
            v-else
            class="w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <i class="pi pi-minus"></i>
          </div>
        </div>

        <div
          v-if="
            !isLoading[idx] &&
            teacher.role === 'main' &&
            currnetIndexList.includes(idx)
          "
        >
          <checker-students
            v-model="studentsAttendanceByTeacher[teacher.name].attendanceRecord"
            :document-id="studentsAttendanceByTeacher[teacher.name].documentId"
            :attendance-date="attendanceDate"
            :is-sub="true"
            @submit="submitStudentAttendance(teacher, idx)"
          />
        </div>
      </div>
    </div>

    <div v-if="!documentId" class="flex justify-center">
      <Button
        class="w-2/6 p-button-lg p-button-warning"
        label="제출하기"
        type="submit"
      />
    </div>

    <div v-else class="flex justify-center">
      <Button
        class="w-2/6 p-button-lg p-button-danger"
        label="수정하기"
        type="submit"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import CheckerStudents from './CheckerStudents.vue';

import { computed, ref, watch } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAttendanceStore } from '@/store/attendance';
import { useMemberStore } from '@/store/member';
import type { Teacher } from '@/types';

const props = defineProps<{
  documentId: string;
  attendanceDate: Date;
  modelValue: any;
}>();

const emit = defineEmits(['submit', 'update:modelValue']);

const account = useAccountStore();
const attendance = useAttendanceStore();
const member = useMemberStore();

const teachersAttendance = computed<Teacher[]>({
  get: () => props.modelValue,
  set: (teachersAttendance) => emit('update:modelValue', teachersAttendance),
});

const userData = computed(() => account.userData);

const isLoading = ref<boolean[]>([]);

const currnetIndexList = ref<number[]>([]);

const studentsAttendanceByTeacher = ref<any>({}); // TODO: 타입 정의 다시하기

watch(
  () => props.attendanceDate,
  () => {
    currnetIndexList.value = [];
    studentsAttendanceByTeacher.value = {};
  }
);

const handleSubmit = () => emit('submit');

const requestStudentsAttendance = async (
  teacher: Teacher,
  currentIndex: number
) => {
  isLoading.value = Array(currentIndex).fill(false);
  isLoading.value[currentIndex] = true;

  const targetIndex = currnetIndexList.value.indexOf(currentIndex);
  if (targetIndex === -1) {
    currnetIndexList.value.push(currentIndex);
  } else {
    currnetIndexList.value.splice(targetIndex, 1);
  }

  if (teacher.role === 'main') {
    if (studentsAttendanceByTeacher.value[teacher.name]) {
      // 조회한 기록이 있음
    }
    // 관리자가 교사가 되어 학생 출석 입력
    else {
      const members = await member.fetchMembers({
        church: userData.value?.church,
        department: userData.value?.department,
        grade: teacher.grade,
        group: teacher.group,
        position: 'student',
        role: 'teacher',
      });

      const result = await attendance.fetchAttendance({
        attendanceDate: props.attendanceDate,
        church: userData.value?.church,
        department: userData.value?.department,
        grade: teacher.grade,
        group: teacher.group,
        members,
        position: 'student',
        role: 'teacher',
      });

      studentsAttendanceByTeacher.value[teacher.name] = {
        documentId: result!.documentId,
        attendanceRecord: result!.attendanceRecord,
      };
    }
  }

  isLoading.value[currentIndex] = false;
};

// 관리자가 교사를 대신해서 학생 출석을 기입
const submitStudentAttendance = async (teacher: Teacher, idx: number) => {
  const response = await attendance.addAttendance({
    documentId: studentsAttendanceByTeacher.value[teacher.name].documentId,
    attendanceDate: props.attendanceDate,
    createUser: userData.value?.name,
    church: userData.value?.church,
    department: userData.value?.department,
    grade: teacher.grade,
    group: teacher.group,
    position: 'student',
    records: studentsAttendanceByTeacher.value[teacher.name].attendanceRecord,
  });

  studentsAttendanceByTeacher.value[teacher.name].documentId =
    response.documentId;
  alert(response.message);
};
</script>

<style scoped>
.attendance {
  padding: 1rem 0;
  margin: 0.5rem 0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.attendance__input {
  display: none;
  height: 0;
  width: 0;
}
.attendance__label {
  opacity: 0.4;
  height: 40px;
  width: 40px;
  border-radius: 0.8rem;
  font-size: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s;
}
.attendance__label__offline {
  border: 2px solid #4caf50;
}
.attendance__label__online {
  border: 2px solid #fbc02d;
}
.attendance__label__absence {
  border: 2px solid #ff4032;
}
.attendance__input:checked + .attendance__label {
  opacity: 1;
  animation: jelly 0.6s ease;
}
.attendance__input:checked + .attendance__label.attendance__label__offline {
  background-color: #4caf50;
  color: white;
}
.attendance__input:checked + .attendance__label.attendance__label__online {
  background-color: #fbc02d;
}
.attendance__input:checked + .attendance__label.attendance__label__absence {
  background-color: #ff4032;
}
.pi {
  font-size: 1.5rem;
  transition: all 0.3s;
}
.pi--open {
  transform: rotate(180deg);
}
</style>
