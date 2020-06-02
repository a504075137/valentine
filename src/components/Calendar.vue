<template>
  <div class="calendar">
    <div class="date-header">
      <div class="prev-month" :style="{opacity:hasPrev?1:0}" @click="handlePrev"></div>
      <div class="show-date">{{`${year}年${month >=10?month:'0'+month}月`}}</div>
      <div class="next-month" :style="{opacity:hasNext?1:0}" @click="handleNext"></div>
    </div>
    <div class="date-content">
      <div class="week-header">
        <div>日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
      </div>
      <div class="week-day">
        <div class="border"></div>
        <div class="box">
          <div class="every-day" v-for="(item,index) in 42" :key="index">
            <!-- <div v-if="item - beginDay <=0" class="other-day">{{item - beginDay + prevDays}}</div> -->
            <div
              v-if="item-beginDay >0 && item-beginDay <= curDays"
              @click="handleChoose(item - beginDay)"
              :class="{
              'now-day':`${year}-${month}-${item-beginDay}` === curDate,
              'has-day':hasMarkDay(formMyDate(item)),
              'activity-day':noMarkDays(formMyDate(item)) && isBeforeNow(formMyDate(item)),
              'gift-day':giftDate(`${year}-${month}-${item-beginDay}`).flag,
              'has-gift':hasGiftDate(formMyDate(item)).flag
          }"
            >
              <div class="date-num">
                <span>{{item - beginDay}}</span>

                <div
                  :class="['gift-icon', {'shake':giftDate(`${year}-${month}-${item-beginDay}`).shake}]"
                ></div>
              </div>
            </div>
            <!-- <div v-else class="other-day">{{item - curDays - beginDay}}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// let list; // 用户签到过的列表
// let giftDay; // 可获得奖品的日子
// let userGiftList; // 用户已获得奖品列表
// let signDay; // 用户签到过的列表
import dayjs from 'dayjs';
let startTime;
let endTime;
let shakeDay;
let reMarkDay = 0;
export default {
    props:['giftDays'],
    data(){
        return {
            year:null,
            month:null,
            day:null,
            curDate:null,
            list:[],// 用户签到过的列表
            giftDay:[],// 可获得奖品的日子
            userGiftList:[], // 用户已获得奖品列表
            signDay:[] // 用户签到过的列表
        };
    },
    methods:{
        getInitData(curd){
            const curdate = new Date();
            this.year=curdate.getFullYear();
            this.month=curdate.getMonth() +1;
            this.day=curdate.getDate();
            this.curDate = `${this.year}-${this.month}-${this.day}`;
            startTime =dayjs(this.$bus.signInfo.config.startTime.split(" ")[0]);
            endTime =dayjs(this.$bus.signInfo.config.endTime);
        },
        handleChoose(day){
            const chooseDay = `${this.year}-${this.month >=10?this.month:'0'+this.month}-${day >=10?day:'0'+day}`;
            const markFlag = this.hasMarkDay(chooseDay);
            if(markFlag){
                const hasGift = this.hasGiftDate(`${this.year}-${this.month >=10?this.month:'0'+this.month}-${day >=10?day:'0'+day}`);
                if(hasGift.flag){
                    this.$dialog.show("gift",{vBind:{type:'display',hasGain:true,cantGain:false,giftInfo:hasGift.itemInfo}});
                    console.log("展示奖品",hasGift.itemInfo);
                }else{
                    // this.$toast({message:'该日已签到'});
                    console.log("已签到");
                }
                return;
            }
            const hasGift = this.giftDate(`${this.year}-${this.month}-${day}`);
            if(!this.noMarkDays(chooseDay) || !this.isBeforeNow(chooseDay)){
                if(hasGift.flag){
                    this.$dialog.show("gift",{vBind:{type:'display',hasGain:false,cantGain:true,giftInfo:hasGift.itemInfo}});
                    console.log("展示奖品",hasGift.itemInfo);
                }else{
                    return;

                }
            }else{ // 补签
                // console.log("点击了补签按钮");
                if(!this.$wxsdk.isWx() && !window.$query.source){
                    // 说明是非微信 非最新版本飞智APP环境 需要弹窗提示去更新
                    this.$dialog.show("gift",{vBind:{type:'update'}});
                }else{
                    if(reMarkDay < this.$bus.signInfo.config.reMarkTimes){
                        this.$dialog.show("gift",{vBind:{type:'remark',date:chooseDay}});
                    }else{
                        this.$toast({message:"很抱歉，您的补签次数已用完"});
                    }
                }
            }
        },
        handlePrev(){
            if(!this.hasPrev){
                return;
            }
            if(this.month === 1){
                this.month = 12;
                this.year --;
            }else{
                this.month -=1;
            }
        },
        handleNext(){
            if(!this.hasNext){
                return;
            }
            if(this.month === 12){
                this.month = 1;
                this.year ++;
            }else{
                this.month +=1;
            }

        },
        initStatus(){ // 初始化抽奖日历状态
            let markListFlag = false; // 判断今日有没有签到
            reMarkDay = 0;
            this.list = this.$bus.signInfo.markList.map(item=>{
                const date = item.createAt.split(" ")[0];
                if(item.isReMark) reMarkDay+=1;
                if(dayjs(date).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')) markListFlag = true;
                return date;
            });
            this.$bus.hasToday = markListFlag;
            this.setGiftDay(markListFlag);
            this.setUserGiftList();
        },
        setGiftDay(markListFlag){


            const hasMark = markListFlag? this.$bus.signInfo.markList.length:this.$bus.signInfo.markList.length +1;
            const list = this.giftDays.sort((a,b)=>{
                return a.days - b.days;
            });
            this.giftDay = list.map(item=>{
                const date1 = new Date();
                const date2 = new Date(date1);
                date2.setDate(date1.getDate() + item.days-hasMark);
                item.date =`${date2.getFullYear()}-${date2.getMonth()+1}-${date2.getDate()}`;
                return item;
            });
            if(this.giftDay[0]) shakeDay = this.giftDay[0].date; // 保存离得最近一天的日期
        },
        setUserGiftList(){
            this.userGiftList = this.$bus.signInfo.userGiftList.map(item=>{
                item.date = item.createAt.split(" ")[0];
                return item;
            });
        }

    },
    computed:{
        beginDay(){
            return new Date(this.year,this.month-1,1).getDay();
        },
        curDays(){
            return new Date(this.year,this.month,0).getDate();
        },
        prevDays(){
            return new Date(this.year,this.month-1,0).getDate();
        },
        hasMarkDay(){
            return (time)=>{
                return this.list.includes(time);
            };
        },
        giftDate(){
            return (time)=>{
                let flag = false;
                let shake = false;
                let itemInfo = [];
                this.giftDay.forEach((item,index)=>{
                    if(item.date === time){
                        flag = true;
                        itemInfo.push(item);

                        shake = shakeDay === item.date?true:false;
                    }
                });
                return {flag,itemInfo,shake};
                // return list.includes(time);
            };
        },
        hasGiftDate(){
            return (time)=>{
                let flag = false;
                let itemInfo = [];
                this.userGiftList.forEach(item=>{
                    if(item.date === time){
                        flag = true;
                        itemInfo.push(item);
                    }
                });
                return {flag,itemInfo};
            };
        },
        noMarkDays(){
            return (time)=>{
                const date = dayjs(time);
                return (startTime.isBefore(date) || startTime.isSame(date)) && (endTime.isAfter(date));
            };
        },
        formMyDate(){
            return (item)=>{
                return `${this.year}-${this.month >=10?this.month:'0'+this.month}-${(item-this.beginDay) >=10?item-this.beginDay:'0'+(item-this.beginDay)}`;
            };

        },
        hasPrev(){ // 判断前一个月是否有活动
            let year=this.year , month=this.month;
            if(this.month === 1){
                month = 12;
                year = this.year -1;
            }else{
                month =this.month - 1;
            }
            const day = new Date(year,month,0).getDate();
            return this.noMarkDays(`${year}-${month}-${day}`);
        },
        hasNext(){// 判断下一个月是否有活动
            let year=this.year , month=this.month;
            if(month === 12){
                month = 1;
                year ++;
            }else{
                month +=1;
            }
            const day = 1;
            return this.noMarkDays(`${year}-${month}-${day}`);
        },
        isBeforeNow(){
            return (time)=>{
                return (dayjs(time).isBefore(dayjs())&& dayjs(time).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD'));
            };
        }

    },
    created(){
        this.getInitData();
        this.initStatus();
    },
    watch:{
        "$bus.refresh"(val){
            this.initStatus();
        }
    },
    mounted(){

    },
};
</script>

<style lang="less">
.calendar {
  width: 100%;
  font-size: 0.35rem;

  > .date-header {
    width: 80vw;
    .flex(space-between, center);
    margin: 0 auto 0.4rem;
    > .prev-month,
    > .next-month {
      .wh(0.48rem);
    }
    > .prev-month {
      .bg-contain("left.png");
    }

    > .next-month {
      .bg-contain("right.png");
    }
    > .show-date {
      .wh(4.68rem, 0.44rem);
      .bg-cover("date_bg.png");
      text-align: center;
      font-size: 0.39rem;
      font-weight: bold;
      font-stretch: normal;
      line-height: 0.44rem;
      letter-spacing: 0.04rem;
      color: #ffffff;
    }
  }
  > .date-content {
    .bg-contain("calendar_border.png");
    .wh(6.63rem, 5.34rem);
    .flex-column(flex-start, center);
    margin: 0 auto;
    overflow: hidden;
    > .week-header {
      .flex(space-around, center);
      .wh(5.83rem, 0.46rem);
      box-sizing: border-box;
      margin: 0.23rem auto 0;
      padding: 0 0.25rem;
      background-color: #427cff;
      > div {
        flex: 1;
        text-align: center;
        font-size: 0.24rem;
        color: #010308;
      }
    }

    > .week-day {
      .wh(5.83rem, 4.42rem);
      box-sizing: border-box;
      // flex: 1;
      background-color: #ffffff;
      > .border {
        width: 5.83rem;
        height: 0.12rem;
        background-color: #427cff;
        opacity: 0.2;
      }
      > .box {
        margin: 0 0.25rem;
        > .every-day {
          .p-r();
          display: inline-block;
          width: 14.28%;
          font-size: 0.32rem;
          font-weight: bold;
          line-height: 0.6rem;
          text-align: center;

          > .other-day {
            color: #ccc;
          }
          > .has-day {
            > .date-num {
              display: inline-block;
              // .wh(0.5rem);
              // line-height: 0.5rem;
              // border-radius: 50%;
              // background-color: #d3e4ff;
              > .gift-icon {
                margin: 0 auto;
                .wh(0.18rem, 0.14rem);
                .bg-contain("sign.png");
                // .p-a();
                // left: 50%;
                // transform: translate3d(-50%, 0, 0);
              }
            }
          }
          > .gift-day,
          > .has-gift {
            > .date-num {
              .p-r();
              > span {
                opacity: 0;
              }
              > .gift-icon {
                .p-a();
                top: 50%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                .wh(0.43rem, 0.39rem);
                .bg-contain("gift_icon.png");
                &.shake {
                  animation: small-to-big 1s infinite linear alternate;
                }
              }
              // display: none;
            }
          }
          > .has-gift {
            > .date-num {
              border-radius: 0;
            }
            &.has-day {
              > .date-num {
                position: static;
                > span {
                  opacity: 1;
                }
                > .gift-icon {
                  position: static;
                  margin: 0 auto;
                  transform: translate3d(0, 0, 0);
                  .wh(0.22rem, 0.19rem);
                  .bg-contain("has_gift.png");
                }
              }
            }
          }
          > .activity-day:not(.has-day) {
            > .date-num {
              > .gift-icon {
                margin: 0 auto;
                .wh(0.18rem, 0.14rem);
                .bg-contain("no-sign.png");
              }
              // display: none;
            }
            // }
          }
          > .now-day {
            // .bg-contain("now-day.png");
            // background-position: center 0.025rem;
            > .date-num {
              > span {
                .wh(0.68rem, 0.53rem);
                line-height: 0.53rem;
                .bg-contain("now-day.png");
                display: inline-block;
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
@keyframes small-to-big {
  from {
    transform: translate3d(-50%, -50%, 0) scale(0.5);
  }
  to {
    transform: translate3d(-50%, -50%, 0) scale(1.2);
  }
}
</style>
