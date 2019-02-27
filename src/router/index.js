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
import OutLibrary from '@/components/out_library'
import slideList from '@/components/slide_list'

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
    }
  ]
})

routes.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = 'westMail' + ' - ' + to.meta.title
    Store.dispatch('setTitle', to.meta.title)
  }
  next()
})

export default routes
