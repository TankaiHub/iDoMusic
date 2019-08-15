import axios from 'axios'
axios.defaults.baseURL =  'http://127.0.0.1:3000';
axios.interceptors.request.use( function (config) {
    return config;
}, function (err) {
    return Promise.reject(err);
} );
export default axios;