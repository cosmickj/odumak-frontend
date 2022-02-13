<template>
  <div>
    <Navbar></Navbar>
    <AttendanceSheet></AttendanceSheet>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import AttendanceSheet from "../components/AttendanceSheet.vue";

export default {
  components: { Navbar, AttendanceSheet },
};
</script>

<style></style>
