import axios from '@/axios.js'

export function getSearchHot() {
    return axios.get(`/search/hot`);
}

export function search(keyword, limit, type)  {
    // type = 1歌曲        100歌手             1000歌单 
    return axios.get(`/search?keywords=${keyword}&limit=${limit}&type=${type}`);
}
export function searchData(keyword) {
    return axios.get(`/search/suggest?keywords=${keyword}&limit=5`);
}