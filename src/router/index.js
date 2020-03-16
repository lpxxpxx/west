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
import InventoryTask from '@/components/inventory_task'
import Inventory from '@/components/inventory'
import MoveLibraryTask from '@/components/move_library_task'
import MoveLibrary from '@/components/move_library'
import ProductSpecificationTask from '@/components/product_specification_task'
import ProductSpecification from '@/components/product_specification'
import OutLibrary from '@/components/out_library'
import returnManagementTask from '@/components/return_management_task'
import returnManagement from '@/components/return_management'
import pickingOperateTask from '@/components/picking_operate_task'
import pickingOperate from '@/components/picking_operate'
import slideList from '@/components/slide_list'
import chartCenter from '@/components/chart_center'
import cn from '@/lang/cn'
import en from '@/lang/en'

Vue.use(Router)

const routes = new Router({
  routes: [
    {
      path: '/',
      name: 'Warehouse',
      component: Warehouse,
      meta: {
        title: 'chooseWarehouse'
      }
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
      meta: {
        title: 'theOperatingMenu'
      }
    },
    {
      path: '/stockInquiry',
      name: 'stockInquiry',
      component: StockInquiry,
      meta: {
        title: 'inventoryQuery'
      }
    },
    {
      path: '/receivingTask',
      name: 'receivingTask',
      component: ReceivingTask,
      meta: {
        title: 'receivingTheTask'
      }
    },
    {
      path: '/receiving',
      name: 'receiving',
      component: Receiving,
      meta: {
        title: 'theGoods'
      }
    },
    {
      path: '/upperShelfTask',
      name: 'upperShelfTask',
      component: UpperShelfTask,
      meta: {
        title: 'onTheTask'
      }
    },
    {
      path: '/upperShelf',
      name: 'upperShelf',
      component: UpperShelf,
      meta: {
        title: 'shelves'
      }
    },
    {
      path: '/inventoryAdjustmentTask',
      name: 'inventoryAdjustmentTask',
      component: InventoryAdjustmentTask,
      meta: {
        title: 'inventoryAdjustmentTask'
      }
    },
    {
      path: '/inventoryAdjustment',
      name: 'inventoryAdjustment',
      component: InventoryAdjustment,
      meta: {
        title: 'theInventory'
      }
    },
    {
      path: '/inventoryTask',
      name: 'inventoryTask',
      component: InventoryTask,
      meta: {
        title: 'inventoryTask'
      }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: Inventory,
      meta: {
        title: 'inventory'
      }
    },
    {
      path: '/moveLibraryTask',
      name: 'moveLibraryTask',
      component: MoveLibraryTask,
      meta: {
        title: 'moveTheLibraryMission'
      }
    },
    {
      path: '/moveLibrary',
      name: 'moveLibrary',
      component: MoveLibrary,
      meta: {
        title: 'moveTheLibrary'
      }
    },
    {
      path: '/productSpecificationTask',
      name: 'productSpecificationTask',
      component: ProductSpecificationTask,
      meta: {
        title: 'productSpecificationCalibrationTask'
      }
    },
    {
      path: '/productSpecification',
      name: 'productSpecification',
      component: ProductSpecification,
      meta: {
        title: 'productSpecification'
      }
    },
    {
      path: '/outLibrary',
      name: 'outLibrary',
      component: OutLibrary,
      meta: {
        title: 'outboundLogistics'
      }
    },
    {
      path: '/slideList',
      name: 'slideList',
      component: slideList,
      meta: {
        title: 'slidingMenu'
      }
    },
    {
      path: '/returnManagementTask',
      name: 'returnManagementTask',
      component: returnManagementTask,
      meta: {
        title: 'returnManagement'
      }
    },
    {
      path: '/returnManagement',
      name: 'returnManagement',
      component: returnManagement,
      meta: {
        title: 'returnManagement'
      }
    },
    {
      path: '/pickingOperateTask',
      name: 'pickingOperateTask',
      component: pickingOperateTask,
      meta: {
        title: 'pickingOperateTask'
      }
    },
    {
      path: '/pickingOperate',
      name: 'pickingOperate',
      component: pickingOperate,
      meta: {
        title: 'pickingOperate'
      }
    },
    {
      path: '/chartCenter',
      name: 'chartCenter',
      component: chartCenter,
      meta: {
        title: 'chartCenter'
      }
    }
  ]
})

routes.beforeEach((to, from, next) => {
  if (to.meta.title) {
    let lang = window.localStorage.getItem('lang') || 'cn'
    if (lang === 'cn') {
      document.title = cn['westMail'] + ' - ' + cn[to.meta.title]
    } else if (lang === 'en') {
      document.title = en['westMail'] + ' - ' + en[to.meta.title]
    }
    Store.dispatch('setTitle', to.meta.title)
  }
  next()
})
export default routes
