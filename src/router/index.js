import Vue from 'vue'
import Router from 'vue-router'
import Warehouse from '@/components/warehouse'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Warehouse',
      component: Warehouse
    }
  ]
})
