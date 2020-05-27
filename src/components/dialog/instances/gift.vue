<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="$listeners"
    toastTransition="fade"
    :maskClose="true"
    class="dialog-gift"
  >
    <div class="gift-content">
      <div class="content">
        <!-- <div class="sign-succes" v-if="type === 'sign-success'"></div> -->
        <div class="icon" :style="{backgroundImage:`url(${require(`@imgs/icon_${type}.png`)})`}"></div>
        <div
          :class="['text',{'success':$bus.isLogin && type =='sign-success'}]"
          v-if="type!=='get-gift'"
        >
          {{textList[type].p1}}
          <br />
          <template v-if="(!$bus.isLogin || type !=='sign-success')">{{textList[type].p2}}</template>
        </div>
        <div :class="['text' , {'hasGain':hasGain || cantGain}]" v-else-if="giftInfo.length === 1">
          <template v-if="cantGain">奖品是{{giftInfo[0].giftName}}</template>
          <template v-else>
            恭喜获得{{giftInfo[0].giftName}}
            <template v-if="!hasGain">
              <br />马上收下这份大礼吧！
            </template>
          </template>
        </div>
        <div :class="['text' , {'hasGain':hasGain || cantGain}]" v-else-if="giftInfo.length > 1">
          <template v-if="cantGain">奖品是{{giftInfo[giftIndex].giftName}}</template>
          <template v-else>
            恭喜获得{{giftInfo[giftIndex].giftName}}
            <template v-if="!hasGain">
              <br />马上收下这份大礼吧！
            </template>
          </template>
          <div class="arrow" @click="switchGift"></div>
        </div>
        <div
          class="btn"
          v-if="(!hasGain && !cantGain) && (!$bus.isLogin || type !=='sign-success')"
          data-clipboard-text="测试赋值淘口令"
          @click="recieve"
        >{{btnText[type]}}</div>
      </div>
      <div class="close-btn" @click="$emit('close')"></div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
import ClipboardJS from "clipboard";
let clipFlag = false;
export default {
    name: 'gift',
    meta: {
        cn: '签到获奖弹窗'
    },
    components: {
        BaseDialog
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
                // console.log("补签",this.$bus.signInfo.config.reMarkTimes);
                if(this.$bus.signInfo.config.reMarkTimes > 0){
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
                        const type = result.sendGiftList[0].giftType === 'taobao' ? 'taobao' : 'get-gift';
                        await this.$api.boot({activityId:this.$bus.activityId});
                        setTimeout(()=>{
                            this.$dialog.show("gift",{vBind:{type,hasGain:false,giftInfo:result.sendGiftList}});
                        },1000);
                        this.$loading.hide();
                        this.$emit('close');
                        return;
                    }
                    await this.$api.boot({activityId:this.$bus.activityId});
                    this.$loading.hide();
                    this.$emit('close');
                    // this.$toast({message:"补签成功"});
                    setTimeout(()=>{
                        this.$dialog.show("gift",{vBind:{type:'sign-success'}});
                    },1000);
                  

                }else{
                    this.$toast({message:'没有补签次数'});
                }
            }else if(this.type === 'get-gift'){
                if(this.hasGain){
                    console.log("领过了");
                }else{
                    console.log(this.giftInfo[0]);
                    this.$emit('close');
                    this.$router.replace('rule');
                }
                
            }else if(this.type === 'taobao'){
                // this.$emit('close');
                // setTimeout(()=>{
                //     this.$dialog.show("gift",{vBind:{type:'taobao'}});
                // },1000);
            }else if(this.type === 'sign-success'){
                this.$emit('close');
                this.$router.replace("login");
            }
        },
        switchGift(){
            this.giftIndex = this.giftIndex === this.giftInfo.length-1? 0 : this.giftIndex+1;
        },
        beforeShow(){
            if(this.type !== 'taobao') return;
            const clipboard = new ClipboardJS(".btn");
            const _this = this;
            clipboard.on("success", function(e) {
                _this.$toast({ message: "复制成功" });
                e.clearSelection();
            });
            clipFlag = true;
        }
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
        &.success {
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
      > .btn {
        .wh(3.45rem, 0.84rem);
        background-color: #4266ff;
        text-align: center;
        font-size: 0.36rem;
        font-weight: bold;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0.84rem;
        letter-spacing: 2px;
        color: #ffffff;
        margin-bottom: 0.6rem;
      }
    }
    > .close-btn {
      .center-row();
      .wh(0.6rem, 1.11rem);
      .bg-contain("close_btn.png");
    }
  }
}
</style>