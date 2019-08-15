import axios from '@/axios'

export function getRankList() {
    return axios.get(`toplist/detail`);
}