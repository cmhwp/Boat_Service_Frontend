import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
    getNotificationsApiV1NotificationsGet,
    markNotificationsAsReadApiV1NotificationsMarkReadPost,
    markAllNotificationsAsReadApiV1NotificationsMarkAllReadPost,
    getNotificationStatsApiV1NotificationsStatsGet,
    deleteNotificationApiV1NotificationsNotificationIdDelete
} from '@/services/api/tongzhiguanli'

// 定义通知接口
interface Notification {
  id: number
  user_id: number
  notification_type: string
  title: string
  content: string
  related_id?: number | null
  status: 'read' | 'unread'
  created_at: string
  read_at?: string | null
}

export const useNotificationStore = defineStore('notification', () => {
  // 通知列表
  const notifications = ref<Notification[]>([])
  // 未读数量
  const unreadCount = ref(0)
  // 总数量
  const totalCount = ref(0)
  // 加载状态
  const loading = ref(false)

  /**
   * 加载通知列表
   */
  async function loadNotifications(params?: any) {
    loading.value = true
    try {   
      const res = await getNotificationsApiV1NotificationsGet(params)
      if (res.data) {
        notifications.value = res.data.data.items || []
        totalCount.value = res.data.data.total || 0
      }
    } catch (error) {
      console.error('加载通知列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载通知统计
   */
  async function loadStats() {
    try {
      const res = await getNotificationStatsApiV1NotificationsStatsGet()
      if (res.data) {
        unreadCount.value = res.data.data.unread_count || 0
        totalCount.value = res.data.data.total_count || 0
      }
    } catch (error) {
      console.error('加载通知统计失败:', error)
    }
  }

  /**
   * 标记为已读
   */
  async function markAsRead(notificationIds: number[]) {
    try {
      await markNotificationsAsReadApiV1NotificationsMarkReadPost({ notification_ids: notificationIds })
      // 更新本地状态
      notifications.value.forEach((n: Notification) => {
        if (notificationIds.includes(n.id)) {
          n.status = 'read'
          if (unreadCount.value > 0) {
            unreadCount.value--
          }
        }
      })
    } catch (error) {
      console.error('标记已读失败:', error)
      throw error
    }
  }

  /**
   * 全部标记为已读
   */
  async function markAllAsRead() {
    try {
      await markAllNotificationsAsReadApiV1NotificationsMarkAllReadPost()
      // 更新本地状态
      notifications.value.forEach((n: Notification) => {
        n.status = 'read'
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('全部标记已读失败:', error)
      throw error
    }
  }

  /**
   * 删除通知
   */
  async function deleteNotification(notificationId: number) {
    try {
      await deleteNotificationApiV1NotificationsNotificationIdDelete({ notification_id: notificationId })
      // 从列表中移除
      const index = notifications.value.findIndex((n: Notification) => n.id === notificationId)
      if (index > -1) {
        const notification = notifications.value[index]
        notifications.value.splice(index, 1)
        totalCount.value--
        
        if (notification.status === 'unread' && unreadCount.value > 0) {
          unreadCount.value--
        }
      }
    } catch (error) {
      console.error('删除通知失败:', error)
      throw error
    }
  }

  return {
    notifications,
    unreadCount,
    totalCount,
    loading,
    loadNotifications,
    loadStats,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
})

