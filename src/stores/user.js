import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      //验证规则
      loginRules: {
        //手机规则
        userTel: {
          rule: /^1[3-9]\d{9}$/,
          msg: '手机号不规范'
        },
        //密码规则
        userCode: {
          rule: /^\d{6,12}$/,
          msg: '验证码不规范'
        }
      },
      loginStatus: false,
      userLikeIdList: [],
      userLikeList: [],
      userInfo: null
    }
  },
  actions: {
    //更改登陆状态
    achieveLogin(data) {
      this.loginStatus = true
      this.userInfo = data
      localStorage.setItem('zhihu-userInfo', JSON.stringify(data))
    },
    quitLogin() {
      localStorage.removeItem('zhihu-userInfo')
      localStorage.removeItem('zhihu-collectionId')
      this.loginStatus = false
      this.userLikeIdList = []
      this.userLikeList = []
      this.userInfo = null
    },
    initUser() {
      let userInfo = null,
        collectionId = []
      if (localStorage.getItem('zhihu-userInfo')) {
        userInfo = JSON.parse(localStorage.getItem('zhihu-userInfo'))
      }
      if (localStorage.getItem('zhihu-collectionId')) {
        collectionId = JSON.parse(localStorage.getItem('zhihu-collectionId'))
      }
      if (userInfo) {
        this.loginStatus = true
        this.userInfo = userInfo
        this.userLikeIdList = collectionId
      }
    }
  }
})
