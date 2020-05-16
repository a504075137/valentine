<template>
    <div class="page-loading">
        <div class='progress-box'>
            <div class="progress-text">{{numProgress}}</div>
            <div class="progress-bg">
                <div class="progress" :style='{width: `${loadProgress}%`}'></div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    requireAll
} from '@utils/func';

export default {
    name: 'loading',
    meta: {
        cn: '加载页'
    },
    data () {
        return {
            loadProgress: 0
        };
    },
    computed: {
        numProgress() {
            return `${Math.floor(this.loadProgress)}%`;
        }
    },
    created () {
        this.init();
    },
    methods: {
        async init() {
            this.total = {
                img: 0,
                audio: 0,
                api: 0,
                all: 0
            };
            this.loadNum = {
                img: 0,
                audio: 0,
                api: 0,
                all: 0
            };
            this.preload();
        },
        async preload() {
            const imgList = requireAll(require.context('@imgs', true));
            const audioList = requireAll(require.context('@audios', true));
            this.total.img = imgList.length;
            this.total.audio = audioList.length;

            this.total.all = this.total.img + this.total.audio;

            Promise.all([
                this.loadImg(imgList),
                this.loadAudio(audioList, true, {
                    bgm_mp3: {
                        loop: true,
                        autoplay: true
                    }
                }),
                ...this.getApi()
            ]).then(resList=> {
                console.log(resList);
                this.loadFinish();
            }).catch(err=> {
                console.error(err);
            });
        },
        getApi() {
            const list = [
                this.$wxsdk.getWxConfig()
            ];
            return list;
        },
        loaded(type) {
            this.loadNum[type]++;
            this.loadNum.all++;
            this.loadProgress = this.loadNum.all * 100 / this.total.all;
            if (this.loadNum[type] >= this.total[type]) {
                return true;
            }
            return false;
        },
        loadImg(list = []) {
            return new Promise((resolve, reject)=> {
                for (let item of list) {
                    let img = new Image();
                    img.onload = img.onerror = ()=> {
                        this.loaded('img') && resolve('图片加载完成');
                    };
                    img.src = item.data;
                }
            });
        },
        /**
         * 第二个参数表示是否异步加载，一般为true，
         * 除非音乐很重要，需要加载完才能进入H5.
         */
        loadAudio(list = [], asyncLoad = false, config = {}) {
            return new Promise((resolve, reject)=> {
                for (let item of list) {
                    if (asyncLoad) {
                        this.loaded('audio') && resolve('音频加载完成');
                    }
                    this.$audio.load(item.path, item.data)
                        .then(()=> {
                            this.playAudio(item.path, config);
                            if (!asyncLoad) {
                                this.loaded('audio') && resolve('音频加载完成');
                            }
                        });
                }
            });
        },
        loadFinish() {
            this.$bus.ready = true;
            this.$bus.showMusicIcon = true;
            this.$router.replace('home');
        },
        playAudio(path, config) {
            path = path.replace(/(\.\/)/, '').replace(/(\/)|(\.)/g, '_');
            // path = path.replace(/(\.\/)/, '').split('.')[0];
            if (config[path]) {
                this.$audio.play(path, config[path]);
            }
        }
    },
};
</script>

<style lang="less">
.page-loading {
    .page(cornflowerblue);
    > .progress-box {
        width: 60%;
        .center();
        .flex-column();
        > .progress-text {
            font-size: .3rem;
            margin-bottom: 10px;
        }
        > .progress-bg {
            .wh(100%, 10px);
            background-color: white;
            border-radius: 10px;
            > .progress {
                width: 0%;
                height: 10px;
                background-color: aquamarine;
                transition: width .3s;
                border-radius: 10px;
            }
        }
    }
}
</style>
