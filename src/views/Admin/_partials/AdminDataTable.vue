<template>
  <AdminDataTableHeader
    :selection="selectionRef"
    @add="handleAdd"
    @delete="handleDelete"
    @export="exportDataTable"
  />

  <div class="bg-[#dadde2]">
    <DataTable
      ref="dataTableRef"
      row-group-mode="subheader"
      :group-rows-by="groupRowsBy"
      row-hover
      scrollable
      scroll-height="calc(100vh - 95px)"
      :value="dataSource"
      :loading="isLoading"
      v-model:selection="selectionRef"
      @update:selection="handleSelect"
    >
      <template #empty>
        <p>등록된 인원이 없습니다.</p>
      </template>

      <template #groupheader="slotProps">
        <div>
          <i class="pi pi-users"></i>
          <span class="ml-4">{{ formatClass(slotProps.data) }}</span>
        </div>
      </template>

      <Column selectionMode="multiple" :exportable="false" />

      <Column field="name" header="이름" style="min-width: 6rem" />

      <Column field="gender" header="성별" style="min-width: 4.2rem">
        <template #body="{ data: { gender } }">
          <Tag
            :value="formatGender(gender)"
            :severity="gender === 'male' ? 'primary' : 'danger'"
          />
        </template>
      </Column>

      <Column
        v-if="columnState?.role"
        field="role"
        header="직무"
        style="min-width: 6rem"
      >
        <template #body="{ data: { role } }">
          <Tag
            :value="formatRole(role)"
            :style="`background: ${formatRoleColor(role)}`"
          />
        </template>
      </Column>

      <Column field="grade" header="학년" style="min-width: 4.2rem" />

      <Column field="group" header="학급" style="min-width: 4.2rem" />

      <Column field="birth" header="생일" style="min-width: 9rem">
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
            class="w-6 aspect-square"
            @click="showEditDialog(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      modal
      class="w-[40vw] max-w-[480px]"
      header="수정하기"
      position="bottomright"
      v-model:visible="editingVisible"
      :closable="false"
      :draggable="false"
      :breakpoints="{ '640px': '90vw' }"
    >
      <section class="flex flex-col">
        <div class="flex items-start">
          <div class="flex-1">
            <p class="font-bold text-lg">기본 정보</p>
          </div>

          <div class="flex-2">
            <p class="mb-2 font-bold">이름</p>
            <InputText class="w-full" v-model="editingMember.name" />

            <div class="flex gap-8 my-2">
              <p class="font-bold">성별</p>
              <div class="flex items-center">
                <RadioButton
                  v-model="editingMember.gender"
                  input-id="male"
                  name="gender"
                  value="male"
                />
                <label class="ml-2 cursor-pointer" for="male">남자</label>

                <RadioButton
                  class="ml-2"
                  v-model="editingMember.gender"
                  input-id="female"
                  name="gender"
                  value="female"
                />
                <label class="ml-2 cursor-pointer" for="female">여자</label>
              </div>
            </div>

            <div class="flex gap-8">
              <p class="font-bold mb-2">생년월일</p>
            </div>

            <Calendar
              id="birth"
              class="w-full"
              touch-u-i
              showButtonBar
              v-model="editingMember.birth"
              :disabled="editingMember.birthLater"
              placeholder="생년월일을 선택해주세요"
            />

            <div class="flex mt-1 items-center">
              <Checkbox
                binary
                input-id="birthLater"
                v-model="editingMember.birthLater"
              />
              <label class="ml-2 cursor-pointer select-none" for="birthLater">
                나중에 입력할게요
              </label>
            </div>
          </div>
        </div>

        <hr class="h-1 my-3 border-0 bg-slate-200" />

        <div v-if="editingMember.job === 'teacher'" class="flex items-start">
          <div class="flex-1">
            <p class="font-bold text-lg">담임 정보</p>
          </div>

          <div class="flex-2">
            <SelectButton
              unselectable
              class="flex"
              v-model="editingMember.role"
              :options="TEACHER_ROLE"
              optionLabel="label"
              optionValue="value"
              placeholder="담당 학년"
            />

            <Transition>
              <div
                v-if="editingMember.role !== 'common'"
                class="flex my-2 items-center justify-between"
              >
                <p>새친구 학급이신가요?</p>

                <div class="flex gap-2 items-center">
                  <p :class="switchState(editingMember.isNewFriendClass)">
                    {{ editingMember.isNewFriendClass ? '네' : '아니요' }}
                  </p>
                  <InputSwitch v-model="editingMember.isNewFriendClass" />
                </div>
              </div>
            </Transition>

            <Transition>
              <div v-if="editingMember.role !== 'common'" class="flex gap-4">
                <Dropdown
                  class="flex-1"
                  v-model="editingMember.grade"
                  :disabled="editingMember.isNewFriendClass"
                  :options="GRADE_OPTIONS"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="학년 선택"
                />

                <Dropdown
                  class="flex-1"
                  v-model="editingMember.group"
                  :disabled="editingMember.isNewFriendClass"
                  :options="GROUP_OPTIONS"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="학급 선택"
                />
              </div>
            </Transition>
          </div>
        </div>

        <div v-else class="flex items-start">
          <div class="flex-1">
            <p class="font-bold text-lg">학급 정보</p>
          </div>

          <div class="flex-2">
            <div class="flex mb-2 items-center justify-between">
              <p>새친구인가요?</p>

              <div class="flex gap-2 items-center">
                <p :class="switchState(editingMember.isNewFriendClass)">
                  {{ editingMember.isNewFriendClass ? '네' : '아니요' }}
                </p>
                <InputSwitch v-model="editingMember.isNewFriendClass" />
              </div>
            </div>

            <div class="flex gap-4">
              <Dropdown
                class="flex-1"
                v-model="editingMember.grade"
                :options="GRADE_OPTIONS"
                optionLabel="label"
                optionValue="value"
                placeholder="학년 선택"
              />

              <Dropdown
                class="flex-1"
                v-model="editingMember.group"
                :disabled="editingMember.isNewFriendClass"
                :options="GROUP_OPTIONS"
                optionLabel="label"
                optionValue="value"
                placeholder="학급 선택"
              />
            </div>
          </div>
        </div>

        <hr class="h-1 my-3 border-0 bg-slate-200" />

        <div class="flex items-start">
          <div class="flex-1">
            <p class="font-bold text-lg">추가 정보</p>
          </div>

          <div class="flex-2">
            <label class="inline-block mb-2 font-bold" for="registeredAt">
              교육부 첫 출석일
            </label>
            <Calendar
              id="registeredAt"
              class="w-full"
              touch-u-i
              showButtonBar
              v-model="editingMember.registeredAt"
            />

            <label class="inline-block my-2 font-bold" for="remark">비고</label>
            <InputText
              id="remark"
              class="w-full"
              v-model="editingMember.remark"
            />
          </div>
        </div>
      </section>

      <template #footer>
        <Button
          text
          label="취소하기"
          icon="pi pi-times"
          @click="editingVisible = false"
        />
        <Button
          label="수정하기"
          severity="warning"
          icon="pi pi-check"
          :disabled="disabled"
          @click="handleEdit"
        />
      </template>
    </Dialog>
  </div>

  <Toast />
</template>

<script setup lang="ts">
import AdminDataTableHeader from '@/views/Admin/_partials/AdminDataTableHeader.vue';

import { computed, onMounted, ref, watch } from 'vue';
import {
  formatDate,
  formatGender,
  formatClass,
  formatRole,
  formatRoleColor,
} from '@/utils/useFormat';
import { GRADE_OPTIONS, GROUP_OPTIONS, TEACHER_ROLE } from '@/constants/common';
import type { MemberData } from '@/types';

import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import type DataTable from 'primevue/datatable';

const props = defineProps<{
  isLoading: boolean;
  dataSource: MemberData[];
  selection: MemberData[];
  columnState?: {
    [field: string]: boolean;
  };
}>();

const emit = defineEmits(['add', 'edit', 'delete', 'select']);

const handleAdd = () => emit('add');
const handleDelete = () => emit('delete');
const handleEdit = async () => {
  // const isFormCorrect = await $v.value.$validate();
  // if (!isFormCorrect) return;

  emit('edit', editingMember.value);
};
const handleSelect = () => emit('select', selectionRef.value);

const dataTableRef = ref<DataTable | null>(null);

const exportDataTable = () => {
  if (dataTableRef.value) dataTableRef.value.exportCSV();
};

const selectionRef = ref(props.selection);

watch(
  () => props.selection,
  (newValue) => (selectionRef.value = newValue),
  { deep: true }
);

onMounted(() => {
  setTimeout(() => {
    const headers = document.querySelectorAll('.p-rowgroup-header td');

    Array.from(headers).forEach((rowHeader) => {
      rowHeader.setAttribute('colspan', '100');
    });
  }, 300);
});

const groupRowsBy = ({ grade, group }: MemberData) => {
  return `${grade} ${group}`;
};

const editingVisible = ref(false);
const editingMember = ref<Partial<MemberData>>({});
const editingMemberClone = ref<Partial<MemberData>>({});

const switchState = (flag?: boolean) =>
  flag ? 'text-[#2196f3]' : 'text-[#ced4da]';

const showEditDialog = (data: MemberData) => {
  editingVisible.value = true;

  editingMember.value = { ...data };
  editingMemberClone.value = { ...data };
};

const disabled = computed(() => {
  return (
    JSON.stringify(editingMember.value) ===
    JSON.stringify(editingMemberClone.value)
  );
});

// const rules = computed(() => ({
//   name: { required },
// }));

// const $v = useVuelidate(rules, editingMember);
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
