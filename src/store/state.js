// 引入playMode
import { playMode } from "common/js/config";
import { loadSearch } from "common/js/cache";

const state = {
  singer: {},
  playing: false, //播放状态
  fullScreen: false, //播放器全屏 展开或收起
  playlist: [], //播放列表
  sequenceList: [], //顺序列表
  mode: playMode.sequence, //播放模式
  currentIndex: -1, // 当前播放的是哪一首歌
  disc: {},
};

export default state;
