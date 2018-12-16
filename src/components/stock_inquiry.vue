<template>
  <div class="container">
    <sticky scroll-box="vux_view_box_body" :check-sticky-support="false" :offset="46">
      <tab :line-width=1>
        <tab-item>按库位查</tab-item>
        <tab-item>按SKU查</tab-item>
      </tab>
    </sticky>
    <swiper v-model="index" height="100px" :show-dots="false">
      <swiper-item>
        <div class="tab-swiper vux-center">1</div>
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
