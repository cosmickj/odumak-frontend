<template>
  <div class="wrapper">
    <AdminHeader />

    <!-- CONTINUE HERE: 
        1) 교사 가입시 승인 절차 만들기
        2) 학생 관리 테이블과 교사 관리 테이블 코드 컴포넌트 합쳐보기
    -->
    <RouterView />

    <AdminModal />
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/views/Admin/AdminHeader.vue';
import AdminModal from '@/views/Admin/AdminModal.vue';
</script>

<style scoped></style>
