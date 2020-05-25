<template>
  <div class="page-login">
    <input type="text" v-input v-model="phone" />
    <input type="text" v-input v-model="code" />
    <input type="submit" @click="login" />
  </div>
</template>

<script>
export default {
    name: 'login',
    meta: {
        cn: '登陆注册'
    },
    data () {
        return {
            phone:null,
            code:null
        };
    },
    created () {

    },
    mounted () {

    },
    methods: {
        async login(){
            const obj = {
                phone:this.phone,code:this.code
            };
            try {
                await this.$api.login(obj);
                this.$router.replace("home");

            } catch (error) {
                console.log(error);
            }

        }
    }
};
</script>

<style lang="less">
.page-login {
  .page();
}
</style>
