<template>
  <StudentList></StudentList>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StudentList from './components/StudentList.vue';

const route = useRoute();
// onMounted(() => console.log(route));
</script>
