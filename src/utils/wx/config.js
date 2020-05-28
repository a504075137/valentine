const signUrl = 'http://comapi.codebear.cn/wx/sdk-config';

const jsApiList = [
    // 分享朋友
    'onMenuShareAppMessage',
    // 分享朋友圈
    'onMenuShareTimeline',
    // 录音相关
    // 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice',
    // 'hideMenuItems',
];

let link = require('@imgs/share_icon.png');
if (link.indexOf('//') === 0) {
    link = location.protocol + link;
}
link = "http://static.via.cool/web/feizhi-mark/static/img/share_icon.32821344.png";
const defaultShareInfo = {
    title: '飞智618新品上新',
    desc: '签到打卡赢全新蜂套2，还有更多好礼等你来拿',
    link: window.location.href.split('#')[0].split('?')[0],
    imgUrl: link,
    type: 'link',
    dataUrl: ''
};

export {
    signUrl,
    jsApiList,
    defaultShareInfo
};