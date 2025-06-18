<template>
  <div class="user-dashboard">
    <!-- 欢迎信息 -->
    <div class="welcome-section">
      <el-card class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ userInfo?.username }}！</h2>
            <p>享受您的绿色智能船艇之旅</p>
          </div>
          <div class="welcome-actions">
            <el-button type="primary" @click="$router.push('/user/boats')">
              <ship theme="outline" size="16" />
              立即预订
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon pending">
                <schedule theme="outline" size="24" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.pending }}</div>
                <div class="stat-label">待确认预约</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon confirmed">
                <check-one theme="outline" size="24" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.confirmed }}</div>
                <div class="stat-label">已确认预约</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon completed">
                <check-correct theme="outline" size="24" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.completed }}</div>
                <div class="stat-label">已完成</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon total">
                <list theme="outline" size="24" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.total }}</div>
                <div class="stat-label">总预约数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 最近预约 -->
    <div class="recent-section">
      <el-card>
        <template #header>
          <div class="section-header">
            <h3>最近预约</h3>
            <el-button text @click="$router.push('/user/bookings')"> 查看全部 </el-button>
          </div>
        </template>

        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>

        <div v-else-if="recentBookings.length === 0" class="empty-container">
          <el-empty description="暂无预约记录">
            <el-button type="primary" @click="$router.push('/user/boats')"> 立即预订 </el-button>
          </el-empty>
        </div>

        <div v-else class="bookings-list">
          <div v-for="booking in recentBookings" :key="booking.id" class="booking-item">
            <div class="booking-info">
              <div class="boat-info">
                <h4>{{ booking.boat_name }}</h4>
                <p class="booking-time">
                  {{ formatDateTime(booking.start_time) }} - {{ formatDateTime(booking.end_time) }}
                </p>
              </div>
              <div class="booking-details">
                <span class="passenger-count">{{ booking.passenger_count }}人</span>
                <el-tag :type="getStatusType(booking.status)" size="small">
                  {{ getStatusText(booking.status) }}
                </el-tag>
                <span class="booking-fee">¥{{ booking.total_amount }}</span>
              </div>
            </div>
            <div class="booking-actions">
              <el-button text size="small" @click="viewBookingDetail(booking.id)">
                查看详情
              </el-button>
              <el-button
                v-if="booking.status === 'pending' || booking.status === 'confirmed'"
                text
                type="danger"
                size="small"
                @click="cancelBooking(booking.id)"
              >
                取消预约
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-card>
        <template #header>
          <h3>快捷操作</h3>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="action-item" @click="$router.push('/user/boats')">
              <ship theme="outline" size="32" />
              <span>船舶预订</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="action-item" @click="$router.push('/user/bookings')">
              <list theme="outline" size="32" />
              <span>我的预约</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="action-item" @click="$router.push('/user/profile')">
              <user theme="outline" size="32" />
              <span>个人中心</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="action-item" @click="$router.push('/user/products')">
              <shopping-cart theme="outline" size="32" />
              <span>农产品采购</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Ship,
  Schedule,
  CheckOne,
  CheckCorrect,
  List,
  User,
  ShoppingCart,
} from '@icon-park/vue-next'
import { useAuthStore } from '@/stores/auth'
import {
  getMyBookingsApiV1BookingsMyGet,
  cancelBookingApiV1BookingsBookingIdCancelPatch,
} from '@/services/api/bookings'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(true)
const recentBookings = ref<API.BookingListItemSchema[]>([])
const stats = ref({
  pending: 0,
  confirmed: 0,
  completed: 0,
  total: 0,
})

// 计算属性
const userInfo = computed(() => authStore.user)

// 获取最近预约
const fetchRecentBookings = async () => {
  try {
    loading.value = true
    const response = await getMyBookingsApiV1BookingsMyGet({
      page: 1,
      page_size: 5,
    })

    if (response.data?.success && response.data.data) {
      recentBookings.value = response.data.data.items || []

      // 计算统计数据
      const allBookingsResponse = await getMyBookingsApiV1BookingsMyGet({
        page: 1,
        page_size: 1000,
      })

      if (allBookingsResponse.data?.success && allBookingsResponse.data.data) {
        const allBookings = allBookingsResponse.data.data.items || []
        stats.value = {
          pending: allBookings.filter((b) => b.status === 'pending').length,
          confirmed: allBookings.filter((b) => b.status === 'confirmed').length,
          completed: allBookings.filter((b) => b.status === 'completed').length,
          total: allBookings.length,
        }
      }
    }
  } catch (error) {
    console.error('获取预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    in_progress: 'primary',
    completed: 'info',
    cancelled: 'info',
    rejected: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    rejected: '已拒绝',
  }
  return statusMap[status] || status
}

// 查看预约详情
const viewBookingDetail = (bookingId: number) => {
  router.push(`/user/bookings/${bookingId}`)
}

// 取消预约
const cancelBooking = async (bookingId: number) => {
  try {
    await ElMessageBox.confirm('确定要取消这个预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await cancelBookingApiV1BookingsBookingIdCancelPatch(
      {
        booking_id: bookingId,
      },
      null,
    )

    ElMessage.success('预约已取消')
    await fetchRecentBookings()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消预约失败:', error)
      ElMessage.error(error.response?.data?.message || '取消预约失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchRecentBookings()
})
</script>

<style scoped>
.user-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  color: white;
}

.welcome-card :deep(.el-card__body) {
  padding: 32px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.welcome-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.welcome-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.welcome-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.stats-section {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.pending {
  background: #faad14;
}

.stat-icon.confirmed {
  background: #52c41a;
}

.stat-icon.completed {
  background: #1890ff;
}

.stat-icon.total {
  background: #722ed1;
}

.stat-info {
  text-align: left;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.recent-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.loading-container,
.empty-container {
  padding: 40px 0;
}

.bookings-list {
  space-y: 16px;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;
}

.booking-item:hover {
  background: #fafafa;
  border-color: #d9d9d9;
}

.booking-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.boat-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.booking-time {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.booking-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.passenger-count {
  color: #666;
  font-size: 14px;
}

.booking-fee {
  font-size: 16px;
  font-weight: 600;
  color: #f56565;
}

.booking-actions {
  display: flex;
  gap: 8px;
}

.quick-actions {
  margin-bottom: 24px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background: #fafafa;
  border-color: #1890ff;
  color: #1890ff;
}

.action-item span {
  font-size: 14px;
  font-weight: 500;
}
</style>
