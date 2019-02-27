<template>
  <div class="container">
    <flexbox :gutter="0" wrap="wrap">
      <flexbox-item :span="1/2" v-for="item in warehouses.warehouseList" v-bind:key="item.warehouseId">
        <div class="flex-demo" @click="goToMenu(item)">
          <p>【{{item.warehouseCode}}】</p>
          <p>{{item.warehouseDesc}}</p>
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
  mounted () {
    let warehouses = document.querySelector('#userInfo').value
    if (warehouses) {
      warehouses = JSON.parse(warehouses)
      this.warehouses = warehouses
    } else {
      alert(this.$t('unableToObtainUserInformation'))
      return false
    }
    if (warehouses.warehouseList.length === 0) {
      alert(this.$t('noPermissionToView'))
      return false
    } else if (warehouses.warehouseList.length === 1) {
      this.goToMenu(warehouses.warehouseList[0])
    }
  },
  data () {
    return {
      warehouses: {}
    }
  },
  methods: {
    goToMenu (item) {
      this.$store.dispatch('setWarehouse', item)
      this.$store.dispatch('setUser', this.warehouses.userName)
      this.$store.dispatch('setUserEmail', this.warehouses.userEmail)
      this.$cookies.set('warehouse', JSON.stringify(item))
      this.$cookies.set('user', this.warehouses.userName)
      this.$cookies.set('userEmail', this.warehouses.userEmail)
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
