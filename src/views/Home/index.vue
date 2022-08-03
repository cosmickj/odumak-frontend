<template>
  <div class="overflow-auto h-[calc(100%_-_6rem)] bg-slate-100">
    <div class="p-5">
      <div class="text-2xl">안녕하세요,</div>
      <div class="text-3xl">{{ userName }} 선생님!</div>
    </div>

    <div class="p-5">
      <div class="flex pb-2">
        <!-- 학생 일일 출석 현황 -->
        <HomeMenu :icon="'pi-users'" :route-name="'AttendanceTracker'" :position="'students'" :type="'daily'" />
        <!-- 학생 누적 출석 현황 -->
        <HomeMenu :icon="'pi-users'" :route-name="'AttendanceTracker'" :position="'students'" :type="'total'" />
      </div>

      <div class="flex pt-2">
        <!-- 교사 일일 출석 현황 -->
        <HomeMenu :icon="'pi-heart'" :route-name="'AttendanceTracker'" :position="'teachers'" :type="'daily'" />
        <!-- 교사 누적 출석 현황 -->
        <HomeMenu :icon="'pi-heart'" :route-name="'AttendanceTracker'" :position="'teachers'" :type="'total'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import HomeMenu from './components/HomeMenu.vue';
import { useAccountStore } from '@/store/account';

const account = useAccountStore();
const userName = computed(() => account.userData?.name);
</script>
