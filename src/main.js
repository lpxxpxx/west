import Vue from 'vue'
import FastClick from 'fastclick'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import App from './App'
import store from './store'
import { ToastPlugin, LoadingPlugin } from 'vux'
import ScanInput from './components/scan_input'
import qs from 'Qs'

FastClick.attach(document.body)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.component('scan-input', ScanInput)
Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  let userEmail = window.localStorage.getItem('userEmail')
  if (config.method === 'post') {
    let data = qs.parse(config.data)
    config.data = qs.stringify({
      userEmail: userEmail,
      ...data
    })
  } else if (config.method === 'get') {
    config.params = {
      userEmail: userEmail,
      ...config.params
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
