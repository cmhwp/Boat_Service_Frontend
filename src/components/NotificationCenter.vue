<template>
  <el-popover
    placement="bottom"
    :width="420"
    trigger="click"
    @show="handleShow"
  >
    <template #reference>
      <el-badge :value="displayUnreadCount" :hidden="displayUnreadCount === 0" class="notification-badge">
        <el-button :icon="Bell" circle />
      </el-badge>
    </template>

    <div class="notification-center">
      <!-- 头部 -->
      <div class="notification-header">
        <span class="title">通知中心</span>
        <el-button
          v-if="notificationStore.unreadCount > 0"
          text
          type="primary"
          size="small"
          @click="handleMarkAllRead"
        >
          全部已读
        </el-button>
      </div>

      <!-- 通知列表 -->
      <el-scrollbar max-height="400px">
        <div v-if="notificationStore.loading" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>

        <div v-else-if="notificationStore.notifications.length === 0" class="empty-container">
          <el-empty description="暂无通知" :image-size="80" />
        </div>

        <div v-else class="notification-list">
          <div
            v-for="notification in notificationStore.notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: notification.status === 'unread' }"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon">
              <el-icon :size="20">
                <component :is="getNotificationIcon(notification.notification_type)" />
              </el-icon>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.content }}</div>
              <div class="notification-time">{{ formatTime(notification.created_at) }}</div>
            </div>
            <div class="notification-actions">
              <el-button
                v-if="notification.status === 'unread'"
                text
                type="primary"
                size="small"
                @click.stop="handleMarkRead(notification)"
              >
                已读
              </el-button>
              <el-button
                text
                type="danger"
                size="small"
                @click.stop="handleDelete(notification)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <!-- 底部 -->
      <div v-if="notificationStore.totalCount > 0" class="notification-footer">
        <el-button text type="primary" @click="handleViewAll">
          查看全部 ({{ notificationStore.totalCount }})
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bell, Loading, MessageBox, ShoppingCart, Calendar, StarFilled, Bell as BellIcon } from '@element-plus/icons-vue'
import { useNotificationStore } from '@/stores/notification'
import { realtimeNotifications, unreadCount as wsUnreadCount, clearUnreadCount } from '@/utils/websocket'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const router = useRouter()
const notificationStore = useNotificationStore()

// 显示的未读数量（WebSocket + Store）
const displayUnreadCount = computed(() => {
  return wsUnreadCount.value + notificationStore.unreadCount
})

// 监听WebSocket实时通知
watch(realtimeNotifications, (newNotifications) => {
  if (newNotifications.length > 0) {
    // 将WebSocket通知合并到store
    notificationStore.notifications.unshift(...newNotifications)
    // 清空WebSocket通知列表
    realtimeNotifications.value = []
  }
})

onMounted(() => {
  loadData()
})

function handleShow() {
  loadData()
}

async function loadData() {
  await Promise.all([
    notificationStore.loadNotifications({ page: 1, page_size: 20 }),
    notificationStore.loadStats()
  ])
  // 清除WebSocket未读数
  clearUnreadCount()
}

async function handleMarkRead(notification: any) {
  try {
    await notificationStore.markAsRead([notification.id])
    ElMessage.success('已标记为已读')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

async function handleMarkAllRead() {
  try {
    await notificationStore.markAllAsRead()
    ElMessage.success('已全部标记为已读')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

async function handleDelete(notification: any) {
  try {
    await ElMessageBox.confirm('确定要删除此通知吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await notificationStore.deleteNotification(notification.id)
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消
  }
}

function handleNotificationClick(notification: any) {
  // 标记为已读
  if (notification.status === 'unread') {
    handleMarkRead(notification)
  }

  // 根据通知类型跳转
  const type = notification.notification_type
  const id = notification.related_id

  if (type.includes('booking') && id) {
    router.push(`/user/bookings/${id}`)
  } else if (type.includes('order') && id) {
    router.push(`/user/orders/${id}`)
  }
}

function handleViewAll() {
  router.push('/user/notifications')
}

function getNotificationIcon(type: string) {
  const iconMap: Record<string, any> = {
    booking_created: Calendar,
    booking_confirmed: Calendar,
    booking_cancelled: Calendar,
    booking_completed: Calendar,
    order_created: ShoppingCart,
    order_paid: ShoppingCart,
    order_shipped: ShoppingCart,
    order_delivered: ShoppingCart,
    crew_assigned: MessageBox,
    review_received: StarFilled,
    system_notice: BellIcon
  }
  return iconMap[type] || BellIcon
}

function formatTime(time: string) {
  try {
    return formatDistanceToNow(new Date(time), {
      addSuffix: true,
      locale: zhCN
    })
  } catch {
    return time
  }
}
</script>

<style scoped>
.notification-badge {
  cursor: pointer;
}

.notification-center {
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.notification-header .title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: var(--el-text-color-secondary);
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notification-item:hover {
  background-color: var(--el-fill-color-light);
}

.notification-item.unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-item.unread:hover {
  background-color: var(--el-color-primary-light-8);
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.notification-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color);
  text-align: center;
}
</style>

