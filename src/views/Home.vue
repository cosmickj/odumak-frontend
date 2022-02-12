<template>
  <div>
    <Navbar></Navbar>
    <AttendanceList></AttendanceList>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import AttendanceList from "../components/AttendanceList.vue";

export default {
  components: { Navbar, AttendanceList },
};
</script>

<style></style>
