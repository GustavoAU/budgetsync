import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Initialize auth store after Pinia is set up
app.use(pinia)

app.use(router)

app.mount('#app')
