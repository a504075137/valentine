<template>
  <div class="component-hw-button" v-on="$listeners">{{text}}</div>
</template>

<script>
export default {
    name: "hw-button",
    meta: {
        cn: "按钮"
    },
    props: ["text"],
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>

<style lang="less">
.component-hw-button {
  width: fit-content;
  padding: 0.15rem 0.3rem;
  border: 1px solid #409eff;
  font-size: 0.24rem;
  border-radius: 8px;
  color: white;
  background-color: #409eff;
}
</style>
