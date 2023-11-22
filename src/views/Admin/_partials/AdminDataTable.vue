<template>
  <AdminDataTableHeader
    :selection="selectedMembers"
    @add="addingVisible = true"
    @delete="deletingVisible = true"
    @export="exportDataTable"
  />

  <AdminDataTableAdd
    :v="vAdd"
    :visible="addingVisible"
    :members="addingMembers.body"
    @add="addOneMember"
    @copy="copyOneMember"
    @delete="deleteOneMember"
    @close="resetAllMembers"
    @submit="handleAdd"
  />

  <AdminDataTableEdit
    :v="vEdit"
    :visible="editingVisible"
    :member="editingMember"
    :clone="editingMemberClone"
    @close="resetEditingState"
    @edit="handleEdit"
  />

  <AdminDataTableDelete
    :visible="deletingVisible"
    :members="selectedMembers"
    @cancel="deletingVisible = false"
    @confirm="handleDelete"
  />

  <div class="bg-[#dadde2]">
    <DataTable
      ref="dataTableRef"
      v-model:selection="selectedMembers"
      row-group-mode="subheader"
      :group-rows-by="groupRowsBy"
      row-hover
      scrollable
      scroll-height="calc(100vh - 95px)"
      :loading="loading"
      :value="dataSource"
    >
      <template #empty>
        <p>등록된 인원이 없습니다.</p>
      </template>

      <template #groupheader="{ data }">
        <div>
          <i class="pi pi-users"></i>
          <span class="ml-4">{{ formatGroupHeader(data) }}</span>
        </div>
      </template>

      <Column selectionMode="multiple" :exportable="false" />

      <Column field="name" header="이름" style="min-width: 6rem" />

      <Column field="gender" header="성별" style="min-width: 4.2rem">
        <template #body="{ data: { gender } }">
          <Tag :value="formatGender(gender)" :severity="gender === 'male' ? 'primary' : 'danger'" />
        </template>
      </Column>

      <Column v-if="columnState?.role" field="role" header="직무" style="min-width: 6rem">
        <template #body="{ data: { role } }">
          <Tag
            :value="formatTeacher(role.teacher)"
            :style="`background: ${formatTeacherColor(role.teacher)}`"
          />
        </template>
      </Column>

      <Column field="grade" header="학년" style="min-width: 4.2rem" />

      <Column field="group" header="학급" style="min-width: 4.2rem" />

      <!-- FIXME: 생일 형식이 달라 에러 발생-->
      <Column v-if="columnState?.birth" field="birth" header="생일" style="min-width: 9rem">
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.birth) }}</span>
        </template>
      </Column>

      <Column header="등록일" field="registeredAt" style="min-width: 9rem">
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.registeredAt) }}</span>
        </template>
      </Column>

      <Column header="비고" field="remark" style="min-width: 8rem" />

      <Column>
        <template #body="slotProps">
          <Button
            text
            severity="info"
            icon="pi pi-pencil"
            class="aspect-square w-6"
            @click="showEditDialog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Toast />
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import type DataTable from 'primevue/datatable';
import { computed, onMounted, ref, toRaw, watch } from 'vue';
import type { Member } from '@/models';
import {
  formatDate,
  formatGender,
  formatGroupHeader,
  formatTeacher,
  formatTeacherColor,
} from '@/utils/useFormat';
import AdminDataTableAdd from './AdminDataTableAdd.vue';
import AdminDataTableDelete from './AdminDataTableDelete.vue';
import AdminDataTableEdit from './AdminDataTableEdit.vue';
import AdminDataTableHeader from './AdminDataTableHeader.vue';

const emit = defineEmits(['add', 'edit', 'delete']);

const props = defineProps<{
  loading: boolean;
  dataSource: Member[];
  dataTarget: Member['job'];
  columnState?: {
    [field: string]: boolean;
  };
}>();

onMounted(() => {
  setTimeout(() => {
    const headers = document.querySelectorAll('.p-rowgroup-header td');

    Array.from(headers).forEach((rowHeader) => {
      rowHeader.setAttribute('colspan', '100');
    });
  }, 300);
});

const dataTableRef = ref<DataTable | null>(null);

const exportDataTable = () => {
  if (dataTableRef.value) dataTableRef.value.exportCSV();
};

const groupRowsBy = ({ grade, group }: Member) => `${grade} ${group}`;
const selectedMembers = ref<Member[]>([]);

/*---------- ADD ----------*/
const MemberRoleMap: { student: {}; teacher: Member['role'] } = {
  student: {},
  teacher: { system: 'user', teacher: 'common' },
};

// CONTINUE
const addingMemberTemp: Omit<Member, 'uid' | 'createdAt'> = {
  name: '',
  birth: null,
  birthLater: true,
  gender: 'male',
  church: '',
  department: '',
  job: props.dataTarget,
  role: MemberRoleMap[props.dataTarget],
  grade: '',
  group: '',
  isNewFriendClass: false,
  registeredAt: new Date(),
  remark: '',
  status: 'active',
};
const addingMembers = ref({ body: [structuredClone(addingMemberTemp)] });
const addingVisible = ref(false);

const addOneMember = () => {
  addingMembers.value.body.push(structuredClone(addingMemberTemp));
};

const copyOneMember = (i: number) => {
  addingMembers.value.body.push(structuredClone(toRaw(addingMembers.value.body[i])));
};

const deleteOneMember = (i: number) => {
  if (addingMembers.value.body.length > 1) {
    addingMembers.value.body.splice(i, 1);
  } else {
    alert('더 이상 삭제할 수 없습니다.');
  }
};

const resetAllMembers = () => {
  vAdd.value.$reset();
  addingVisible.value = false;

  addingMembers.value.body = [];
  addingMembers.value.body.push(structuredClone(addingMemberTemp));
};

const handleAddingTeacherChange = (newValue: Omit<Member, 'uid' | 'createdAt'>) => {
  if (newValue.isNewFriendClass) {
    newValue.grade = '0';
    newValue.group = '0';
  } else if (newValue.grade === '0' && newValue.group === '0') {
    newValue.grade = '';
    newValue.group = '';
  }

  if (newValue.role.teacher === 'common') {
    newValue.grade = '';
    newValue.group = '';
    newValue.isNewFriendClass = false;
  }
};

const handleAddingStudentChange = (newValue: Omit<Member, 'uid' | 'createdAt'>) => {
  if (newValue.isNewFriendClass) {
    newValue.group = '0';
  } else if (newValue.group === '0') {
    newValue.group = '';
  }
};

watch(
  addingMembers,
  (newValue) => {
    newValue.body.forEach((member) => {
      if (member.job === 'teacher') {
        handleAddingTeacherChange(member);
      } else if (member.job === 'student') {
        handleAddingStudentChange(member);
      }

      if (member.birthLater) {
        member.birth = null;
      }
    });
  },
  { deep: true }
);

const addStudentRules = {
  body: {
    $each: helpers.forEach({
      name: { required },
      grade: { required },
      group: {
        // @ts-ignore
        requiredIf: requiredIf((_, data: Member) => {
          return !data.isNewFriendClass;
        }),
      },
    }),
  },
};

const addTeacherRules = {
  body: {
    $each: helpers.forEach({
      name: { required },
      grade: {
        // @ts-ignore
        requiredIf: requiredIf((_, data: Member) => {
          return data.role.teacher !== 'common';
        }),
      },
      group: {
        // @ts-ignore
        requiredIf: requiredIf((_, data: Member) => {
          return data.role.teacher !== 'common';
        }),
      },
    }),
  },
};

const AddRulesMap = {
  student: addStudentRules,
  teacher: addTeacherRules,
};

const vAdd = useVuelidate(AddRulesMap[props.dataTarget], addingMembers);

const handleAdd = () => {
  emit('add', addingMembers.value.body);
};

/*---------- EDIT ----------*/
const editingVisible = ref(false);
const editingMember = ref<Partial<Member>>({});
const editingMemberClone = ref<Partial<Member>>({});

const showEditDialog = (data: Member) => {
  editingVisible.value = true;

  editingMember.value = structuredClone(toRaw(data));
  editingMemberClone.value = structuredClone(toRaw(data));
};

const resetEditingState = () => {
  vEdit.value.$reset();
  editingVisible.value = false;

  editingMember.value = {};
  editingMemberClone.value = {};
};

const handleEditingTeacherChange = (newValue: Partial<Member>) => {
  if (newValue.isNewFriendClass) {
    newValue.grade = '0';
    newValue.group = '0';
  } else if (newValue.grade === '0' && newValue.group === '0') {
    newValue.grade = '';
    newValue.group = '';
  }

  if (newValue.role?.teacher === 'common') {
    newValue.grade = '';
    newValue.group = '';
    newValue.isNewFriendClass = false;
  }
};

const handleEditingStudentChange = (newValue: Partial<Member>) => {
  if (newValue.isNewFriendClass) {
    newValue.group = '0';
  } else if (newValue.group === '0') {
    newValue.group = '';
  }
};

watch(
  editingMember,
  (newValue) => {
    if (newValue.job === 'teacher') {
      handleEditingTeacherChange(newValue);
    } else if (newValue.job === 'student') {
      handleEditingStudentChange(newValue);
    }

    if (newValue.birthLater) {
      newValue.birth = null;
    }
  },
  { deep: true }
);

const editRules = computed(() => ({
  name: { required },
  birth: {
    requiredIf: requiredIf(editingMember.value.birthLater === false),
  },
  grade: {
    requiredIf: requiredIf(editingMember.value.role?.teacher !== 'common'),
  },
  group: {
    requiredIf: requiredIf(editingMember.value.role?.teacher !== 'common'),
  },
}));

// @ts-ignore
const vEdit = useVuelidate(editRules, editingMember);

const handleEdit = () => {
  emit('edit', editingMember.value);
  editingVisible.value = false;
};

/*---------- DELETE ----------*/
const deletingVisible = ref(false);

const handleDelete = () => {
  emit('delete', selectedMembers.value);
  deletingVisible.value = false;
};
</script>

<style scoped>
:deep(td.p-editable-column.p-cell-editing) {
  padding-top: 0;
  padding-bottom: 0;
}
:deep(tr.p-rowgroup-header) {
  position: unset !important;
  background: #dadde2;
}
:deep(tr.p-rowgroup-header > td) {
  padding: 8px 16px !important;
}

.v-enter-active {
  transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
