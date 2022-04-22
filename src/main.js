import { createApp } from 'vue'
import { Table, Modal } from 'ant-design-vue';
import App from './App.vue'

const app = createApp(App);

app.use(Table, Modal).mount('#app');
