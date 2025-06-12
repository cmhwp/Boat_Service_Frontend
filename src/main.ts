import 'normalize.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

async function initApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  // 初始化认证状态
  const authStore = useAuthStore()
  await authStore.initAuth()

  app.mount('#app')
}

initApp()
