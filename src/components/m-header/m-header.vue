<template>
  <div class="m-header">
    <h1 class="text">Bind Music</h1>
    
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.m-header
  position: relative
  height: 44px
  text-align: center
  color: $color-theme
  font-size: 0

  .text
    display: inline-block
    vertical-align: top
    line-height: 44px
    font-size: $font-size-large-x
  .mine
    position: absolute
    top: 0
    right: 0
    .icon-mine
      display: block
      padding: 12px
      font-size: 20px
      color: $color-theme
</style>
