<template>
  <div class="calendar">
    <div class="date-header">
      <!-- <div class="prev-month" @click="handlePrev"></div> -->
      <div class="show-date">{{`${year}年${month >=10?month:'0'+month}月`}}</div>
      <!-- <div class="next-month" @click="handleNext"></div> -->
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
              'active-day':`${year}-${month}-${item-beginDay}` === `${year}-${month}-${day}`,
              'has-day':hasMarkDay(`${year}-${month >=10?month:'0'+month}-${(item-beginDay) >=10?item-beginDay:'0'+(item-beginDay)}`),
              'gift-day':giftDate(`${year}-${month}-${item-beginDay}`).flag,
            
              'has-gift':hasGiftDate(`${year}-${month >=10?month:'0'+month}-${(item-beginDay) >=10?item-beginDay:'0'+(item-beginDay)}`).flag
          }"
            >
              <div class="date-num">
                {{item - beginDay}}
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
        },
        handleChoose(day){
            const markFlag = this.hasMarkDay(`${this.year}-${this.month >=10?this.month:'0'+this.month}-${day >=10?day:'0'+day}`);
            if(markFlag){
                const hasGift = this.hasGiftDate(`${this.year}-${this.month >=10?this.month:'0'+this.month}-${day >=10?day:'0'+day}`);
                if(hasGift.flag){
                    this.$dialog.show("gift",{vBind:{type:'get-gift',hasGain:true,giftInfo:hasGift.itemInfo}});
                    console.log("展示奖品",hasGift.itemInfo);
                }else{
                    this.$toast({message:'该日已签到'});
                }
                return;
            }
            if(this.day>day){
                this.$dialog.show("gift",{vBind:{type:'remark',date:`${this.year}-${this.month >=10?this.month:'0'+this.month}-${day >=10?day:'0'+day}`}});

            }else{
                const hasGift = this.giftDate(`${this.year}-${this.month}-${day}`);
                if(hasGift.flag){
                    this.$dialog.show("gift",{vBind:{type:'get-gift',hasGain:false,cantGain:true,giftInfo:hasGift.itemInfo}});
                    console.log("展示奖品",hasGift.itemInfo);
                }else{
                    // this.$toast({message:'该日已签到'});

                }
            }
            // this.day = day;
        },
        handlePrev(){
            if(this.month === 1){
                this.month = 12;
                this.year --;
            }else{
                this.month -=1;

            }
        },
        handleNext(){
            if(this.month === 12){
                this.month = 1;
                this.year ++;
            }else{
                this.month +=1;
            }

        },
        initStatus(){ // 初始化抽奖日历状态

            this.list = this.$bus.signInfo.markList.map(item=>{
                return item.createAt.split(" ")[0];
            });
           
            this.setGiftDay();
            this.setUserGiftList();
        },
        setGiftDay(){
            const hasMark = this.$bus.signInfo.markList.length;
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
                        shake = index === 0?true:false;
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
    width: 100%;
    .flex(space-between, center);
    > .prev-month,
    > .next-month {
      border: 15px solid transparent;
      width: 0;
      height: 0;
    }
    > .prev-month {
      border-right-color: #007fff;
    }

    > .next-month {
      border-left-color: #007fff;
    }
    > .show-date {
      flex: 1;
      text-align: center;
      font-size: 0.39rem;
      font-weight: bold;
      font-stretch: normal;
      line-height: 44px;
      letter-spacing: 4px;
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
        margin: 0.34rem 0.25rem 0rem;
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
              .wh(0.5rem);
              line-height: 0.5rem;
              border-radius: 50%;
              background-color: #d3e4ff;
            }
          }
          > .gift-day,
          > .has-gift {
            > .date-num {
              .p-r();
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
.active-day:not(.now-day) {
  color: #007fff;
  // border: 2px solid #007fff;
  // line-height: 46px;
}
</style>