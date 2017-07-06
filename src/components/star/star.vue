<template>
  <div class="star" :class="starType">
    <span v-for="item in starClasses"
          :class="item"
          class="star-item"
          ></span>
  </div>
</template>

<script type="text/ecmascript-6">
const LEN = 5;
const HALF = 'half';
const ON = 'on';
const OFF = 'off';
export default{
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starClasses () {
      let result = [];
      let size = this.score;
      let len = Math.floor(size);
      let part = size - len > 0.5;
      for (let i = 0; i < len; i++) {
        result.push(ON);
      }
      if (part) {
        result.push(HALF);
      }
      while (result.length < LEN) {
        result.push(OFF);
      }
      return result;
    },
    starType () {
      return 'star-' + this.size;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .star
    font-size:0
    .star-item
      display:inline-block
      background-repeat:no-repeat
    &.star-48
      .star-item
        width:20px
        height:20px
        margin-right:22px
        background-size:20px 20px
        &:last-child
          margin-right:0
        &.on
          bg-image('star48_on')
        &.off
          bg-image('star48_off')
        &.half
          bg-image('star48_half')
    &.star-36
      .star-item
        width:15px
        height:15px
        margin-right:6px
        background-size:15px 15px
        &:last-child
          margin-right:0
        &.on
          bg-image('star36_on')
        &.off
          bg-image('star36_off')
        &.half
          bg-image('star36_half')
    &.star-24
      .star-item
        width:10px
        height:10px
        margin-right:3px
        background-size:10px 10px
        &:last-child
          margin-right:0
        &.on
          bg-image('star24_on')
        &.off
          bg-image('star24_off')
        &.half
          bg-image('star24_half')



</style>
