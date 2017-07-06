<template>
<div class="detail-title">
  <div class="line"></div>
  <div class="text">{{text}}</div>
  <div class="line"></div>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    text: {
      type: String
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .detail-title
    display:flex
    width:80%
    margin:28px auto 24px auto
    .line
      flex:1
      border-bottom:1px solid rgba(255,255,255,0.2)
      position:relative
      top:-7px
    .text
      margin:0 12px
      font-size:14px
      line-height:14px
      font-weight:700
</style>
