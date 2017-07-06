<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="supportsMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="supports-count"  @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>
    <transition name="fade">
    <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="detail-name">{{seller.name}}</h1>
          <star :size="48" :score="seller.score"
                  class="star-wrapper"></star>
          <v-title text="优惠信息"></v-title>
          <ul class="detail-supports" v-if="seller.supports">
            <li v-for="(item, index) in seller.supports"
               class="supports-item">
              <span class="icon" :class="supportsMap[index]"></span><span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <v-title text="商家公告"></v-title>
          <div class="detail-bulletin">
            <p class="bulletin-content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close">
        <i class="icon-close" @click="showDetail"></i>
      </div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star';
import title from '../title/title';
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false,
      supportsMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    };
  },
  methods: {
    showDetail () {
      this.detailShow = !this.detailShow;
    }
  },
  components: {
    'star': star,
    'v-title': title
  }
};

</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
  .header
    color: #fff
    position:relative
    overflow:hidden
    background:rgba(7,17,27,0.5)
  .content-wrapper
      padding:24px 12px 18px 24px
      position:relative
      font-size:0
      .avatar
        display:inline-block
        img
          border-radius:2px
          display:block
      .content
        display:inline-block
        height:100%
        vertical-align:top
        margin-left:16px
        .title
          margin:2px 0 8px 0
          font-size:0
          .name
            font-size:16px
            font-weight:bold
            line-height:18px
            margin-left:6px
          .brand
            display:inline-block
            width:30px
            height:18px
            bg-image("brand")
            background-size:30px 18px
            background-repeat:no-repeat
            vertical-align:top
        .description
          margin-bottom:10px
          font-size:12px
          line-height:12px
        .supports
          margin-bottom:2px
          font-size:0
          .icon
            display:inline-block
            width:12px
            height:12px
            background-size:12px 12px
            background-repeat:no-repeat
            vertical-align:top
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            margin-left:4px
            font-size:10px
            line-height:12px
      .supports-count
        position:absolute
        height:24px
        line-height:24px
        border-radius:14px
        background:rgba(0,0,0,0.2)
        right:12px
        bottom:15px
        text-align:center
        font-size:0
        padding:0 8px
        .count
          font-size:10px
          vertical-align:top
        .icon-keyboard_arrow_right
          margin-left:2px
          font-size:10px
          line-height:24px
    .bulletin-wrapper
      height:28px
      padding:0 22px 0 12px
      position:relative
      overflow:hidden
      white-space:nowrap
      text-overflow:ellipsis
      background:rgba(7,17,27,0.2)
      .bulletin-title
        display:inline-block
        width:22px
        height:12px
        vertical-align:middle
        bg-image("bulletin")
        background-size:22px 12px
        background-repeat:no-repeat
      .bulletin-text
        margin:0 4px
        font-size:10px
        line-height:28px
      .icon-keyboard_arrow_right
        position:absolute
        font-size:10px
        top:9px
        right:12px
    .background
      position:absolute
      left:0
      top:0
      width:100%
      height:100%
      z-index:-1
      filter:blur(10px)
      img
        width:100%
        height:100%
    .detail
      position:fixed
      width:100%
      height:100%
      top:0
      left:0
      z-index:100
      overflow:auto
      background:rgba(7,17,27,0.8)
      backdrop-filter:blur(10px)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
      .detail-wrapper
        min-height:100%
        width:100%
        .detail-main
          margin-top:64px
          padding-bottom:64px
          .detail-name
            text-align:center
            font-size:16px
            line-height:16px
            font-weight:700
            margin-bottom:16px
          .star-wrapper
            text-align:center
            height:24px
          .detail-supports
            width:80%
            margin:0 auto
            .supports-item
              margin:0 12px 12px 12px
              &:last-child
                margin-bottom:0
              .icon
                display:inline-block
                width:16px
                height:16px
                background-size:16px 16px
                background-repeat:no-repeat
                vertical-align:middle
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.special
                  bg-image('special_2')
                &.invoice
                  bg-image('invoice_2')
                &.guarantee
                  bg-image('guarantee_2')
              .text
                display:inline-block
                margin-left:6px
                font-size:12px
                line-height:12px
                vertical-align:middle
          .detail-bulletin
            width:80%
            margin:0 auto
            .bulletin-content
              padding:0 12px
              font-size:12px
              line-height:24px
      .detail-close
        position:relative
        width:32px
        height:32px
        clear:both
        margin:-64px auto 0 auto
        font-size:32px
        color:rgba(255,255,255,0.5)

</style>
