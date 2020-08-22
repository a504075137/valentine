import Vue from 'vue';
import {
    setServerTime,
    post,
    get,
    encryptGet,
    encryptPost,
    auth
} from './axios';
import config from './config';

let source = window.$query.source;


class Api {
    async getServerTime() {
        const data = await get('/server/time');
        setServerTime(data.server_time);
    }
    injectJwt(jwt) {
        config.authHeader.Authorization = `Bear ${jwt}`;
    }

    // login(params) {
    //     return auth.post('/login/feizhi/login', params);
    // }
}


Vue.$api = Vue.prototype.$api = new Api();
