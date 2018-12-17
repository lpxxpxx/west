import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Warehouse from '@/components/warehouse'
import Menu from '@/components/menu'
import StockInquiry from '@/components/stock_inquiry'
import ReceivingTask from '@/components/receiving_task'
import Receiving from '@/components/receiving'

Vue.use(Router)

const routes = new Router({
  routes: [
    {
      path: '/',
      name: 'Warehouse',
      component: Warehouse,
      meta: {
        title: '选择仓库'
      }
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
      meta: {
        title: '操作菜单'
      }
    },
    {
      path: '/stockInquiry',
      name: 'stockInquiry',
      component: StockInquiry,
      meta: {
        title: '库存查询'
      }
    },
    {
      path: '/receivingTask',
      name: 'receivingTask',
      component: ReceivingTask,
      meta: {
        title: '收货任务'
      }
    },
    {
      path: '/receiving',
      name: 'receiving',
      component: Receiving,
      meta: {
        title: '收货'
      }
    }
  ]
})

routes.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = '西邮 - ' + to.meta.title
    Store.dispatch('setTitle', to.meta.title)
  }
  next()
})

export default routes
