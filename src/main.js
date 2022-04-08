import { createApp } from 'vue'
import { Button } from 'ant-design-vue';
import App from './App.vue'
import * as echarts from "echarts"
import china from './assets/china.json'
echarts.registerMap('china',china)

const app = createApp(App);

app.config.globalProperties.$echarts = echarts
app.use(Button).mount('#app');
