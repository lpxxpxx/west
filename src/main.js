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
  let language = window.localStorage.getItem('lang') || 'cn'
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
  locale: window.localStorage.getItem('lang') || 'cn',
  messages: {
    'cn': require('./lang/cn'),
    'en': require('./lang/en')
  }
})

/**
 *对Date的扩展，将 Date 转化为指定格式的String
  *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  *例子：
  *(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2019-07-02 08:09:04.423
  *(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2019-7-2 8:9:4.18
  */
// eslint-disable-next-line
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app-box')
