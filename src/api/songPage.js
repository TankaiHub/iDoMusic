import axios from '@/axios'

export function getRecommendListData(id) {//获取歌单
    return axios.get(`/playlist/detail?id=${id}`);
}

export function getSingerListData(id) { //获取歌手
    return axios.get(`/artists?id=${id}`);
}