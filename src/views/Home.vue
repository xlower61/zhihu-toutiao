<template>
  <div class="container">
    <!-- 导航栏 -->
    <header>
      <van-nav-bar title="知乎日报" :fixed="true">
        <template #left>
          <div class="today">
            <div>
              <p>{{ today.date }}</p>
              <p>{{ today.month }}</p>
            </div>
            <div class="right-line"></div>
          </div>
        </template>
        <template #right>
          <div class="headImg" @click="goNext">
            <img v-if="!userStore.loginStatus" src="@/assets/images/loginPlease.png" alt="" />
            <img v-else :src="userStore.userInfo.image" alt="" />
          </div>
        </template>
      </van-nav-bar>
    </header>

    <section ref="stn">
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in top_stories" :key="item.id">
          <div class="swiper">
            <img v-lazy="item.image" @click="goDetail(item.id)" />
            <div class="info">
              <h3>{{ item.title }}</h3>
              <div class="hint">{{ item.hint }}</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <!-- 新闻列表 -->
      <van-list offset="100" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="news_list.length > 0">
        <van-cell v-for="(itemO, index) in news_list" :key="itemO.date">
          <van-divider class="date" :style="{ color: '#b0352f', borderColor: '#b0352f', padding: '0 16px' }"> {{ itemO.date }} </van-divider>

          <div class="list" v-for="item in itemO.stories" :key="item.id" @click="goDetail(item.id)">
            <div class="left">
              <div>
                <!-- 超过两行就... -->
                <div class="van-multi-ellipsis--l2 title">{{ item.title }}</div>
                <div class="hint">{{ item.hint }}</div>
              </div>
              <div class="icon">
                <span><van-icon name="chat-o" :badge="item.comments == 0 ? '' : item.comments" /></span>
                <span><van-icon name="good-job-o" :badge="item.popularity" /></span>
                <span @click.stop="changeCollection(index, item)"><van-icon :name="item.type ? 'star' : 'star-o'" :class="{ active: item.type }" /></span>
              </div>
            </div>
            <div class="right">
              <!-- 在 Vue 中,使用 :src 或 v-bind:src 绑定图片 URL 时,如果绑定的值是数组,Vue 会自动取数组的第一项作为图片的 src。 -->
              <!-- 而这里刚好就是数组 -->
              <img v-lazy="item.images[0]" alt="" />
            </div>
          </div>
        </van-cell>
        <!-- 缓存后，vant的返回顶部会在后面页面存在 -->
        <van-back-top offset="350" v-if="hide" />
      </van-list>
    </section>
  </div>
</template>

<script>
// 鲁大师 提供了许多函数 节流的函数、防抖的函数、操作数组的一系列函数、操作对象的一系列函数（对象的深拷贝、浅拷贝）
import _ from 'lodash'
import { updateCollectionAPI, getAllCollectionIdAPI } from '@/request/user.js'
import { getLastestNews, getBeforeNews, getNewsItemInfo } from '@/request/zhihu.js'
import { useUserStore } from '@/stores/user.js'
import { showToast } from 'vant'
let fn = null
export default {
  setup() {
    //选项
    const actions = [{ text: '个人中心' }, { text: '我的收藏' }, { text: '退出登录' }]
    //用户信息
    const userStore = useUserStore()
    return {
      actions,
      userStore
    }
  },
  data() {
    return {
      //新闻列表
      home: true,
      news_list: [],
      top_stories: [],
      //底部加载
      loading: false,
      finished: false,
      //日期
      today: {
        date: '',
        month: '',
        arr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      },
      //回到顶部，因为缓存，要自己关
      hide: true,
      //第一次进入，需要请求数据
      firstIn: true,
      //记录滚动条位置
      scrlloToY: 0
    }
  },
  methods: {
    goDetail(id) {
      this.hide = false
      this.$router.push(`/detail/${id}`)
    },
    //没登陆点击头像位置，前往登陆页面
    goNext() {
      if (this.userStore.loginStatus) {
        this.$router.push('/mine')
      } else {
        this.$router.push('/login')
      }
    },
    //实现局部检查是否收藏了，收藏了type改为1，根据判断给收藏样式
    //并请求获取评论数和点赞数
    showItemInfo(pageId, change) {
      this.news_list[pageId].stories.forEach(async (eo) => {
        if (this.userStore.userLikeIdList.includes(eo.id)) {
          eo.type = 1
        } else {
          eo.type = 0
        }
        //如果是加入收藏那边过来的，就说明这边加载好了，不用请求评论和点赞数
        //不是，则请求
        if (!change) {
          let extra = await getNewsItemInfo(eo.id)
          eo.comments = extra.comments
          eo.popularity = extra.popularity
        }
      })
    },
    //添加或取消收藏
    async changeCollection(index, item) {
      if (!this.userStore.loginStatus) {
        showToast({
          message: '请登录！',
          position: 'bottom'
        })
        this.$router.push('/login')
        return
      }
      let { data: res } = await updateCollectionAPI(this.userStore.userInfo.id, item.id, item.title, item.hint, item.images[0])
      if (res.code === 1) {
        if (res.data === 1) {
          this.userStore.userLikeIdList.push(item.id)
          showToast({ message: '收藏成功！', position: 'bottom' })
        } else {
          showToast({ message: '取消成功！', position: 'bottom' })
          this.userStore.userLikeIdList = this.userStore.userLikeIdList.filter((e) => {
            return e !== item.id
          })
        }
      }
      this.showItemInfo(index, 1)
    },
    //到底部，继续加载
    async onLoad() {
      if (this.news_list[this.news_list.length - 1].date) {
        let date = this.news_list[this.news_list.length - 1].date
        let res = await getBeforeNews(date)
        this.news_list.push(res)
        this.showItemInfo(this.news_list.length - 1)
      }
      this.loading = false
    },
    //记录滚动条位置，使用lodsh的防抖，50毫秒
    recordTopHandler() {
      return _.debounce(
        () => {
          this.scrlloToY = this.$refs.stn.scrollTop
        },
        50,
        { trailing: true }
      )
    }
  },

  //创建时发送请求获取新闻
  async activated() {
    //回到进度条位置
    this.$refs.stn.scrollTo(0, this.scrlloToY)
    //开启防抖记录滚动位置
    fn = this.recordTopHandler()
    this.$refs.stn.addEventListener('scroll', fn)
    //请求知乎新闻，并设置日期，节流阀
    if (this.firstIn) {
      let now = new Date()
      this.today.date = now.getDate()
      this.today.month = this.today.arr[now.getMonth()]
      // showLoadingToast({ message: '加载中...', forbidClick: true })
      let { date, stories, top_stories } = await getLastestNews()
      this.top_stories = top_stories
      this.news_list.push({ date, stories })
    }
    //获取收藏列表各新闻id
    if (this.userStore.userInfo) {
      let { data: res } = await getAllCollectionIdAPI(this.userStore.userInfo.id)
      localStorage.setItem('zhihu-collectionId', [])
      if (res.data) {
        localStorage.setItem('zhihu-collectionId', JSON.stringify(res.data))
      }

      this.userStore.userLikeIdList = res.data
    }
    //遍历收藏
    for (let index = 0; index < this.news_list.length; index++) {
      //第一次就要获取点赞数和评论数，后面就不用，随着加载更多获取就行了
      if (this.firstIn) {
        this.showItemInfo(index)
      } else {
        this.showItemInfo(index, 1)
      }
    }
    //恢复回到顶部
    this.hide = true
  },
  deactivated() {
    //取消第一次进入标签
    this.firstIn = false
    //销毁防抖记录滚动位置
    this.$refs.stn.removeEventListener('scroll', fn)
  }
}
</script>

<style lang="less" scoped>
header {
  height: 60px;
  color: #fff;
  .today {
    height: 60px;
    display: flex;
    align-items: center;
    p {
      margin: -4px 0;
      color: #fff;
      &:first-child {
        font-size: 20px;
      }
    }
    .right-line {
      height: 60%;
      padding-right: 20px;
      border-right: 1px solid #ccc;
    }
  }
  .headImg {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
section {
  .my-swipe .van-swipe-item {
    .swiper {
      position: relative;
      img {
        width: 10rem;
        height: 8rem;
      }
      .info {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 0;
        bottom: 24px;
        padding-left: 16px;
        h3 {
          width: 95%;
          color: #eee;
          font-size: 20px;
        }
        .hint {
          color: #ccc;
          font-size: 14px;
        }
      }
    }
  }
  .date {
    font-size: 16px;
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 110px;
    border-bottom: 1px solid #eee;
    .left {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 16px;
      height: 95px;
      .title {
        color: #666;
        font-size: 15px;
      }
      .hint {
        font-size: 11px;
      }
      .icon {
        span {
          font-size: 22px;
          margin-right: 16px;
        }
      }
      .active {
        color: red;
      }
    }
    .right {
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
