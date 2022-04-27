import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/lib/button/style/index.less'
import 'ant-design-vue/lib/tabs/style/index.less'

const app = createApp(App);

app.use().mount('#app');
