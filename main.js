import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
export const pinia = Pinia.createPinia()
pinia.use(piniaPluginPersistedstate)

import LoginTip from "@/components/loginTip/index"

export function createApp() {
  const app = createSSRApp(App)
  app.component('LoginTip', LoginTip) 
  // 使用插件
  app.use(pinia)
  app.use(uviewPlus)
  
  return {
    app
  }
}