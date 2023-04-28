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
import { useUserStore } from '@/store/user';

/*----- Setup Kakao -----*/
window.Kakao.init(import.meta.env.VITE_KAKAO_CLIENT_ID);

const app = createApp(App);

app.use(router);
app.use(createPinia());

// Waiting for Auth to be Ready
(async () => {
  try {
    const currentUser = await getCurrentUser();
    const userStore = useUserStore();

    if (currentUser) {
      await userStore.fetchSingle({ uid: currentUser.uid });
    }
    userStore.isAuthReady = true;
  } catch (error) {
    console.log(error);
  }
})();

app.use(PrimeVue);
app.use(ToastService);

import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
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
import Steps from 'primevue/steps';
import ToggleButton from 'primevue/togglebutton';

app
  .component('Avatar', Avatar)
  .component('Button', Button)
  .component('Calendar', Calendar)
  .component('Card', Card)
  .component('Chart', Chart)
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
  .component('Steps', Steps)
  .component('ToggleButton', ToggleButton)
  .component('OverlayPanel', OverlayPanel);

app.mount('#app');
