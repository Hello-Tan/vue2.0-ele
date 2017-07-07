<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import axios from 'axios';
  import {urlParse} from './common/js/util';
  import Data from '../data.json';

  export default{
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created () {
      axios.get('./api/seller?id=' + this.seller.id)
        .then((response) => {
          /* 创建一个新的对象，让它包含原对象的属性和新的属性 */
          this.seller = Object.assign({}, this.seller, response.data.data);
          console.log(this.seller);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
          console.log(this.seller);
        });
      this.seller = Data.seller;
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl";

  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27 ,0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
        .router-link-active
          color: rgb(240, 20, 20)
</style>
