<template>
  <div class="mine container">
    <header>
      <van-nav-bar title="我的" @click-left="this.$router.push('/')" :fixed="true">
        <template #left>
          <div><van-icon name="arrow-left" color="#fff" />返回</div>
        </template>
      </van-nav-bar>
    </header>
    <section>
      <div class="headImg" @click="showPopup">
        <div v-if="!userStore.loginStatus">
          <img src="@/assets/images/loginPlease.png" alt="" />
          <div class="name">请先登录！</div>
        </div>
        <div v-else>
          <img :src="userStore.userInfo.image" alt="" />
          <div class="name">{{ userStore.userInfo.username }}</div>
        </div>
      </div>
      <van-popup v-model:show="show" position="bottom" :round="true">
        <div class="img-choice">
          <ul>
            <li><span>拍照</span></li>
            <li>
              <van-uploader :before-read="beforeRead">
                <span>从相册中选择</span>
              </van-uploader>
            </li>
            <li class="li-margin" @click="show = false"><span>取消</span></li>
          </ul>
        </div>
      </van-popup>
      <van-popup class="bg-tran" v-model:show="showCropper" closeable position="top" :style="{ height: '100%' }">
        <div class="flex-column-center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :full="option.full"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :high="option.high"
            :mode="option.mode"
          >
          </vueCropper>

          <div class="img-in-choice">
            <ul>
              <li @click="cancelCropper">取消</li>
              <li class="rotate" @click="rotateImage"><van-icon name="replay" /></li>
              <li @click="getCropUp">确定</li>
            </ul>
          </div>
        </div>
      </van-popup>
      <div class="mine-choice" v-if="userStore.loginStatus">
        <ul>
          <li @click="goCollection">
            <div>我的收藏</div>
            <van-icon name="arrow" />
          </li>
          <li @click="changeColor">
            <div>{{ bgc.text }}</div>
            <van-icon name="arrow" />
          </li>
          <li @click="quit">
            <div>退出登录</div>
            <van-icon name="arrow" />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { showToast, showNotify } from 'vant'
import { upLoadImgAPI } from '@/request/user.js'
import { useUserStore } from '@/stores/user.js'
//引入图片上传修建插件VueCropper
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
//引入图片上传修建插件VueCropper

export default {
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  components: { VueCropper },
  data() {
    return {
      show: false,
      showCropper: false,
      imageAccept: '/jpg,/png,/jpeg',
      imageFileName: '',
      //VueCropper选项配置
      option: {
        img: '',
        outputSize: 0.8,
        info: false, // 裁剪框的大小信息
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: '150px', // 默认生成截图框宽度
        autoCropHeight: '150px', // 默认生成截图框高度
        high: true, // 是否按照设备的dpr 输出等比例图片
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        mode: '100% auto', // 图片默认渲染方式,
        canMove: false
      },
      file: '',
      bgc: {
        color: '#111',
        text: '深色模式'
      }
    }
  },
  methods: {
    changeColor() {
      const root = document.querySelector(':root')
      if (this.bgc.text === '深色模式') {
        this.bgc.text = '正常模式'
        root.style.setProperty('--bgc', this.bgc.color)
      } else {
        this.bgc.text = '深色模式'
        root.style.setProperty('--bgc', '#b0352f')
      }
    },
    goCollection() {
      this.$router.push('/collection')
    },
    showPopup() {
      if (!this.userStore.loginStatus) {
        showToast('请先登录!')
        this.$router.push('/login')
        return
      }
      this.show = !this.show
    },
    // 将本地图片转化为Base64，否则vue-cropper组件显示不出要本地需要剪裁的图片
    imageToBase64(file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // 截图框中的图片
        this.option.img = reader.result
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },
    // 获取文件后缀
    getFileSuffix(fileName) {
      return fileName.match(/\/\w+$/)[0].toLowerCase()
    },
    // 选择图片上传前操作，调起剪裁组件
    beforeRead(file) {
      if (file.size > 3 * 1024 * 1024) {
        return showToast('图片不能大于3M')
      }
      if (!this.imageAccept.includes(this.getFileSuffix(file.type))) {
        return showToast('请上传 jpg/jpeg/png 格式图片')
      }
      this.show = false
      this.showCropper = true
      this.imageFileName = file.name
      // 本地图片转成base64，用于截图框显示本地图片
      this.imageToBase64(file)
    },
    // 旋转图片
    rotateImage() {
      this.$refs.cropper.rotateRight()
    },
    // 取消截图上传头像
    cancelCropper() {
      this.showCropper = false // 隐藏切图遮罩
      this.show = true
    },

    // 确认剪裁并上传图片
    getCropUp() {
      let formData = new FormData()
      this.$refs.cropper.getCropBlob(async (data) => {
        formData.append('image', data, this.imageFileName)
        formData.append('id', this.userStore.userInfo.id)
        showNotify({ message: '正在上传！', color: '#b0352f', background: '#f5f5f5', position: 'bottom', duration: 700 })
        let { data: res } = await upLoadImgAPI(formData)
        if (res.code === 1) {
          this.userStore.userInfo.image = res.data
          localStorage.setItem('zhihu-userInfo', JSON.stringify(this.userStore.userInfo))
        } else {
          showToast({ message: res.msg, position: 'bottom' })
          this.userStore.quitLogin()
        }
      })

      this.showCropper = false // 隐藏切图遮罩
    },
    quit() {
      this.userStore.quitLogin()
      showToast({ message: '已退出登录！', position: 'bottom' })
      this.$router.push('/login')
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
}
section {
  .headImg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 200px;
    background-color: var(--bgc);
    color: #fff;
    padding: 10px;
    font-size: 18px;
  }
  .name {
    margin-top: 10px;
    text-align: center;
  }
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .img-choice {
    ul {
      background-color: #f5f5f5;
      .li-margin {
        margin-top: 10px;
      }
      li {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #ddd;
        padding: 13px;

        span {
          text-align: center;
          width: 100%;
          font-size: 16px;
          padding: 0 10px;
        }
      }
    }
  }
  .mine-choice {
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        font-size: 16px;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
      }
    }
  }
}
.flex-column-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .vue-cropper {
    flex: 1;
    background: #000;
    .cropper-view-box {
      outline: 1px solid #fff !important;
      outline-color: #fff !important;
    }
  }
  .img-in-choice {
    width: 100%;
    font-size: 16px;
    ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rotate {
        font-size: 25px;
      }
      li {
        text-align: center;
        border-bottom: 1px solid #eee;
        padding: 20px;
      }
    }
  }
}
</style>
