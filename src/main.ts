import '@/styles/reset.css'; // Reset CSS
import 'animate.css'; // Animate.css
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import '@/index.css'; // Tailwind CSS

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';

import VueCookies from 'vue-cookies'; // Vue Cookies
import PrimeVue from 'primevue/config'; // PrimeVue

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

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

app.use(VueCookies);
app.use(PrimeVue);

app.component('Button', Button);
app.component('Card', Card);
app.component('Calendar', Calendar);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Dropdown', Dropdown);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('RadioButton', RadioButton);

app.mount('#app');
