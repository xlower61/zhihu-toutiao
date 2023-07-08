<template>
  <div class="container">
    <header>
      <van-nav-bar class="head" title="我的收藏" @click-left="this.$router.back()" @click-right="this.$router.push('/')" :fixed="true">
        <template #left>
          <div class="icon"><van-icon name="arrow-left" color="#fff" /></div>
        </template>
        <template #right>
          <div class="icon"><van-icon name="home-o" color="#fff" /></div>
        </template>
      </van-nav-bar>
    </header>
    <section>
      <ul v-if="!userStore.userLikeList.length == 0">
        <li v-for="item in userStore.userLikeList" :key="item.id" @click="goDetail(item.newId)">
          <div class="news-content">
            <h3 class="van-multi-ellipsis--l2">{{ item.title }}</h3>
            <i>{{ item.hint }}</i>
          </div>
          <div class="news-img">
            <img :src="item.image" alt="" />
          </div>
        </li>
      </ul>
      <div v-else class="no-collect">
        <div>暂无收藏！</div>
        <div>快去收藏吧！</div>
      </div>
    </section>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.js'
import { getAllCollectionAPI } from '@/request/user.js'
export default {
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push(`/detail/${id}`)
    }
  },
  async activated() {
    if (this.userStore.userInfo) {
      let { data: res } = await getAllCollectionAPI(this.userStore.userInfo.id)
      this.userStore.userLikeList = res.data
      let arr = []
      this.userStore.userLikeList.forEach((e) => {
        arr.push(e.newId)
      })
      localStorage.setItem('zhihu-collectionId', JSON.stringify(arr))
      this.userStore.userLikeIdList = arr
    }
  }
}
</script>

<style lang="less" scoped>
header {
  height: 60px;
  color: #fff;
  .icon {
    font-size: 24px;
    display: flex;
    align-items: center;
  }
}
section {
  position: relative;
  width: 375px;
  ul {
    li {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.0267rem solid #eee;
      height: 2.6667rem;
      width: 375px;
      padding-right: 0.2667rem;
      box-sizing: border-box;

      .news-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0.5333rem 0.6933rem 0 0.4267rem;
        box-sizing: border-box;
        width: 6.6667rem;

        h3 {
          font-size: 0.4rem;
          font-weight: 500;
          color: #666;
        }
        i {
          padding-top: 0.1333rem;
          font-size: 0.32rem;
          color: #bbb;
        }
      }
      .news-img {
        display: flex;
        align-items: center;
        img {
          width: 2.1333rem;
          height: 2.1333rem;
        }
      }
    }
  }
  .no-collect {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #ccc;
    font-size: 30px;
  }
}
</style>
