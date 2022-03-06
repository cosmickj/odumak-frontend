<template>
  <div id="daily-attendance">
    <div class="daily-attendance__container">
      <div class="title__container">
        <h2 class="title">일일 출석 확인</h2>
        <span>이경준 선생님</span>
        <span>3-1</span>
      </div>

      <div class="calendar__container pt-10">
        <Calendar
          v-model="selectedDate"
          class="w-100"
          :touchUI="true"
          :showIcon="true"
          :disabledDays="[1, 2, 3, 4, 5, 6]"
        />
      </div>

      <div v-if="!selectedDate">날짜를 선택하세요.</div>
      <div class="pt-10" v-else>
        <DataTable
          class="p-datatable-sm"
          :value="dailyAttendances"
          :scrollable="true"
          scrollHeight="calc(100vh - 230px)"
          removableSort
          :filters="filter"
        >
          <template #header>
            <div class="search__container">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  class="p-inputtext-sm"
                  v-model="filter.global.value"
                  placeholder="Search"
                />
              </span>
            </div>
          </template>
          <Column field="class" header="학년반" :sortable="true"></Column>
          <Column field="teacher" header="담임" :sortable="true"></Column>
          <Column field="student" header="학생" :sortable="true"></Column>
          <Column field="attendance" header="출결" :sortable="true">
            <!-- <template #body="{ data }">
              <span :class="'customer-badge status-' + data.attendance">
                {{ data.attendance }}
              </span>
            </template> -->
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { FilterMatchMode } from "primevue/api";

export default defineComponent({
  setup() {
    const filter = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const selectedDate = ref("");
    // prettier-ignore
    const dailyAttendances = ref([
      { class: "3-1", teacher: "강경환", student: "박주하", attendance: "온라인" },
      { class: "3-1", teacher: "강경환", student: "전지훈", attendance: "미참여" },
      { class: "3-1", teacher: "강경환", student: "윤서후", attendance: "현장예배" },
      { class: "3-1", teacher: "강경환", student: "김동률", attendance: "현장예배" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      { class: "3-2", teacher: "안정임", student: "신윤솔", attendance: "온라인" },
      // 서버에서 값을 넘겨줄 때 색깔 값을 계산해서 넣어서 넘겨주자.
    ]);

    return {
      selectedDate,
      dailyAttendances,
      filter,
    };
  },
});
</script>

<style>
.p-datatable {
  border-radius: 3px;
  overflow: hidden;
}
.p-datatable-table {
  font-size: 12px;
}
</style>

<style scoped>
.title__container {
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
}
.daily-attendance__container {
  padding: var(--container-padding);
}
.search__container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
