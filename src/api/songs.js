import axios from '@/axios.js'

export function getPlaylistCatlist() { //获取所有歌单
    return axios.get(`/playlist/catlist`);
}

export function getTopPlaylist(cat) {
    return axios.get(`/top/playlist?cat=${cat}`);
}