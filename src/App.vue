<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { connectWebSocket, disconnectWebSocket } from '@/utils/websocket'

const authStore = useAuthStore()

// 监听登录状态变化
watch(() => authStore.token, (newToken) => {
  if (newToken) {
    // 登录后连接WebSocket
    connectWebSocket(newToken)
  } else {
    // 登出后断开WebSocket
    disconnectWebSocket()
  }
}, { immediate: true })

onMounted(() => {
  // 如果已登录，连接WebSocket
  if (authStore.token) {
    connectWebSocket(authStore.token)
  }
})

onUnmounted(() => {
  // 组件卸载时断开WebSocket
  disconnectWebSocket()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
