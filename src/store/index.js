import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  title: '西邮移动端'
}

const getters = {
  getTitle: state => state.title
}

const mutations = {
  changeTitle: (state, text) => { state.title = text }
}

const actions = {
  setTitle: (context, text) => { context.commit('changeTitle', text) }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
