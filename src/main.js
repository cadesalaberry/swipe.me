import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import './registerServiceWorker'

let API_BASE_URL = process.env.API_BASE_URL || '//cadesalaberry.github.io'

if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
  API_BASE_URL = 'localhost:3000'
}

console.log('Using', API_BASE_URL)

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: API_BASE_URL
})

new Vue({
  render: h => h(App)
}).$mount('#app')
