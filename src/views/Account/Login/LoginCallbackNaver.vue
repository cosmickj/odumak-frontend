<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProfile } from '@/api/oauth';

const router = useRouter();

onMounted(async () => {
  const queryList = router.currentRoute.value.hash
    .substring(1)
    .split('&')
    .map((q) => {
      return q.split('=');
    });
  const obj = Object.fromEntries(queryList);
  const { data } = await getProfile(obj['access_token']);

  console.log(JSON.parse(data));
});
</script>

<style scoped></style>
