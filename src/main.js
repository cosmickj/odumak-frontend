import Vue from "vue";
import App from "./App.vue";
// PWA Setup
import "./registerServiceWorker";
// Vuex Setup
import router from "./router";
import store from "./store";
// Bootstrap Setup
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// Global & Reset CSS Setup
import "@/css/reset.css";
import "@/css/global.css";
// Vue2 Composition API
import VueCompositionAPI from "@vue/composition-api";
// Fontawesome Setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPenToSquare,
  faFileLines,
  faBook,
  faHouse,
  faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPenToSquare, faFileLines, faBook, faHouse, faBarsStaggered);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueCompositionAPI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
