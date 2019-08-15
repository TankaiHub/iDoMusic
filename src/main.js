import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import style from './style/reset.css'
import lazyLoad from 'vue-lazyload'
// import {WechatPlugin, AjaxPlugin, LoadingPlugin, ToastPlugin, AlertPlugin} from 'vux'
Vue.use(lazyLoad, {
  // loading:'./assets/loading.gif'
});
Vue.config.productionTip = false
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



// app.vue--->layout>>default ->->other