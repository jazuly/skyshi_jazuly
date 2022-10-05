import { createApp } from 'vue'
import App from './App.vue'
import store from "./store";
import ApiService from "./core/ApiService";
import ElementPlus from "element-plus";
import router from "./routers";

import "element-plus/theme-chalk/index.css";
import './style.css'

const app = createApp(App);

ApiService.init(app);
app.use(ElementPlus);
app.use(store);
app.use(router);

app.mount("#app");
