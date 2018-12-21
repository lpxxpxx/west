<template>
  <div class="container">
    <div class="search search-first">
      <span class="label">SKU</span>
      <input type="text" placeholder="此处扫描入库单号" />
    </div>
    <div class="search search-last">
      <span class="label">新库位</span>
      <input type="text" placeholder="此处扫描箱唛上的SKU" />
    </div>
    <divider>参数</divider>
    <div class="search search-first">
      <span class="label">重量</span>
      <input type="number" placeholder="0" />
      <span class="type">KG</span>
    </div>
    <div class="search">
      <span class="label">长</span>
      <input type="number" placeholder="0" />
      <span class="type">CM</span>
    </div>
    <div class="search">
      <span class="label">宽</span>
      <input type="number" placeholder="0" />
      <span class="type">CM</span>
    </div>
    <div class="search search-last">
      <span class="label">高</span>
      <input type="number" placeholder="0" />
      <span class="type">CM</span>
    </div>
    <div class="button">
      <flexbox>
        <flexbox-item>
          <x-button :gradients="['#169bd5', '#169bd5']">提交</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Divider } from 'vux'

export default {
  name: 'productSpecification',
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    Divider
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
    input[type='number'] {
      text-align: right;
    }
    .type {
      width: 2rem;
      text-align: right;
    }
  }
  .search.search-first {
    padding-top: 1rem; 
  }
  .search.search-last {
    padding-top: 0; 
  }
  .button {
    padding: 0 1rem;
  }
</style>
