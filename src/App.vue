<template>
  <main class="min-h-screen flex">
    <section class="flex-grow-1 flex justify-content-center align-items-center">
      <div
        class="wrapper relative flex-grow-1 flex flex-column justify-content-center w-screen h-screen surface-0 border-round"
      >
        <router-view></router-view>
      </div>
    </section>
  </main>
</template>

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
