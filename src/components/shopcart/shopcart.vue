<template>
<div class="shopcart">
  <div class="content" @click="showDetail">
    <div class="content-left">
      <div class="cart-wrapper">
        <div class="cart" :class="{highlight:foodsCount>0}">
          <i class="icon-shopping_cart" :class="{highlight:foodsCount>0}"></i>
        </div>
        <div class="num" v-show="foodsCount>0">{{foodsCount}}</div>
      </div>
      <div class="price" :class="{highlight:foodsPrice>0}">￥{{foodsPrice}}</div>
      <div class="delivery-cost">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <div class="content-right"
         :class="{highlight:foodsPrice>=minPrice}"
        @click.stop.prevent="payment">
      <div class="delivery">{{delivery}}</div>
    </div>
  </div>
  <div class="ball-wrapper">
    <transition name="fade" v-for="ball in balls" :key="ball" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball" v-show="ball.show">
        <div class="inner inner-hook"></div>
      </div>
    </transition>
  </div>
  <transition name="slide">
    <div class="showcart-details" v-show="detailShow">
      <div class="details-header">
        <h1 class="title">购物车</h1>
        <div class="empty" @click="emptyShowCart">清空</div>
      </div>
      <div class="details-content" ref="detailsContent">
        <ul>
          <li class="details-content-item border-1px" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">￥{{food.price*food.count}}</div>
            <div class="shopbtn-wrapper">
              <shopbtn :food="food"></shopbtn>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
  <transition name="fade">
    <div class="details-bg" v-show="detailShow" @click="showDetail"></div>
  </transition>
</div>
</template>

<script type="text/ecmascript-6">
  import Hub from '../eventHub';
  import BScroll from 'better-scroll';
  import shopbtn from '../shopbtn/shopbtn.vue';

  export default({
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        detail: false
      };
    },
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [
            {
              count: 0,
              price: 0
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number
      },
      minPrice: {
        type: Number
      }
    },
    computed: {
      foodsCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      foodsPrice () {
        let price = 0;
        this.selectFoods.forEach((food) => {
          price += food.price * food.count;
        });
        return price;
      },
      delivery () {
        if (this.foodsPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.foodsPrice < this.minPrice) {
          let price = this.minPrice - this.foodsPrice;
          return `还差￥${price}起送`;
        } else {
          return `去结算`;
        }
      },
      detailShow () {
        if (!this.foodsCount) {
          this.detail = false;
          return false;
        }
        if (this.detail) {
          if (!this.scroll) {
            this.$nextTick(() => {
              this.scroll = new BScroll(this.$refs.detailsContent, {
                click: true
              });
            });
          } else {
            this.$nextTick(() => {
              this.scroll.refresh();
            });
          }
        }
        return this.detail;
      }
    },
    created () {
      Hub.$on('drop', (el) => {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      });
    },
    methods: {
      beforeEnter (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter (el, done) {
        /* eslint-disable no-unused-vars */
        let redraw = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift();
        if (ball) {           /* 对象是引用类型，会修改balls对应的值 */
          ball.show = false;
          el.style.display = 'none';
        }
      },
      showDetail () {
        if (this.foodsCount) {
          this.detail = !this.detail;
        }
      },
      emptyShowCart () {
        this.selectFoods.forEach((food) => {
          if (food.count) {
            food.count = 0;
          }
        });
      },
      payment () {
        if (this.foodsPrice >= this.minPrice) {
          window.alert(`本次消费${this.foodsPrice}元！`);
        }
      }
    },
    components: {
      'shopbtn': shopbtn
    }
  });

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .shopcart
    width:100%
    height:48px
    position:fixed
    z-index:50
    left:0
    bottom:0
    .content
      display:flex
      position:relative
      z-index:49
      font-size:0
      color:rgba(255,255,255,0.4)
      .content-left
        flex:1
        background:#141d27
        .cart-wrapper
          display:inline-block
          vertical-align:top
          width:56px
          height:56px
          position:relative
          top:-10px
          background:#151F28
          margin:0 12px
          padding:6px
          box-sizing:border-box
          border-radius:50%
          .cart
            width:100%
            height:100%
            border-radius:50%
            text-align:center
            background:#2b343c
            .icon-shopping_cart
              font-size:24px
              line-height:44px
              color:#80858a
              &.highlight
                color:#fff
            &.highlight
              background:#00a0dc
          .num
            width:24px
            height:16px
            position:absolute
            top:0
            right:0
            color:#fff
            font-size:9px
            font-weight:700
            line-height:18px
            text-align:center
            border-radius:12px
            box-shadow:0px 4px 8px 0px rgba(0,0,0,0.4)
            background:rgb(240,20,20)
        .price
          display:inline-block
          vertical-align:top
          padding-right:12px
          margin:12px 0
          font-size:16px
          line-height:24px
          box-sizing:border-box
          border-right:1px solid  rgba(255,255,255,0.1)
          font-weight:700
          &.highlight
           color:#fff
        .delivery-cost
          display:inline-block
          vertical-align:top
          font-size:10px
          font-weight:normal
          line-height:48px
          margin:0 12px
      .content-right
        flex:0 0 105px
        width:105px
        background:#2b333b
        &.highlight
          background:#00b43c
          color:#fff
        .delivery
          padding:0 8px
          font-size:12px
          font-weight:700
          text-align:center
          line-height:48px
    .ball-wrapper
      .ball
        position:fixed
        left:32px
        bottom:22px
        z-index:200
        transition:all .4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width:16px
          height:16px
          border-radius:50%
          background:rgb(0,160,220)
          transition:all .4s linear
    .showcart-details
      width:100%
      position:absolute
      z-index:48
      left:0
      top:0px
      transform:translate3d(0,-100%,0)
      transition:all .5s
      &.slide-enter, &.slide-leave-to
        transform:translate3d(0,0,0)
      &.slide-leave, &.slide-enter-to
        transform:translate3d(0,-100%,0)
      .details-header
        height:40px
        padding:0 18px
        line-height:40px
        box-sizing:border-box
        border-bottom:1px solid rgba(7,17,27,0.1)
        background:#f3f5f7
        .title
          float:left
          font-size:14px
          font-weight:200
          color:rgb(7,17,27)
        .empty
          float:right
          font-size:12px
          color:rgb(0,160,220)
      .details-content
        max-height:217.5px
        padding:0 16px
        overflow:hidden
        background:#fff
        .details-content-item
          position:relative
          height:48px
          line-height:24px
          padding:12px 0
          border-1px(rgba(7,17,27,0.1))
          box-sizing:border-box
          .name
            font-size:14px
            font-weight:700
            color:rgb(7,17,27)
          .price
            position:absolute
            right:95px
            bottom:12px
            font-size:14px
            font-weight:700
            color:rgb(240,20,20)
          .shopbtn-wrapper
            position:absolute
            right:0
            bottom:6px
            line-height:1
            font-size:24px
    .details-bg
      position:fixed
      z-index:40
      top:0
      left:0
      width:100%
      height:100%
      background:rgba(7,17,27,.6)
      transition:all 0.5s
      &.fade-enter, &.fade-leave-to
        -webkit-backdrop-filter:blur(0)
        backdrop-filter:blur(0)
        background:rgba(7,17,27,0)
      &.fade-leave, &.fade-enter-to
        -webkit-backdrop-filter:blur(0)
        backdrop-filter:blur(0)
        background:rgba(7,17,27,0.6)
</style>
