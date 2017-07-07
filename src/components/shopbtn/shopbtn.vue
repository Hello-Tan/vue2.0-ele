<template>
<div class="shopbtn">
  <transition name="move">
    <div class="shop-decrease icon-remove_circle_outline"
         v-show="food.count>0" @click.stop.prevent="removeShop($event)">
    </div>
  </transition>
  <div class="shop-count" v-show="food.count>0">{{food.count}}</div>
  <div class="shop-add icon-add_circle" @click.stop.prevent="addShop($event)"></div>
</div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import Hub from '../eventHub';

  export default({
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addShop (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$nextTick(() => {    /* 下次更新dom执行，保证流畅 */
          Hub.$emit('drop', event.target);
        });
      },
      removeShop (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  });
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shopbtn
    font-size:0
    transform-style: preserve-3d;
    .shop-decrease
      display:inline-block
      padding:6px
      font-size:24px;
      line-height:24px
      color:rgb(0,160,220)
      transition:all 0.3s linear
      &.move-enter, &.move-leave-to
        opacity:0
        transform:translate3d(24px,0,0) rotate(180deg)
      &.move-leave, &.move-enter-to
        opactiy:1
        transform:translate3d(0,0,0) rotate(0)
    .shop-count
      display:inline-block
      vertical-align:top
      width:18px
      text-align:center
      font-size:10px
      line-height:36px;
      color:rgb(147,153,159)
    .shop-add
      display:inline-block
      padding:6px
      font-size:24px;
      line-height:24px
      color:rgb(0,160,220)
</style>
