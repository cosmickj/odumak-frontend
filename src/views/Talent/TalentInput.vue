<template>
  <div class="p-6">
    <p>달란트 지급 이유가 무엇인가요?</p>
    <Dropdown
      v-model="selectedReason"
      :options="reasons"
      optionLabel="label"
      optionValue="value"
      placeholder="이유를 선택해주세요"
      class="md:w-14rem w-full"
    />

    <div v-if="selectedReason === '기타'" class="mt-2">
      <p>사유 직접 입력</p>
      <InputText class="w-full" />
    </div>

    <p class="mt-2">몇 달란트를 지급하나요?</p>
    <InputNumber
      class="w-full"
      v-model="selectedTalentAmount"
      suffix="달란트"
      :min="1"
      :max="100"
      :disabled="selectedReason != '기타'"
    />

    <IconField class="mt-4" iconPosition="left">
      <InputIcon class="pi pi-search"> </InputIcon>
      <InputText class="w-full" placeholder="검색하기" />
    </IconField>

    <Accordion multiple class="mt-4">
      <AccordionTab v-for="(gradegroup, i) in Object.keys(groupedMembers)" :key="i">
        <template #header>
          {{ formatClassName(gradegroup.split('_')[0], gradegroup.split('_')[1]) }}
          <Badge v-if="countedClasses[gradegroup]" :value="countedClasses[gradegroup]" class="ml-2" />
        </template>

        <div class="flex items-center text-xl">
          <Checkbox
            binary
            v-model="isClassSelected[gradegroup]"
            :input-id="gradegroup"
            @change="toggleClass(gradegroup)"
          />
          <label class="ml-2 flex-1 cursor-pointer" :for="gradegroup">모두 선택</label>
        </div>

        <div v-for="(mem, j) in groupedMembers[gradegroup]" :key="j" class="flex items-center text-xl">
          <div class="mr-2 h-7 w-5">
            <div class="mx-auto h-full w-[1px] bg-slate-200"></div>
          </div>
          <Checkbox
            v-model="selectedMembers"
            name="members"
            :value="mem"
            :input-id="mem.uid"
            @change="toggleMember(mem)"
          />
          <label class="ml-2 flex-1 cursor-pointer" :for="mem.uid">{{ mem.name }}</label>
        </div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { Member } from '@/models';
import { useMemberStore } from '@/stores/member';
import { formatClassName } from '@/utils/useFormat';

const memberStore = useMemberStore();

const selectedReason = ref('');
const reasons = ref([
  { label: 'QT 학교 및 제자학교 출석', value: 'QT 학교 및 제자학교 출석' },
  { label: '주일예배 참석 - 정시', value: '주일예배 참석 - 정시' },
  { label: '주일예배 참석 - 지각', value: '주일예배 참석 - 지각' },
  { label: '주일 공과 참여', value: '주일 공과 참여' },
  { label: '찬양대', value: '찬양대' },
  { label: '모범어린이', value: '모범어린이' },
  { label: '주보 모으기 - 전체', value: '주보 모으기 - 전체' },
  { label: '주보 모으기 - 절반 이상', value: '주보 모으기 - 절반 이상' },
  { label: '전도 - 첫 주 출석', value: '전도 - 첫 주 출석' },
  { label: '전도 - 등반', value: '전도 - 등반' },
  { label: '기타 (직접 입력)', value: '기타' },
]);

const talentAmountMap: any = {
  'QT 학교 및 제자학교 출석': 2,
  '주일예배 참석 - 정시': 2,
  '주일예배 참석 - 지각': 1,
  '주일 공과 참여': 1,
  찬양대: 1,
  모범어린이: 2,
  '주보 모으기 - 전체': 7,
  '주보 모으기 - 절반 이상': 4,
  '전도 - 첫 주 출석': 10,
  '전도 - 등반': 10,
};
const selectedTalentAmount = ref(null);

const isClassSelected = ref(Object.create(null));

const toggleClass = (gradegroup: string) => {
  const [grade, group] = gradegroup.split('_');

  if (isClassSelected.value[gradegroup]) {
    selectedMembers.value.push(...groupedMembers.value[gradegroup]);
  } else {
    selectedMembers.value = selectedMembers.value.filter((m) => {
      if (m.grade === grade && m.group === group) return false;
      return true;
    });
  }
};

const groupedMembers = ref(Object.create(null));
const selectedMembers = ref<Member[]>([]);

const toggleMember = ({ grade, group }: Member) => {
  const key = grade + '_' + group;

  const memCnt = groupedMembers.value[key]?.length;
  const selectedMemCnt = selectedMembers.value?.reduce(
    (n, { grade, group }) => (key === `${grade}_${group}` ? n + 1 : n),
    0
  );

  if (!selectedMemCnt) {
    isClassSelected.value[key] = false;
  }

  if (memCnt === selectedMemCnt) {
    isClassSelected.value[key] = true;
  }
};

// TODO: 변수명 더욱 의미에 맞게 수정하기
const countedClasses = computed(() => {
  const result = Object.create(null);

  for (const mem of selectedMembers.value) {
    const className = `${mem.grade}_${mem.group}`;
    const currCount = result[className] ?? 0;
    result[className] = currCount + 1;
  }

  return result;
});

watch(selectedReason, () => {
  selectedTalentAmount.value = talentAmountMap[selectedReason.value];
});

onMounted(async () => {
  try {
    // TODO: 동적으로 변경하기
    const members = await memberStore.fetchAll({ church: '영은교회', department: '초등부', job: 'student' });

    // @ts-ignore
    groupedMembers.value = Object.groupBy(members, (mem) => `${mem.grade}_${mem.group}`);

    isClassSelected.value = Object.keys(groupedMembers.value).reduce(
      (obj, key) => ({ ...obj, [key]: false }),
      {}
    );
  } catch (error) {
    console.log(error);
  }
});
</script>
