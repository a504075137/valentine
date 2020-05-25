<template>
    <BaseDialog
        v-bind="$attrs"
        v-on="$listeners"
        toastTransition="fade"
        :maskClose="true"
        class="dialog-get-gift">
        <div class="get-gift-content">

        </div>
    </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
export default {
    name: 'get-gift',
    meta: {
        cn: '获取奖品'
    },
    components: {
        BaseDialog
    },
};
</script>

<style lang="less">
.dialog-get-gift {
    .get-gift-content {
        
    }
}
</style>