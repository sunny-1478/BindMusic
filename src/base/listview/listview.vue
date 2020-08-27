<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li
        v-for="(group, a) in data"
        :key="a"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <uL>
          <li
            @click="selectItem(item)"
            v-for="(item, b) in group.items"
            :key="b"
            class="list-group-item"
          >
            <img class="avatar" :src="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!-- 歌手列表的右侧快速入口 -->
    <!-- 给列表添加一个点击事件touchstart点击右侧列表时，可以访问到歌手列表相应位置 -->
    <!-- 定义 -->
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="item"
          :class="{ current: currentIndex == index }"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- // 当我们滚动到某一个区块，顶方就显示对应区块的名称 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Loading from "../../base/loading/loading";
import Scroll from "../../base/scroll/scroll";
// 导入dom.js中封装好的getData方法
import { getData } from "../../common/js/dom";
// 获取右侧列表每一个数字所占的高度 高度为css样式自定义18
const ANCHOR_HEIGHT = 18;
// 定义title高度
const TITLE_HEIGHT = 30;
export default {
  created() {
    // 创建touch对象
    this.touch = {};
    // 创建listenScroll
    this.listenScroll = true;
    // 列表高度
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      // 观测scrollY数据 默认值为-1；
      scrollY: -1,
      // 观测当前应该显示的第几个 默认值为0 第一个为高亮
      currentIndex: 0,
      // diff表示这个区块的上限和当前滚动位置的滚动差
      diff: -1,
    };
  },
  props: {
    data: {
      type: Array,
      dafault: [],
    },
  },
  //vue计算属性,
  computed: {
    // 获取右侧入口的快速属性
    shortcutList() {
      return this.data.map((group) => {
        // 返回title的集合数组
        return group.title.substr(0, 1);
      });
    },
    // 当我们滚动到某一个区块，顶方就显示对应区块的名称
    fixedTitle() {
      // 当scrollY>0返回值为空
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    },
  },
  // 歌手列表左右联动的总结：
  // 他的主要难度就是在于左右的联动：也就是说如果想要达到左边和右边的联动，首先需要知道左边实时滚动的位置，然后根据他的滚动位置，来算到他当前滚动位置是落在左边的哪一个group的区间，得到落在哪一个区间以后，就知道右侧对应的索引，对应的哪个索引应该高亮
  // 然后结合到vue里边：我们主要用到watch去观测变化，然后配合scroll实时派发的scrollY去观测Y值得变化，之后就可以计算到currentIndex，然后根据currentIndex通过Vuedom的映射currentIndex如果等于当前索引时，就加入一个高亮效果
  methods: {
    // 定义歌手列表点击事件
    selectItem(item) {
      this.$emit("select", item);
    },

    // 定义onShortcutTouchStart方法实现点击事件touchstart
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      // 获取手指首次触碰位置
      let firstTouch = e.touches[0];
      //获取firstTouch.pageY的值赋给y1
      this.touch.y1 = firstTouch.pageY;
      // 记录当前点这个锚点的时候是第几个索引
      this.touch.anchorIndex = anchorIndex;
      // 调用_scrollTo()方法
      this._scrollTo(anchorIndex);
    },
    // 定义onShortcutTouchMove方法实现右侧列表滚动事件
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      // 获取右侧列表在y轴上移动了几个元素(偏移了几个锚点)
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      // 获取右侧滑动时的锚点位置
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      // console.log(anchorIndex);
      // 调用_scrollTo()方法
      this._scrollTo(anchorIndex);
    },
    // 创建scroll监听事件 通过scroll事件观测实时滚动的位置
    scroll(pos) {
      // y轴滚动到位置
      this.scrollY = pos.y;
    },
    // 封装 调用Scroll组件滚动到相应位置方法
    _scrollTo(index) {
      // 设置scrollY的值
      this.scrollY = -this.listHeight[index];
      // 点击右侧上边空白区域 给index一个上限值
      if (!index && index !== 0) {
        return;
      }
      // 滑动的时候 给index一个下限值
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      // 调用Scroll组件滚动到相应位置
      // scrollToElement第二个参数是滑动时页面更新的时间
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      this.scrollY = this.$refs.listview.scroll.y;
    },
    // 定义计算高度的方法 当传给listview时候的data发生变化时需要计算高度
    _calculateHeight() {
      this.listHeight = [];
      // 引入list
      const list = this.$refs.listGroup;
      // 初始高度为0
      let height = 0;
      // 第一个元素的高度为0
      this.listHeight.push(height);
      // 遍历list 获取每个group元素的高度
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight; //通过dom属性获取到元素的高度
        this.listHeight.push(height);
      }
    },
  },

  watch: {
    // 监听data的变化
    data() {
      // 设置延时的原因是数据变化到dom变化的时候会有一个延时
      setTimeout(() => {
        // dom渲染后计算每个group的高度
        this._calculateHeight();
      }, 20);
    },
    // 监听scrollY的变化
    scrollY(newY) {
      // 引用listHeight
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }

      // 在中间部分滚动
      // 遍历listHeight通过高度上限和高度下限的值来判断scrollY落在哪个区间
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 获取高度下限
        let height1 = listHeight[i];
        // 获取高度上限
        let height2 = listHeight[i + 1];
        // 通过高度上限和高度下限的值来判断scrollY落在哪个区间
        // newY向上滚动时为负值 -newY为距离
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          // console.log(this.currentIndex)
          // 通过观测diff的变化来设置fixedTitle的偏移
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      // 改变fixed偏移量来达到效果
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
  },

  components: {
    Scroll,
    Loading,
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
}

.list-group {
  padding-bottom: 30px;

  .list-group-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    background: $color-highlight-background;
  }

  .list-group-item {
    display: flex;
    align-items: center;
    padding: 20px 0 0 30px;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .name {
      margin-left: 20px;
      color: $color-text-l;
      font-size: $font-size-medium;
    }
  }
}

.list-shortcut {
  position: absolute;
  z-index: 30;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;

  .item {
    padding: 3px;
    line-height: 1;
    color: $color-text-l;
    font-size: $font-size-small;

    &.current {
      color: $color-theme;
    }
  }
}

.list-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  .fixed-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    background: $color-highlight-background;
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
