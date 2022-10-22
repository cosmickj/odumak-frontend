<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { httpsCallable } from 'firebase/functions';

const router = useRouter();

// https://parandol.tistory.com/49
// https://developers.naver.com/docs/login/api/api.md
onMounted(() => {
  const nCode = router.currentRoute.value.query.code;
  const nState = router.currentRoute.value.query.state;
  const wState = localStorage.getItem('naverState');
  //   localStorage.removeItem('naverState');

  if (wState !== nState) {
    alert('잘못된 방법으로 접근하셨습니다. 로그인 페이지로 이동합니다.');
    router.push('/');
    return;
  }

  const params = [];
  params.push('grant_type=authorization_code');
  params.push('client_id=' + import.meta.env.VITE_NAVER_CLIENT_ID);
  params.push('client_secret=' + import.meta.env.VITE_NAVER_CLIENT_SECRET);
  params.push('code=' + nCode);
  params.push('state=' + nState);

  const tokenBaseUrl = 'https://nid.naver.com/oauth2.0/token';
  const tokenCodeUrl = tokenBaseUrl + '?' + params.join('&');

  fetch(tokenCodeUrl).then((data) => {
    console.log(data);
    // CORS 발생
  });
});
</script>

<style scoped></style>
