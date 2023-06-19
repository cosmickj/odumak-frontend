<template>
  <AdminDataTable
    :loading="isLoading"
    :data-source="members"
    :column-state="{ role: true }"
    @add="addMembers"
    @edit="editMember"
    @delete="deleteMembers"
  />
</template>

<script setup lang="ts">
import AdminDataTable from '../_partials/AdminDataTable.vue';

import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useMemberStore } from '@/store/member';
import { useToast } from 'primevue/usetoast';
import type { MemberData } from '@/types';

// import { useVuelidate } from '@vuelidate/core';
// import { required, helpers } from '@vuelidate/validators';

const userStore = useUserStore();
const memberStore = useMemberStore();

const isLoading = ref(false);
const members = ref<MemberData[]>([]);

const fetchMembers = async () => {
  try {
    isLoading.value = true;

    const { church, department } = userStore.userData || {};

    if (church && department) {
      members.value = await memberStore.fetchAll({
        church,
        department,
        job: 'teacher',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => await fetchMembers());

// const initSelectedMember: MemberData = {
//   name: '',
//   birth: null,
//   birthLater: true,
//   gender: 'male',
//   church: '',
//   department: '',
//   job: 'teacher',
//   role: { system: 'user', teacher: 'common' },
//   grade: '',
//   group: '',
//   isNewFriendClass: false,
//   registeredAt: new Date(),
//   remark: '',
// };

// const selectedMembers = reactive({ body: [] as MemberData[] });

// const createNewMember = (obj: MemberData) => Object.assign({}, obj);

// const addSelectedMembers = (payload: MemberData[]) => {
//   selectedMembers.body = payload.map((d) => createNewMember(d));
// };

// const isDialogAddVisible = ref(false);

// const openDialogToAddTeacher = () => {
//   isDialogAddVisible.value = true;
//   addNewMember();
// };

// const newMembers = reactive({ body: [] as MemberData[] });

// const addNewMember = () => {
//   newMembers.body.push(createNewMember(initSelectedMember));
// };

// const copyNewMember = (index: number) => {
//   newMembers.body.push(createNewMember(newMembers.body[index]));
// };

// const deleteNewMember = (index: number) => {
//   if (newMembers.body.length > 1) {
//     newMembers.body.splice(index, 1);
//   } else {
//     alert('더 이상 삭제할 수 없습니다.');
//   }
// };

// const rules = {
//   body: {
//     $each: helpers.forEach({
//       name: { required },
//       grade: { required },
//       group: { required },
//     }),
//   },
// };

// const $v = useVuelidate(rules, selectedMembers);

// const errors = computed(() => $v.value.$errors[0]?.$response?.$errors);

// const resetNewMembers = () => {
//   isDialogAddVisible.value = false;
//   newMembers.body = [];
//   $v.value.$reset();
// };

// const submitNewMembers = async () => {
//   try {
//     const isFormCorrect = await $v.value.body.$validate();
//     if (!isFormCorrect) return;

//     addMembers();
//     resetNewMembers();
//     await getMembers();
//   } catch (error) {
//     console.log(error);
//   }
// };

// const isDialogDeleteVisible = ref(false);

// const toggleIsDialogDeleteVisible = () => {
//   isDialogDeleteVisible.value = !isDialogDeleteVisible.value;
// };

const toast = useToast();

const addMembers = async (members: MemberData[]) => {
  try {
    const { church, department } = userStore.userData || {};

    if (church && department) {
      memberStore.createMultiple({ church, department, members });
      await fetchMembers();

      toast.add({
        severity: 'success',
        detail: '추가되었습니다',
        life: 1000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const editMember = async (payload: Required<MemberData>) => {
  try {
    const { uid, ...params } = payload;

    await memberStore.modifySingle({ uid, ...params });
    await fetchMembers();

    toast.add({
      severity: 'info',
      summary: `${params.name}`,
      detail: '수정되었습니다',
      life: 1000,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteMembers = async (members: MemberData[]) => {
  try {
    const uids = members.map((member) => member.uid);

    await memberStore.removeMultiple({ uids });
    await fetchMembers();

    toast.add({
      severity: 'error',
      detail: '삭제되었습니다',
      life: 1000,
    });
  } catch (error) {
    console.log(error);
  }
};
</script>
