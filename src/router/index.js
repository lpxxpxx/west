import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Warehouse from '@/components/warehouse'
import Menu from '@/components/menu'
import StockInquiry from '@/components/stock_inquiry'
import ReceivingTask from '@/components/receiving_task'
import Receiving from '@/components/receiving'
import UpperShelfTask from '@/components/upper_shelf_task'
import UpperShelf from '@/components/upper_shelf'
import InventoryAdjustmentTask from '@/components/inventory_adjustment_task'
import InventoryAdjustment from '@/components/inventory_adjustment'
import MoveLibraryTask from '@/components/move_library_task'
import MoveLibrary from '@/components/move_library'
import ProductSpecificationTask from '@/components/product_specification_task'
import ProductSpecification from '@/components/product_specification'

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
    },
    {
      path: '/upperShelfTask',
      name: 'upperShelfTask',
      component: UpperShelfTask,
      meta: {
        title: '上架任务'
      }
    },
    {
      path: '/upperShelf',
      name: 'upperShelf',
      component: UpperShelf,
      meta: {
        title: '上架'
      }
    },
    {
      path: '/inventoryAdjustmentTask',
      name: 'inventoryAdjustmentTask',
      component: InventoryAdjustmentTask,
      meta: {
        title: '调库存任务'
      }
    },
    {
      path: '/inventoryAdjustment',
      name: 'inventoryAdjustment',
      component: InventoryAdjustment,
      meta: {
        title: '调库存'
      }
    },
    {
      path: '/moveLibraryTask',
      name: 'moveLibraryTask',
      component: MoveLibraryTask,
      meta: {
        title: '移库任务'
      }
    },
    {
      path: '/moveLibrary',
      name: 'moveLibrary',
      component: MoveLibrary,
      meta: {
        title: '移库'
      }
    },
    {
      path: '/productSpecificationTask',
      name: 'productSpecificationTask',
      component: ProductSpecificationTask,
      meta: {
        title: '产品规格校验任务'
      }
    },
    {
      path: '/productSpecification',
      name: 'productSpecification',
      component: ProductSpecification,
      meta: {
        title: '产品规格'
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
