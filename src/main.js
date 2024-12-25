import { createApp } from 'vue'
import App from './App.vue'

import router from './router.js'
import store from './store.js'
import './css/main.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');