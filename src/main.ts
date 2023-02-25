import '@/styles/normalize.css';
import '@/styles/global.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import '@/index.css'; // Tailwind CSS

import router from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '@/App.vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import VueCookies from 'vue-cookies';

import { getCurrentUser } from '@/router';
import { useAccountStore } from '@/store/account';
import { useUserStore } from '@/store/user';

import type { UserData } from '@/types';
import type { User } from 'firebase/auth/dist/auth';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(PrimeVue);
app.use(ToastService);
app.use(VueCookies);

// Waiting for Auth to be Ready
(async () => {
  const accountStore = useAccountStore();
  const userStore = useUserStore();

  const currentUser = (await getCurrentUser()) as User;

  if (currentUser) {
    const result = (await userStore.fetchSingle({
      uid: currentUser.uid,
    })) as UserData;

    accountStore.accountData = {
      uid: currentUser.uid,
      email: currentUser.email!,
      displayName: currentUser.displayName!,
      ...result,
    };
  }
  accountStore.isAuthReady = true;
})();

import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import InputMask from 'primevue/inputmask';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import ProgressSpinner from 'primevue/progressspinner';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import Toast from 'primevue/toast';
import Tree from 'primevue/tree';

app
  .component('Button', Button)
  .component('Calendar', Calendar)
  .component('Card', Card)
  .component('Checkbox', Checkbox)
  .component('Column', Column)
  .component('DataTable', DataTable)
  .component('DataView', DataView)
  .component('Dialog', Dialog)
  .component('Dropdown', Dropdown)
  .component('FileUpload', FileUpload)
  .component('Image', Image)
  .component('InputMask', InputMask)
  .component('InputSwitch', InputSwitch)
  .component('InputText', InputText)
  .component('MultiSelect', MultiSelect)
  .component('Password', Password)
  .component('ProgressSpinner', ProgressSpinner)
  .component('RadioButton', RadioButton)
  .component('SelectButton', SelectButton)
  .component('Toast', Toast)
  .component('Tree', Tree);

app.mount('#app');
