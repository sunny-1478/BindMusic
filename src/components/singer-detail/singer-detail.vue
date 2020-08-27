<template>
  <transition name="slide" >
    <!-- 使用music-list组件并传入参数 -->
    <music-list :songs='songs' :title="title" :bg-image='bgImage'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  // import MusicList from 'components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong} from 'common/js/song'
  import { mapGetters } from 'vuex'
  // 引入music-list组件
  import MusicList from '../music-list/music-list'

  export default {
    data(){
      return{
        songs:[]
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },

      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 如果获取不到歌手id
      if (!this.singer.id) {
        // 调用this.$router回退到歌手列表 也就是说如果用户在歌手详情页面点击刷新 将回退到歌手列表
        this.$router.push('/singer')
        return
      }
        // 通过this.singer.id传入singe.id 获取歌曲信息
       getSingerDetail(this.singer.id).then((res)=>{
         if(res.code==ERR_OK){
          //  console.log(res.data.list)
          this.songs=this._normalizeSongs(res.data.list)
          // console.log(this.songs)
         }
       })
      },
      //  定义normalizeSongs方法对list进行处理
      // 对list进行遍历
      _normalizeSongs(list){
        let ret =[];
        list.forEach((item)=>{
          let {musicData}=item;
          // 因为必须要传入songid 和 albummid 才去push song的实例
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        return ret 
      }
    },
    // 注册MusicList组件
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable';

  *
    touch-action: none;

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  
    
</style>