import axios from '@/axios'

export function getBanner(type) {
    return axios.get(`/banner?type=${type}`);
}

export function getPersonalized() {
    return axios.get(`/personalized?limit=6`);
}

export function getNewSong() {
    return axios.get(`/personalized/newsong`);
}