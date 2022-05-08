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
      class="p-datatable-sm pt-5"
      ref="table"
      :value="finalResult"
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
        </div>
      </template>

      <Column field="grade" header="학년" class="justify-content-center"></Column>
      <Column field="group" header="학급" class="justify-content-center"></Column>
      <Column field="teacher" header="이름" class="justify-content-center"></Column>
      <Column field="attendance" header="출석현황" class="justify-content-center">
        <template #body="slotProps">
          <span :class="`attendance-${slotProps.data.attendance}`">
            {{ translateAttendance(slotProps.data.attendance) }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const attendanceDate = ref<Date>();
const finalResult = ref([]);

const onAttendanceDateSelect = async () => {
  const result = await store.dispatch("attendance/fetchAllStudents");
  const unique = [
    ...new Map(
      result.map((item: any) => [
        item["teacher"],
        { grade: item.grade, group: item.group, teacher: item.teacher, attendance: item.attendance },
      ])
    ).values(),
  ];

  const result2 = await store.dispatch("attendance/fetchTeacherAttendancesByDate", {
    date: attendanceDate.value,
  });

  for (let teacherAttendance of result2) {
    for (let teacher of unique) {
      if (
        teacher.grade === teacherAttendance.grade &&
        teacher.group === teacherAttendance.group &&
        teacher.name === teacherAttendance.teacher
      ) {
        teacher.attendance = teacherAttendance.attendance;
        break;
      }
    }
  }

  unique.sort((a, b) => ~~a.grade - ~~b.grade || ~~a.group - ~~b.group);

  finalResult.value = unique;
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

<style scoped></style>
