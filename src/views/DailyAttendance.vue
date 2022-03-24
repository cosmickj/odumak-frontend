<template>
  <div id="daily-attendance" v-if="authIsReady">
    <div class="daily-attendance__container">
      <div class="title__container" v-if="userInfo">
        <h2 class="title">일일 출석 확인</h2>
        <!-- <span class="fz-16">3-1</span> -->
        <!-- <span class="fz-16">{{ userInfo.name }} 선생님</span> -->
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

      <div class="pt-10" v-if="selectedDate">
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
          <Column field="attendance" header="출결" :sortable="true"></Column>
        </DataTable>
      </div>

      <FingerUpper v-else></FingerUpper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useStore } from "vuex";
import FingerUpper from "@/components/FingerUpper.vue";

export default defineComponent({
  components: { FingerUpper },
  setup() {
    const store = useStore();
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
    ]);

    return {
      authIsReady: computed(() => store.state.user.authIsReady),
      userInfo: computed(() => store.state.userInfo),
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
  justify-content: space-between;
  font-size: 3rem;
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
