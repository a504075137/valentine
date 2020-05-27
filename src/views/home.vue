<template>
  <div class="home">
    <Banner />
    <div class="sign">
      <div class="text">
        累计签到
        <span>{{signDay}}</span>
        天
      </div>
      <span>|</span>
      <div class="text">
        连续签到
        <span>{{continueDay}}</span>
        天
      </div>
    </div>
    <Calendar class="calendar" :giftDays="giftDays" />
    <div class="btn" @click="mark"></div>
    <div class="gift" @click="$router.replace('rule')"></div>
  </div>
</template>

<script>
import Calendar from '@c/Calendar';
import Banner from '@c/Banner';
export default {
    name: "home",
    meta: {
        cn: "首页"
    },
    data(){
        return {
            signDay:0,
            continueDay:0,
            giftDays:[]
        };
    },
    created(){
        this.init();
     
    },
    mounted() {},
    components:{
        Calendar,
        Banner
    },
    methods:{
        // getHomeConfig(){
        //     this.$api.homeConfig().then(res=>{
        //     });
        // },
        init(){
            // if(!this.$bus.isLogin) return;
            this.signDay = this.$bus.signInfo.markList.length;
            this.continueDay = this.$bus.signInfo.markList.length >0 ? this.$bus.signInfo.markList[0].continueDays:0;
            this.getGiftDate();
        },
        getGiftDate(){ // 获取显示奖品icon的日期
            const hasMark = this.$bus.signInfo.markList.length;
            const giftDays = [];
            this.$bus.signInfo.giftConfigList.forEach(item=>{
                if(hasMark < item.days){
                    giftDays.push(item);
                }
            });
            this.giftDays = giftDays;
        },
        async mark(){
            if(!this.$bus.isLogin){
                this.$dialog.show("gift",{vBind:{type:'sign-success'}});
                return;
            }
            this.$loading.show();
            const markResult = await this.$api.mark({activityId:this.$bus.signInfo.config.id});
            console.log("mark",markResult);
            if(markResult.code == '1008'){
                this.$toast({message:markResult.msg});
                this.$loading.hide();
                return;
            }
            await this.$api.boot({activityId:this.$bus.activityId});
            this.$loading.hide();
            if(markResult.sendGiftList.length>0){
                const type = markResult.sendGiftList[0].giftType === 'taobao' ? 'taobao' : 'get-gift';
                this.$dialog.show("gift",{vBind:{type,hasGain:false,giftInfo:markResult.sendGiftList}});
            }else{
                this.$dialog.show("gift",{vBind:{type:'sign-success'}});

            }
        },
    },
    watch:{
        "$bus.refresh"(val){
            this.init();
        }
    }
};
</script>
<style lang="less">
.home {
  .wh(100vw, 100vh);
  .bg-cover("bg.png");
  overflow: hidden;
  .flex-column(space-around, center);
  > .sign {
    .wh(60vw, 0.24rem);
    margin: 0.22rem auto;
    font-size: 0.25rem;
    font-weight: normal;
    font-stretch: normal;
    color: #ffffff;
    .flex(space-between);
    > span {
      font-weight: bold;
    }
    > .text {
      > span {
        margin: 0 0.1rem;
        font-size: 0.29rem;
        font-weight: normal;
        font-stretch: normal;
        color: #4e8cff;
      }
    }
  }
  > .calendar {
    @media @long {
      margin-bottom: 1rem;
    }
  }
  > .btn {
    .wh(3.07rem, 0.74rem);
    margin-bottom: 0.43rem;
    .bg-contain("mark_btn.png");
    @media @long {
      transform: scale(1.1);
      margin-bottom: 1rem;
    }
  }
  > .gift {
    .p-a();
    right: 0.36rem;
    bottom: 0.35rem;
    .wh(0.92rem);
    .bg-contain("gift_button.png");
    @media @wide {
      bottom: 0.35rem;
    }
    @media @long {
      bottom: 1.3rem;
    }
  }
}
</style>
