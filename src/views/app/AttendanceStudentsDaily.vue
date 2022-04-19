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

    <!-- <DataTable
      v-if="attendanceDate"
      ref="dt"
      class="p-datatable-sm pt-5"
      scrollHeight="calc(100vh - 230px)"
      :scrollable="true"
      :removableSort="true"
      :value="studentsDailyAttendance"
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

      <Column header="학년반" :sortable="true">
        <template #body="slotProps">
          <span>{{ `${slotProps.data.grade}-${slotProps.data.group}` }}</span>
        </template>
      </Column>
      <Column field="teacher" header="담임" :sortable="true"></Column>
      <Column field="name" header="학생" :sortable="true"></Column>
      <Column field="attendance" header="출결" :sortable="true">
        <template #body="slotProps">
          <span :class="`attendance-${slotProps.data.attendance}`">
            {{ convertKorean(slotProps.data.attendance) }}
          </span>
        </template>
      </Column>
    </DataTable> -->

    <!-- <AppFingerUpper v-else class="pt-5" /> -->

    <DataTable
      :value="customers"
      rowGroupMode="subheader"
      groupRowsBy="teacher"
      sortMode="single"
      sortField="teacher"
      :sortOrder="1"
      scrollable
      scrollHeight="500px"
    >
      <Column header="학년반" :sortable="true">
        <template #body="slotProps">
          <span>{{ `${slotProps.data.grade}-${slotProps.data.group}` }}</span>
        </template>
      </Column>
      <Column field="teacher" header="Representative"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="attendance" header="Attendance"></Column>

      <template #groupheader="slotProps">
        <span class="image-text">{{ slotProps.data.teacher }}</span>
      </template>

      <template #groupfooter="slotProps">
        <td style="min-width: 80%">
          <div style="text-align: right; width: 100%">Total Customers</div>
        </td>
        <td style="width: 20%">
          <!-- {{ calculateCustomerTotal(slotProps.data.teacher) }} -->
        </td>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import AppFingerUpper from "@/components/AppFingerUpper.vue";

// import { FilterMatchMode } from "primevue/api";
// interface Filter {
//   global: {
//     value: string;
//     matchMode: string;
//   };
// }
// const dt = ref<any>(null);
// const filter = ref<Filter>({
//   global: { value: "", matchMode: FilterMatchMode.CONTAINS },
// });
// const exportCSV = () => {
//   dt.value.exportCSV();
// };

const store = useStore();

const attendanceDate = ref<Date>();
const studentsDailyAttendance = computed(() => store.state.attendance.students);

const onAttendanceDateSelect = async () => {
  await store.dispatch("attendance/fetchStudents");
  await store.dispatch("attendance/fetchAttendanceStudentsDaily", {
    date: attendanceDate.value,
  });
};

const convertKorean = (attendance: string) => {
  if (attendance === "online") return "온라인";
  if (attendance === "offline") return "현장";
  if (attendance === "absence") return "결석";
};

// Subheader
const customers = computed(
  () => store.state.attendance.attendanceStudentsDaily
);

const calculateCustomerTotal = (name) => {
  let total = 0;

  if (customers.value) {
    for (let customer of customers.value) {
      if (customer.representative.name === name) {
        total++;
      }
    }
  }

  return total;
};
</script>

<style scoped>
.attendance-online {
  background-color: #fbc02d;
  padding: 0.5rem;
  border-radius: 3px;
  font-weight: bold;
}
.attendance-offline {
  background-color: #4caf50;
  padding: 0.5rem;
  border-radius: 3px;
  font-weight: bold;
}
.attendance-absence {
  background-color: #ff4032;
  padding: 0.5rem;
  border-radius: 3px;
  font-weight: bold;
}
</style>
