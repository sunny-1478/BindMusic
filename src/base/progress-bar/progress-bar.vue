<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- 给进度条按钮添加滑动事件(.prevent阻止浏览器默认行为) -->
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入prefixStyle
import {prefixStyle} from 'common/js/dom'
// 使用prefixStyle中的transform
  const transform = prefixStyle('transform')

  // 定义按钮宽度为16 由样式决定
  const progressBtnWidth=16
export default {
  props:{
    // 给进度条一个百分比属性
    percent:{
      type:Number,
      default:0
    }
  },
  // 创建touch实例对象
  created(){
    // 用于不同的回调函数里边需要去共享一些数据的时候，需要把共享数据挂载到touch的空对象中
    this.touch={}
  },
  methods:{
    //从参数e中拿到touch的信息
    progressTouchStart(e){
      // touch初始化
      this.touch.initiated=true
      // 记录touch点击的位置 touches[0].pageX表示我们第一次移动小球时的位置
      this.touch.startX=e.touches[0].pageX
      // 记录当前按钮的偏移位置：滚动进度条的宽度
      this.touch.left=this.$refs.progress.clientWidth
    },
    progressTouchMove(e){
      // 如果没有经过progressTouchStart直接return
      if(!this.touch.initiated){
        return
      }
      // 手指移动的偏移量
      const deltaX=e.touches[0].pageX-this.touch.startX
      // 小球移动后的位置 移动量不能小于0，不能超过进度条宽度
      const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,this.touch.left+deltaX))
      this._offset(offsetWidth)
      
    },
    progressTouchEnd(){
      this.touch.initiated=false
      this._triggerPercent();
    },
    // 拖动完成 派发percent改变事件
    _triggerPercent(){
      const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
      const percent=this.$refs.progress.clientWidth/barWidth
      this.$emit('percentChange',percent)
    },
    _offset(offsetWidth){
      this.$refs.progress.style.width=`${offsetWidth}px`
      //进度条小球偏移量
      this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)` 
    },
    // 点击滚动条时  改变当前歌曲播放进度
    progressClick(e){
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      
      this._triggerPercent()
    }
  },

watch:{
  // 监听进度条百分比变化
  percent(newPercent){
    // !this.touch.initiated防止与移动事件造成冲突
    if(newPercent>0 && !this.touch.initiated){
      // 进度条宽度
      const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
      // console.log(barWidth)
      // 偏移宽度 歌曲播放比例
      const offsetWidth=newPercent*barWidth
      // console.log(offsetWidth)
      this._offset(offsetWidth)
    }
  }
}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>