<template>
  <div class="container">
    <tab :line-width=1>
      <tab-item :selected="index === 0" @on-item-click="changeIndex(0)">按库位查</tab-item>
      <tab-item :selected="index === 1" @on-item-click="changeIndex(1)">按SKU查</tab-item>
    </tab>
    <div class="tab-swiper" v-show="index === 0">
      <div class="search">
        <span class="label">库位</span>
        <input type="text" />  
      </div>
      <div class="total">
        <span class="pull-left">SKU种类 <span class="underline">5</span></span>
        <span class="pull-right">总计 <span class="underline">1020</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>SKU</th>
              <th>可用</th>
              <th>待出库</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <x-button :gradients="['#1D62F0', '#19D5FD']">调库存</x-button>
      </div>
    </div>
    <div class="tab-swiper" v-show="index === 1">
      <div class="search">
        <span class="label">SKU</span>
        <input type="text" />  
      </div>
      <div class="total">
        <span class="pull-left">库位数 <span class="underline">5</span></span>
        <span class="pull-right">总计 <span class="underline">1020</span></span>
      </div>
      <div class="table">
        <x-table full-bordered>
          <thead>
            <tr>
              <th>SKU</th>
              <th>可用</th>
              <th>待出库</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
            <tr>
              <td>YDL-1010101020</td>
              <td>25</td>
              <td>1</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div class="button">
        <x-button :gradients="['#1D62F0', '#19D5FD']">调库存</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XTable, XButton } from 'vux'

export default {
  name: 'stockInquiry',
  components: {
    Tab,
    TabItem,
    XTable,
    XButton
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
    padding: 1.5rem 1rem;
    height: 3rem;
    line-height: 3rem;
    display: flex;
    .label {
      margin-right: 1rem;
      font-size: 1.5rem;
    }
    input {
      flex: 1;
    }
  }
  .total {
    padding: 0rem 1rem 1.5rem;
  }
  .table {
    padding: 1rem;
  }
  .button {
    padding: 0 1rem 1rem;
  }
</style>
