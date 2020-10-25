import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import { Vue as VueIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/browser'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import Vuex from 'vuex'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import './registerServiceWorker'
import store from './store'

import App from './App.vue'
import Deck from './components/Deck.vue'
import EditableDeck from './components/EditableDeck.vue'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Profile from './components/Profile.vue'

let API_BASE_URL = 'https://api.swipeme.io/dev/'

Sentry.init({
  dsn: 'https://571d08a49cf4438c9c91b16d056ad3cf@o386323.ingest.sentry.io/5220443',
  integrations: [new VueIntegration({ Vue, attachProps: true, logErrors: true })]
})

if (process.env.VUE_APP_API_BASE_URL) {
  API_BASE_URL = process.env.VUE_APP_API_BASE_URL
}

if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
  API_BASE_URL = 'http://localhost:3000/dev/'
}

if (!API_BASE_URL) {
  throw new Error('No API_BASE_URL given')
}

const MINIMAL_AMPLIFY_CONFIG = {
  API: {
    endpoints: [
      {
        name: 'main',
        endpoint: API_BASE_URL
      }
    ]
  }
}

// Soft initialization of the Amplify API module
store.dispatch('configureAmplify', MINIMAL_AMPLIFY_CONFIG)

// Needed to setup Storage and Auth
store.dispatch('syncServerConfig')
  .then(() => store.dispatch('fetchUserInfos'))

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(Vuex)

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: API_BASE_URL
})

const routes = [
  { path: '', component: Home },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile },
  { path: '/decks/new', component: EditableDeck },
  { path: '/decks/:deckId', component: Deck }
]

const router = new VueRouter({
  // mode: 'history',
  routes // short for `routes: routes`
})
// injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
