import './vue/style/main.scss';
import { createApp } from 'vue';
import App from './vue/App.vue';
import GlobalVueProps from './VueInterface.js';
import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';

const app = createApp(App);
app.use(VueTippy);
app.provide('props', GlobalVueProps); // Connect the ThreeVueInterface to the root Vue component
app.mount('#vueApp'); // Mount the Vue app to the #vueApp DOM element, see index.html