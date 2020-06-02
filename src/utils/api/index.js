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
const source = window.$query.source;

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
            let res = await post('/login/feizhi/login', { country_code: "86", isuid: "2", source, ...params });
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
    boot(params) { // 获取用户奖品数据
        return auth.get('/mark/userBoot', params);
    }
    preLogin(params) { // 获取活动配置
        return get('/login/feizhi/pre', { ...params, source });
    }
    getActivity(params) { // 获取活动配置
        return get('/mark/boot', { ...params, source });
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
        return post('/login/feizhi/code', { country_code: 86, ...params, source });
    }
    register(params) {
        return post('/login/feizhi/register', { ...params, source });
    }
    // login(params) {
    //     return auth.post('/login/feizhi/login', params);
    // }
}


Vue.$api = Vue.prototype.$api = new Api();
