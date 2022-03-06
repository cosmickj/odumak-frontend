import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
// Global Styles
import "./assets/main.css";
import "@/css/global.css";
import "@/css/reset.css";
// Prime Vue
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

createApp(App)
  .use(PrimeVue)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("Calendar", Calendar)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .use(store)
  .use(router)
  .mount("#app");
