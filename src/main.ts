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

import { getCurrentUser } from '@/router';
import { useAccountStore } from '@/store/account';
import { useUserStore } from '@/store/user';

import type { UserData } from '@/types';
import type { User } from 'firebase/auth/dist/auth';

const app = createApp(App);

app.use(router);
app.use(createPinia());

// Waiting for Auth to be Ready
(async () => {
  const currentUser = (await getCurrentUser()) as User;
  if (currentUser) {
    const userStore = useUserStore();
    const userData = await userStore.fetchSingle({
      uid: currentUser.uid,
    });

    if (userData) {
      const accountStore = useAccountStore();
      accountStore.accountData = {
        ...userData,
        uid: currentUser.uid,
        email: currentUser.email!,
        name: currentUser.displayName!,
      };
      accountStore.isAuthReady = true;
    }
  }
})();

app.use(PrimeVue);
app.use(ToastService);

import Avatar from 'primevue/avatar';
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
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import ProgressSpinner from 'primevue/progressspinner';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';
import Tree from 'primevue/tree';
import OverlayPanel from 'primevue/overlaypanel';

app
  .component('Avatar', Avatar)
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
  .component('InputNumber', InputNumber)
  .component('InputSwitch', InputSwitch)
  .component('InputText', InputText)
  .component('MultiSelect', MultiSelect)
  .component('Password', Password)
  .component('ProgressSpinner', ProgressSpinner)
  .component('RadioButton', RadioButton)
  .component('SelectButton', SelectButton)
  .component('Toast', Toast)
  .component('Toolbar', Toolbar)
  .component('Tree', Tree)
  .component('OverlayPanel', OverlayPanel);

app.mount('#app');
