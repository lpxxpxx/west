<template>
  <div class="container">
    <flexbox :gutter="0" wrap="wrap">
      <flexbox-item :span="1/2" v-for="item in warehouses" v-bind:key="item.id">
        <div class="flex-demo" @click="goToMenu">
          <p>【{{item.warehouseShort}}】</p>
          <p>{{item.warehouseName}}</p>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  name: 'Warehouse',
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      warehouses: [
        {
          id: 0,
          warehouseShort: 'LA',
          warehouseName: '洛杉矶大仓'
        },
        {
          id: 1,
          warehouseShort: 'NJ',
          warehouseName: '新泽西大仓'
        },
        {
          id: 2,
          warehouseShort: 'LA02LSC',
          warehouseName: '洛杉矶临时仓'
        },
        {
          id: 3,
          warehouseShort: 'DE',
          warehouseName: '德国仓'
        },
        {
          id: 4,
          warehouseShort: 'USHOU01',
          warehouseName: '休斯敦仓'
        },
        {
          id: 5,
          warehouseShort: 'USCHI01',
          warehouseName: '芝加哥仓'
        },
        {
          id: 6,
          warehouseShort: 'WPUKK',
          warehouseName: '英国K仓'
        },
        {
          id: 7,
          warehouseShort: 'WPUKS',
          warehouseName: '英国S仓'
        }
      ],
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    goToMenu () {
      this.$router.push('/menu')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin: 1rem;
}
.flex-demo {
  margin: 0.5rem;
  background: linear-gradient(to bottom, #f1f1f1 , #e4e4e4);
  border: 1px solid #797979;
  height: 3.5rem;
  padding-top: 1.5rem;
  line-height: 5rem;
}
.flex-demo p {
  font-size: 0.9rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
}
</style>
