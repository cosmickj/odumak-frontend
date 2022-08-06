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
      <Column field="birth" header="birth">
        <template #body="{ data }">
          {{ translateBirth(data.birth?.seconds) }}
        </template>
      </Column>
      <Column field="remark" header="remark" />
    </DataTable>
  </section>

  <div class="fixed bottom-7 right-7 bg-yellow-200 rounded-full drop-shadow">
    <div
      class="h-full flex justify-center items-center cursor-pointer select-none"
      @click="openModal"
    >
      <div class="p-5 text-xl">
        <span>학생 추가하기</span>
        <i class="pi pi-plus-circle ml-3 text-xl"></i>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <div
      v-if="isOpened"
      class="absolute inset-0 bg-slate-100/80 flex justify-center items-center"
    >
      <StudentAdd @close="closeModal" @submit="addStudent" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import StudentAdd from './StudentAdd.vue';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import type { Position, State } from '@/types';

const route = useRoute();

const member = useMemberStore();
const account = useAccountStore();

const students = ref();
const userChurch = computed(() => account.userData?.church);
const userDepartment = computed(() => account.userData?.department);
const membersPosition = computed(() => route.params.position as Position);

const isLoading = ref(true);

onMounted(async () => {
  try {
    const result = await member.fetchMembers({
      church: userChurch.value,
      department: userDepartment.value,
      position: membersPosition.value,
    });
    console.log(result);

    students.value = result;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});

const isOpened = ref(false);
const openModal = () => {
  isOpened.value = true;
};
const closeModal = () => {
  const message = '지금까지 작성한 내용이 모두 사라집니다.\n정말 닫으시겠습니까?';
  if (confirm(message)) {
    isOpened.value = false;
  }
};

const addStudent = async (payload: State) => {
  try {
    await member.createMember({
      church: userChurch.value!,
      department: userDepartment.value!,
      position: membersPosition.value,
      ...payload,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isOpened.value = false;
  }
};

const translateBirth = (seconds: number | undefined) => {
  if (seconds) {
    return new Date(seconds * 1000);
  } else {
    return;
  }
};
</script>
