import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/tokens.css'
import './styles/base.css'
import { lang } from './lib/i18n'

document.documentElement.lang = lang.value
createApp(App).use(router).mount('#app')
