<template>
  <b-navbar>
    <b-navbar-nav class="m-auto">
      <b-navbar-brand class="m-0" href="#">영은교회 초등부</b-navbar-brand>
    </b-navbar-nav>

    <button class="menu-btn" @click="openSidebar">
      <i class="fas fa-bars"></i>
    </button>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    openSidebar() {
      alert("hello sidebar");
    },
  },
};
</script>

<style scoped>
.navbar {
  height: 3.5rem;
  background: #1abc9c;
}
.navbar ul a {
  color: white;
  font-weight: bold;
  font-size: 1rem;
}
/* .navbar ul a:hover {
  color: white;
  font-weight: bold;
} */
.menu-btn {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: white;
}
</style>
