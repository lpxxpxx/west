import 'babel-polyfill'
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
import VueI18n from 'vue-i18n'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

FastClick.attach(document.body)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin, {time: 5000, width: '80%'})
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.use(VueI18n)
Vue.use(preview)
Vue.component('scan-input', ScanInput)
Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  let userEmail = window.localStorage.getItem('userEmail')
  let language = window.localStorage.getItem('lang') || 'zh'
  let warehouse = window.localStorage.getItem('warehouse')
  let warehouseId = JSON.parse(warehouse || '{}').warehouseId
  if (config.method === 'post') {
    let data = qs.parse(config.data)
    config.data = qs.stringify({
      userEmail,
      language,
      warehouseId,
      ...data
    })
  } else if (config.method === 'get') {
    config.params = {
      userEmail,
      language,
      warehouseId,
      ...config.params
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener('blur', function () {
      if (el.classList[0] === 'weight') {
        el.value = (el.value.match(/\d{1,4}(\.\d{0,3})?/) || [''])[0]
      } else {
        el.value = (el.value.match(/\d{1,4}(\.\d{0,2})?/) || [''])[0]
      }
      el.dispatchEvent(new Event('input'))
    })
  }
})

Vue.directive('selectVal', {
  inserted: function (el) {
    el.addEventListener('focus', function () {
      this.select()
    })
  }
})

const i18n = new VueI18n({
  locale: window.localStorage.getItem('lang') || 'zh',
  messages: {
    'zh': require('./lang/zh'),
    'en': require('./lang/en')
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app-box')
