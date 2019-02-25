<template>
  <div class="container">
    <div v-for="item in menuList" :key="item.id" class="menu-list" @click="goToDetail(item.target)">
      <i class="iconfont" :class="item.icon"></i>
      <span class="menu-title">{{item.name}}</span>
      <badge v-if="item.num !== 0" :text="item.num"></badge>
    </div>
  </div>
</template>

<script>
import { Badge } from 'vux'

export default {
  name: 'Menu',
  components: {
    Badge
  },
  mounted () {
    this.getWaitOperateData()
  },
  data () {
    return {
      menuList: [
        {
          id: 0,
          name: '库存查询',
          icon: 'icon-monitor',
          target: '/stockInquiry',
          num: 0
        },
        {
          id: 1,
          name: '收货',
          icon: 'icon-Import',
          target: '/receivingTask',
          num: 0
        },
        {
          id: 2,
          name: '上架',
          icon: 'icon-export',
          target: '/upperShelfTask',
          num: 0
        },
        {
          id: 3,
          name: '调库存',
          icon: 'icon-sync',
          target: '/inventoryAdjustmentTask',
          num: 0
        },
        {
          id: 4,
          name: '移库',
          icon: 'icon-redo',
          target: '/moveLibraryTask',
          num: 0
        },
        {
          id: 5,
          name: '产品规格',
          icon: 'icon-detail',
          target: '/productSpecificationTask',
          num: 0
        },
        {
          id: 6,
          name: '物流出库',
          icon: 'icon-detail',
          target: '/OutLibrary',
          num: 0
        }
      ]
    }
  },
  methods: {
    getWaitOperateData () {
      this.axios.get(`${this.$store.getters.getUrl}/weixinapi/index/getWaitOperateData`, {
        params: {
          warehouseId: this.$store.getters.getWarehouse.warehouseId
        }})
      .then(res => {
        if (res.data.success) {
          this.menuList[1].num = res.data.data.waitReceivingCount || 0
          this.menuList[2].num = res.data.data.waitPutawayCount || 0
          this.menuList[3].num = res.data.data.inventoryAdjustmentCount || 0
          this.menuList[4].num = res.data.data.moveWarehouseCount || 0
          this.menuList[5].num = res.data.data.productSkuAttrCount || 0
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.data.message
          })
        }
      })
      .catch(res => {
        alert('业务系统异常！')
      })
    },
    goToDetail (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
  .menu-list{
    display: flex;
    font-size: 1.5rem;
    border-bottom: 1px dashed #999;
    color: #333;
    padding: 1.5rem;
    .iconfont {
      position: absolute;
      margin-top: -5px;
      font-size: 1.75rem;
    }
    .menu-title {
      font-size: 1.25rem;
      flex: 1;
      padding-left: 2.5rem;
    }
    .vux-badge {
      position: relative;
      top: 8px;
      height: 1.25rem;
      line-height: 1.25rem;
      border-radius: 2rem;
    }
  }
</style>
