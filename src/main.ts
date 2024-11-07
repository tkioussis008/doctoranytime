import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementPlus from 'element-plus'
import './assets/main.css';
import 'element-plus/dist/index.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')
