<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="$listeners"
    toastTransition="fade"
    :maskClose="false"
    class="dialog-gift"
  >
    <div class="gift-content">
      <template v-if="type === 'taobao'">
        <Taobao :giftInfo="giftInfo" @close="$emit('close')" :hasGain="hasGain" @recieve="recieve" />
      </template>

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
        <div class="swiper-container taobaobanner">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in giftInfo" :key="index">
              <Taobao
                :giftInfo="item ? item:giftInfo[0]"
                :hasGain="hasGain"
                @recieve="recieve"
                @close="$emit('close')"
              >
                <div class="text">
                  <div class="taobao-text" v-if="item.days && !hasGain">累计签到 {{item.days}} 天可获得</div>
                  {{item ? item.giftName:giftInfo[0].giftName}}
                </div>
              </Taobao>
            </div>
          </div>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <!-- <div class="arrow" v-if="giftInfo.length > 1 && giftIndex < giftInfo.length-1"></div>
        <div
          class="arrow left"
          @click="switchGift('prev')"
          v-if="giftInfo.length > 1 && giftIndex>0"
        ></div>-->
      </div>

      <div class="close-btn" @click="$emit('close')"></div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
import ClipboardJS from "clipboard";
import Ticket from "@c/Ticket";
import Taobao from "@c/Taobao";
import Swiper from 'swiper';
import "swiper/css/swiper.min.css";
let clipFlag = false;
let mySwiper;
export default {
    name: 'gift',
    meta: {
        cn: '签到获奖弹窗'
    },
    components: {
        BaseDialog,
        // Ticket,
        Taobao
    },
    props:['type','giftInfo','hasGain','cantGain','date'],
    data(){
        return {
            textList:{
                'sign-success':{
                    p1:'签到成功！',
                    p2:'马上登录保存成绩吧~'
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
                'sign-success':'立即登录',
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
                if(!this.$bus.isWeixinBrowser){
                    // console.log(11,this.date);
                    this.$dialog.show("Share");
                    this.$storage.save("share",this.date);
                }else{
                    this.$dialog.show("Share");
                    this.$bus.$off("wx-share",this.reMark);
                    this.$bus.$on("wx-share",this.reMark);
                }

            }else if(this.type === 'get-gift'){
                this.recieveGetGift();

            }else if(this.type === 'taobao' || this.type === 'display'){
                if(this.$bus.isWeixinBrowser){
                    console.log("复制");
                }else{
                    // console.log(1111,this.giftInfo);
                    const link = this.giftInfo.taobaoAppUrl || this.giftInfo[this.giftIndex].taobaoAppUrl;
                    window.location.replace(link);
                }

            }else if(this.type === 'sign-success'){
                this.$emit('close');
                // this.$router.replace("login");
                this.$bus.$emit("goLogin");
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
        switchGift(direction){
            if(direction === 'next'){
                this.giftIndex = this.giftIndex === this.giftInfo.length-1? this.giftInfo.length-1 : this.giftIndex+1;
            }else{
                this.giftIndex = this.giftIndex === 0? 0 : this.giftIndex-1;
            }

        },
        beforeShow(){
            this.giftIndex = 0;
            this.initBanner();

            if((this.type !== 'taobao' && this.type!=='display') || !this.$bus.isWeixinBrowser) return;

            const clipboard = new ClipboardJS(".taobaobtn");
            const _this = this;
            clipboard.on("success", this.copy);
            clipFlag = true;
        },
        copy(e){
            if( (this.type !== 'taobao' && this.type!=='display') || !this.$bus.isWeixinBrowser) return;
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
                    this.$dialog.show("gift",{vBind:{type:'display',hasGain:true,cantGain:false,giftInfo:result.sendGiftList}});
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
        initBanner(){
            this.$nextTick(()=>{
                // if(mySwiper) {
                //     mySwiper.updateSlides();
                //     return;
                // }
                mySwiper = new Swiper ('.swiper-container.taobaobanner', {
                    loop: false, // 循环模式选项
                    init: true,
                    allowTouchMove: false,
                    initialSlide: 0,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        // prevEl: '.swiper-button-prev',
                        prevEl: '.swiper-button-prev',
                    },

                });
            });

        },
        beforeClose(){
            if(mySwiper && this.giftInfo && this.giftInfo.length>0){
                setTimeout(()=>{
                    mySwiper.slideTo(0, 1, false);
                },1000);
            }


        }
    },
    mounted(){

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
        .taobao-text {
          margin-bottom: 0;
        }
        .text {
          font-size: 0.28rem;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 1px;
          color: #eaf5ff;
          margin-bottom: 0.5rem;
        }
        // > .arrow {
        //   .p-a();
        //   top: 1.5rem;
        //   right: -2rem;
        //   padding: 1rem;
        //   .wh(0.47rem, 0.94rem);
        //   .bg-contain("arrow.png");
        //   &.left {
        //     left: -2rem;
        //   }
        // }
        .taobao-content {
          background: none;
        }
        > .swiper-container {
          .wh(4.68rem, 6.07rem);
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
      > .swiper-button-next {
        .p-a();
        top: 1.5rem;
        right: -2rem;
        padding: 1rem;
        .wh(0.47rem, 0.94rem);
        .bg-contain("arrow.png");
        &:focus {
          outline: none;
        }
        &::after {
          content: "";
        }
        &:not(.swiper-button-disabled) {
          animation: shakeRight 0.6s linear infinite alternate;
        }
      }
      > .swiper-button-prev {
        .p-a();
        top: 1.5rem;
        left: -2rem;
        padding: 1rem;
        .wh(0.47rem, 0.94rem);
        .bg-contain("arrow.png");
        transform-origin: center;
        transform: rotate(180deg);
        &:focus {
          outline: none;
        }
        &::after {
          content: "";
        }
        &:not(.swiper-button-disabled) {
          animation: shakeLeft 0.6s linear infinite alternate;
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
@keyframes shakeRight {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0.1rem, 0, 0);
  }
}
@keyframes shakeLeft {
  from {
    transform: translate3d(0, 0, 0) rotate(180deg);
  }
  to {
    transform: translate3d(-0.1rem, 0, 0) rotate(180deg);
  }
}
</style>
