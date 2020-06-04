import Vue from 'vue';
import dayjs from 'dayjs';

const formatTime = (value , formatString = 'YYYY-MM-DD HH:mm:ss')=> {
    return dayjs(value).format(formatString);
};

const isBefore = (value)=> {
    return dayjs().isBefore(dayjs(value));
};

const isAfter = (value)=> {
    return dayjs().isAfter(dayjs(value));
};

/**
 * base64解码
 * @param {*} str
 */
const base64Decode = (str)=> {
    if (!str) {
        return str;
    }
    return decodeURIComponent(
        atob(str)
            .split('')
            .map((c)=> '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
};

/**
 * base64编码
 * @param {*} str
 */
const base64Encode = (str)=> {
    if (!str) {
        return str;
    }
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1)=> String.fromCharCode('0x' + p1))
    );
};

/**
 * 获取某URL所有参数，集成一个对象
 * @param {*} url
 */
const getAllUrlQuery = ()=> {
    // 获取连接后面的参数，微信分享的链接可能会有编码问题，先decodeURI
    var list = window.location.search.replace('?', '').split('&');

    window._query = {};
    for (var i = 0;i < list.length;++i) {
        var q = list[i].split('=');
        if (!q[0]) continue;
        window._query[q[0]] = q[1];
    }
    var hashList = (window.location.hash.split('?')[1] || '').split('&');
    window._hquery = {};
    for (var i = 0;i < hashList.length;++i) {
        var q = hashList[i].split('=');
        if (!q[0]) continue;
        window._hquery[q[0]] = q[1];
    }
    // 返回一个空对象
    let result = {
        ...window._query,
        ...window._hquery
    }
    console.log(result);

    for(var key in result){
        console.log(key);
        if(result[key]&&result[key]!=""){
            console.log(result[key])
            Vue.$storage.save(key,result[key]);
            window.localStorage.setItem(key,result[key]);
        }
    }

    var len = window.localStorage.length;  // 获取长度
    var newResult={};
    var arr = new Array(); // 定义数据集
    for(var i = 0; i < len; i++) {
        // 获取key 索引从0开始
        var getKey = window.localStorage.key(i);
        console.log(getKey)
        // 获取key对应的值
        var getVal = window.localStorage.getItem(getKey);
        try {
            getVal = JSON.parse(getVal);
        } catch(e) {
            getVal = getVal;
        }

        // 放进数组
        newResult[getKey] = getVal;
    }
    return newResult;
};

/**
 * 引入上下文
 * @param {*} context
 */
const requireAll = context => context.keys().map(item=> {
    return {
        path: item,
        data: context(item)
    };
});

/**
 * 获取cookie
 * @param {*} name
 */
const getCookie = (name) => {
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    const cookie = document.cookie.match(reg);
    return cookie && cookie[2];
};

function setCookie(name,value)
{
    var Days = 3;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

/**
 * 延时方法
 * @param {*} duration 时间，毫秒
 */
const wait = (duration)=> {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};

/**
 * 获取区间中的随机数
 * @param {*} min 最小值
 * @param {*} max 最大值
 * @param {*} fn 处理随机数方法（比如Math.floor, Math.ceil等等）
 */
const getRandom = (min, max, fn = (data)=> data)=> {
    return fn(Math.random() * (max - min + 1) + min);
};


const u = navigator.userAgent;
/**
 * 是否在微信中打开
 */
const isWeixinBrowser = ()=> /micromessenger/i.test(u);
/**
 * 是否Android
 */
const isAndroid = ()=> u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
/**
 * 是否ios
 */
const isIos = ()=> !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
/**
 * 是否宽屏手机
 */
const isWide = ()=> window.innerWidth / window.innerHeight >= 0.6;

/**
 * 用于自动播放视频、音频等
 * @param {*} cb
 */
const wxinvoke = (cb)=> {
    // Android还是不会自动播放，需要点击屏幕
    if (isIos() && isWeixinBrowser()) {
        if (window.WeixinJSBridge) {
            window.WeixinJSBridge.invoke('getNetworkType', {}, cb, false);
        } else {
            let _cb = ()=> {
                document.body.removeEventListener('WeixinJSBridgeReady', _cb, false);
                window.WeixinJSBridge.invoke('getNetworkType', {}, cb);
            };
            document.addEventListener("WeixinJSBridgeReady", _cb, false);
        }
    } else {
        cb();
        // let _cb = ()=> {
        //     document.body.removeEventListener('click', _cb, false);
        //     cb();
        // };
        // document.body.addEventListener('click', _cb, false);
    }
};

/**
 * 洗牌算法，将一个数组随机打乱
 * @param {*} arr
 */
function shuffle (arr) {
    if (!Array.isArray(arr) && arr.length) {
        return [];
    }
    const res = [];
    for (let i = arr.length; i > 0; i--) {
        const idx = Math.floor(Math.random() * i);
        res.push(arr[idx]);
        arr.splice(idx, 1);
    }
    return res;
}

/**
 * 获取ios版本
 */
function getIosVerStr(){
    let userAgent = navigator.userAgent;
    let reg = /CPU iPhone OS (.*?) like Mac OS/i;
    let verStr = userAgent.match(reg)[1];
    return verStr.replace(/_/g,'.');
}

/**
 * 比较两个版本号大小
 * @param {*} ver
 */
function isVerLessThan(ver,compareVer){
    let verArr = ver.split('.');
    let compareVerArr = compareVer.split('.');
    let minLength = Math.max(compareVerArr.length,verArr.length);
    for(let i = 0;i<minLength;i++){
        if(verArr[i]<compareVerArr[i]){
            return true;
        }
    }
    return false;
}

Vue.$func = Vue.prototype.$func = {
    isBefore,
    isAfter,
    formatTime,
    getAllUrlQuery,
    base64Decode,
    base64Encode,
    requireAll,
    getCookie,
    setCookie,
    wait,
    getRandom,
    isWeixinBrowser,
    isAndroid,
    isIos,
    isWide,
    wxinvoke,
    shuffle,
    getIosVerStr,
    isVerLessThan
};

export {
    isBefore,
    isAfter,
    formatTime,
    getAllUrlQuery,
    base64Decode,
    base64Encode,
    requireAll,
    getCookie,
    setCookie,
    wait,
    getRandom,
    isWeixinBrowser,
    isAndroid,
    isIos,
    isWide,
    wxinvoke,
    shuffle,
    getIosVerStr,
    isVerLessThan
};
