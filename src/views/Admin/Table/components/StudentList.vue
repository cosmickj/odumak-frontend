<template>
  <section class="overflow-auto flex-auto">
    <DataTable
      class="overflow-auto w-[860px] h-[90vh] mt-[5vh] mx-auto drop-shadow-lg"
      :value="students"
      :lazy="true"
      :loading="isLoading"
      :rowHover="true"
      responsiveLayout="scroll"
    >
      <Column field="grade" header="grade" />
      <Column field="group" header="group" />
      <Column field="name" header="name" />
      <Column field="gender" header="gender" />
      <Column field="phone" header="phone" />
      <Column field="teacher" header="teacher" />
      <Column field="address" header="address" headerStyle="min-width: 30rem" />
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { fetchStudents } from '@/api/members';
import { onMounted, ref } from 'vue';

const isLoading = ref(true);
const students = ref();

onMounted(async () => {
  const result = await fetchStudents();

  console.log(result.data);

  students.value = result.data;
  isLoading.value = false;
});
</script>

<style scoped></style>
