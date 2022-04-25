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
      v-if="attendanceDate && !isLoading"
      ref="dt"
      :value="finalResult"
      class="p-datatable-sm pt-5"
      rowGroupMode="subheader"
      groupRowsBy="teacher"
      removableSort
      sortMode="single"
      sortField="teacher"
      scrollable
      :sortOrder="1"
      :filters="filter"
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
          <div class="flex justify-content-end align-items-center">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filter.global.value"
                class="p-inputtext-sm"
                placeholder="검색하기"
              />
            </span>
          </div>
        </div>
      </template>

      <Column field="teacher" header="선생님"></Column>
      <Column
        field="name"
        header="이름"
        :sortable="true"
        class="justify-content-center"
      ></Column>
      <Column
        field="grade"
        header="학년"
        class="justify-content-center"
      ></Column>
      <Column
        field="group"
        header="학급"
        class="justify-content-center"
      ></Column>
      <Column
        field="attendance"
        header="출석현황"
        class="justify-content-center"
      >
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
          {{ calculateCustomerTotal(slotProps.data.teacher) }}
        </td>
      </template>
    </DataTable>

    <AppFingerUpper v-else-if="!attendanceDate && isLoading" class="pt-5" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { FilterMatchMode } from "primevue/api";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import totalClassesData from "@/json/total-classes-2022.json";

interface Filter {
  global: {
    value: string;
    matchMode: string;
  };
}
const filter = ref<Filter>({
  global: { value: "", matchMode: FilterMatchMode.CONTAINS },
});
const dt = ref<any>(null);
const exportCSV = () => dt.value.exportCSV();

const store = useStore();
const attendanceDate = ref<Date>();
// const studentsDailyAttendance = computed(() => store.state.attendance.students);
const customers = computed(
  () => store.state.attendance.attendanceStudentsDaily
);

// const onAttendanceDateSelect = async () => {
//   await store.dispatch("attendance/fetchStudents");
//   await store.dispatch("attendance/fetchAttendanceStudentsDaily", {
//     date: attendanceDate.value,
//   });
// };

const translateAttendance = (attendance: string) => {
  if (attendance === "online") return "온라인";
  if (attendance === "offline") return "현장";
  if (attendance === "absence") return "결석";
  else return "미입력";
};

const calculateCustomerTotal = (name: string) => {
  let total = 0;
  if (customers.value) {
    for (let customer of customers.value) {
      if (customer.teacher === name) total++;
    }
  }
  return total;
};

// 리팩토링
const isLoading = ref(true);
const totalClasses = totalClassesData;
const finalResult = ref([]);

const onAttendanceDateSelect = async () => {
  isLoading.value = true;
  finalResult.value = [];

  for (let { grade, group } of totalClasses) {
    const params = {
      date: attendanceDate.value,
      grade,
      group,
    };
    const result = await store.dispatch(
      "attendance/fetchStudentAttendances",
      params
    );
    finalResult.value.push(...result);
  }
  isLoading.value = false;
};
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
.attendance-none {
  background-color: #cccccc;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
}
</style>
