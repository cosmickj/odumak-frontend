<template>
  <div class="p-5">
    <div class="text-3xl text-center">학생 일일 출석현황</div>

    <Calendar
      v-model="attendanceDate"
      class="w-full pt-5 border-round"
      :touchUI="true"
      :showIcon="true"
      :disabledDays="[1, 2, 3, 4, 5, 6]"
      @date-select="onAttendanceDateSelect"
    />

    <DataTable
      class="p-datatable-sm pt-5"
      v-if="attendanceDate && !isLoading"
      ref="table"
      :value="finalResult"
      rowGroupMode="subheader"
      groupRowsBy="teacher"
      sortMode="single"
      sortField="group"
      :sortOrder="1"
      scrollable
    >
      <template #header>
        <div class="flex justify-content-between">
          <div style="text-align: left">
            <Button
              icon="pi pi-external-link"
              class="p-button-sm p-button-secondary"
              label="엑셀저장"
              @click="exportCSV"
            />
          </div>
          <!-- <div class="flex justify-content-end align-items-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filter.global.value" class="p-inputtext-sm" placeholder="검색하기" />
            </span>
          </div> -->
        </div>
      </template>

      <Column field="grade" header="학년" class="justify-content-center"></Column>
      <Column field="group" header="학급" class="justify-content-center"></Column>
      <Column field="name" header="이름" class="justify-content-center"></Column>
      <Column field="attendance" header="출석현황" class="justify-content-center">
        <template #body="slotProps">
          <span :class="`attendance-${slotProps.data.attendance}`">
            {{ translateAttendance(slotProps.data.attendance) }}
          </span>
        </template>
      </Column>

      <template #groupheader="slotProps">
        <span class="text-yellow-500 font-bold">
          {{ slotProps.data.teacher }}
        </span>
      </template>

      <template #groupfooter="slotProps">
        <td style="min-width: 80%">
          <div style="text-align: right; width: 100%">총 학생수:</div>
        </td>
        <td style="width: 20%">
          {{ calculateStudentTotal(slotProps.data.teacher) }}
        </td>
      </template>
    </DataTable>

    <div class="spinner" v-else-if="attendanceDate && isLoading">
      <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
    </div>

    <AppFingerUpper v-else-if="!attendanceDate && isLoading" class="pt-5" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import AppFingerUpper from "@/components/AppFingerUpper.vue";

// import { FilterMatchMode } from "primevue/api";
// interface Filter {
//   global: {
//     value: string;
//     matchMode: string;
//   };
// }
// const filter = ref<Filter>({
//   global: { value: "", matchMode: FilterMatchMode.CONTAINS },
// });

interface StudentAttendance {
  grade: string;
  group: string;
  name: string;
  teacher: string;
  attendance: string;
}

const store = useStore();

const isLoading = ref(true);
const attendanceDate = ref<Date>();
const finalResult = ref<StudentAttendance[]>([]);

const onAttendanceDateSelect = async () => {
  isLoading.value = true;

  const allStudents = await store.dispatch("attendance/fetchAllStudents");
  const studentAttendances = await store.dispatch("attendance/fetchStudentAttendancesByDate", {
    date: attendanceDate.value,
  });

  for (let studentAttendance of studentAttendances) {
    for (let student of allStudents) {
      if (
        student.grade === studentAttendance.grade &&
        student.group === studentAttendance.group &&
        student.name === studentAttendance.name
      ) {
        student.attendance = studentAttendance.attendance;
        break;
      }
    }
  }

  // finalResult.value = sortByTeacher(allStudents);
  finalResult.value = allStudents;
  isLoading.value = false;
};

// const sortByTeacher = (studentAttendance: StudentAttendance[]) => {
//   studentAttendance.sort((a, b) => (a.teacher > b.teacher ? 1 : b.teacher > a.teacher ? -1 : 0));
//   return studentAttendance;
// };

const translateAttendance = (attendance: string) => {
  if (attendance === "online") return "온라인";
  if (attendance === "offline") return "현장";
  if (attendance === "absence") return "결석";
  else return "미입력";
};

const calculateStudentTotal = (name: string) => {
  let total = 0;
  if (finalResult.value) {
    for (let result of finalResult.value) {
      if (result.teacher === name) total++;
    }
  }
  return total;
};

const table = ref();
const exportCSV = () => table.value.exportCSV();
</script>

<style scoped>
.attendance-online {
  background-color: #fbc02d;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
}
.attendance-offline {
  background-color: #4caf50;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
}
.attendance-absence {
  background-color: #ff4032;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
}
/* .attendance-none { */
.attendance- {
  background-color: #cccccc;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
}
.spinner {
  position: absolute;
  top: calc(50% - 1.5rem);
  left: calc(50% - 1.5rem);
}
</style>
