// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'

import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'
import './common/scss/index.scss'

import storage from 'good-storage'
import {messages} from 'common/js/lang'
import VueLazyLoad from 'vue-lazyload'
// console.log(cnText);
Vue.config.productionTip = true
import ElementUI from 'element-ui';
Vue.use(VueI18n)
Vue.use(ElementUI)
// 语言切换， i18n版本7.4.0
Vue.config.lang = 'zh-cn'

const i18n = new VueI18n({
  locale: storage.get('language', 'zh-cn'),
  messages
})
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueLazyLoad, {
  loading: require('./assets/loading.gif')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})
