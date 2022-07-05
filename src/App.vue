<template>
  <main class="min-h-screen flex">
    <section class="flex-grow-1 flex align-items-center justify-content-center">
      <div
        class="wrapper relative flex-grow-1 flex justify-content-center flex-column w-screen h-screen surface-0 border-round"
      >
        <router-view></router-view>

        <TheModalDownload :deferred-prompt="deferredPrompt" @dismiss="dismiss" @download="download" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import TheModalDownload from "@/components/TheModalDownload.vue";
import type { VueCookies } from "vue-cookies/types/index";

const $cookies = inject<VueCookies>("$cookies");
const deferredPrompt = ref<Event | null>(null);

onMounted(() => {
  if (!$cookies?.get("download_later")) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt.value = e;
    });
    window.addEventListener("appinstalled", () => {
      deferredPrompt.value = null;
    });
  }
});

const dismiss = () => {
  setTimeout(() => (deferredPrompt.value = null), 800);
  $cookies?.set("download_later", true, "1d");
};
const download = () => {
  deferredPrompt.value?.prompt();
  deferredPrompt.value = null;
};
</script>

<style scoped>
@media (min-width: 450px) {
  main {
    background-color: var(--surface-200) !important;
  }
  .wrapper {
    max-width: 350px !important;
    max-height: 600px !important;
  }
}
</style>
