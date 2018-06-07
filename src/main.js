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
import '../static/kindeditor/plugins/clearcode/clearcode.js'
KindEditor.lang({
  upimage : '上传图片',
   upmedia : '上传视频',
   clearcode : '格式化',
  },'zh-CN');
// KindEditor.lang.upimage='upimage'
// KindEditor.lang.upmedia='upmedia'
// KindEditor.lang.clearcode='clearcode'
// KindEditor.lang.clearcode='clearimg'
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


console.log('API_URL')
console.log(process.env.API_URL)