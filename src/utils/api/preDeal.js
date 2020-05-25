import Vue from 'vue';
const preDealList = {
    '/server/time': (res) => {
        return res;
    },
    '/mark/boot': (res) => {
        console.log('info', res);
        Vue.$bus.signInfo = res;
        Vue.$bus.refresh = !Vue.$bus.refresh;
        return res;
    }
};

export default function preDeal(key, params) {
    if (preDealList[key]) {
        return preDealList[key](params);
    }
    return params;
}