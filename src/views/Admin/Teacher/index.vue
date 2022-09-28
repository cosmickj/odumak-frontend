<template>
  <div class="container">
    <div class="mb-12">
      <Button
        class="p-button-success mr-2"
        icon="pi pi-plus"
        label="추가하기"
      />
      <Button class="p-button-danger" icon="pi pi-trash" label="삭제하기" />
    </div>
  </div>

  <div class="container">
    <div class="overflow-hidden mb-12 rounded-2xl drop-shadow-lg">
      <DataTable
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import { DataTableRowClickEvent } from 'primevue/datatable';

const account = useAccountStore();
const member = useMemberStore();

const isLoading = ref(false);
const dataSource = ref();

const getMembers = async () => {
  try {
    isLoading.value = true;
    dataSource.value = await member.fetchMembers({
      church: account.userData?.church,
      department: account.userData?.department,
      position: 'teacher',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getMembers();
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}
</style>
