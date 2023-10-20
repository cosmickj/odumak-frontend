<template>
  <section class="pb-12">
    <div class="flex items-center justify-between p-4">
      <div>
        <p class="text-sm">{{ todayString }}</p>
        <p class="text-lg break-keep">
          안녕하세요, <strong>{{ userData?.name }}</strong
          >&nbsp;선생님
        </p>
      </div>

      <Avatar
        :image="userData?.profileImage"
        class="bg-slate-200 rounded-lg"
        size="xlarge"
      />
    </div>

    <div class="px-4">
      <Calendar
        borderless
        expanded
        class="rounded-3xl"
        locale="ko"
        :attributes="attributes"
        @did-move="changeMonth"
      />
    </div>

    <div class="py-2">
      <p class="bg-slate-200 px-2 py-1">
        {{ targetMonth }}월 {{ userData?.department }} 생일자
      </p>

      <div class="flex flex-col p-2 items-center">
        <template v-if="upcomingBirthday.length">
          <div
            v-for="({ customData }, i) in upcomingBirthday"
            class="px-4 py-3 bg-white rounded-2xl shadow w-full mb-2 flex items-center"
            :class="[
              { 'opacity-30': customData.isBirthdayPassed },
              { 'bg-yellow-400': customData.hoursUntilBirthday === 0 },
            ]"
            :key="i"
          >
            <Avatar
              icon="pi pi-user"
              class="text-white mr-4"
              :class="[
                { 'bg-blue-500': customData.gender === 'male' },
                { 'bg-pink-500': customData.gender === 'female' },
              ]"
              shape="circle"
            />

            <div class="flex-1 flex items-center">
              <p class="text-gray-600 min-w-[74px]">
                {{ formatClassName(customData.grade, customData.group) }}
              </p>

              <p class="ml-1">
                {{ customData.name }}
              </p>

              <div class="font-bold min-w-[46px] ml-auto">
                {{ formatDDay(customData.hoursUntilBirthday) }}
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="px-4 py-3 bg-white w-full mb-2 rounded-2xl text-center">
            올해 {{ targetMonth }}월 생일은 이미 지났어요!
          </div>
        </template>

        <span
          class="underline text-center cursor-pointer"
          @click="visibleBottom = true"
        >
          모두 보기
        </span>
      </div>
    </div>

    <Sidebar
      v-model:visible="visibleBottom"
      position="bottom"
      class="h-[80svh] max-w-sm bg-slate-100"
    >
      <h3 class="text-xl font-semibold mb-4 absolute top-5 left-4">
        전체 {{ targetMonth }}월 생일자 - {{ attributes?.length }}명
      </h3>

      <div v-for="(birthday, i) in Object.keys(aggregatedByBirthday)" :key="i">
        <p class="mb-1 text-gray-600">{{ birthday }}</p>

        <div
          v-for="(member, i) in aggregatedByBirthday[birthday]"
          class="px-4 py-3 bg-white rounded-2xl shadow w-full mb-2 flex items-center"
          :class="[
            { 'opacity-30': member.isBirthdayPassed },
            { 'bg-yellow-400': member.hoursUntilBirthday === 0 },
          ]"
          :key="i"
        >
          <Avatar
            icon="pi pi-user"
            class="text-white mr-4"
            :class="[
              { 'bg-blue-500': member.gender === 'male' },
              { 'bg-pink-500': member.gender === 'female' },
            ]"
            shape="circle"
          />

          <div class="flex-1 flex items-center justify-between">
            <div>
              <p>{{ member.name }}</p>
              <p class="text-sm">
                {{ formatClassName(member.grade, member.group) }}
              </p>
            </div>

            <div class="font-bold">
              {{ formatDDay(member.hoursUntilBirthday) }}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { formatClassName, formatDDay } from '@/utils/useFormat';

import dayjs from 'dayjs';
import { faker } from '@faker-js/faker/locale/ko';
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';

type Attributes = InstanceType<typeof Calendar>['$props']['attributes'];

const { userData } = useUserStore();

const todayString = dayjs().format('YYYY년 MM월 DD일');

const setFakeAttrs = (month: number) => {
  const result = [] as Attributes;
  const today = dayjs().set('hour', 0).set('minute', 0).set('second', 0);

  for (let i = 0; i < faker.number.int({ min: 5, max: 20 }); i++) {
    const fakeName = faker.person.lastName() + faker.person.firstName();
    const fakeBirthday = dayjs(
      faker.date.between({
        from: `2023-${month}-1`,
        to: `2023-${month}-31`,
      })
    )
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    const fakeGrade = faker.number.int({ min: 3, max: 4 });
    const fakeGroup = faker.number.int({ min: 0, max: 7 });
    const fakeGender = faker.person.sexType();

    result?.push({
      key: 'birthday',
      dot: true,
      dates: [fakeBirthday.toDate()],
      customData: {
        name: fakeName,
        birthday: fakeBirthday.format('MM월 DD일'),
        isBirthdayPassed: dayjs().isAfter(fakeBirthday, 'date'),
        hoursUntilBirthday: fakeBirthday.diff(today, 'hour') / 24,
        grade: fakeGrade.toString(),
        group: fakeGroup.toString(),
        gender: fakeGender,
      },
    });
  }

  result?.sort((a, b) => {
    return a.customData.birthday.localeCompare(b.customData.birthday);
  });

  return result;
};

const targetMonth = ref(dayjs().month() + 1);
const attributes = ref<Attributes>(setFakeAttrs(targetMonth.value));

const upcomingBirthday = computed(() => {
  if (!attributes.value) return [];

  return attributes.value
    .filter((attr) => !attr.customData.isBirthdayPassed)
    .slice(0, 3);
});

const aggregatedByBirthday = computed(() => {
  if (!attributes.value) return {};

  const result = attributes.value.reduce((acc, { customData }) => {
    const { birthday } = customData;
    acc[birthday]
      ? acc[birthday].push(customData)
      : (acc[birthday] = [customData]);
    return acc;
  }, {} as { [key: string]: any[] });

  return result;
});

const visibleBottom = ref(false);

const changeMonth = (event: any) => {
  targetMonth.value = event[0].month;
  attributes.value = setFakeAttrs(targetMonth.value);
};
</script>
