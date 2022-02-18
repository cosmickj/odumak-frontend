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
        class="table-main shadow-sm"
        sticky-header="calc(100vh - 223px)"
        primary-key="student"
        :items="items"
        :fields="fields"
        :filter="filter"
        :responsive="true"
      ></b-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedDate: "",
      selectedAttendanceType: "online",
      attendanceTypes: [
        { value: "online", text: "온라인 예배" },
        { value: "offline", text: "현장 예배" },
        { value: "dabsence", text: "미참여" },
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
    dateDisabled(_ymd, date) {
      const sunday = date.getDay();
      return sunday !== 0;
    },
  },
};
</script>

<style scoped>
.date-wrapper {
  margin: 8px 8px 0px 8px;
  padding: 10px 0px 10px 0px;
  border: 1px #dde1e5 solid;
  border-radius: 5px;
}
.date {
  font-weight: bold;
}

/* TABLE */
.table-container {
  padding: 5px;
}
.table-main {
  border-radius: 5px;
}
.table-main::-webkit-scrollbar {
  display: none;
}
</style>

<style>
.table-b-table-default {
  min-width: 90px;
  font-size: 0.9rem;
}
</style>
