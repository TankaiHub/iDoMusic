import axios from '@/axios'

export function getHotSinger(limit) {
    return axios.get(`/top/artists?limit=${limit}`);
}

export function getSingerList(cat) {
    // /artist/list?cat=1001
    return axios.get(`/artist/list?cat=${cat}&limit=100`)
}