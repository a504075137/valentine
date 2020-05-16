<template>
    <div id="app">
        <transition name="fade">
            <router-view />
        </transition>
        <DialogHandler />
        <MusicBtn />
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
        MusicBtn,
        DialogHandler,
        Loading
    }
};
</script>

<style lang="less">
#app {
    .page();
}
</style>
