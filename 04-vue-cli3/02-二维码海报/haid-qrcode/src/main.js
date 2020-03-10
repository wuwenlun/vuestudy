import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = '/rest';
//请求头
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// 超时时间
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
