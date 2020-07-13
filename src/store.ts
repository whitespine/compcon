import Vue from 'vue'
import Vuex from 'vuex'
import { NavStore } from './features/nav/store'
import {  CCDataInterface } from './io/ccdata_store'

// import gmToolkitModules from './features/encounters/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  modules: {
    nav: NavStore,
    data: CCDataInterface,
  },
})

export {
  store,
  NavStore,
}
