<template>
  <div id="app">
    <x-header :left-options="{backText: ''}">{{$store.getters.getTitle}}<a slot="right" @click="showMenus = true">English</a></x-header>
    <router-view></router-view>
    <div>
      <actionsheet :menus="menus" v-model="showMenus"></actionsheet>
    </div>
    <footer v-show="showFooter" class="footer"><span class="pull-left">当前仓库：{{$store.getters.getWarehouse.warehouseDesc}}</span><span class="pull-right">操作人：{{$store.getters.getUser}}</span></footer>
  </div>
</template>

<script>
import { XHeader, Actionsheet } from 'vux'

export default {
  name: 'app',
  components: {
    XHeader,
    Actionsheet
  },
  mounted () {
    this.phoneType()
    this.changeFooter()
    this.afterRefresh()
    this.store()
  },
  data () {
    return {
      menus: {
        menu1: '中文',
        menu2: 'English'
      },
      showMenus: false,
      showFooter: false
    }
  },
  methods: {
    changeFooter () {
      if (this.$route.name === 'Warehouse') {
        this.showFooter = false
      } else {
        this.showFooter = true
      }
    },
    afterRefresh () {
      let warehouse = this.$cookies.get('warehouse')
      let user = this.$cookies.get('user')
      let url = this.$cookies.get('url')
      let userEmail = this.$cookies.get('userEmail')
      if (warehouse) {
        this.$store.dispatch('setWarehouse', warehouse)
      }
      if (user) {
        this.$store.dispatch('setUser', user)
      }
      if (url) {
        this.$store.dispatch('setUrl', url)
      }
      if (userEmail) {
        this.$store.dispatch('setUserEmail', userEmail)
      }
    },
    store () {
      let url = document.querySelector('#domain').value
      let userEmail = document.querySelector('#userInfo').value
      if (url) {
        this.$cookies.set('url', url)
        this.$store.dispatch('setUrl', url)
      }
      if (userEmail) {
        window.localStorage.setItem('userEmail', JSON.parse(userEmail).userEmail)
      }
    },
    phoneType () {
      let type = navigator.userAgent
      console.log(type)
      if (type.indexOf('Android') > -1 || type.indexOf('Linux') > -1) {
        this.$store.dispatch('setPhoneType', 'Android')
      } else if (type.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        this.$store.dispatch('setPhoneType', 'IOS')
      } else {
        this.$store.dispatch('setPhoneType', 'Other')
      }
    }
  },
  computed: {
    title () {
      return this.$store.getters.getTitle
    }
  },
  watch: {
    '$route' (to, from) {
      this.changeFooter()
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '//at.alicdn.com/t/font_978696_8xlxuqb8u19.css';

body {
  background-color: #fbf9fe;
}
#app {
  padding-bottom: 3rem;
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.underline {
  text-decoration: underline;
}
.input {
  padding-top: .5rem;
  .cont {
    .label {
      display: none;
    }
    input {
      background: #fbf9fe;
      border-left: 0;
      border-right: 0;
      border-top: 1px solid #999;
      border-bottom: 1px solid #999;
      padding: .5rem 2rem .5rem 1rem!important;
    }
  }
}
.move-library .search .label {
  margin-right: .5rem!important;
  font-size: 1.5rem;
  width: 5rem;
  text-align: right;
}
.footer {
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0 1rem;
  background: #ccc;
  height: 3rem;
  line-height: 3rem;
  font-size: 0.75rem;
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0
}
.clearfloat {
  zoom: 1
}
</style>
