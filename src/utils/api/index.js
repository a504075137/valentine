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
        return new Promise(async (resolve, reject) => {
            let res = await post('/login', params);
            // res.jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJkYXRhIjp7InBob25lIjoiMTgxMjIxODA5NjQifSwiZXhwIjoxNTkyNzU2MDY0LCJzdWIiOiIifQ.Z7sSZC0Yw9o0xc_V7QNQWzbDQFhsjyoPWEPUD46BcaTmtydaIiNalTYIau8OO5LTxCdvy2wujMzAz_gX4g9nTw';
            try {
                if (res.jwt) {
                    this.injectJwt(res.jwt);
                    Vue.$storage.save('jwt', res.jwt);
                    resolve();
                } else {
                    Vue.$toast('登录失败', 'error');
                    reject('登录失败');
                }

            } catch (e) {
                Vue.$toast('登录失败', 'error');
                throw e;
            }
        });

    }
    homeConfig(params) {
        return auth.get('/index/status/get', params);
    }
    boot(params) { // 获取奖品数据
        return auth.get('/mark/boot', params);
    }
    mark(params) { // 签到
        return auth.post('/mark', params);
    }
    remark(params) {
        return auth.post('/mark/reMark', params);
    }
    sendForm(params) {
        return auth.post('/mark/form', params);
    }
}


Vue.$api = Vue.prototype.$api = new Api();
