<template>
  <div></div>
</template>

<script>
export default {
  computed: {
    totalAttendaces() {
      return this.$store.state.totalAttendaces;
    },
    totalAttendaceFields() {
      return this.$store.state.totalAttendaceFields;
    },
  },
};
</script>

<style scoped></style>
