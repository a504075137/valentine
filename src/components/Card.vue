<template>
  <div class="wrapper">
    <div class="header">
      <!-- giftName -->
      <div
        class="pic rectangle"
        v-if="giftInfo.giftName === '5元优惠券'"
        :style="{backgroundImage:`url(${require(`@imgs/5.png`)})`}"
      ></div>
      <div
        class="pic rectangle"
        v-else-if="giftInfo.giftName.includes('15')"
        :style="{backgroundImage:`url(${require(`@imgs/15.png`)})`}"
      ></div>
      <div
        class="pic rectangle"
        v-else-if="giftInfo.giftName.includes('20')"
        :style="{backgroundImage:`url(${require(`@imgs/20.png`)})`}"
      ></div>
      <div
        class="pic rectangle"
        v-else-if="giftInfo.giftName.includes('30')"
        :style="{backgroundImage:`url(${require(`@imgs/30.png`)})`}"
      ></div>
      <div
        class="pic"
        v-else
        :style="{backgroundImage:`url(${giftInfo.giftImg})`}"
      ></div>
      <div class="content">
        <div class="name">{{giftInfo.giftName}}</div>
        <div class="desc">{{giftInfo.giftDescription}}</div>
      </div>
    </div>
    <div class="footer">
      <div class="time">{{giftInfo.createAt}}</div>
      <div
        class="btn"
        @click="getGift"
      >领取奖品</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["giftInfo"],
  data() {
    return {};
  },
  methods: {
    getGift() {
      // this.$dialog.show("getGift");
      this.$emit("getGift", this.giftInfo);
    }
  },
  created() {}
};
</script>

<style lang="less">
.wrapper {
  .wh(6.65rem, 2.93rem);
  .bg-cover("card.png");
  margin: 0.35rem auto 0;
  &:first-child {
    margin-top: 0.54rem;
  }

  > .header {
    .wh(100%, 1.65rem);
    background-color: rgba(42, 142, 255, 0.3);
    .flex(space-around, center);
    > .pic {
      .wh(1.24rem);
      .contain();
      // background-color: #ffffff;
      opacity: 0.73;
      border-radius: 50%;
      &.rectangle {
        border-radius: 0;
      }
      //   margin-left: 0.4rem;
    }
    > .content {
      .wh(4.01rem, 1.08rem);
      .flex-column(space-start, flex-start);
      > .name {
        font-size: 0.3rem;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0.02rem;
        color: #ffffff;
      }
      > .desc {
        margin-top: 0.2rem;
        font-size: 0.24rem;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 1px;
        color: #9e9e9e;
      }
    }
  }
  > .footer {
    .wh(100%, 1.19rem);
    .flex(space-around, center);
    > .time {
      font-size: 0.22rem;
      font-weight: bold;
      font-stretch: normal;
      letter-spacing: 2px;
      color: #ffffff;
    }
    > .btn {
      .wh(2.34rem, 0.68rem);
      text-align: center;
      background-color: #ffffff;
      box-shadow: 0px 7px 21px 0px rgba(0, 25, 78, 0.39);
      font-size: 0.26rem;
      font-weight: 700;
      font-stretch: normal;
      line-height: 0.68rem;
      letter-spacing: 0.01rem;
      color: #010101;
    }
  }
}
</style>
