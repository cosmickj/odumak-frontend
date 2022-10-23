<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getData } from '@/api/members';

const router = useRouter();

onMounted(async () => {
  const queryList = router.currentRoute.value.hash
    .substring(1)
    .split('&')
    .map((q) => {
      return q.split('=');
    });
  const obj = Object.fromEntries(queryList);
  const { data } = await getData(obj['access_token']);
  console.log(data);
});
</script>

<style scoped></style>
