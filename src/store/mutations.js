export default {
    set_musicPlayList(state, list) {
        state.musicPlayList = list;
    },
    set_sequencePlayList(state, list) {
        state.sequencePlayList = list;
    },
    set_currentIndex(state, index) {
        state.currentIndex = index;
    },
    set_musicId(state, id) {
        state.musicId = id;
    },
    set_mode(state, mode) {
        state.mode = mode;
    },
    set_isClick(state, bool) {
        state.isClick = bool;
    },
    set_songsType(state, type) {
        state.songsType = type;
        console.log(type, '-->mutations songsType')
    }
}