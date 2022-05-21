import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import Toaster from '@meforma/vue-toaster'
import middleware from '@grafikri/vue-middleware'
import { useRoute } from 'vue-router'
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css'
import Markdown from 'vue3-markdown-it'

loadFonts()

const route = useRoute()

router.beforeEach(middleware({ store }))

createApp(App)
  .use(router)
  .use(store, key)
  .use(vuetify)
  .use(Toaster)
  .use(Markdown)
  .component('vue-cookie-accept-decline', VueCookieAcceptDecline)
  .mount('#app')
