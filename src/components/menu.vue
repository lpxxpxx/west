<template>
  <div class="container">
    <div v-for="item in menuList" :key="item.id" class="menu-list" @click="goToDetail(item.target)">
      <span :class="item.icon"></span>
      <span class="menu-title">{{item.name}}</span>
      <badge :text="item.num"></badge>
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
  data () {
    return {
      menuList: [
        {
          id: 0,
          name: '库存查询',
          icon: 'icon icon-search',
          target: '/stockInquiry',
          num: 0
        },
        {
          id: 1,
          name: '收货',
          icon: 'icon icon-download',
          target: '/receivingTask',
          num: 2
        },
        {
          id: 2,
          name: '上架',
          icon: 'icon icon-upload',
          target: '/upperShelfTask',
          num: 2
        },
        {
          id: 3,
          name: '调库存',
          icon: 'icon icon-list-numbered',
          target: '/inventoryAdjustmentTask',
          num: 2
        },
        {
          id: 4,
          name: '移库',
          icon: 'icon icon-exit',
          target: '/moveLibraryTask',
          num: 2
        },
        {
          id: 5,
          name: '产品规格',
          icon: 'icon icon-file-text2',
          target: '/productSpecificationTask',
          num: 222
        }
      ]
    }
  },
  methods: {
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
    .icon {
      margin-right: 10px;
      position: relative;
      top: 5px;
    }
    .menu-title {
      font-size: 1.25rem;
      flex: 1;
    }
    .vux-badge {
      position: relative;
      top: 8px;
      height: 1.25rem;
      width: 1.25rem;
      line-height: 1.25rem;
      border-radius: 2rem;
    }
  }
</style>
