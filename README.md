npm init vue@latest
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes

yarn add less
yarn add axios
yarn add  ant-design-vue



解决跨域问题cors
request.js
// 创建一个 axios 实例
const service = axios.create({
	// baseURL: 'https://news-at.zhihu.com/api/4', // 所有的请求地址前缀部分
	timeout: 6000, // 请求超时时间毫秒
})

vite.config.js
  //https://juejin.cn/post/7170952274045304868
  server:{
    proxy:{
       '/api':{
           target:"https://news-at.zhihu.com/api/4", //跨域地址
           changeOrigin:true, //支持跨域
           rewrite:(path) => path.replace(/^\/api/, "")//重写路径,替换/api
       }
    }
 }

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

https://www.antdv.com/components/overview

