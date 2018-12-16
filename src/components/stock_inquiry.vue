<template>
  <div class="container">
    <sticky scroll-box="vux_view_box_body" :check-sticky-support="false" :offset="46">
      <tab :line-width=1>
        <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按库位查</tab-item>
        <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按SKU查</tab-item>
      </tab>
    </sticky>
    <swiper v-model="index" :show-dots="false">
      <swiper-item>
        <div class="tab-swiper vux-center">
          <div class="search">
            <span class="label">库位</span>
            <input type="text" />  
          </div>  
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-swiper vux-center">2</div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Sticky, Tab, TabItem, Swiper, SwiperItem } from 'vux'

export default {
  name: 'stockInquiry',
  components: {
    Sticky,
    Tab,
    TabItem,
    Swiper,
    SwiperItem
  },
  data () {
    return {
      index: 1
    }
  },
  methods: {
    changeIndex (i) {
      this.index = i
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    height: 3rem;
    line-height: 3rem;
    display: flex;
    input {
      flex: 1;
    }
  }
</style>
