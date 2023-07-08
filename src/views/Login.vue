<template>
  <div class="container">
    <header>
      <van-nav-bar title="登陆/注册" @click-left="this.$router.push('/')" @click-right="this.$router.push('/')" :fixed="true">
        <template #left>
          <div><van-icon name="arrow-left" color="#fff" />返回</div>
        </template>
        <template #right>
          <div class="icon"><van-icon name="home-o" color="#fff" /></div>
        </template>
      </van-nav-bar>
    </header>
    <section>
      <div class="login-tel">
        <input type="text" placeholder="请输入手机号" pattern="[0-9]{11}" v-model="userTel" />
      </div>
      <div class="login-code">
        <input type="text" placeholder="请输入短信验证码" pattern="[0-9]*" v-model="msgCode" />
        <button :class="!isDisable ? 'active' : 'noactive'" :disabled="isDisable" @click="getShortCode">{{ sendBtn }}</button>
      </div>
      <div class="login-in" @click="login">登录</div>
      <div class="login-tab">
        <span @click="toUserLogin">密码登录</span>
      </div>
    </section>
  </div>
</template>

<script>
import { getCodeAPI, updateCodeAPI, LoginAPI } from '@/request/login.js'
import { useUserStore } from '@/stores/user.js'
import { showToast } from 'vant'
export default {
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      sendBtn: '发送验证码',
      isDisable: false,
      userTel: '',
      msgCode: '',
      waitTime: 6,
      trueCode: ''
    }
  },
  methods: {
    async getShortCode() {
      //手机号验证
      if (!this.userStore.loginRules.userTel.rule.test(this.userTel)) {
        showToast(this.userStore.loginRules.userTel.msg)
        return
      }
      if (this.sendBtn === '重新获取验证码') {
        let { data: res } = await updateCodeAPI(this.userTel)
        if (res.code != 1) {
          showToast({ message: '验证码发送失败！', position: 'bottom' })
        }
      }
      let { data: res } = await getCodeAPI(this.userTel)
      this.msgCode = res.data
      showToast({ message: '验证码已发送！', position: 'bottom' })
      //禁用按钮
      this.isDisable = true
      //倒计时
      let timer = setInterval(() => {
        --this.waitTime
        this.sendBtn = `重新发送${this.waitTime}`
      }, 1000)
      setTimeout(() => {
        clearInterval(timer)
        this.waitTime = 6
        this.sendBtn = '重新获取验证码'
        this.isDisable = false
      }, 6000)
    },
    async login() {
      //手机号验证
      if (!this.userStore.loginRules.userTel.rule.test(this.userTel)) {
        showToast(this.userStore.loginRules.userTel.msg)
        return
      }
      //验证码验证
      if (!this.userStore.loginRules.userCode.rule.test(this.msgCode)) {
        showToast(this.userStore.loginRules.userCode.msg)
        return
      }
      // 发送登录请求
      let { data: res } = await LoginAPI(this.userTel, this.msgCode)
      if (res.code === 1) {
        this.userStore.achieveLogin(res.data)
        this.$router.push('/mine')
      } else {
        showToast({
          message: res.msg,
          position: 'bottom'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
header {
  height: 60px;
  color: #fff;
  div {
    font-size: 16px;
  }
  .icon {
    font-size: 22px;
  }
}
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  font-size: 0.3733rem;
  div {
    width: 8.9333rem;
    height: 1.1733rem;
    margin: 0.2667rem 0;
  }
  input {
    padding: 0 0.2667rem;
    line-height: 1.1733rem;
    background-color: #fff;
    border: 0.0267rem solid #ccc;
    box-sizing: border-box;
    border-radius: 0.16rem;
  }
  .login-tel {
    margin-top: 0.8rem;
    input {
      width: 100%;
    }
  }
  .login-code {
    display: flex;
    align-items: center;
    input {
      flex: 1;
      margin-right: 0.0267rem;
    }

    button {
      height: 1.1733rem;
      border: 0;
      color: #fff;
      border-radius: 0.16rem;
      box-sizing: border-box;
      font-size: 0.3733rem;
      padding: 0 0.2667rem;
    }
  }
  .login-in {
    background-color: #b0352f;
    line-height: 1.1733rem;
    text-align: center;
    color: #fff;
    border-radius: 0.16rem;
  }
  .login-tab {
    margin-top: 16px;
    text-align: center;
  }
}
.noactive {
  background-color: #999;
}
.active {
  background-color: #b0352f;
}
</style>
