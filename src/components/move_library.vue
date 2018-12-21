<template>
  <div class="container">
    <div class="tab-swiper" v-show="index === 0">
      <div class="search search-first">
        <span class="label">库位</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="cheak">
        <check-icon :value.sync="isAll" type="plain">移动当前库位所有SKU</check-icon>
      </div>
      <div class="search">
        <span class="label">SKU</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search">
        <span class="label">数量</span>
        <input type="text" placeholder="此处扫描入库单号" />
      </div>
      <div class="search search-last">
        <span class="label">新库位</span>
        <input type="text" placeholder="此处扫描箱唛上的SKU" />
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
            <x-button :gradients="['#169bd5', '#169bd5']">提交</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, CheckIcon } from 'vux'

export default {
  name: 'moveLibrary',
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    CheckIcon
  },
  data () {
    return {
      index: 0,
      isAll: false
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
    padding: 0 1rem 10px;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      margin-right: .5rem;
      font-size: 1.5rem;
      width: 5rem;
      text-align: right;
    }
    input {
      flex: 1;
      padding: 0 .5rem;
    }
  }
  .search.search-first {
    padding-top: 1rem; 
  }
  .search.search-last {
    padding-top: 0; 
  }
  .cheak {
    padding: 0 1rem 10px;
    margin-left: 5rem;
  }
  .photo {
    padding: .5rem 1rem 1.5rem;
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
