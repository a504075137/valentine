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
        <div class="text" v-if="type!=='get-gift'">
          {{textList[type].p1}}
          <br />
          {{textList[type].p2}}
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
        <div class="btn" v-if="!hasGain && !cantGain" @click="recieve">{{btnText[type]}}</div>
      </div>
      <div class="close-btn" @click="$emit('close')"></div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
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
            }
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
                    if(result.code === '1013'){
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
                        const type = result.sendGiftList[0].giftType === 'taobao' ? 'taobao' : 'sign-success';
                        this.$dialog.show("gift",{vBind:{type}});
                    }
                    await this.$api.boot({activityId:1});
                    this.$emit('refresh');
                    this.$loading.hide();
                    this.$emit('close');
                    this.$toast({message:"补签成功"});


                }else{
                    this.$toast({message:'没有补签次数'});
                }
            }else if(this.type === 'get-gift'){
                if(this.hasGain){
                    console.log("领过了");
                }else{
                    console.log(this.giftInfo[0]);
                }
                
            }
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