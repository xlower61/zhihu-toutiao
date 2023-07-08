import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default {
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //https://juejin.cn/post/7170952274045304868
  server: {
    proxy: {
      '/local': {
        target: 'http://localhost:8080',
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/local/, '') //重写路径,替换/local为/
      },
      //代理/article接口,有这个接口就地址转换将localhost转为这个
      '/article': {
        target: 'https://news-at.zhihu.com/api/4', //跨域地址
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/article/, '') //重写路径,替换/article为/
        //即/article/news/latest  =https://news-at.zhihu.com/api/4/news/latest
      }
    }
  }
}
