<template>
  <div class="home">
    <div class="title">home</div>
  </div>
</template>

<script>
export default {
    name: "home",
    meta: {
        cn: "首页"
    },
    mounted() {}
};
</script>
<style lang="less">
.home {
  .page();
    .title{
      font-size: .5rem;
      .p-a();
      left:.3rem;
      top:.5rem;
      color:gray;
  }
}
</style>
