<template>
  <div class="page-rule">
    <header>
      <template>领奖信息</template>
      <div class="close" @click="close"></div>
    </header>
    <div class="content">
      <div class="bg">
        <input v-input type="text" class="name" v-model="giftParams.name" placeholder="请输入姓名" />
        <input v-input type="text" class="phone" v-model="giftParams.phone" placeholder="请输入电话" />
        <input
          v-input
          type="text"
          class="address"
          v-model="giftParams.address"
          placeholder="请输入收货地址"
        />
        <div class="desc">
          请填写您的领奖信息
          <br />我们将在活动结束后尽快安排发奖
        </div>
      </div>
    </div>

    <footer>
      <div class="btn" @click="submit">{{btnText}}</div>
    </footer>
  </div>
</template>

<script>
export default {
    name: "rule",
    meta: {
        cn: "规则奖品"
    },
    props: ["name", "phone", "address", "gift"],
    data() {
        return {
            giftParams: {
                name: "",
                phone: "",
                address: ""
            },
            btnText: "更新信息"
        };
    },
    created() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            console.log(this.gift);
            Object.assign(this.giftParams, {
                name: this.name,
                phone: this.phone,
                address: this.address
            });
            if (!this.name && !this.phone && !this.address) this.btnText = "提交信息";
        },
        close() {
            this.$emit("close");
        },
        submit() {
            if(this.$bus.gameover){
                this.$dialog.show("gift", { vBind: { type: "gameover" } });
                return;
            }
            if (this._check()) {
                const obj = {
                    name: this.giftParams.name,
                    phone: this.giftParams.phone,
                    address: this.giftParams.address
                };
                console.log(JSON.stringify(this.gift));
                if (!this.gift.giftId) this.gift.giftId = this.gift.id;
                this.$api
                    .sendForm({
                        activityId: this.$bus.signInfo.config.id,
                        addressForm: JSON.stringify(obj),
                        giftId: this.gift.giftId
                    })
                    .then(async res => {
                        if (res.code === "1010") {
                            this.$toast({ message: "活动结束" });
                        } else {
                            this.$toast({ message: "填写成功" });

                            await this.$api.boot({
                                activityId: this.$bus.signInfo.config.id
                            });
                            this.$emit("close");
                        }
                    })
                    .catch(err => {
                        console.log("err", err);
                    });
            }
        },
        _check() {
            let err = "";
            if (!this.giftParams.phone) {
                err = "请填写手机号";
            } else if (!this.giftParams.name) {
                err = "请填写姓名";
            } else if (!this.giftParams.address) {
                err = "请填写地址";
            }
            err && this.$toast({ message: err });
            return !err;
        }
    }
};
</script>

<style lang="less">
.page-rule {
  .page();
  z-index: 999;
  .wh(100vw, 100vh);
  .flex-column(space-between, center);
  > header {
    .p-r();
    .wh(100vw, 1.2rem);
    text-align: center;
    background-color: #132249;
    font-size: 0.42rem;
    font-weight: bold;
    font-stretch: normal;
    line-height: 1.2rem;
    letter-spacing: 0.08rem;
    color: #ffffff;
    > .back {
      .p-a();
      top: 0.1rem;
      left: 0.1rem;
      padding: 0.3rem;
      .wh(0.23rem, 0.4rem);
      .bg-contain("back.png");
    }
    > .close {
      .p-a();
      top: 0.43rem;
      right: 0.53rem;
      .wh(0.32rem);
      .bg-contain("close.png");
    }
  }
  > .content {
    width: 100%;
    flex: 1;
    background-color: #000000;
    .flex-column(flex-start, flex-start);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    > .bg {
      // .center-row();
      // top: 1.5rem;
      margin: 1rem auto 0;
      .wh(6.53rem, 6.83rem);
      // background-color: rgba(19, 36, 83, 0.78);
      .bg-cover("gift_bg.png");
      .flex-column(flex-start);
      > input {
        .wh(5.59rem, 0.85rem);
        background-color: #ffffff;
        border: none;
        outline: none;
        box-sizing: border-box;
        margin-top: 0.5rem;
        padding: 0rem 0.31rem 0 0.28rem;
        font-size: 0.25rem;
        &::placeholder {
          color: #999999;
        }
      }
      > .desc {
        margin-top: 0.8rem;
        font-size: 0.24rem;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 1px;
        color: #52638f;
        text-align: center;
      }
    }
    > .title {
      margin-left: 0.59rem;
      margin-top: 0.6rem;
      font-size: 0.36rem;
      font-weight: bold;
      font-stretch: normal;
      letter-spacing: 7px;
      color: #ffffff;
    }
    > .cont {
      max-width: 6.29rem;
      margin-top: 0.4rem;
      margin-left: 0.59rem;
      font-size: 0.24rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 0.44rem;
      letter-spacing: 1px;
      color: #9e9e9e;
      &:last-of-type {
        margin-bottom: 1rem;
      }
    }
    > .card {
      &:last-of-type {
        margin-bottom: 1rem;
      }
    }
  }
  > footer {
    .wh(100vw, 1.1rem);
    .flex();
    > .btn {
      .wh(100%);
      text-align: center;
      line-height: 1.1rem;
      font-size: 0.32rem;
      font-weight: bold;
      font-stretch: normal;
      letter-spacing: 0.02rem;
      background-color: #1f305e;
      color: #ffffff;
      &.active {
        color: #2b6bff;
      }
    }
  }
}
</style>
