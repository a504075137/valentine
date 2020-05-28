<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="$listeners"
    toastTransition="fade"
    :maskClose="true"
    class="dialog-gift"
  >
    <div class="gift-content">
      <div class="content" v-if="type === 'taobao'">
        <div class="taobao-title">恭喜获得！</div>
        <Ticket :giftInfo="giftInfo" />
        <div
          class="taobaobtn"
          :style="{marginBottom:$bus.isWeixinBrowser?0:'0.4rem'}"
          :data-clipboard-text="giftInfo.taobaoKey"
          @click="recieve"
        >
          <template v-if="$bus.isWeixinBrowser">复制淘口令</template>
          <template v-else>领取优惠券</template>
        </div>
        <div v-if="$bus.isWeixinBrowser" class="taobao-text">复制淘口令，打开淘宝即可领取优惠券</div>
      </div>

      <div class="content" v-else-if="type === 'get-gift'">
        <div class="icon" :style="{backgroundImage:`url(${require(`@imgs/icon_${type}.png`)})`}"></div>
        <div :class="['text' , {'hasGain':!hasGain || cantGain}]" v-if="giftInfo.length >= 1">
          <template
            v-if="cantGain"
          >奖品是{{giftInfo[giftIndex] ? giftInfo[giftIndex].giftName:giftInfo[0].giftName}}</template>
          <template v-else>
            恭喜获得{{giftInfo[giftIndex] ? giftInfo[giftIndex].giftName:giftInfo[0].giftName}}
            <template
              v-if="!hasGain"
            >
              <br />马上收下这份大礼吧！
            </template>
          </template>
          <div class="arrow" @click="switchGift" v-if="giftInfo.length > 1"></div>
        </div>
        <div class="btn" v-if="hasGain && !cantGain" @click="recieve">{{btnText[type]}}</div>
      </div>
      <div class="content" v-else-if="type === 'sign-success'">
        <template v-if="!$bus.isLogin">
          <div class="icon" :style="{backgroundImage:`url(${require(`@imgs/icon_${type}.png`)})`}"></div>
          <div class="text">
            {{textList[type].p1}}
            <br />
            {{textList[type].p2}}
          </div>
          <div class="btn" v-if="!$bus.isLogin" @click="recieve">{{btnText[type]}}</div>
        </template>
        <template v-else>
          <div class="icon" :style="{backgroundImage:`url(${require(`@imgs/icon_mark.png`)})`}"></div>
          <div class="text">恭喜~您签到成功啦！</div>
          <div class="btn" @click="$emit('close')">知道了</div>
        </template>
      </div>
      <div class="content" v-else-if="type === 'remark'">
        <div class="icon" :style="{backgroundImage:`url(${require(`@imgs/icon_${type}.png`)})`}"></div>
        <div class="text">
          {{textList[type].p1}}
          <br />
          {{textList[type].p2}}
        </div>
        <div class="btn" @click="recieve">{{btnText[type]}}</div>
      </div>
      <div class="content display" v-else-if="type === 'display'">
        <Ticket :giftInfo="giftInfo[giftIndex]?giftInfo[giftIndex]:giftInfo[0]" />
        <div
          class="taobao-text"
          v-if="giftInfo[0].days"
        >累计签到 {{giftInfo[giftIndex] ? giftInfo[giftIndex].days:giftInfo[0].days}} 天可获得</div>
        <div class="text">
          <div class="arrow" @click="switchGift" v-if="giftInfo.length > 1"></div>
          {{giftInfo[giftIndex] ? giftInfo[giftIndex].giftName:giftInfo[0].giftName}}
        </div>
      </div>

      <div class="close-btn" @click="$emit('close')"></div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
import ClipboardJS from "clipboard";
import Ticket from "@c/Ticket";
let clipFlag = false;
export default {
    name: 'gift',
    meta: {
        cn: '签到获奖弹窗'
    },
    components: {
        BaseDialog,
        Ticket
    },
    props:['type','giftInfo','hasGain','cantGain','date'],
    data(){
        return {
            textList:{
                'sign-success':{
                    p1:'签到成功！',
                    p2:'马上登陆保存成绩吧~'
                },
                remark:{
                    p1:'哦哟~您忘记签到啦！',
                    p2:''
                },
                'get-gift':{
                    p1:'',
                    p2:''
                },
                'taobao':{
                    p1:'复制下面淘口令',
                    p2:'xxxxx'
                }
            },
            btnText:{
                'sign-success':'立即登陆',
                remark:'我要补签',
                'get-gift':'马上领奖',
                taobao:'复制淘口令'
            },
            giftIndex:0
        };
    },
    methods:{
        async recieve(){
            if(this.type === 'remark'){
                this.$dialog.show("Share");
                this.$bus.$off("wx-share",this.reMark);
                this.$bus.$on("wx-share",this.reMark);
            }else if(this.type === 'get-gift'){
                this.recieveGetGift();
                
            }else if(this.type === 'taobao'){
                if(this.$bus.isWeixinBrowser){
                    console.log("复制");
                }else{
                    window.location.replace(this.giftInfo.taobaoAppUrl);
                }
               
            }else if(this.type === 'sign-success'){
                this.$emit('close');
                this.$router.replace("login");
            }
        },
        recieveGetGift(){
            // if(this.hasGain){
            //     console.log("领过了");
            // }else{
            //     console.log(this.giftInfo[0]);
            //     this.$emit('close');
            //     this.$router.replace('rule');
            // }
            this.$emit('close');
            this.$router.replace('rule');
        },
        switchGift(){
            this.giftIndex = this.giftIndex === this.giftInfo.length-1? 0 : this.giftIndex+1;
        },
        beforeShow(){
            console.log(this.giftInfo);
            this.giftIndex = 0;
            if(this.type !== 'taobao' || !this.$bus.isWeixinBrowser) return;
            const clipboard = new ClipboardJS(".taobaobtn");
            const _this = this;
            clipboard.on("success", this.copy);
            clipFlag = true;
        },
        copy(e){
            if( this.type !== 'taobao' || !this.$bus.isWeixinBrowser) return;
            this.$toast({ message: "淘口令复制成功" });
            e.clearSelection();
        },
        async reMark(){
            if(!this.$bus.isLogin){
                this.$emit('close');
                setTimeout(()=>{
                    this.$dialog.show("gift",{vBind:{type:'sign-success'}});
                },600);  
               
                return;
            }
            this.$loading.show();
            const result = await this.$api.remark({activityId:this.$bus.signInfo.config.id,date: this.date});
            if(result.code === '1013'){
                this.$toast({message:"超出补签次数"});
                this.$loading.hide();
                this.$emit('close');
                return;
            }
            if(result.code === '1011'){
                this.$toast('签到过了');
                this.$loading.hide();
                this.$emit('close');
                return;
            }
            if(result.code === '1012'){
                this.$toast('补签日期不在活动期间');
                this.$loading.hide();
                return;
            }
            if(result.sendGiftList.length>0){
                // const type = result.sendGiftList[0].giftType === 'taobao' ? 'taobao' : 'get-gift';
                await this.$api.boot({activityId:this.$bus.activityId});
                setTimeout(()=>{
                    this.$dialog.show("gift",{vBind:{type:'get-gift',hasGain:true,cantGain:false,giftInfo:result.sendGiftList}});
                },1000);
                this.$loading.hide();
                this.$emit('close');
                return;
            }
            await this.$api.boot({activityId:this.$bus.activityId});
            this.$loading.hide();
            this.$emit('close');
            this.$bus.$off("wx-share",this.reMark);
            // this.$toast({message:"补签成功"});
            setTimeout(()=>{
                this.$dialog.show("gift",{vBind:{type:'sign-success'}});
            },1000);
        },
    }
};
</script>

<style lang="less">
.dialog-gift {
  .gift-content {
    > .content {
      .wh(4.68rem, 6.07rem);
      .bg-contain("dialog_bg.png");
      .flex-column(space-around, center);
      &.display {
        > .taobao-text {
          margin-bottom: 0;
        }
        > .text {
          font-size: 0.28rem;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 1px;
          color: #eaf5ff;
          margin-bottom: 0.5rem;
        }
      }
      > .icon {
        .wh(2.13rem, 1.79rem);
        .contain();
      }
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
        > .arrow {
          .p-a();
          top: 1.5rem;
          right: -2rem;
          padding: 1rem;
          .wh(0.47rem, 0.94rem);
          .bg-contain("arrow.png");
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
      > .taobaobtn {
        margin-bottom: 0;
      }
      > .taobao-title {
        margin-top: 0.4rem;
        font-size: 0.36rem;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0.02rem;
        color: #1556ff;
      }
      > .taobao-text {
        font-size: 0.22rem;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0.01rem;
        color: #eaf5ff;
        opacity: 0.4;
        margin-bottom: 0.6rem;
      }
    }
    > .close-btn {
      .center-row();
      .wh(0.6rem, 1.2rem);
      .bg-contain("close_btn.png");
    }
  }
}
</style>