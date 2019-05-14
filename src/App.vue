<template>
  <div id="app">
    <x-header :left-options="{backText: ''}">{{$t($store.getters.getTitle)}}<a slot="right" @click="showMenus = true">{{lang}}</a><a v-if="showLogout" class="iconfont icon-poweroff logout" slot="right" href="/logout"></a></x-header>
    <router-view></router-view>
    <div>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="changeLang"></actionsheet>
    </div>
    <footer v-show="showFooter" class="footer"><span class="pull-left">{{$t('warehouse')}}：{{$store.getters.getLang === 'zh' ? $store.getters.getWarehouse.warehouseDesc : $store.getters.getWarehouse.warehouseTimezone}}</span><span class="pull-right">{{$t('operationOf')}}：{{$store.getters.getUser}}</span></footer>
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
    this.setLang()
    this.changeFooter()
    this.afterRefresh()
    this.store()
    this.isPc()
  },
  data () {
    return {
      menus: {
        zh: '中文',
        en: 'English'
      },
      showMenus: false,
      showFooter: false,
      showLogout: false
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
    changeLang (menuKey) {
      window.localStorage.setItem('lang', menuKey)
      location.reload()
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
      try {
        let url = document.querySelector('#domain').value
        let userEmail = document.querySelector('#userInfo').value
        if (url) {
          this.$cookies.set('url', url)
          this.$store.dispatch('setUrl', url)
        }
        if (userEmail) {
          window.localStorage.setItem('userEmail', JSON.parse(userEmail).userEmail)
        }
      } catch (err) {
        console.log('On dev mode!')
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
    },
    isPc () {
      try {
        let terminal = document.querySelector('#requestTerminal').value
        if (terminal === 'PC') {
          this.showLogout = true
        } else {
          this.showLogout = false
        }
      } catch (err) {
        console.log('On dev mode!')
      }
    },
    setLang () {
      let lang = window.localStorage.getItem('lang') || 'zh'
      this.$store.dispatch('setLang', lang)
    }
  },
  computed: {
    title () {
      return this.$store.getters.getTitle
    },
    lang () {
      return window.localStorage.getItem('lang') === 'en' ? this.menus.zh : this.menus.en
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
@import '//at.alicdn.com/t/font_978696_gy3pq7sorda.css';

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
.logout {
  margin-left: .7rem;
  color: #fff;
  font-size: 1.2rem;
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
.adjustment .table td {
  .iconfont.icon-minus-circle-fill {
    position: absolute;
    top: 0;
    left: -8px;
  }
  .cont {
    margin: 0 .8rem;
    height: 2rem;
    line-height: 2rem;
    width: 50vw;
    .label {
      display: none;
    }
    input {
      width: 100%;
    }
  }
}
.move-library .search .label {
  margin-right: .5rem!important;
  font-size: 1.5rem;
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
