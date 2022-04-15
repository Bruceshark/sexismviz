import { createApp } from 'vue'
import { Table } from 'ant-design-vue';
import App from './App.vue'

const app = createApp(App);

app.use(Table).mount('#app');
