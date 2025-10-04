import { ref } from 'vue'
import { ElNotification } from 'element-plus'

// WebSocket连接状态
export const wsConnected = ref(false)
// 实时通知列表
export const realtimeNotifications = ref<any[]>([])
// 未读数量
export const unreadCount = ref(0)

let ws: WebSocket | null = null
let reconnectTimer: number | null = null
let heartbeatTimer: number | null = null

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1/notifications/ws'

/**
 * 连接WebSocket
 */
export function connectWebSocket(token: string) {
  if (!token) {
    console.warn('WebSocket: Token为空，无法连接')
    return
  }

  // 关闭已有连接
  if (ws) {
    ws.close()
  }

  try {
    ws = new WebSocket(`${WS_URL}?token=${token}`)

    ws.onopen = () => {
      console.log('✅ WebSocket已连接')
      wsConnected.value = true
      
      // 清除重连定时器
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }

      // 启动心跳
      startHeartbeat()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // 心跳响应
        if (event.data === 'pong') {
          return
        }

        // 连接成功消息
        if (data.type === 'connection') {
          console.log('WebSocket连接成功:', data.data.message)
          return
        }

        // 通知消息
        if (data.type === 'notification') {
          handleNotification(data.data)
        }
      } catch (error) {
        console.error('WebSocket消息解析失败:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('❌ WebSocket错误:', error)
      wsConnected.value = false
    }

    ws.onclose = () => {
      console.log('🔌 WebSocket已断开')
      wsConnected.value = false
      stopHeartbeat()

      // 3秒后尝试重连
      reconnectTimer = window.setTimeout(() => {
        console.log('🔄 尝试重新连接WebSocket...')
        connectWebSocket(token)
      }, 3000)
    }
  } catch (error) {
    console.error('WebSocket连接失败:', error)
  }
}

/**
 * 断开WebSocket连接
 */
export function disconnectWebSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  
  stopHeartbeat()

  if (ws) {
    ws.close()
    ws = null
  }

  wsConnected.value = false
  console.log('WebSocket已主动断开')
}

/**
 * 启动心跳
 */
function startHeartbeat() {
  stopHeartbeat()
  
  heartbeatTimer = window.setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send('ping')
    }
  }, 30000) // 30秒一次心跳
}

/**
 * 停止心跳
 */
function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

/**
 * 处理收到的通知
 */
function handleNotification(notification: any) {
  // 添加到实时通知列表
  realtimeNotifications.value.unshift(notification)
  
  // 增加未读数量
  unreadCount.value++

  // 显示桌面通知
  showDesktopNotification(notification)
}

/**
 * 显示桌面通知
 */
function showDesktopNotification(notification: any) {
  const typeMap: Record<string, any> = {
    booking_created: { type: 'info', icon: '📅' },
    booking_confirmed: { type: 'success', icon: '✅' },
    booking_cancelled: { type: 'warning', icon: '❌' },
    booking_completed: { type: 'success', icon: '🎉' },
    order_created: { type: 'info', icon: '🛒' },
    order_paid: { type: 'success', icon: '💰' },
    order_shipped: { type: 'info', icon: '📦' },
    order_delivered: { type: 'success', icon: '🚚' },
    crew_assigned: { type: 'info', icon: '👨‍✈️' },
    review_received: { type: 'info', icon: '⭐' },
    system_notice: { type: 'warning', icon: '📢' }
  }

  const config = typeMap[notification.notification_type] || { type: 'info', icon: '📬' }

  ElNotification({
    title: `${config.icon} ${notification.title}`,
    message: notification.content,
    type: config.type as any,
    duration: 4500,
    position: 'top-right'
  })
}

/**
 * 清除未读数量
 */
export function clearUnreadCount() {
  unreadCount.value = 0
}

