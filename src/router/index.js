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
        title: this.$t('chooseWarehouse')
      }
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
      meta: {
        title: this.$t('theOperatingMenu')
      }
    },
    {
      path: '/stockInquiry',
      name: 'stockInquiry',
      component: StockInquiry,
      meta: {
        title: this.$t('inventoryQuery')
      }
    },
    {
      path: '/receivingTask',
      name: 'receivingTask',
      component: ReceivingTask,
      meta: {
        title: this.$t('receivingTheTask')
      }
    },
    {
      path: '/receiving',
      name: 'receiving',
      component: Receiving,
      meta: {
        title: this.$t('theGoods')
      }
    },
    {
      path: '/upperShelfTask',
      name: 'upperShelfTask',
      component: UpperShelfTask,
      meta: {
        title: this.$t('onTheTask')
      }
    },
    {
      path: '/upperShelf',
      name: 'upperShelf',
      component: UpperShelf,
      meta: {
        title: this.$t('shelves')
      }
    },
    {
      path: '/inventoryAdjustmentTask',
      name: 'inventoryAdjustmentTask',
      component: InventoryAdjustmentTask,
      meta: {
        title: this.$t('inventoryAdjustmentTask')
      }
    },
    {
      path: '/inventoryAdjustment',
      name: 'inventoryAdjustment',
      component: InventoryAdjustment,
      meta: {
        title: this.$t('theInventory')
      }
    },
    {
      path: '/moveLibraryTask',
      name: 'moveLibraryTask',
      component: MoveLibraryTask,
      meta: {
        title: this.$t('moveTheLibraryMission')
      }
    },
    {
      path: '/moveLibrary',
      name: 'moveLibrary',
      component: MoveLibrary,
      meta: {
        title: this.$t('moveTheLibrary')
      }
    },
    {
      path: '/productSpecificationTask',
      name: 'productSpecificationTask',
      component: ProductSpecificationTask,
      meta: {
        title: this.$t('productSpecificationCalibrationTask')
      }
    },
    {
      path: '/productSpecification',
      name: 'productSpecification',
      component: ProductSpecification,
      meta: {
        title: this.$t('productSpecification')
      }
    },
    {
      path: '/outLibrary',
      name: 'outLibrary',
      component: OutLibrary,
      meta: {
        title: this.$t('outboundLogistics')
      }
    },
    {
      path: '/slideList',
      name: 'slideList',
      component: slideList,
      meta: {
        title: this.$t('slidingMenu')
      }
    }
  ]
})

routes.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = this.$t('westMail') + ' - ' + to.meta.title
    Store.dispatch('setTitle', to.meta.title)
  }
  next()
})

export default routes
