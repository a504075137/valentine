<template>
  <div class="taobao-content">
    <template v-if="!giftInfo.none">
      <div class="taobao-title" v-if="hasGain">恭喜获得！</div>
      <Ticket :giftInfo="giftInfo" />
      <slot></slot>
      <template v-if="giftInfo.giftType == 'taobao'">
        <div
          v-if="hasGain"
          class="taobaobtn"
          :data-clipboard-text="giftInfo.taobaoKey"
          @click="recieve"
        >
          <template v-if="$bus.isWeixinBrowser">复制淘口令</template>
          <template v-else>领取优惠券</template>
        </div>
      </template>
      <template v-else>
        <div class="taobaobtn" @click="goFrom" v-if="hasGain">去填写信息</div>
      </template>
    </template>
    <template v-else>
      <!-- 奖品没了 -->
      <div class="taobao-title noneGift" v-if="hasGain">以下奖品被领光啦</div>

      <div class="icon" :style="{backgroundImage:`url(${require(`@imgs/icon_get-gift.png`)})`}"></div>
      <div class="giftName">{{giftInfo.giftName}}</div>
      <div class="desc">还有其他精彩礼品等着你！</div>
      <div class="taobaobtn" @click="$emit('close')">继续签到</div>
    </template>

    <!-- <div v-if="$bus.isWeixinBrowser" class="taobao-text">复制淘口令，打开淘宝即可领取优惠券</div> -->
  </div>
</template>

<script>
import Ticket from "@c/Ticket";
export default {
    name:"Taobao",
    props:['giftInfo','hasGain'],
    components:{
        Ticket
    },
    methods:{
        recieve(){
            this.$emit("recieve");
        },
        goFrom(){
            this.$emit("close");
            // this.$router.replace("rule");
            // this.$bus.$emit("goRule");
            // this.$bus.rulePage = this.giftInfo;
            if(this.giftInfo.addressForm){
                const {name,phone,address} = JSON.parse(this.giftInfo.addressForm);
                this.$bus.$emit("goGetgift",{gift:this.giftInfo,name,phone,address});

            }else{
                this.$bus.$emit("goGetgift",{gift:this.giftInfo});

            }
        }
    },
    mounted(){
        console.log(1111,this.giftInfo);
    }
};
</script>

<style lang="less" >
.taobao-content {
  .wh(4.68rem, 6.07rem);
  .bg-contain("dialog_bg.png");
  .flex-column(space-around, center);
  > .text {
    text-align: center;
    font-size: 0.32rem;
    line-height: 0.4rem;
    font-weight: normal;
    font-stretch: normal;
    color: #eaf5ff;
    &.hasGain {
      margin-bottom: 1.5rem;
    }
    > .taobao-text {
      font-size: 0.22rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0.01rem;
      color: #eaf5ff;
      opacity: 0.4;
      //   margin-bottom: 0.6rem;
    }
    > .arrow {
      .p-a();
      top: 1.5rem;
      right: -2rem;
      padding: 1rem;
      .wh(0.47rem, 0.94rem);
      .bg-contain("arrow.png");
      &.left {
        left: -2rem;
        transform-origin: center;
        transform: rotate(180deg);
      }
    }
  }
  > .taobaobtn,
  > .btn {
    .wh(3.45rem, 1.02rem);
    .bg-contain("dialog_btn.png");
    // background-color: #4266ff;
    text-align: center;
    font-size: 0.36rem;
    font-weight: bold;
    font-stretch: normal;
    line-height: 1.02rem;
    letter-spacing: 2px;
    color: #ffffff;
    margin-bottom: 0.6rem;
  }

  > .taobao-title {
    margin-top: 0.4rem;
    font-size: 0.36rem;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 0.02rem;
    color: #1556ff;
    &.noneGift {
      color: #ffffff;
    }
  }
  &:last-child {
    margin-bottom: 0.4rem;
  }
  > .icon {
    .wh(2.13rem, 1.79rem);
    .contain();
  }
  > .giftName {
    font-size: 0.24rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0.01rem;
    color: #eaf5ff;
  }
  > .desc {
    font-size: 0.24rem;
    font-weight: normal;
    font-stretch: normal;
    color: #eaf5ff;
    opacity: 0.5;
  }
}
</style>