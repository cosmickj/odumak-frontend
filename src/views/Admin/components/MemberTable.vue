<template>
  <section class="overflow-auto flex-auto">
    <DataTable
      class="overflow-auto w-[860px] h-[90vh] mt-[5vh] mx-auto drop-shadow-lg"
      :value="dataSource"
      :lazy="true"
      :loading="isLoading"
      :rowHover="true"
      responsiveLayout="scroll"
    >
      <!-- TODO : 더 깔끔한 분기 처리 방법 생각하기 -->
      <template v-if="membersPosition === 'student'">
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
      </template>

      <!-- TODO : 더 깔끔한 분기 처리 방법 생각하기 -->
      <template v-else>
        <Column field="grade" header="grade" />
        <Column field="group" header="group" />
        <Column field="name" header="name" />
        <Column field="role" header="role" />
        <Column field="remark" header="remark" />
      </template>
    </DataTable>
  </section>

  <div class="fixed bottom-7 right-7 bg-yellow-200 rounded-full drop-shadow">
    <div
      class="h-full flex justify-center items-center cursor-pointer select-none"
      @click="openModal"
    >
      <div class="p-5 text-xl">
        <!-- TODO : 더 깔끔한 분기 처리 방법 생각하기 -->
        <span v-if="membersPosition === 'student'">학생 추가하기</span>
        <!-- TODO : 더 깔끔한 분기 처리 방법 생각하기 -->
        <span v-else>교사 추가하기</span>

        <i class="pi pi-plus-circle ml-3 text-xl"></i>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <div
      v-if="isOpened"
      class="absolute inset-0 bg-slate-100/80 flex justify-center items-center"
    >
      <!-- TODO : 더 깔끔한 분기 처리 방법 생각하기 -->
      <StudentAdd
        v-if="membersPosition === 'student'"
        @close="closeModal"
        @submit="addMember"
      />
      <!-- TODO : 더 깔끔한 분기 처리 방법 생각하기 -->
      <TeacherAdd
        v-if="membersPosition === 'teacher'"
        @close="closeModal"
        @submit="addMember"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import StudentAdd from './StudentAdd.vue';
import TeacherAdd from './TeacherAdd.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useMemberStore } from '@/store/member';
import type { Position, State } from '@/types';

const route = useRoute();

const member = useMemberStore();
const account = useAccountStore();

const dataSource = ref();
const userChurch = computed(() => account.userData?.church);
const userDepartment = computed(() => account.userData?.department);
const membersPosition = computed(() => route.params.position as Position);

const isLoading = ref(true);

onMounted(async () => {
  try {
    dataSource.value = await member.fetchMembers({
      church: userChurch.value,
      department: userDepartment.value,
      position: membersPosition.value,
    });
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

// const addMember = async (payload: State) => {
const addMember = async (payload: any) => {
  try {
    await member.createMember({
      church: userChurch.value!,
      department: userDepartment.value!,
      position: membersPosition.value,
      ...payload,
    });

    dataSource.value = await member.fetchMembers({
      church: userChurch.value,
      department: userDepartment.value,
      position: membersPosition.value,
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
