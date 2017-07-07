<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left border-1pxx">
          <p class="score">{{seller.score}}</p>
          <p class="text">综合评分</p>
          <p class="rankRate">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="graded">
            <span class="text">服务态度</span>
            <div class="star-wrapper"><star :size="36" :score="seller.serviceScore"></star></div>
            <span class="desc">{{seller.serviceScore}}</span>
          </div>
          <div class="graded">
            <span class="text">商品评价</span>
            <div class="star-wrapper"><star :size="36" :score="seller.foodScore"></star></div>
              <span class="desc">{{seller.foodScore}}</span>
          </div>
          <div class="delivery">
            <span class="text">送达时间</span>
            <span class="desc">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratinglist
        :select-type="selectType"
        :only-content="onlyContent"
        :ratings="ratings">
      </ratinglist>
      <ul>
        <li v-for="rating in ratings" class="rating border-1px"
          v-show="showRating(rating.rateType,rating.text)">
          <div class="avatar">
            <img :src="rating.avatar" width="28" height="28">
          </div>
          <div class="rating-content">
            <div class="user-details">
              <span class="username">{{rating.username}}</span>
              <span class="time">{{rating.rateTime |formattingDate}}</span>
            </div>
            <div class="user-rating">
              <div class="star-wrapper"><star :size="24" :score="rating.score"></star></div>
              <span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="rating-text" v-show="rating.text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend&&!!rating.recommend.length">
              <i class="icon-thumb_up"></i>
              <span v-for="(item,index) in rating.recommend" class="recommend-food" v-show="index<3">{{rating.recommend[index]}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../../components/star/star.vue';
  import split from '../../components/split/split.vue';
  import ratinglist from '../../components/ratinglist/ratinglist.vue';
  import {formattingDate} from '../../common/js/formattingDate';
  import Hub from '../eventHub';
  import BScroll from 'better-scroll';
  import Data from '../../../data.json';

  const ALL = 2;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        selectType: ALL,
        onlyContent: false,
        ratings: []
      };
    },
    components: {
      star,
      split,
      ratinglist
    },
    created () {
      this.ratings = Data.ratings;
      this._initScroll();
      Hub.$on('selectRating', (only, type) => {
        this.onlyContent = only;
        this.selectType = type;
      });
    },
    methods: {
      showRating (type, text) {
        if (this.onlyContent && !text) {  /* 只看有内容的评价 */
          return false;
        }
        if (this.selectType === ALL) {  /* 显示所有评价 */
          return true;
        } else {                      /* 动态选择评价类型 */
          return type === this.selectType;
        }
      },
      _initScroll () {
        if (!this.scroll) {
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          });
        } else {
          this.scroll.refresh();
        }
      }
    },
    filters: {
      formattingDate (time) {
        let DATE = new Date(time);
        return formattingDate(DATE, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  $orange = rgb(255,153,0)
  .ratings
    position:absolute
    width:100%
    top:174px
    left:0
    bottom:0
    overflow:hidden
    background:#fff
    .ratings-content
      .overview
        display:flex
        .overview-left
          flex: 0 0 137px
          width:137px
          margin:18px 0
          border-right-1px(rgba(7,17,27,0.1))
          text-align:center
          @media only screen and (max-width: 320px)  {
            flex: 0 0 120px
            width:120px
          }
          .score
            margin-bottom:6px
            font-size:24px
            line-height:28px
            color:$orange
          .text
            margin-bottom:8px
            font-size:12px
            line-height:12px
            color:rgb(7,17,27)
          .rankRate
            margin-bottom:6px
            font-size:10px
            line-height:10px
            color:rgb(147,153,159)
        .overview-right
          flex:1
          margin:18px 24px
          @media screen and (max-width: 320px)  {
            margin:18px 5px
          }
          @media screen and (min-width: 350px)  {
            margin:18px 15px
          }
          @media screen and (min-width: 400px)  {
            margin:18px 24px
          }
          .graded
            margin-bottom:8px
            font-size:0
            .text
              display:inline-block
              font-size:12px
              line-height:18px
              color:rgb(7,17,27)
            .star-wrapper
              display:inline-block
              vertical-align:top
              margin:0 12px
            .desc
              font-size:12px
              line-height:18px
              color:$orange
          .delivery
            font-size:0
            .text
              margin-right:12px
              font-size:12px
              line-height:18px
              color:rgb(7,17,27)
            .desc
              font-size:12px
              line-height:18px
              color:rgb(147,153,159)
      .rating
        margin:0 18px
        padding:18px 0
        border-1px(rgba(7,17,27,0.1))
        position:relative
        .avatar
          position:absolute
          left:0
          top:18px
          img
            border-radius:50%
        .rating-content
          margin-left:40px
          .user-details
            position:relative
            margin-bottom:4px
            font-size:0
            .username
              display:inline-block
              font-size:10px
              line-height:12px
              color:rgb(7,17,27)
            .time
              display:inline-block
              position:absolute
              right:0
              top:0
              font-size:10px
              line-height:12px
              font-weight:200
              color:rgb(147,153,159)
          .user-rating
            margin-bottom:6px
            font-size:0
            .star-wrapper
              display:inline-block
              vertical-align:top
            .delivery-time
              display:inline-block
              margin-left:6px
              font-size:10px
              line-height:12px
              font-weight:200
              color:rgb(147,153,159)
          .rating-text
            font-size:12px
            line-height:18px
            color:rgb(7,17,27)
          .recommend
            margin-top:8px
            font-size:0
            .icon-thumb_up
              font-size:12px
              line-height:16px
              color:rgb(0,160,220)
            .recommend-food
              display:inline-block
              margin:0 8px
              padding:0 6px
              border:1px solid rgba(7,17,27,0.1)
              border-radius:2px
              font-size:9px
              line-height:16px
              color:rgb(147,153,159)
</style>
