import axios from '@/axios.js'
export function getUrl(id) {//获取url
    return axios.get(`/song/url?id=${id}`);
}

export function getDetail(ids) {//获取歌曲详情
    return axios.get(`/song/detail?ids=${ids}`);
}

export function getLyric(id) {//获取歌词
    return axios.get(`/lyric?id=${id}`);
}

export function checkMucis(id) {//url是否可用
    return axios.get(`/check/music?id=${id}`);
}