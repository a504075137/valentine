<template>
  <div class="page-loading">
    <div class="progress-box">
      <div class="progress-text">{{numProgress}}</div>
      <div class="progress-bg">
        <div
          class="progress"
          :style="{width: `${loadProgress}%`}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { requireAll } from "@utils/func";

export default {
  name: "loading",
  meta: {
    cn: "加载页"
  },
  data() {
    return {
      loadProgress: 0
    };
  },
  computed: {
    numProgress() {
      return `${Math.floor(this.loadProgress)}%`;
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      console.log("页面初始化时间：" + new Date());
      if (window.$query.activityId) {
        this.$bus.activityId = window.$query.activityId;
      }
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
      const imgList = requireAll(require.context("@imgs", true));
      const audioList = requireAll(require.context("@audios", true));
      this.total.img = imgList.length;
      this.total.audio = audioList.length;

      this.total.all = this.total.img + this.total.audio;

      Promise.all([this.loadImg(imgList), ...this.getApi()])
        .then(resList => {
          console.log(resList);
          this.loadFinish();
        })
        .catch(err => {
          console.error(err);
        });
    },
    getApi() {
      const list = [
        this.$wxsdk.getWxConfig(),
        this.preLogin().then(this.boot),
        this.$api.getActivity({ activityId: this.$bus.activityId })
      ];
      return list;
    },
    async preLogin() {
      const token = window.$query.token;
      const uid = window.$query.uid;
      const source = window.$query.source;
      let jwt = this.$storage.load("jwt");
      console.log(source, token, uid);
      if (
        source != "" &&
        token == "" &&
        uid == "" &&
        !this.$storage.load("login-handle")
      ) {
        // 说明从APP进入，且没有带身份，且不是APP通过H5手动登录的情况，需要手动退出登录
        this.$storage.delete("jwt");
      } else if (source != "" && token && uid && !jwt) {
        // 从APP进入 且外面带了身份 里面还没有手动登录
        const result = await this.$api.preLogin({ uid });
        console.log("接口返回结果：" + result);
        try {
          this.$storage.save("jwt", result);
          this.$storage.delete("login-handle");
        } catch (e) {
          console.log(e);
        }
      }
    },
    boot() {
      return new Promise(async resolve => {
        let jwt = this.$storage.load("jwt");
        if (jwt) {
          await this.$api.injectJwt(jwt);
          await this.$api.boot({ activityId: this.$bus.activityId });
        }
        resolve();
      });
    },
    loaded(type) {
      this.loadNum[type]++;
      this.loadNum.all++;
      this.loadProgress = (this.loadNum.all * 100) / this.total.all;
      if (this.loadNum[type] >= this.total[type]) {
        return true;
      }
      return false;
    },
    loadImg(list = []) {
      return new Promise((resolve, reject) => {
        for (let item of list) {
          let img = new Image();
          img.onload = img.onerror = () => {
            this.loaded("img") && resolve("图片加载完成");
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
      return new Promise((resolve, reject) => {
        for (let item of list) {
          if (asyncLoad) {
            this.loaded("audio") && resolve("音频加载完成");
          }
          this.$audio.load(item.path, item.data).then(() => {
            this.playAudio(item.path, config);
            if (!asyncLoad) {
              this.loaded("audio") && resolve("音频加载完成");
            }
          });
        }
      });
    },
    loadFinish() {
      this.$bus.ready = true;
      this.$bus.showMusicIcon = true;
      let jwt = this.$storage.load("jwt");
      if (!jwt) {
        this.$bus.isLogin = false;
        // this.$router.replace('login');
      } else {
        this.$bus.isLogin = true;
        this.$api.injectJwt(jwt);
      }
      this.$router.replace("home");
    },
    playAudio(path, config) {
      path = path.replace(/(\.\/)/, "").replace(/(\/)|(\.)/g, "_");
      // path = path.replace(/(\.\/)/, '').split('.')[0];
      if (config[path]) {
        // this.$audio.play(path, config[path]);
      }
    }
  }
};
</script>

<style lang="less">
.page-loading {
  .page();
  .bg-cover("loading_bg.png");
  > .progress-box {
    width: 60%;
    .center();
    .flex-column();
    > .progress-text {
      font-size: 0.86rem;
      font-weight: bold;
      font-style: italic;
      font-stretch: normal;
      line-height: 0.68rem;
      letter-spacing: 0px;
      color: #427cff;
      margin-bottom: 0.6rem;
    }
    > .progress-bg {
      .wh(6.04rem, 0.38rem);
      .bg-contain("progress_bg.png");
      //   background-color: white;
      > .progress {
        width: 0%;
        height: 0.38rem;
        .bg-contain("progress.png");
        transition: width 0.3s;
      }
    }
  }
}
</style>
