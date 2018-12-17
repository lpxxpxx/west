<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按SKU收货</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按箱收货</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <span class="label">库位</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search search-last">
        <span class="label">SKU</span>
        <input type="text" placeholder="此处扫描箱唛上的SKU" />
      </div>
      <div class="info">
        <div class="info-detail">
          
        </div>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1"></div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, XInput } from 'vux'

export default {
  name: 'receiving',
  components: {
    Tab,
    TabItem,
    XButton,
    XInput
  },
  data () {
    return {
      index: 0
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    padding: 1rem 1rem 5px;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      margin-right: 1rem;
      font-size: 1.5rem;
      width: 4rem;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
  }
  .search.search-last {
    padding-top: 0; 
  }
</style>
