import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  title: '西邮移动端',
  user: 'Narotu',
  warehouse: { warehouseId: 4 },
  url: 'http://localhost:8080',
  /* url: 'http://wms.qa.aukeyit.com', */
  /*   url: '', */
  userEmail: '',
  phoneType: ''
}

const getters = {
  getTitle: state => state.title,
  getUser: state => state.user,
  getWarehouse: state => state.warehouse,
  getUrl: state => state.url,
  getUserEmail: state => state.userEmail,
  getPhoneType: state => state.phoneType
}

const mutations = {
  changeTitle: (state, text) => { state.title = text },
  changeUser: (state, text) => { state.user = text },
  changeWarehouse: (state, text) => { state.warehouse = text },
  changeUrl: (state, text) => { state.url = text },
  changeUserEmail: (state, text) => { state.userEmail = text },
  changePhoneType: (state, text) => { state.phoneType = text }
}

const actions = {
  setTitle: (context, text) => { context.commit('changeTitle', text) },
  setUser: (context, text) => { context.commit('changeUser', text) },
  setWarehouse: (context, text) => { context.commit('changeWarehouse', text) },
  setUrl: (context, text) => { context.commit('changeUrl', text) },
  setUserEmail: (context, text) => { context.commit('changeUserEmail', text) },
  setPhoneType: (context, text) => { context.commit('changePhoneType', text) }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
