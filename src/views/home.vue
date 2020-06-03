<template>
  <div class="home">
    <transition name="bounceUp">
      <Rule v-if="showRule" @close="showRule = false" />
    </transition>
    <transition name="bounceUp">
      <Login v-if="showLogin" @close="showLogin = false" />
    </transition>
    <transition name="bounceUp">
      <Getgift
        v-if="showGetgift"
        :name="giftContent.name"
        :address="giftContent.address"
        :gift="giftContent.gift"
        :phone="giftContent.phone"
        @close="showGetgift = false"
      />
    </transition>

    <Banner />

    <!-- <div class="test">{{query}}</div> -->
    <Calendar class="calendar" :giftDays="giftDays" />
    <div class="btn" @click="mark" v-if="!$bus.hasToday"></div>
    <div class="btn hasToday" v-else></div>
    <div class="gift" @click="showRule=true"></div>
  </div>
</template>

<script>
import Calendar from '@c/Calendar';
import Banner from '@c/Banner';
import Rule from '@c/Rule';
import Login from '@c/Login';
import Getgift from '@c/Getgift';
import jwtDecode from 'jwt-decode';

export default {
    name: "home",
    meta: {
        cn: "首页"
    },
    data(){
        return {
            signDay:0,
            continueDay:0,
            giftDays:[],
            showRule:false,
            showLogin:false,
            showGetgift:false,
            query:window.$query.source,
            giftContent:{
                gift:null,
                name:null,
                phone:null,
                address:null
            }
        };
    },
    created(){
        this.init();

    },
    mounted() {
    },
    components:{
        Calendar,
        Banner,
        Rule,
        Login,
        Getgift
    },
    methods:{
        init(){
            const jwt = this.$storage.load("jwt");
            let uid = -1;
            if(jwt){
                uid = jwtDecode(jwt).data.uid;
            }
            console.log("用户ID",uid);
            window.webfunny && webfunny.wmInitUser(uid, "1.0.0"); // 统计代码

            // if(!this.$bus.isLogin) return;
            this.$bus.signDay = this.$bus.signInfo.markList.length;
            this.$bus.continueDay = this.$bus.signInfo.markList.length >0 ? this.$bus.signInfo.markList[0].continueDays:0;
            this.getGiftDate();
            this.judgeShare();
            this.$bus.$on("goRule",()=>{
                this.showRule = true;
            });
            this.$bus.$on("goLogin",()=>{
                this.showLogin = true;

            });
            this.$bus.$on("goGetgift",(e)=>{
                this.giftContent = e;
                this.showGetgift = true;
            });

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
            const {sendGiftList} = markResult;
            const hasList = this.$bus.signInfo.giftConfigList.filter((item)=>{
                return item.days === 1;
            });
            console.log("mark",markResult,hasList);
            if(markResult.code == '1008'){
                this.$toast({message:markResult.msg});
                this.$loading.hide();
                return;
            }
            await this.$api.boot({activityId:this.$bus.activityId});
            this.$loading.hide();
            if(sendGiftList.length === hasList.length){
                if(markResult.sendGiftList.length>0){
                // const type = markResult.sendGiftList[0].giftType === 'taobao' ? 'taobao' : 'get-gift';
                    this.$dialog.show("gift",{vBind:{type:'display',hasGain:true,giftInfo:markResult.sendGiftList}});
                }else{
                    this.$dialog.show("gift",{vBind:{type:'sign-success'}});

                }
            }else{

                const noneGift = hasList.filter(item=>{
                    let flag = true;
                    sendGiftList.forEach(oitem=>{
                        if(oitem.id === item.id){
                            flag = false;
                        }
                    });
                    return flag;
                });
                console.log(757571,noneGift,hasList,sendGiftList);
                noneGift.map(item=>{
                    item.none= true;
                    return item;
                });
                console.log("没礼物",noneGift);
                this.$dialog.show("gift",{vBind:{type:'display',hasGain:true,giftInfo:[...sendGiftList,...noneGift]}});
            }

        },
        async judgeShare(){
            // 从APP进入时，会默认带上source=app的，所以要依赖source=share来判断分享态
            if(window.$query.source == 'share'){
                const markDate = this.$storage.load("share");
                if(!markDate){
                    return;
                }

                this.reMark(markDate);
                this.$storage.save("share",'');
            }

        },
        async reMark(markDate){
            if(!this.$bus.isLogin){
                this.$emit('close');
                setTimeout(()=>{
                    this.$dialog.show("gift",{vBind:{type:'sign-success'}});
                },600);

                return;
            }
            this.$loading.show();
            const result = await this.$api.remark({activityId:this.$bus.signInfo.config.id,date: markDate});
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
  > .test {
    color: #ffffff;
  }
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
    &.hasToday {
      .bg-contain("hasMark.png");
    }
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
