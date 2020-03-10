import 'babel-polyfill'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font-google-noto-sans.css'
import './assets/iconfont.css'

import Vue from 'vue'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import { Component } from 'vue-property-decorator'
import * as element from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import App from '@/App.vue'
import router from './router'
import store from './store'
import PerfectScrollbar from './directives/perfect-scrollbar'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
])

Vue.config.productionTip = false
sync(store, router)
Vue.use(element)
Vue.use(VueClipboard)
Vue.directive('scrollbar', PerfectScrollbar)

const $app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
