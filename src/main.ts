import '@/styles/normalize.css';
import '@/styles/global.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';
import App from '@/App.vue';

import VueCookies from 'vue-cookies';
import PrimeVue from 'primevue/config';

import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import Tree from 'primevue/tree';
import '@/index.css'; // Tailwind CSS
import 'animate.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(VueCookies);
app.use(PrimeVue);

import { getCurrentUser } from '@/router';
import { useAccountStore } from './store/account';
import type { User } from 'firebase/auth/dist/auth';
import type { AccountData } from '@/types/store';

// Waiting for Auth to be Ready
(async () => {
  const account = useAccountStore();
  const currentUser = (await getCurrentUser()) as User;
  if (currentUser) {
    const result = (await account.fetchAccount({
      uid: currentUser.uid,
    })) as AccountData;
    account.userData = {
      email: currentUser.email!,
      name: currentUser.displayName!,
      uid: currentUser.uid,
      ...result,
    };
  }
  account.isAuthReady = true;
})();

app
  .component('Button', Button)
  .component('Card', Card)
  .component('Calendar', Calendar)
  .component('Checkbox', Checkbox)
  .component('Column', Column)
  .component('DataTable', DataTable)
  .component('Dropdown', Dropdown)
  .component('InputText', InputText)
  .component('MultiSelect', MultiSelect)
  .component('Password', Password)
  .component('RadioButton', RadioButton)
  .component('SelectButton', SelectButton)
  .component('Tree', Tree);

app.mount('#app');
