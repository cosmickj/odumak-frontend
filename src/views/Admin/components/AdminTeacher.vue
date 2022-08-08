<template>
  <DataTable
    class="overflow-auto w-[860px] h-[90vh] mt-[5vh] mx-auto drop-shadow-lg"
    :value="dataSource"
    :lazy="true"
    :loading="isLoading"
    :rowHover="true"
    responsiveLayout="scroll"
  >
    <Column field="grade" header="grade" />

    <Column field="group" header="group" />

    <Column field="name" header="name" />

    <Column field="role" header="role" />

    <Column field="remark" header="remark" />
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  dataSource: any;
  isLoading: boolean;
}>();
</script>
