<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="seller-information">
        <div class="overview border-1px">
          <h1 class="name">{{seller.name}}</h1>
          <div class="sell-wrapper">
            <div class="star-wrapper"><star :size="36" :score="seller.score"></star></div>
            <span class="ratingCount">({{seller.ratingCount}})</span>
            <span class="sellCount">月售{{seller.sellCount}}单</span>
          </div>
          <div class="favorite-wrapper">
            <i class="icon-favorite" :class="{'active':favorite}" @click="favoriteChange"></i>
            <p class="text">{{favoriteText}}</p>
          </div>
        </div>
        <div class="delivery">
          <div class="min-price border-1pxx">
            <p class="text">起送价</p>
            <p class="desc">{{seller.minPrice}}元</p>
          </div>
          <div class="delivery-price border-1pxx">
            <p class="text">商家配送</p>
            <p class="desc">{{seller.deliveryPrice}}元</p>
          </div>
          <div class="delivery-time">
            <p class="text">平均配送时间</p>
            <p class="desc">{{seller.deliveryTime}}分钟</p>
          </div>
        </div>
      </div>
        <split></split>
      <div class="bulletin-box">
        <h1 class="title">公告与活动</h1>
        <p class="bulletin">{{seller.bulletin}}</p>
        <ul>
          <li v-for="item in seller.supports" class="supports border-1px">
            <i class="icon" :class="supportsMap[item.type]"></i>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-picture">
        <h1 class="title">商家实景</h1>
        <div class="picture-box" ref="picWrapper">
          <ul class="picture-list" ref="picList">
            <li v-for="item in seller.pics" class="picture-item">
              <img  :src="item" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-infos">
        <h1 class="title">商家信息</h1>
        <ul>
          <li v-for="item in seller.infos" class="info border-1px">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import {savaToLocal, loadFromlLocal} from '../../common/js/store';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        supportsMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        favorite: (() => {
          return loadFromlLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    components: {
      star,
      split
    },
    watch: {
      'seller' () {
        this._initScroll();
        this._initPics();
      }
    },
    mounted () {
      this._initScroll();
      this._initPics();
    },
    methods: {
      _initScroll () {
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        });
      },
      _initPics () {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      favoriteChange (event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        savaToLocal(this.seller.id, 'favorite', this.favorite);
      },
      selectFoods () {
        let selectshop = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              selectshop.push(food);
            }
          });
        });
        return selectshop;
      }
    },
    computed: {
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏';
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .seller
    position:absolute
    left:0
    top:174px
    bottom:0
    width:100%
    overflow:hidden
    .seller-information
      padding:18px 18px 0 18px
      .overview
        position:absolute
        padding-bottom:18px
        border-1px(rgba(7,17,27,0.1))
        .name
          font-size:14px
          line-height:14px
        .sell-wrapper
          margin-top:8px
          font-size:0
          .star-wrapper
            display:inline-block
            vertical-align:top
          .ratingCount
            margin:0 12px 0 8px
          .ratingCount,.sellCount
            display:inline-block
            font-size:10px
            line-height:18px
            color:rgb(77,85,93)
        .favorite-wrapper
          width:50px
          position:absolute
          right:-7px
          top:4px
          text-align:center
          .icon-favorite
            display:block
            font-size:24px
            line-height:24px
            color:#d4d6d9
            &.active
              color:rgb(240,20,20)
          .text
            margin-top:4px
            font-size:10px
            line-height:10px
            color:rgb(77,85,93)
      .delivery
        display:flex
        margin:18px 0
        .delivery-time
          flex:1
          text-align:center
        .min-price,.delivery-price
          flex:1
          border-right-1px(rgba(7,17,27,0.1))
          text-align:center
        .min-price,.delivery-price,.delivery-time
          .text
            font-size:10px
            line-height:10px
            color:rgb(147,153,159)
          .desc
            margin-top:4px
            font-size:24px
            line-height:24px
            font-weight:200
            color:rgb(7,17,27)
    .bulletin-box
      margin:18px 18px 0 18px
      .title
        font-size:14px
        line-height:14px
        color:rgb(7,17,27)
      .bulletin
        margin:8px 12px 18px 12px
        font-size:14px
        line-height:24px
        font-weight:200
        color:rgb(240,20,20)
      .supports
        padding:16px 12px
        border-top-1px(rgba(7,17,27,0.1))
        font-size:0
        .icon
          display:inline-block
          vertical-align:top
          width:16px
          height:16px
          background-size:16px 16px
          background-repeat:no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.special
            bg-image('special_4')
          &.invoice
            bg-image('invoice_4')
          &.guarantee
            bg-image('guarantee_4')
        .text
          display:inline-block
          margin-left:8px
          font-size:14px
          line-height:16px
    .seller-picture
      margin:18px
      font-size:0
      .title
        margin-bottom:12px
        font-size:14px
        line-height:14px
        color:rgb(7,17,27)
      .picture-box
        width:100%
        overflow:hidden
        white-space:nowrap
        .picture-list
          font-size:0
          .picture-item
            display:inline-block
            width:120px
            height:90px
            margin-right:6px
            &:last-child
              margin:0
    .seller-infos
      margin:18px 18px 0 18px
      color:rgb(7,17,27)
      .title
        margin-bottom:12px
        font-size:14px
        line-height:14px
      .info
        padding:16px 12px
        font-size:12px
        line-height:16px
        font-weight:200
        border-top-1px(rgba(7,17,27,0.1))
</style>
