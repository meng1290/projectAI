import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia' // 引入 Pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入持久化存储插件
export const pinia = Pinia.createPinia()
pinia.use(piniaPluginPersistedstate)
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uviewPlus)
  return {
    app,
    Pinia
  }
}
// #endif