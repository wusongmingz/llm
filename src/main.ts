import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles';
import './components/AAUI';
import ElementPlus from 'element-plus';
import VXETable from 'vxe-table';
document.title = import.meta.env.VITE_TITLE;

import Casdoor from 'casdoor-vue-sdk';

const config = {
  serverUrl: import.meta.env.VITE_SERVERURL,
  clientId: import.meta.env.VITE_CLIENTID,
  organizationName: import.meta.env.VITE_ORGANIZATION,
  appName: import.meta.env.VITE_APPNAME,
  redirectPath: '/home',
};

//md 预览
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';

import '@kangc/v-md-editor/lib/theme/vuepress.js';

const app = createApp(App);
app.use(VMdPreviewHtml).use(Casdoor, config).use(store).use(router).use(ElementPlus).use(VXETable).mount('#app');
