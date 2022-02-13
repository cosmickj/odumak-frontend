<template>
  <div>
    <div class="d-flex justify-content-center align-items-center date-wrapper">
      <span class="date">{{ selectedDate }}</span>
    </div>

    <div class="d-flex">
      <b-form-datepicker
        class="m-2"
        v-model="selectedDate"
        size="sm"
        placeholder="날짜 선택"
        :button-only="true"
        :date-disabled-fn="dateDisabled"
      ></b-form-datepicker>

      <b-form-select
        class="m-2 attendance-select"
        v-model="selectedAttendanceType"
        :options="attendanceTypes"
        size="sm"
      ></b-form-select>

      <b-input-group class="m-2" size="sm">
        <b-input-group-prepend>
          <b-input-group-text>
            <i class="fas fa-search"></i>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input
          v-model="filter"
          type="search"
          placeholder="Search..."
        ></b-form-input>
      </b-input-group>
    </div>

    <div class="table-container">
      <b-table
        sticky-header="calc(100vh - 175px)"
        :items="items"
        :fields="fields"
        :filter="filter"
      ></b-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: "",
      selectedAttendanceType: "online",
      attendanceTypes: [
        { value: "online", text: "온라인 예배" },
        { value: "offline", text: "현장 예배" },
        { value: "dabsence", text: "미참여" },
      ],
      // prettier-ignore
      items: [
        { "class": "3-1", "teacher": "강경환", "student": "박주하", "attendance": "온라인" },
        { "class": "3-1", "teacher": "강경환", "student": "전지훈", "attendance": "미참여" },
        { "class": "3-1", "teacher": "강경환", "student": "윤서후", "attendance": "현장예배" },
        { "class": "3-1", "teacher": "강경환", "student": "김동률", "attendance": "현장예배" },
        { "class": "3-1", "teacher": "안정임", "student": "신윤솔", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "오한율", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "이초은", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "전예은", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "전주은", "attendance": "온라인" },
        { "class": "3-1", "teacher": "이유빈", "student": "이아인", "attendance": "온라인" },
        { "class": "3-1", "teacher": "이유빈", "student": "손지호", "attendance": "온라인" },
        { "class": "3-1", "teacher": "강경환", "student": "박주하", "attendance": "온라인" },
        { "class": "3-1", "teacher": "강경환", "student": "전지훈", "attendance": "미참여" },
        { "class": "3-1", "teacher": "강경환", "student": "윤서후", "attendance": "현장예배" },
        { "class": "3-1", "teacher": "강경환", "student": "김동률", "attendance": "현장예배" },
        { "class": "3-1", "teacher": "안정임", "student": "신윤솔", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "오한율", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "이초은", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "전예은", "attendance": "온라인" },
        { "class": "3-1", "teacher": "안정임", "student": "전주은", "attendance": "온라인" },
        { "class": "3-1", "teacher": "이유빈", "student": "이아인", "attendance": "온라인" },
        { "class": "3-1", "teacher": "이유빈", "student": "손지호", "attendance": "온라인" },
      ],
      fields: [
        { key: "class", label: "학년(반)", sortable: true },
        { key: "teacher", label: "담임교사", sortable: true },
        { key: "student", label: "학생명", sortable: true },
        { key: "attendance", label: "출석여부", sortable: true },
      ],
      filter: null,
    };
  },
  created() {
    const today = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .split("T")[0];
    this.selectedDate = today;
  },
  methods: {
    dateDisabled(ymd, date) {
      const sunday = date.getDay();
      return sunday !== 0;
    },
  },
};
</script>

<style scoped>
.date-wrapper {
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px #dde1e5 solid;
  border-radius: 5px;
}
.date {
  font-weight: bold;
}
</style>
