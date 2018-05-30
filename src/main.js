// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './element-variables.scss'
import axios from 'axios'
import api from './utils/axios'
import VueKindEditor from 'vue-kindeditor'
import '../static/kindeditor/kindeditor.js'
import 'kindeditor/themes/default/default.css'
import '../static/kindeditor/plugins/upimage/upimage.js'
import '../static/kindeditor/plugins/upmedia/upmedia.js'
KindEditor.lang.upimage='upimage'
KindEditor.lang.upmedia='upmedia'
Vue.use(VueKindEditor)
import $ from 'jquery';   
window.$ = $;


//axios.defaults.baseURL = 'http://toutiaomanage.ministudy.com';
////axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//axios.defaults.headers.post['Content-Type']='application/application/json';
let token = localStorage.getItem('Token')
if(token){
  api.setToken(token)
}

Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
