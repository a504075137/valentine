<template>
  <div class="component-hw-scroller" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import PullDown from "@better-scroll/pull-down";
import Vue from "vue";

BScroll.use(PullDown);
BScroll.use(Pullup);

export default {
    name: "hw-scroller",
    meta: {
        cn: "滚动组件"
    },
    props: ["name"],
    data() {
        return {};
    },
    created() {
        if (!Vue.$scroller) {
            Vue.$scroller = Vue.prototype.$scroller = {};
        }
        Vue.$scroller[this.name] = Vue.prototype.$scroller[this.name] = this;
    },
    mounted() {
        this.$nextTick(() => {
            let wrapper = this.$refs.wrapper;
            this.bScroll = new BScroll(wrapper, {
                scrollY: true,
                useTransition: false,
                // momentum: false,
                pullUpLoad: {
                    threshold: 60
                },
                pullDownRefresh: {
                    threshold: 60
                }
            });
            this.bScroll.on("scroll", () => {
                this.$emit("scroll");
            });
            this.bScroll.on("pullingUp", () => {
                this.$emit("pullingUp");
            });
            this.bScroll.on("pullingDown", e => {
                this.$emit("pullingDown", { e });
            });
        });
    },
    methods: {
        refresh() {
            setTimeout(() => {
                this.bScroll.refresh();
            }, 0);
        },
        enable() {
            this.bScroll.enable();
        },
        disable() {
            this.bScroll.disable();
        },
        finishPullUp() {
            this.bScroll.finishPullUp();
        }
    }
};
</script>

<style lang="less">
.component-hw-scroller {
  .wh(100%);
//   .p-r();
  overflow: hidden;
}
</style>
