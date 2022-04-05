import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
       less: {
         modifyVars: {
           hack: `true; @import (reference) "${path.resolve(__dirname, 'src/css/global.less')}";`, 
         },
         javascriptEnabled: true
       }
    }
  }
})
