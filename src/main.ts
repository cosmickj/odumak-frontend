import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
// Global Styles
import "./assets/main.css";
import "@/css/global.css";
import "@/css/reset.css";
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
// Prime Vue
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(PrimeVue)
  .component("InputText", InputText)
  .component("Button", Button)
  .use(store)
  .use(router)
  .mount("#app");
