<template>
  <BaseDialog
    v-bind="$attrs"
    v-on="$listeners"
    toastTransition="fade"
    :maskClose="true"
    class="dialog-share"
  >
    <div class="share-content"></div>
  </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
export default {
    name: 'share',
    meta: {
        cn: '分享引导蒙层'
    },
    components: {
        BaseDialog
    },
    methods:{
        // beforeShow(){
        //     setTimeout(()=>{
        //         this.$bus.$emit("wx-share");
        //     },1000);
        // }
    }
};
</script>

<style lang="less">
.dialog-share {
  .share-content {
    position: fixed;
    right: 0;
    top: 0.26rem;
    .wh(6.14rem, 3.8rem);
    .bg-contain("wx-share.png");
  }
}
</style>