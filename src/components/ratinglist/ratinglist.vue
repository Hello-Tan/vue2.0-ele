<template>
  <div class="ratinglist">
    <div class="ratings-type border-1px">
      <div class="rating-type all" :class="{'active':selectType===2}" @click="setRatingType(2,$event)">
        <span class="name">{{ratingType[0]}}</span>
        <span class="count">{{ratings.length}}</span>
      </div>
      <div class="rating-type positive" :class="{'active':selectType===0}" @click="setRatingType(0,$event)">
        <span class="name">{{ratingType[1]}}</span>
        <span class="count">{{positive.length}}</span>
      </div>
      <div class="rating-type negative" :class="{'active':selectType===1}" @click="setRatingType(1,$event)">
        <span class="name">{{ratingType[2]}}</span>
        <span class="count">{{negative.length}}</span>
      </div>
    </div>
    <div class="content-type">
      <i class="icon-check_circle" :class="{'active':onlyContent}" @click="toggleOnlyContent"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Hub from '../eventHub';

  const ALL = 2;
  const POSITIVE = 0;
  const NEGATIVE = 1;

  export default{
    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },
      ratingType: {
        type: Array,
        default () {
          return ['全部', '满意', '不满意'];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        Type: this.selectType,
        Content: this.onlyContent
      };
    },
    computed: {
      positive () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negative () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      setRatingType (type, event) {
        if (!event._constructed) {
          return;
        }
        this.Type = type;
        /* 触发父组件事件，传递更新后的数据 */
        Hub.$emit('selectRating', this.Content, this.Type);
      },
      toggleOnlyContent (event) {
        if (!event._constructed) {
          return;
        }
        this.Content = !this.Content;
        Hub.$emit('selectRating', this.Content, this.Type);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .ratinglist
    .ratings-type
      margin:0 18px
      padding:18px 0
      font-size:0
      border-1px(rgba(7,17,27,0.1))
      .rating-type
        display:inline-block
        width:60px
        height:32px
        margin-right:8px
        border-radius:1px
        text-align:center
        color:rgb(77,85,93)
        &.all,&.positive
          background:rgba(0,160,220,0.2)
          &.active
            border-radius:12px
            color:#fff
            background:rgba(0,160,220,1)
        &.negative
          background:rgba(77,85,93,0.2)
          &.active
            border-radius:12px
            color:#fff
            background:rgba(77,85,93,1)
        .name
          display:inline-block
          font-size:12px
          line-height:32px
        .count
          margin-left:2px
          font-size:8px
    .content-type
      padding:18px
      border-bottom:1px solid rgba(7,17,27,0.1)
      font-size:0
      color:rgb(147,153,159)
      .icon-check_circle
        display:inline-block
        font-size:24px
        line-height:24px
        &.active
          color:#00c850
      .text
        display:inline-block
        vertical-align:top
        margin-left:4px
        font-size:12px
        line-height:24px
</style>
