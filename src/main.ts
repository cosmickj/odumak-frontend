import '@/styles/reset.css'; // Reset CSS
import 'animate.css'; // Animate.css
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@/index.css'; // Tailwind CSS

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';
const pinia = createPinia();
import VueCookies from 'vue-cookies'; // Vue Cookies
import PrimeVue from 'primevue/config'; // PrimeVue
import Button from 'primevue/button';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';

const app = createApp(App);

app.use(router);
app.use(pinia);
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
