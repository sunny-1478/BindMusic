import Song from "common/js/song";

export const singer = (state) => state.singer;

export const playing = (state) => state.playing;

export const fullScreen = (state) => state.fullScreen;

export const playlist = (state) => state.playlist;

export const sequenceList = (state) => state.sequenceList;

export const mode = (state) => state.mode;

export const currentIndex = (state) => state.currentIndex;

// 通过修改currentIndex的变化来修改currentSong的变化 然后改变audio src的变化
// 最后通过watch中的audio来改变歌曲的播放
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {};
};

export const disc = (state) => state.disc;

export const topList = (state) => state.topList;

