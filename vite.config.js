import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

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
           'primary-color': '#c92268' 
         },
         javascriptEnabled: true
       }
    }
  },
  base: './'
})
