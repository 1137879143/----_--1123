import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// import * as echarts from 'echarts' // 引入ECharts

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'

import '@/icons' // icon
import '@/permission' // permission control

// import * as echarts from 'echarts'
// Vue.prototype.$echarts = echarts

// 构建axios实例
import { getToken } from '@/utils/auth'
// 拦截请求
axios.interceptors.request.use(
  config => {
    // const token = sessionStorage.getItem('vue_admin_template_token')
    const token = getToken()
    config.headers['Page-Title'] = encodeURIComponent(router.history.current.meta.title)
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// instance.interceptors.response.use(
//   response => { // 该处为后端返回整个内容
//     // const res = response.data // 该处可将后端数据取出，提前做一个处理
//     return response
//   }

// )

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
// Vue.use(echarts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 定义一个过滤器 处理时间
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 月份从0开始,使她变成字符串,不足两位时,前面补个0.
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
