import axios from 'axios'
import { closeToast } from 'vant'
import { useUserStore } from '@/stores/user.js'

// 创建并导出访问知乎的axios实例
export const zhihu = axios.create({
  baseURL: '/article' // 所有的请求地址前缀部分
})

export const needAuthorization = axios.create({
  baseURL: '/local', // 所有的请求地址前缀部分，这里跨域重写了
  timeout: 6000 // 请求超时时间毫秒
})

export const needCode = axios.create({
  baseURL: '/local', // 所有的请求地址前缀部分，这里跨域重写了
  timeout: 6000 // 请求超时时间毫秒
})
// zhihu.interceptors.request.use(
//   (config) => {
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

//处理后端返回的未授权认证错误
zhihu.interceptors.response.use(
  function (response) {
    //只返回response的data部分
    closeToast()
    return response.data
  },
  function (error) {
    //对请求错误进行处理
    closeToast()
    return Promise.reject(error)
  }
)

//添加token
needAuthorization.interceptors.request.use(
  function (config) {
    let token

    if (localStorage.getItem('zhihu-userInfo')) {
      token = JSON.parse(localStorage.getItem('zhihu-userInfo')).token
    }
    config.headers.Authorization = token ? `${token}` : ''
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

needAuthorization.interceptors.response.use(
  (response) => {
    let userStore = useUserStore()
    if (response.data.msg == 'token error or expired') {
      localStorage.removeItem('zhihu-userInfo')
      localStorage.removeItem('zhihu-collectionId')
      userStore.userInfo = {}
      userStore.userLikeIdList = []
    }
    return response
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error)
  }
)
