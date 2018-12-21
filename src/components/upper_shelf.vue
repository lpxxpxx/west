<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按SKU收货</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按箱收货</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <span class="label">单号</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search search-last">
        <span class="label">SKU</span>
        <input type="text" placeholder="此处扫描箱唛上的SKU" />
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">SKU名称：</span> 
          <span class="underline name" title="">AICOOK-GH23-电烤箱（美规）</span>
        </div>
        <div class="total">
          <span class="pull-left">收货数量： <span class="underline">5</span></span>
          <span class="pull-right">已上架数量： <span class="underline">1020</span></span>
        </div>
      </div>
      <div class="search">
        <span class="label">库位</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search search-last">
        <span class="label">数量</span>
        <input type="number" placeholder="此处扫描箱唛上的SKU" />
      </div>
      <div class="photo">
        <span class="label">拍照（可选）</span>
        <span class="photo-cont">
          <span class="icon icon-camera"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']">确认</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <span class="label">单号</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search search-last">
        <span class="label">SKU</span>
        <input type="text" placeholder="此处扫描箱唛上的SKU" />
      </div>
      <div class="info clearfloat">
        <div class="info-detail">
          <span class="label">SKU名称：</span> 
          <span class="underline name" title="">AICOOK-GH23-电烤箱（美规）</span>
        </div>
        <div class="total">
          <span class="pull-left">收货数量： <span class="underline">5</span></span>
          <span class="pull-right">已上架数量： <span class="underline">1020</span></span>
        </div>
      </div>
      <div class="search">
        <span class="label">库位</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search search-last">
        <span class="label">数量</span>
        <input type="number" placeholder="此处扫描箱唛上的SKU" />
      </div>
      <div class="photo">
        <span class="label">拍照（可选）</span>
        <span class="photo-cont">
          <span class="icon icon-camera"></span>
        </span>
      </div>
      <div class="button">
        <flexbox>
          <flexbox-item>
            <x-button :gradients="['#cccccc', '#cccccc']">重置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :gradients="['#169bd5', '#169bd5']">确认</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, XInput, Flexbox, FlexboxItem } from 'vux'

export default {
  name: 'upperShelf',
  components: {
    Tab,
    TabItem,
    XButton,
    XInput,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      index: 0
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
  .info {
    padding: 1rem 1rem 0;
    .info-detail {
      display: flex;
      .name {
        flex: 1;
        text-overflow: ellipsis;
      }
    }
  }
  .photo {
    padding: 1.5rem 1rem;
    display: flex;
    .label {
      display: inline-block;
      line-height: 3rem;
      margin-right: 5px;
    }
    .photo-cont {
      display: flex;
      flex: 1;
      font-size: 2rem;
      line-height: 3rem;
      .icon {
        border: 1px dashed #999;
        color: #999;
        padding: 5px 7px 0;
      }
    }
  }
  .button {
    padding: 0 1rem;
  }
</style>
