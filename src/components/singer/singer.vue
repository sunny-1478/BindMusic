<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
//引进getSingerList方法
import { getSingerList } from "../../api/singer";
import { ERR_OK } from "../../api/config";
import Singer from "../../common/js/singer";
import ListView from "../../base/listview/listview";
// vue语法糖mapMutations
import {mapMutations} from 'vuex'
// import {playlistMixin} from 'common/js/mixin'

// 定义一个热门数据常量
const HOT_NAME = "热门";
const HOT_NAME_LEN = 10;
export default {
  // mixins: [playlistMixin],
  data() {
    return {
      singers: [],
    };
  },
  created() {
    this._getSingerList();
  },

  methods: {
    selectSinger(singer){
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      // 调用setSinger 把singer传过来
        this.setSinger(singer)
    },
    _getSingerList() {
      // 调用getSingerList方法
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normaLizeSinger(res.data.list);
        }
      });
    },
    // 规范化歌手数据
    _normaLizeSinger(list) {
      // 创建对象 map
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      list.forEach((item, index) => {
        if (index < HOT_NAME_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          })
        );
      });
      // 为了得到有序列表，我们需要处理map
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title == HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    // 调用mapMutations语法糖
    ...mapMutations({
      // 映射mutations-type中的STE_SINGER
      setSinger:'SET_SINGER'
    })
  },

  //   注册Listview组件
  components: {
    ListView
  },
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
