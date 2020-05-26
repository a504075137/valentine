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
        config.authHeader.Authorization = `Bear ${jwt}`;
    }
    async login(params) {
        return new Promise(async (resolve, reject) => {
            let res = await post('/login/feizhi/login', { country_code: "86", isuid: "2", ...params });
            console.log(res);
            try {
                if (res.jwt) {
                    this.injectJwt(res.jwt);
                    Vue.$storage.save('jwt', res.jwt);
                    resolve(res);
                } else {
                    // Vue.$toast('登录失败', 'error');
                    reject(res);
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
    sendCode(params) {
        return post('/login/feizhi/code', { country_code: 86, ...params });
    }
    register(params) {
        return post('/login/feizhi/register', params);
    }
    // login(params) {
    //     return auth.post('/login/feizhi/login', params);
    // }
}


Vue.$api = Vue.prototype.$api = new Api();
