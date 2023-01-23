<template>
  <div class="wrapper">
    <AdminHeader />

    <!-- CONTINUE HERE: 
        1) 교사 가입시 승인 절차 만들기
        2) 학생 관리 테이블과 교사 관리 테이블 코드 컴포넌트 합쳐보기

        ++
        현재 해야하는 것이 members에 학생, 교사를 모두 집어넣고 교사의 경우는 users와 비교하여 가입 여부도 판단하여야 한다.
        현재 중복되는 코드가 많다...이걸 지금 리팩토링하려고 하지 말고, 기능 완성 이후에 리팩토링하자.
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
