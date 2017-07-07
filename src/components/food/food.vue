<template>
  <transition name="slide">
    <div class="food-wrapper" v-show="foodShow" ref="food">
      <div class="food">
        <div class="food-content">
          <div class="food-img">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="sell">
              <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating==''?0:food.rating}}%</span>
            </div>
            <div class="price-wrapper">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="shopbtn-wrapper">
              <shopbtn :food="food"></shopbtn>
            </div>
            <transition name="fade">
              <div class="buy" @click.stop.prevent="buy" v-show="!food.count||food.count===0">加入购物车</div>
            </transition>
          </div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h2 class="title">商品介绍</h2>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="ratinglist-wrapper">
          <h2 class="title">商品评价</h2>
          <ratinglist
            :ratings="food.ratings"
            :rating-type="ratingType"
            :select-type="selectType"
            :only-content="onlyContent">
          </ratinglist>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="showRating(item.rateType,item.text)" v-for="item in food.ratings" class="rating-item border-1px">
                <div class="user-details">
                  <div class="time">{{item.rateTime | formattingDate}}</div>
                  <div class="user">
                    <span class="username">{{item.username}}</span>
                    <img :src="item.avatar" class="avatar">
                  </div>
                </div>
                <div class="rating-content">
                  <i class="type" :class="{'icon-thumb_down':item.rateType===1,'icon-thumb_up':item.rateType===0}"></i>
                  <span class="text">{{item.text}}</span>
                </div>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import Hub from '../eventHub';
  import {formattingDate} from '../../common/js/formattingDate';
  import BScroll from 'better-scroll';
  import shopbtn from '../shopbtn/shopbtn.vue';
  import split from '../split/split.vue';
  import ratinglist from '../ratinglist/ratinglist.vue';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        foodShow: false,
        ratingType: ['全部', '推荐', '吐槽'],
        onlyContent: false,
        selectType: ALL
      };
    },
    methods: {
      show () {
        this.foodShow = true;
        this.onlyContent = false;
        this.selectType = ALL;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide () {
        this.foodShow = false;
      },
      buy (event) {
        if (!event._constructed) {
          return;
        }
        Hub.$emit('drop', event.target);
        Vue.set(this.food, 'count', 1);
      },
      showRating (type, text) {
        if (this.onlyContent && !text) {  /* 只看有内容的评价 */
          return false;
        }
        if (this.selectType === ALL) {  /* 显示所有评价 */
          return true;
        } else {                      /* 动态选择评价类型 */
          return type === this.selectType;
        }
      }
    },
    mounted () {           /* 接受子组件事件，更改数据，切换评价类型 */
      Hub.$on('selectRating', (only, type) => {
        this.onlyContent = only;
        this.selectType = type;
        this.$nextTick(() => {     /* dom更新完刷新better-scroll */
          if (this.scroll) {
            this.scroll.refresh();
          }
        });
      });
    },
    filters: {
      formattingDate (time) {
        let DATE = new Date(time);
        return formattingDate(DATE, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      'shopbtn': shopbtn,
      'split': split,
      'ratinglist': ratinglist
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .food-wrapper
    position:fixed
    top:0
    left:0
    bottom:48px
    width:100%
    height:100%
    background:#fff
    transform:translate3d(0,0,0)
    transition:all 0.3s linear
    &.slide-enter,&.slide-leave-to
      transform:translate3d(100%,0,0)
    &.slide-leave,&.slide-enter-to
      transform:translate3d(0,0,0)
    .food
      padding-bottom:48px
      .food-content
        position:relative
        .food-img
          position:relative
          width:100%
          height:0
          padding-top:100%
          img
            position:absolute
            top:0
            left:0
            width:100%
            height:100%
          .back
            position:absolute
            left:10px
            top:10px
            .icon-arrow_lift
              display:block
              font-size:18px
              font-weight:500
              padding:10px
              color:rgba(0,160,220,0.6)
        .content
          padding:18px
          position:relative
          .title
            font-size:14px
            line-height:14px
            font-weight:700
            color:rgb(7,17,27)
          .sell
            margin-top:8px
            font-size:10px
            line-height:10px
            color:rgb(147,153,159)
            :first-child
              margin-right:12px
          .price-wrapper
            position:relative
            margin:18px 0
            height:24px
            line-height:24px
            font-weight:700
            font-size:0
            overflow:hidden
            .now
              display:inline-block
              font-size:14px
              color:rgb(240,20,20)
            .old
              display:inline-block
              font-size:10px
              margin-left:8px
              text-decoration:line-through
              color:rgb(147,153,159)
        .shopbtn-wrapper
          position:absolute
          top:62px
          right:12px
        .buy
          position:absolute
          z-index:20
          top:66px
          right:18px
          width:74px
          height:24px
          font-size:10px
          line-height:24px
          color:#fff
          text-align:center
          border-radius:24px
          background:rgb(0,160,220)
          transition:all .2s
          &.fade-enter,&.fade-leave-to
            opactiy:0
          &.fade-leave,&.fade-enter-to
            opactiy:1
      .info
        padding:18px
        .title
          font-size:14px
          line-height:14px
          font-weight:500
        .text
          padding:6px 8px
          font-size:12px
          line-height:24px
          color:rgb(77,85,93)
      .ratinglist-wrapper
        .title
          margin:18px 0 0 18px
          font-size:14px
          line-height:14px
          font-weight:500
        .rating-wrapper
          .rating-item
            margin:0 18px
            padding:16px 0
            border-1px(rgba(7,17,27,0.1))
            .user-details
              width:100%
              height:12px
              position:relative
              color:rgb(147,153,159)
              .time
                font-size:10px
                line-height:12px
              .user
                position:absolute
                top:0
                right:0
                font-size:0
                .username
                  display:inline-block
                  height:12px
                  font-size:10px
                  line-height:12px
                .avatar
                  display:inline-block
                  width:12px
                  height:12px
                  vertical-align:top
                  margin-left:6px
                  border-radius:50%
            .rating-content
              margin-top:6px
              font-size:0
              .type
                display:inline-block
                font-size:12px
                line-height:24px
                &.icon-thumb_down
                  color:rgb(147,153,159)
                &.icon-thumb_up
                  color:rgb(0,160,220)
              .text
                display:inline-block
                margin-left:4px
                font-size:12px
                line-height:16px
                color:rgb(7,17,27)
          .no-rating
            padding:16px 18px
            font-size:12px
            color:rgb(147,153,159)
</style>
