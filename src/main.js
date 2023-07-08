import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 公共css
import '@/assets/css/common.css'
//vant改变的css
import '@/assets/css/vantChange.less'
// 适配文件
import '@/assets/js/flexible.js'

//引入按需引入无法自动引入的样式
//Toast
import 'vant/es/toast/style'
// Notify
import 'vant/es/notify/style'

//图片懒加载
import { Lazyload } from 'vant'
import 'vant/es/toast/style'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Lazyload, {
  lazyComponent: true
})

app.mount('#app')
