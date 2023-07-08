<template>
  <router-view #default="{ Component }">
    <keep-alive>
      <component v-if="$route.meta.live" :is="Component" :key="$route.name" />
    </keep-alive>
    <component v-if="!$route.meta.live" :is="Component" :key="$route.name" />
  </router-view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'
export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()

    return {
      userStore
    }
  },
  async created() {
    this.userStore.initUser()
  }
}
</script>

<style lang="less" scoped></style>
