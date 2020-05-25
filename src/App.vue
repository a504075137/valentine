<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
    <DialogHandler />
    <!-- <MusicBtn /> -->
    <Loading />
  </div>
</template>

<script>
import MusicBtn from '@c/MusicBtn';
import Loading from '@c/loading';
import DialogHandler from '@c/dialog/DialogHandler';

export default {
    name: 'app',
    components: {
        // MusicBtn,
        DialogHandler,
        Loading
    }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  font-family: lthz;
}
html,
body {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
}
#app {
  .wh(100vw, 100vh);
}
</style>
