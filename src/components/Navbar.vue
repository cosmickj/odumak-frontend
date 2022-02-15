<template>
  <b-navbar>
    <b-navbar-nav class="m-auto">
      <router-link to="/"> <span>영은교회 초등부</span> </router-link>
    </b-navbar-nav>

    <button class="menu-btn" v-b-toggle.sidebar>
      <i class="fas fa-bars"></i>
    </button>
    <b-sidebar
      id="sidebar"
      no-header
      right
      backdrop
      shadow
      width="280px"
      bg-variant="default"
    >
      <div class="p-3">
        <div class="sidebar-title">MENU</div>

        <div class="sidebar-menus">
          <router-link to="/input-attendance">출석 입력</router-link>
        </div>
      </div>
      <template #footer="{ hide }">
        <div class="d-flex justify-content-end align-items-center px-3 py-3">
          <b-button variant="light" @click="hide" block>Close</b-button>
        </div>
      </template>
    </b-sidebar>
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
  text-decoration: none;
}
.navbar ul a span {
  color: white;
  font-weight: bold;
  font-size: 1rem;
}
.menu-btn {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: white;
}
.sidebar-title {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #fff;
  padding-bottom: 20px;
}
.sidebar-menus {
  padding-top: 20px;
}
.sidebar-menus a {
  text-align: center;
  display: block;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  background-color: #1abc9c;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 8px;
}
</style>
