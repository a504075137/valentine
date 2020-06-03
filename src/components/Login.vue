<template>
  <div class="page-login">
    <header class="header">
      {{['登录飞智帐号','注册'][index]}}
      <div class="back" v-if="index ==1" @click="index = 0"></div>
    </header>
    <section class="content" v-if="index ==0">
      <input type="text" v-input placeholder="请输入您的手机号/邮箱.." v-model="phone" />
      <input type="text" v-input placeholder="请输入密码.." v-model="password" />
      <div class="submit" @click="login">登录</div>
    </section>
    <section class="content regist" v-else>
<!--      <input type="text" v-input placeholder="请输入您的昵称.." v-model="register.name" />-->
      <input type="text" v-input placeholder="请输入您的手机号.." v-model="register.phone" />
      <div class="sms">
        <input type="text" v-input placeholder="请输入手机验证码.." v-model="register.code" />
        <div class="sms-btn btn-text" @click="sendSms">{{ sending ? secondNum : "获取验证码" }}</div>
      </div>

      <input type="text" v-input placeholder="请输入密码（8-16位）.." v-model="register.password" />
<!--      <input type="text" v-input placeholder="请再次输入密码.." v-model="register.repasswd" />-->
      <div class="submit" @click="sendRegister">立即注册</div>
    </section>

    <div class="register" v-if="index === 0" @click="goRegister">
      <div class="desc">还没有账号？</div>
      <a href="#">立即注册</a>
    </div>
    <div class="login-logo"></div>
    <footer v-show="false">
      登录即代表您同意
      <span>《飞智用户协议》</span>
    </footer>
  </div>
</template>

<script>
let seconds = 1000 * 60;
let registFlag = false;
export default {
    name: 'login',
    meta: {
        cn: '登录注册'
    },
    data () {
        return {
            index:0,
            phone:null,
            password:null,
            register:{
                phone:null,
                code:null,
                password:null,
                repasswd:null,
                name:null
            },
            secondNum: "",
            sending: false,
            timer: null,
        };
    },
    created () {

    },
    mounted () {

    },
    methods: {
        async login(){
            if(this._check()){
                const obj = {
                    email:this.phone,password:this.password
                };
                try {
                    this.$loading.show();
                    const result = await this.$api.login(obj);
                    this.$bus.isLogin = true;
                    await this.$api.boot({activityId:this.$bus.activityId});
                    this.$toast('登录成功');
                    this.$loading.hide();
                    // this.$router.replace("home");
                    this.$emit("close");

                } catch (error) {
                    console.log(error);
                    this.$loading.hide();
                    if(error.err == 1){
                        this.$toast({message:"用户不存在"});
                    }else if(error.err == 2){
                        this.$toast({message:"密码错误"});
                    }else if(error.err == 3){
                        this.$toast({message:"安全问题错误"});
                    }
                }
            }


        },
        _check() {
            let err = "";
            if (!this.phone) {
                err = "请填写手机号";
            } else if (!this.password) {
                err = "请填写密码";
            }
            err && this.$toast({ message: err });
            return !err;
        },
        goRegister(){
            this.index = 1;
        },
        async sendSms() {
            if (!this.register.phone) {
                this.$toast("手机号不能为空");
                return;
            }
            if (this.sending) {
                this.$toast("请稍后再试");
                return;
            }
            try {
                this.$loading.show();
                let result = await this.$api.sendCode({ mobile: this.register.phone });
                this.$loading.hide();
                result.err == 0  && this.$toast("发送验证码成功");

                if(result.err == 20001 ){
                    this.$toast("手机号码不合法");
                }else if(result.err == 20002 ){
                    this.$toast("号码已被注册");
                }else if(result.err == 20003){
                    this.$toast("短信发送失败");
                }else if(result.err == 20008){
                    this.$toast("图形验证码错误");
                }else{
                    this.sending = true;
                    this.secondNum = seconds / 1000 + "s";
                    this.timer = setInterval(() => {
                        if (seconds <= 0) {
                            this.sending = false;
                            seconds = 1000 * 60;
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                        seconds -= 1000;
                        this.secondNum = seconds / 1000 + "s";
                    }, 1000);
                }

            } catch (error) {
                this.$loading.hide();
                console.log(error);
                this.$toast("服务器开小差了，稍后再试试吧");
            }
        },
        async sendRegister(){

            if(this._checkRegist()){
                if(registFlag){
                    return;
                }
                registFlag = true;
                const result = await this.$api.register({  code: this.register.code,
                    mobile: this.register.phone,
                    password: this.register.password
                    // , username: this.register.name
                });
                switch(result.err){
                case 0:
                    this.$api.injectJwt(result.jwt);
                    this.$storage.save('jwt', result.jwt);
                    this.$bus.isLogin = true;
                    await this.$api.boot({activityId:this.$bus.activityId});
                    this.$toast('注册成功');
                    // this.$router.replace("home");
                    this.$emit("close");
                    break;
                case 20001:
                    this.$toast('手机号码不合法');
                    break;
                case 20002:
                    this.$toast('号码已被注册');
                    break;
                case 20004:
                    this.$toast('验证码错误');
                    break;
                case 20005:
                    this.$toast('用户名被占用');
                    break;
                case 20006:
                    this.$toast('注册失败');
                    break;
                }
                registFlag = false;

            }
        },
        _checkRegist() {
            let err = "";
            if (!this.register.phone) {
                err = "请填写手机号";
            }
            // else if (!this.register.name) {
            //     err = "请填写昵称";
            // }
            else if (!this.register.code) {
                err = "请填写验证码";
            } else if (!this.register.password) {
                err = "请填写密码";
            }
            // else if (!this.register.repasswd) {
            //     err = "请填写再次输入密码";
            // }
            // else if (this.register.repasswd !== this.register.password) {
            //     err = "两次密码不一致";
            // }
            err && this.$toast({ message: err });
            return !err;
        },
    }
};
</script>

<style lang="less">
.page-login {
  .page();
  z-index: 99;
  .bg-cover("login_bg.png");
  > .header {
    .wh(100vw, 1.18rem);
    background-color: #132249;
    text-align: center;
    font-size: 0.42rem;
    font-weight: bold;
    font-stretch: normal;
    line-height: 1.18rem;
    letter-spacing: 0.08rem;
    color: #4288ff;
    > .back {
      .p-a();
      top: 0.4rem;
      left: 0.3rem;
      .wh(0.23rem, 0.4rem);
      .bg-contain("back.png");
    }
  }
  > .content {
      z-index:2;
    .wh(6.53rem, 4.56rem);
    .bg-cover("login_board.png");
    margin: 1rem auto 0;
    &.regist {
      .wh(6.53rem, 6.53rem);
      .bg-cover("regist_board.png");
    }
    .flex-column(flex-start, center);
    input {
      .wh(5.59rem, 0.85rem);
      background-color: #ffffff;
      border: none;
      outline: none;
      box-sizing: border-box;
      margin-top: 0.5rem;
      padding: 0rem 0.31rem 0 0.28rem;
      font-size: 0.25rem;
      &::placeholder {
        color: #999999;
      }
    }
    > .submit {
      .wh(5.61rem, 0.83rem);
      background-color: #4266ff;
      margin-top: 0.58rem;
      text-align: center;
      font-size: 0.36rem;
      font-weight: bold;
      font-stretch: normal;
      line-height: 0.83rem;
      letter-spacing: 0.02rem;
      color: #ffffff;
    }
    .sms {
      .flex(space-between, center);
      .wh(5.59rem, 0.85rem);
      margin-top: 0.58rem;
      > input {
        margin-top: 0;
        width: 3.47rem;
      }
      .sms-btn {
        .wh(1.87rem, 0.83rem);
        background-color: #2164ff;
        text-align: center;
        font-size: 0.28rem;
        font-weight: bold;
        font-stretch: normal;
        line-height: 0.83rem;
        letter-spacing: 1px;
        color: #ffffff;
      }
    }
  }
  > .register {
    margin: 0.66rem auto 0;
    text-align: center;
    font-size: 0.24rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0.44rem;
    letter-spacing: 1px;
    color: #ffffff;
    > .desc {
      text-decoration: none;
      letter-spacing: 0.01rem;
      color: #676767;
    }
    > a {
      color: #ffffff;
    }
  }
  > footer {
    .center-row();
    bottom: 0.3rem;
    width: 100vw;
    text-align: center;
    font-size: 0.22rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0.44rem;
    letter-spacing: 1px;
    color: #676767;
    > span {
      display: inline-block;
      font-weight: normal;
      letter-spacing: 1px;
      color: #ffffff;
    }
  }
    > .login-logo{
        width: 4.12rem;
        height: .83rem;
        .center-row();
        /*bottom: 0.57rem;*/
        top: 10rem;
        .bg-contain("login_logo.png");
        z-index :1;
    }
}
</style>
