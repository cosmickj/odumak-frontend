<template>
  <main class="flex">
    <aside class="overflow-y-auto shrink-0 h-screen w-72">
      <Tree class="h-full bg-yellow-100" :value="menus"></Tree>
    </aside>

    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
const menus = [
  {
    key: '0',
    label: '학생 목록 관리',
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
    children: [
      {
        key: '0-0',
        label: '학생 전체 목록',
        data: 'Work Folder',
        icon: 'pi pi-fw pi-cog',
      },
      {
        key: '0-1',
        label: '학생 추가하기',
        data: 'Home Folder',
        icon: 'pi pi-fw pi-home',
      },
    ],
  },
  {
    key: '1',
    label: '교사 목록 관리',
    data: 'Events Folder',
    icon: 'pi pi-fw pi-calendar',
    children: [
      {
        key: '1-0',
        label: '교사 전체 목록',
        data: 'Meeting',
        icon: 'pi pi-fw pi-calendar-plus',
      },
      {
        key: '1-1',
        label: '교사 추가하기',
        data: 'Product Launch',
        icon: 'pi pi-fw pi-calendar-plus',
      },
    ],
  },
];
</script>
