<template>
  <div class="page-rule">
    <header>
      <template v-if="index === 0">活动规则</template>
      <template v-else-if="index === 1">我的奖品</template>
      <template v-else>领奖信息</template>
      <div class="close" @click="close"></div>
    </header>
    <div class="content" v-if="index === 0">
      <div class="title">活动时间</div>
      <div class="cont">即日起至 2020月6月18日</div>
      <div class="title">活动方式</div>
      <div class="cont">登录飞智APP，进入指定活动页面即可参与抽奖活动，有机会赢取淘宝优惠券，大奖低至1折；</div>
      <div class="title">活动规则</div>
      <div class="cont">
        1.每位用户每天进入活动页，即可获得一次抽奖机会，完成指定任务可获得额外的抽奖机会，单日最多可抽奖2次 ；
        2.折扣券有效期及使用范围以所获得的奖品为准，请尽快在有效期内使用；
        3.折扣券均为原价基础上折扣，与特价商品不可叠加享受优惠；
        4.折扣券不可转让、不可折现，仅可本人使用；
        5.该活动的奖励与 Apple Inc. 无关；
      </div>
      <div class="title">主办方</div>
      <div class="cont">飞智科技</div>
    </div>
    <div class="content" v-if="index === 1">
      <Card
        class="card"
        v-for="(item,index) in giftList"
        :key="index"
        :giftInfo="item"
        @getGift="getGift"
      />
    </div>
    <div class="content" v-if="index === 3">
      <div class="bg">
        <input v-input type="text" class="name" v-model="name" placeholder="请输入姓名" />
        <input v-input type="text" class="phone" v-model="phone" placeholder="请输入电话" />
        <input v-input type="text" class="address" v-model="address" placeholder="请输入收货地址" />
        <div class="desc">
          请填写您的领奖信息
          <br />我们将在活动结束后尽快安排发奖
        </div>
      </div>
    </div>

    <footer v-show="this.giftList.length>0">
      <template v-if="index !==3">
        <div
          :class="['btn',{'active':index === 0} ]"
          @click="index = 0"
          v-show="this.giftList.length>0"
        >活动规则</div>
        <div
          :class="['btn',{'active':index === 1} ]"
          @click="index = 1"
          v-show="this.giftList.length>0"
        >我的奖品</div>
      </template>
      <template v-else>
        <div class="btn" @click="submit">提交信息</div>
      </template>
    </footer>
  </div>
</template>

<script>
import Card from '@c/Card';
export default {
    name: 'rule',
    meta: {
        cn: '规则奖品'
    },
    data () {
        return {
            index:0,
            giftList:[],
            name:'',
            phone:'',
            address:'',
            gift:null
        };
    },
    created () {
        this.init();
    },
    mounted () {
    },
    methods: {
        init(){
            this.giftList = this.$bus.signInfo.userGiftList;
            if(this.$bus.rulePage){
                this.gift = this.$bus.rulePage;
                if(this.$bus.rulePage.addressForm){
                    const {name,phone,address} = JSON.parse(this.$bus.rulePage.addressForm);
                    this.name = name;
                    this.phone = phone;
                    this.address = address;
                }
                this.index = 0;
                this.$bus.rulePage = null;
            }
        },
        close(){
            this.$emit("close");
        },
        getGift(params){
            if(params.giftType === 'entity'){
                // this.index = 3;
                this.gift = params;
                if(params.addressForm){
                    const {name,phone,address} = JSON.parse(params.addressForm);
                    this.name = name;
                    this.phone = phone;
                    this.address = address;
                    this.$bus.$emit("goGetgift",{gift:params,name,phone,address});
                }else{
                    this.$bus.$emit("goGetgift",{gift:params});
                }

            }else{
                this.$dialog.show("gift",{vBind:{type:'taobao',hasGain:true,giftInfo:params}});
            }
        },
        submit(){
            if(this._check()){
                const obj = {name:this.name,phone:this.phone,address:this.address};
                console.log(obj,this.gift);
                this.$api.sendForm({  activityId: this.$bus.signInfo.config.id,
                    addressForm: JSON.stringify(obj),
                    giftId: this.gift.giftId}).then(
                    async res=>{
                        this.$toast({message:"填写成功"});
                        await this.$api.boot({activityId:this.$bus.signInfo.config.id});
                    }
                ).catch(err=>{
                    console.log('err',err);
                });
            }
        },
        _check() {
            let err = "";
            if (!this.phone) {
                err = "请填写手机号";
            } else if (!this.name) {
                err = "请填写姓名";
            } else if (!this.address) {
                err = "请填写地址";
            }
            err && this.$toast({ message: err });
            return !err;
        }
    },
    watch:{
        "$bus.refresh"(val){
            this.giftList = this.$bus.signInfo.userGiftList;
        }
    },
    components:{
        Card
    }
};
</script>

<style lang="less">
.page-rule {
  .page();
  z-index: 9;
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
    color: #4288ff;
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
      padding: 0 0 0.6rem 0.6rem;
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
      color: #4d8bdc;
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
      background-color: #1c5ffa;
      color: #ffffff;
      &.active {
        background-color: #5fa7ff;
        color: #090709;
      }
    }
  }
}
</style>
