// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.styl.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';

import './common/stylus/index.styl';

Vue.config.productionTip = false;
Vue.use(VueRouter);

Vue.extend(App);

const routes = [
  { path: '/', redirect: './goods' },
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];

const router = new VueRouter({
  routes: routes
});
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

