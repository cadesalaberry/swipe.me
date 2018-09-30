import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  render: h => h(App)
}).$mount('#app')
