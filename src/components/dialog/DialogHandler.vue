<template>
  <keep-alive>
    <component
      :is="currentDialog.name"
      :show="showDialogHandler"
      :showOrHideAnimationOver="showOrHideAnimationOver"
      :style="{
                'pointer-events': dialogHandlerPointerEvents
            }"
      :animationDuration="animationDuration"
      v-bind="currentDialog.vBind"
      ref="dialog"
      @close="close"
    />
  </keep-alive>
</template>

<script>
import Vue from "vue";
import components from "./instances/index.js";
export default {
    components,
    data() {
        return {
            animationDuration: 1000,
            currentDialog: {
                name: "",
                showDuration: 1000,
                closeDuration: 1000
            },
            showDialogHandler: false,
            dialogHandlerPointerEvents: "auto",
            showOrHideAnimationOver: true
        };
    },
    created() {
        Vue.$dialog = Vue.prototype.$dialog = this;
        this.savedDialogList = []; //存起来的弹窗列表
    },
    methods: {
        saveDialog(dialog) {
            this.savedDialogList.push(dialog);
        },
        clearSave() {
            this.savedDialogList = [];
        },
        async show(name, options) {
            let defaultOptions = {
                vBind: {},//弹窗的props
                save: false,//是否保存弹窗.如果设置了为true,当在弹窗打开新的弹窗，新的弹窗关闭时依然显示此弹窗
                showDuration: 700,//显示弹窗动画时长
                closeDuration: 1000//关闭弹窗动画时长
            };
            if (!this.showOrHideAnimationOver) {
                console.log("有弹窗正在执行动画中");
                return false;
            }
            if (!(name in components)) {
                console.log("请检查弹窗", name, "是否存在");
                return false;
            }
            this.showOrHideAnimationOver = false;
            let willHandleDialog = Object.assign(defaultOptions, options, { name });
            if (this.savedDialogList.length > 0) {
                await this.showNextDialog(willHandleDialog);
            } else {
                await this.showDialog(willHandleDialog);
            }
            willHandleDialog.save && this.saveDialog(willHandleDialog);
            return true;
        },
        async close(closeAll = false) {
            if (!this.showOrHideAnimationOver) {
                return;
            }
            if (closeAll) {
                this.clearSave();
            }

            await this.closeDialog();
            if (this.savedDialogList.length > 0) {
                await this.showPreDialog();
            }
        },
        async showDialog(willHandleDialog) {
            this.currentDialog = willHandleDialog;
            return new Promise(resolve => {
                this.$nextTick(async () => {
                    await this.handleShowDialog(true, willHandleDialog);
                    resolve();
                });
            });
        },
        async closeDialog() {
            if (
                this.savedDialogList.length > 0 &&
                this.currentDialog.name ===
                    this.savedDialogList[this.savedDialogList.length - 1].name
            ) {
                let willHandleDialog = this.savedDialogList.pop();
            }
            await this.handleShowDialog(false, this.currentDialog);
        },
        async showPreDialog() {
            let willHandleDialog = this.savedDialogList[
                this.savedDialogList.length - 1
            ];
            await this.showDialog(willHandleDialog);
        },
        async showNextDialog(willHandleDialog) {
            let lastDialogInSavedDialogList = this.savedDialogList.slice(-1)[0];
            await this.handleShowDialog(false, lastDialogInSavedDialogList);
            await this.showDialog(willHandleDialog);
        },
        async handleShowDialog(isShow, willHandleDialog) {
            const dialog = this.$refs.dialog;
            if (isShow) {
                this.animationDuration = willHandleDialog.showDuration;
            } else {
                this.animationDuration = willHandleDialog.closeDuration;
            }
            this.showDialogHandler = isShow;
            let cbSuffix = isShow ? "Show" : "Close";
            dialog[`before${cbSuffix}`] && dialog[`before${cbSuffix}`]();
            this.dialogHandlerPointerEvents = "auto";
            await this.$func.wait(this.animationDuration);
            this.showOrHideAnimationOver = true;
            this.dialogHandlerPointerEvents = isShow ? "auto" : "none";
            dialog[`after${cbSuffix}`] && dialog[`after${cbSuffix}`]();
            this.addStatistics(isShow, willHandleDialog);
        },
        addStatistics(isShow, willHandleDialog) {
            const {
                name,
                meta: { cn }
            } = components[willHandleDialog.name];
            if (isShow) {
                window.baidu("event", `enter_${name}`, `进入${cn}`);
            } else {
                const name = willHandleDialog.name;
                window.baidu("event", `leave_${name}`, `离开${cn}`);
            }
        }
    }
};
</script>
