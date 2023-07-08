<template>
  <div class="container">
    <header>
      <van-nav-bar title="" @click-left="this.$router.go(-1)" :fixed="true">
        <template #left>
          <div><van-icon name="arrow-left" color="#fff" />返回</div>
        </template>
      </van-nav-bar>
    </header>
    <section>
      <div v-html="news.body"></div>
      <van-back-top offset="350" />
    </section>
    <footer>
      <div v-for="item in tabbarIcons" :key="item.id"><van-icon :name="item.name" :badge="item.badge == 0 ? '' : item.badge" color="#b0352f" @click="changeTabbar(item.id)" /></div>
    </footer>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { showToast } from 'vant'
import { getNewsDetail, getNewsItemInfo } from '../request/zhihu'
import { useUserStore } from '@/stores/user.js'
import { updateCollectionAPI } from '@/request/user.js'

export default {
  setup() {
    //用户信息
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data() {
    return {
      id: 0,
      news: { body: '' },
      link: null,
      tabbarIcons: [
        { id: 0, name: 'arrow-left' },
        { id: 1, name: 'good-job-o', badge: 0 },
        { id: 2, name: 'chat-o', badge: 0 },
        { id: 3, name: 'star-o' },
        { id: 4, name: 'ellipsis' }
      ]
    }
  },

  methods: {
    handleStyle(result) {
      if (result == null) return
      let { css } = result
      if (!Array.isArray(css)) return
      css = css[0]
      if (!css) return
      // 创建<LINK>导入样式
      this.link = document.createElement('link')
      this.link.rel = 'stylesheet'
      this.link.href = css
      document.head.appendChild(this.link)
    },
    handleImage(result) {
      if (result == null) return
      let imgPlaceHolder = document.querySelector('.img-place-holder')
      imgPlaceHolder.style.height = '100%'
      imgPlaceHolder.style.display = 'flex'
      imgPlaceHolder.style.justifyContent = 'center'
      if (!imgPlaceHolder) return
      // 创建大图
      let tempImg = new Image()
      tempImg.src = result.image
      tempImg.onload = () => {
        imgPlaceHolder.appendChild(tempImg)
      }
      tempImg.onerror = () => {
        let parent = imgPlaceHolder.parentNode
        parent.parentNode.removeChild(parent)
      }
    },
    changeTabbar(id) {
      switch (id) {
        case 0:
          this.$router.back()
          break
        case 1:
          if (this.tabbarIcons[id].name === 'good-job-o') {
            this.tabbarIcons[id].badge++
            this.tabbarIcons[id].name = 'good-job'
          } else {
            this.tabbarIcons[id].badge--
            this.tabbarIcons[id].name = 'good-job-o'
          }
          break
        case 3:
          this.changeCollection()
          this.tabbarIcons[id].name = this.tabbarIcons[id].name === 'star-o' ? 'star' : 'star-o'
          break
      }
    },
    async changeCollection() {
      // 实现收藏
      if (this.userStore.userInfo) {
        let { data: res } = await updateCollectionAPI(this.userStore.userInfo.id, this.id, this.news.title, '', this.news.images[0])
        if (res.data === 1) {
          showToast({ message: '收藏成功！', position: 'bottom' })
        } else {
          showToast({ message: '取消成功！', position: 'bottom' })
        }
      }
    }
  },
  async created() {
    //获取新闻详情
    this.id = parseInt(this.$route.params.id)
    let news = await getNewsDetail(this.id)
    this.news = news
    nextTick(() => {
      this.handleStyle(news)
      this.handleImage(news)
    })
    //获取点赞评论数
    let extra = await getNewsItemInfo(this.id)
    this.tabbarIcons[1].badge = extra.popularity
    this.tabbarIcons[2].badge = extra.comments
    //检查是否已收藏
    if (this.userStore.userLikeIdList.includes(this.id)) {
      this.tabbarIcons[3].name = 'star'
    }
  },
  unmounted() {
    // 销毁组件:移除创建的样式
    if (this.link) document.head.removeChild(this.link)
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
}

footer {
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #ccc;
  div {
    font-size: 20px;
  }
}
</style>
