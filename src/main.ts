import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
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

let API_BASE_URL = 'https://dev.swipeme.io/dev/'

if (process.env.VUE_APP_API_BASE_URL) {
  API_BASE_URL = process.env.VUE_APP_API_BASE_URL
}

if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
  API_BASE_URL = 'http://localhost:3000/dev/'
}

if (!API_BASE_URL) {
  throw new Error('No API_BASE_URL given')
}

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.VUE_APP_REGION,
    userPoolId: process.env.VUE_APP_COGNITO_USER_POOL,
    identityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL,
    userPoolWebClientId: process.env.VUE_APP_COGNITO_USER_POOL_CLIENT
  },
  Storage: {
    region: process.env.VUE_APP_REGION,
    bucket: process.env.VUE_APP_S3_UPLOADS_BUCKET_NAME,
    identityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL
  },
  API: {
    endpoints: [
      {
        name: 'main',
        endpoint: API_BASE_URL
      }
    ]
  }
})

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
