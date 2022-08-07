<template>
  <form class="grow flex flex-col select-none" @submit.prevent="handleSubmit">
    <div class="overflow-auto h-0 grow">
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
            :for="`absence-${teacher.name}`"
            class="shadow-md attendance__label attendance__label__absence"
          >
            <span>결석</span>
          </label>

          <input
            v-model="teachersAttendance[idx].attendance"
            class="attendance__input"
            type="radio"
            value="online"
            :id="`online-${teacher.name}`"
          />
          <label
            :for="`online-${teacher.name}`"
            class="shadow-md attendance__label attendance__label__online"
          >
            <span>온라인</span>
          </label>

          <input
            v-model="teachersAttendance[idx].attendance"
            class="attendance__input"
            type="radio"
            value="offline"
            :id="`offline-${teacher.name}`"
          />
          <label
            :for="`offline-${teacher.name}`"
            class="shadow-md attendance__label attendance__label__offline"
          >
            <span>현장</span>
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

          <div v-else class="w-8 h-8 flex items-center justify-center cursor-pointer">
            <i class="pi pi-minus"></i>
          </div>
        </div>

        <div
          v-if="
            !isLoading[idx] &&
            teacher.role === 'teacher' &&
            currnetIndexList.includes(idx)
          "
        >
          <CheckerStudents
            v-model="studentsAttendanceByTeacher[teacher.name].studentsAttendance"
            :document-id="studentsAttendanceByTeacher[teacher.name].documentId"
            :attendance-date="attendanceDate"
            :writer="teacher.name"
            :is-sub="true"
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

  <TheLoader :is-loading="isLoader" />
</template>

<script setup lang="ts">
import CheckerStudents from './CheckerStudents.vue';
import TheLoader from '@/components/TheLoader.vue';

import { computed, ref, watch } from 'vue';
import { useAttendanceStore } from '@/store/attendance';
import type { Student, Teacher } from '@/types';

const attendance = useAttendanceStore();

const props = defineProps<{
  documentId: string;
  attendanceDate: Date;
  modelValue: any;
}>();

const emit = defineEmits(['submit', 'update:modelValue']);

const teachersAttendance = computed<Teacher[]>({
  get: () => props.modelValue,
  set: (teachersAttendance) => emit('update:modelValue', teachersAttendance),
});

const isLoading = ref<boolean[]>([]);
const currnetIndexList = ref<number[]>([]);
const studentsAttendanceByTeacher = ref<any>({}); // TODO: 타입 정의 다시하기

const isLoader = ref(false);

watch(
  () => props.attendanceDate,
  () => {
    currnetIndexList.value = [];
    studentsAttendanceByTeacher.value = {};
  }
);

const requestStudentsAttendance = async (teacher: Teacher, currentIndex: number) => {
  isLoader.value = true;
  isLoading.value = Array(currentIndex).fill(false);
  isLoading.value[currentIndex] = true;

  const targetIndex = currnetIndexList.value.indexOf(currentIndex);
  if (targetIndex === -1) {
    currnetIndexList.value.push(currentIndex);
  } else {
    currnetIndexList.value.splice(targetIndex, 1);
  }

  if (teacher.role === 'teacher') {
    if (studentsAttendanceByTeacher.value[teacher.name]) {
      // ignore
    } else {
      const result = await attendance.fetchStudentsAttendance({
        date: props.attendanceDate,
        grade: teacher.grade,
        group: teacher.group,
        teacher: teacher.name,
      });
      result.studentsAttendance.forEach((student: Student) => {
        if (!student.attendance) student.attendance = 'offline';
      });
      studentsAttendanceByTeacher.value[teacher.name] = {
        documentId: result.documentId,
        studentsAttendance: result.studentsAttendance,
      };
    }
  }

  isLoader.value = false;
  isLoading.value[currentIndex] = false;
};

// const params = {
//   documentId: props.documentId,
//   date: props.attendanceDate,
//   teachersAttendance: teachersAttendance.value,
// };
// const { id } = await attendance.addTeachersAttendance(params);
// emit('onUploaded:teachersAttendance', { id });
// if (!props.documentId) {
//   alert('교사 출석 현황이 제출되었습니다.');
// } else {
//   alert('교사 출석 현황이 수정되었습니다.');
// }
const handleSubmit = () => emit('submit');
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
@keyframes jelly {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
.pi {
  font-size: 1.5rem;
  transition: all 0.3s;
}
.pi--open {
  transform: rotate(180deg);
}
</style>
