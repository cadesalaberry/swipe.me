import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import App from './App.vue'
import Deck from './components/Deck.vue'
import Home from './components/Home.vue'
import './registerServiceWorker'

let API_BASE_URL = ''

if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
  API_BASE_URL = 'http://localhost:3000'
}

if (process.env.API_BASE_URL) {
  API_BASE_URL = process.env.API_BASE_URL
}

if (!API_BASE_URL) {
  throw new Error('No API_BASE_URL given')
}

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: API_BASE_URL
})

const routes = [
  {
    path: '/',
    component: App,
    children: [
      { path: '', component: Home },
      { path: '/decks/:deckId', component: Deck }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes // short for `routes: routes`
})
// injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
