import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./registerServiceWorker";
// Global Styles
import "@/assets/css/reset.css";
import "@/assets/css/style.css";
// Animate CSS
import "animate.css";
// PrimeVue
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
// PrimeFlex
import "/node_modules/primeflex/primeflex.css";
// Vue Cookies
import VueCookies from "vue-cookies";

createApp(App)
  .use(PrimeVue)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("Calendar", Calendar)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("TabView", TabView)
  .component("TabPanel", TabPanel)
  .use(store)
  .use(router)
  .use(VueCookies)
  .mount("#app");
