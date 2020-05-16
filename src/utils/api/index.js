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

class Api {
    async getServerTime() {
        const data = await get('/server/time');
        setServerTime(data.server_time);
    }
    injectJwt(jwt) {
        config.authHeader.Authorization = `Bearer ${jwt}`;
    }
    async login(params) {
        let res = post('/shake/admin/login', params);
        try {
            this.injectJwt(res.jwt);
            // Vue.$storage.save('jwt',res.jwt);
        } catch (e) {
            Vue.$toast('登录失败', 'error');
            throw e;
        }
    }
}


Vue.$api = Vue.prototype.$api = new Api();
