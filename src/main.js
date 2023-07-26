import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import './components/Interceptors/axios'

// import login from './components/coreachLogin.vue'
// import coachPortal from './components/HelloCoach.vue'

// import { createRouter, createWebHashHistory } from 'vue-router';
import "primevue/resources/themes/lara-light-blue/theme.css";
// import "primevue/resources/themes/tailwind-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import Tooltip from 'primevue/tooltip';

// console.log = function() {}
// const routes = [
//     {
//         path: '/', 
//         component: login,
//     },
//     {
//         path: '/coach',
//         component: coachPortal
//     }
// ];

// const router = createRouter({
//     history : createWebHashHistory(),
//     routes : routes,
// });    

// createApp(App).use(router).use(PrimeVue).mount("#app");
createApp(App).use(PrimeVue).directive('tooltip', Tooltip).mount("#app");
