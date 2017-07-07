<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu-list">
        <li v-for="(item,index) in goods" class="menu-item"
        :class="{'current':currentIndex===index}"
        @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span class="icon" v-if="item.type>0"
                  :class="supportsMap[item.type]"></span>
            {{goods[index].name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods"  class="foods-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood($event,food)" v-for="food in item.foods" class="foods-item border-1px">
              <div class="food-icon">
                <img :src="food.icon">
              </div>
              <div class="food-content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description" v-show="food.description">{{food.description}}</p>
                <div class="sell">
                  <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating===""?0:food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now-price">￥{{food.price}}</span>
                  <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="shopbtn-wrapper">
                  <shopbtn :food="food">
                  </shopbtn>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      :min-price="seller.minPrice"
      :delivery-price="seller.deliveryPrice"
      :select-foods="selectFoods">
    </shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart';
  import shopbtn from '../shopbtn/shopbtn.vue';
  import food from '../food/food.vue';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        supportsMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
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
    methods: {
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight () {
        let list = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0, len = list.length; i < len; i++) {
          height += list[i].clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu (index, event) {
        if (!event._constructed) {
          return;
        }
        let list = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = list[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood (event, food) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      'shopcart': shopcart,
      'shopbtn': shopbtn,
      'food': food
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .goods
    display:flex
    position:absolute
    width:100%
    top:174px
    bottom:48px
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px
      background:#f3f5f7
      .menu-list
        .menu-item
          display:table
          height:54px
          width:56px
          padding:0 12px
          line-height:14px
          &.current
            position:relative
            z-index:10
            margin-top:-1px
            font-weight:700
            background:#fff
            .text:after
              border:none
          .icon
            display:inline-block
            margin:auto 0
            width:12px
            height:12px
            background-size:12px 12px
            background-repeat:no-repeat
            vertical-align:top
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.special
              bg-image('special_3')
            &.invoice
              bg-image('invoice_3')
            &.guarantee
              bg-image('guarantee_3')
          .text
            display:table-cell
            vertical-align: middle
            border-1px(rgba(7,17,27,0.1))
            font-size:12px
            line-height:14px
            color:rgb(77,85,93)
    .foods-wrapper
      flex:1
      .foods-list
        .title
          height:26px
          font-size:12px
          line-height:26px
          padding-left:14px
          border-left:2px solid #d9dde1
          color:rgb(147,153,159)
          background:#f3f5f7
        .foods-item
          display:flex
          margin:0 18px
          padding:18px 0
          font-size:0
          border-1px(rgba(7,17,27,0.1))
          &:last-child:after
            border:0
          .food-icon
            flex:0 0 57px
            img
               width:57px
               height:57px
          .food-content
            flex:1
            position:relative
            margin-left:10px
            .name
              font-size:14px
              line-height:14px
              font-weight:700
              margin:2px 0 8px 0
              color:rgb(7,17,27)
            .description,.sell
              font-size:10px
              line-height:12px
              color:rgb(147,153,159)
            .sell
              line-height:10px
              margin-top:8px
              :first-child
                margin-right:12px
            .price
                line-height:24px
                font-weight:700
              .now-price
                display:inline-block
                font-size:14px
                color:rgb(240,20,20)
              .old-price
                display:inline-block
                font-size:10px
                margin-left:8px
                text-decoration:line-through
                color:rgb(147,153,159)
            .shopbtn-wrapper
              position:absolute
              right:0
              bottom:0
</style>
