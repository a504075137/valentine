<template>
  <div :class="['ticket',{'card':giftInfo.giftType == 'taobao'}]">
    <template v-if="giftInfo.giftType !== 'taobao'">
      <div class="head" :style="{backgroundImage:`url(${giftInfo.giftImg})`}"></div>
    </template>
    <template v-else>
      <div class="header">
        <span>¥</span>
        <span class="money">{{initMoney.cash}}</span>
      </div>
      <div class="desc">{{initMoney.limit}}</div>
    </template>
  </div>
</template>

<script>
export default {
    name:"Ticket",
    props:['giftInfo'],
    methods:{
    },
    computed:{
        initMoney(){
            let limit,cash;

            if(this.giftInfo.giftType !== 'taobao') return{limit,cash};

            const name = this.giftInfo.giftName;
            const money  = name.match(/([\s\S]*)元/)[1].split("-");
            
            if(money.length > 1){
                cash = money[1];
                limit = `满${money[0]}可用`;
            }else{
                cash = money[0];
                limit = `无门槛`;
            }
            return {cash,limit};
        }
    },
    mounted(){

    }
};
</script>

<style lang="less">
.ticket {
  &.card {
    .wh(2.02rem, 2.55rem);
    .bg-contain("ticket.png");
  }
  > .header {
    text-align: center;
    font-size: 0rem;
    font-weight: bold;
    font-stretch: normal;
    line-height: 2rem;
    letter-spacing: -0.11rem;
    color: #ffffff;
    > span {
      font-size: 0.51rem;
      &:not(.money) {
        margin-right: 0.15rem;
      }
      &.money {
        font-size: 1.1rem;
      }
    }
  }
  > .desc {
    margin-top: -0.14rem;
    text-align: center;
    font-size: 0.29rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0rem;
    letter-spacing: 0px;
    color: #1a5cff;
    @media @wide {
      margin-top: -0.19rem;
    }
  }
  > .head {
    .wh(1.88rem);
    border-radius: 50%;
    border: solid 0.12rem #2b58f3;
    .contain();
  }
}
</style>