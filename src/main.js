import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import store from './store'

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
