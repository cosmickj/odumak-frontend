<template>
  <div class="p-5">
    <div class="text-3xl text-center">교사 일일 출석현황</div>

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
      ref="table"
      class="p-datatable-sm pt-5"
      :value="finalResult"
      sortMode="single"
      sortField="group"
      :sortOrder="1"
      scrollable
    >
      <template #header>
        <div class="flex justify-content-between">
          <div style="text-align: left">
            <!-- 저장하기 -->
            <Button
              class="p-button-sm p-button-secondary"
              icon="pi pi-download"
              label="저장하기"
              @click="exportCSV"
            />
          </div>
        </div>
      </template>

      <Column field="name" header="이름" class="justify-content-center"></Column>
      <Column field="attendance" header="출석현황" class="justify-content-center">
        <template #body="slotProps">
          <span :class="`attendance-${slotProps.data.attendance}`">
            {{ translateAttendance(slotProps.data.attendance) }}
          </span>
        </template>
      </Column>
    </DataTable>

    <AppFingerUpper v-else-if="!attendanceDate && isLoading" class="pt-5" />

    <div class="spinner" v-else-if="attendanceDate && isLoading">
      <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppFingerUpper from "@/components/AppFingerUpper.vue";
import { useStore } from "vuex";

const store = useStore();

const isLoading = ref(true);
const attendanceDate = ref<Date>();
const finalResult = ref([]);

const onAttendanceDateSelect = async () => {
  try {
    isLoading.value = true;

    const fetchTeachersAttendanceByDateRet = await store.dispatch("attendance/fetchTeachersAttendanceByDate", {
      date: attendanceDate.value,
    });

    finalResult.value = fetchTeachersAttendanceByDateRet;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const translateAttendance = (attendance: string) => {
  if (attendance === "online") return "온라인";
  if (attendance === "offline") return "현장";
  if (attendance === "absence") return "결석";
  else return "미입력";
};

const table = ref();
const exportCSV = () => table.value.exportCSV();
</script>

<style scoped>
.attendance-online {
  width: 40px;
  height: 24px;
  background-color: #fbc02d;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attendance-offline {
  width: 40px;
  height: 24px;
  background-color: #4caf50;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attendance-absence {
  width: 40px;
  height: 24px;
  background-color: #ff4032;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attendance-undefined {
  width: 40px;
  height: 24px;
  background-color: #cccccc;
  border-radius: 3px;
  font-weight: bold;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  margin-top: 2rem;
  text-align: center;
}
</style>
