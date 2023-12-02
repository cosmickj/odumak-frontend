import '@/index.css'; // Tailwind CSS
import '@/styles/normalize.css';
import '@/styles/global.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';

import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import { Chart as _Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
_Chart.register(ChartDataLabels);

import { setupCalendar } from 'v-calendar';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(PrimeVue);
app.use(ToastService);
app.use(setupCalendar, {});

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
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import MultiSelect from 'primevue/multiselect';
import OverlayPanel from 'primevue/overlaypanel';
import Password from 'primevue/password';
import ProgressSpinner from 'primevue/progressspinner';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import Sidebar from 'primevue/sidebar';
import Skeleton from 'primevue/skeleton';
import Steps from 'primevue/steps';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import ToggleButton from 'primevue/togglebutton';
import Toolbar from 'primevue/toolbar';
import Tree from 'primevue/tree';

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
  .component('Divider', Divider)
  .component('Dropdown', Dropdown)
  .component('FileUpload', FileUpload)
  .component('Image', Image)
  .component('InputNumber', InputNumber)
  .component('InputSwitch', InputSwitch)
  .component('InputText', InputText)
  .component('Menu', Menu)
  .component('MultiSelect', MultiSelect)
  .component('OverlayPanel', OverlayPanel)
  .component('Password', Password)
  .component('ProgressSpinner', ProgressSpinner)
  .component('RadioButton', RadioButton)
  .component('SelectButton', SelectButton)
  .component('Sidebar', Sidebar)
  .component('Skeleton', Skeleton)
  .component('Steps', Steps)
  .component('Tag', Tag)
  .component('Toast', Toast)
  .component('ToggleButton', ToggleButton)
  .component('Toolbar', Toolbar)
  .component('Tree', Tree);

app.mount('#app');
