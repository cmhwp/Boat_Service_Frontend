<template>
  <div class="booking-detail-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="!booking" class="error-container">
      <el-result icon="warning" title="预约不存在" sub-title="抱歉，您查看的预约不存在或已被删除">
        <template #extra>
          <el-button type="primary" @click="$router.push('/user/bookings')">
            返回预约列表
          </el-button>
        </template>
      </el-result>
    </div>

    <div v-else class="booking-detail-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/user/bookings' }">我的预约</el-breadcrumb-item>
        <el-breadcrumb-item>预约详情</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 预约状态头部 -->
      <el-alert
        :title="getStatusTitle(booking.status)"
        :type="getStatusAlertType(booking.status)"
        :description="getStatusDescription(booking.status)"
        show-icon
        :closable="false"
        class="status-alert"
      />

      <el-row :gutter="32">
        <!-- 左侧主要内容 -->
        <el-col :span="16">
          <!-- 预约基本信息 -->
          <el-card class="booking-info-card">
            <template #header>
              <div class="card-header">
                <h2>预约信息</h2>
                <el-tag :type="getStatusType(booking.status)" size="large">
                  {{ getStatusText(booking.status) }}
                </el-tag>
              </div>
            </template>

            <div class="info-grid">
              <div class="info-section">
                <h3>预约详情</h3>
                <div class="info-item">
                  <label>预约号：</label>
                  <span class="booking-id">{{ booking.booking_number }}</span>
                </div>
                <div class="info-item">
                  <label>预约时间：</label>
                  <span
                    >{{ formatDateTime(booking.start_time) }} -
                    {{ formatDateTime(booking.end_time) }}</span
                  >
                </div>
                <div class="info-item">
                  <label>乘客人数：</label>
                  <span>{{ booking.passenger_count }} 人</span>
                </div>
                <div class="info-item">
                  <label>创建时间：</label>
                  <span>{{ formatDateTime(booking.created_at) }}</span>
                </div>
                <div class="info-item">
                  <label>预约费用：</label>
                  <span class="fee-amount">¥{{ booking.total_amount }}</span>
                </div>
              </div>

              <div class="info-section">
                <h3>联系信息</h3>
                <div class="info-item">
                  <label>联系人：</label>
                  <span>{{ booking.contact_name }}</span>
                </div>
                <div class="info-item">
                  <label>联系电话：</label>
                  <span>{{ booking.contact_phone }}</span>
                </div>
              </div>
            </div>

            <!-- 备注信息 -->
            <div
              v-if="booking.user_notes || booking.merchant_notes || booking.cancel_reason"
              class="notes-section"
            >
              <h3>备注信息</h3>
              <div v-if="booking.user_notes" class="note-item">
                <label>我的备注：</label>
                <p>{{ booking.user_notes }}</p>
              </div>
              <div v-if="booking.merchant_notes" class="note-item">
                <label>商家备注：</label>
                <p>{{ booking.merchant_notes }}</p>
              </div>
              <div v-if="booking.cancel_reason" class="note-item">
                <label>取消原因：</label>
                <p class="cancel-reason">{{ booking.cancel_reason }}</p>
              </div>
            </div>
          </el-card>

          <!-- 船只信息 -->
          <el-card class="boat-info-card">
            <template #header>
              <h3>船只信息</h3>
            </template>

            <div class="boat-content">
              <div class="boat-image">
                <el-image
                  :src="booking.boat?.images?.[0] || '/default-boat.jpg'"
                  :alt="booking.boat?.name || '船只'"
                  fit="cover"
                  class="image"
                >
                  <template #error>
                    <div class="image-error">
                      <ship theme="outline" size="48" />
                    </div>
                  </template>
                </el-image>
              </div>

              <div class="boat-details">
                <h4>{{ booking.boat?.name || '未知船只' }}</h4>
                <div class="boat-specs">
                  <div class="spec-item">
                    <label>船只类型：</label>
                    <span>{{ booking.boat?.boat_type || '未知' }}</span>
                  </div>
                  <div class="spec-item">
                    <label>载客量：</label>
                    <span>{{ booking.boat?.capacity || '未知' }} 人</span>
                  </div>
                  <div class="spec-item">
                    <label>小时费率：</label>
                    <span>¥{{ booking.boat?.hourly_rate || '未知' }}/小时</span>
                  </div>
                  <div v-if="booking.boat?.current_location" class="spec-item">
                    <label>位置：</label>
                    <span>{{ booking.boat.current_location }}</span>
                  </div>
                </div>

                <div class="boat-actions">
                  <el-button type="primary" size="small" @click="viewBoatDetail">
                    查看船只详情
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 商家信息 -->
          <el-card class="merchant-info-card">
            <template #header>
              <h3>商家信息</h3>
            </template>

            <div class="merchant-content">
              <el-avatar :size="60" :src="booking.merchant?.avatar" :icon="UserFilled" />
              <div class="merchant-details">
                <h4>{{ booking.merchant?.merchant_name || booking.merchant?.username }}</h4>
                <p v-if="booking.merchant?.address">地址：{{ booking.merchant.address }}</p>
                <div class="merchant-stats">
                  <el-rate
                    v-if="booking.merchant?.rating"
                    :value="booking.merchant.rating"
                    disabled
                    show-score
                  />
                  <span v-if="booking.merchant?.total_bookings">
                    已服务 {{ booking.merchant.total_bookings }} 次
                  </span>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 船员信息 -->
          <el-card v-if="booking.assigned_crew" class="crew-info-card">
            <template #header>
              <h3>指派船员</h3>
            </template>

            <div class="crew-content">
              <el-avatar :size="60" :src="booking.assigned_crew.avatar" :icon="UserFilled" />
              <div class="crew-details">
                <h4>{{ booking.assigned_crew.username }}</h4>
                <p v-if="booking.assigned_crew.phone">
                  联系电话：{{ booking.assigned_crew.phone }}
                </p>
                <div v-if="booking.assigned_crew.rating" class="crew-rating">
                  <el-rate :value="booking.assigned_crew.rating" disabled show-score />
                </div>
              </div>

              <div v-if="canRate" class="crew-actions">
                <el-button type="success" size="small" @click="rateBooking"> 评价船员 </el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧操作区 -->
        <el-col :span="8">
          <el-affix :offset="80">
            <el-card class="actions-card">
              <template #header>
                <h3>操作</h3>
              </template>

              <div class="action-buttons">
                <el-button v-if="canCancel" type="danger" size="large" @click="cancelBooking" block>
                  取消预约
                </el-button>

                <el-button v-if="canRate" type="success" size="large" @click="rateBooking" block>
                  评价船员
                </el-button>

                <el-button
                  v-if="booking.status === 'completed'"
                  type="primary"
                  size="large"
                  @click="rebookSame"
                  block
                >
                  再次预订
                </el-button>

                <el-button size="large" @click="$router.push('/user/bookings')" block>
                  返回列表
                </el-button>
              </div>
            </el-card>
          </el-affix>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { Ship } from '@icon-park/vue-next'
import {
  getBookingDetailApiV1BookingsBookingIdGet,
  cancelBookingApiV1BookingsBookingIdCancelPatch,
} from '@/services/api/bookings'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const booking = ref<API.BookingDetailSchema | null>(null)

// 计算属性
const canCancel = computed(() => {
  if (!booking.value) return false
  // 只有待确认和已确认的预约可以取消，后端会处理具体的业务规则
  return booking.value.status === 'pending' || booking.value.status === 'confirmed'
})

const canRate = computed(() => {
  if (!booking.value) return false
  return (
    booking.value.status === 'completed' &&
    booking.value.assigned_crew &&
    !booking.value.crew_rating
  )
})

// 获取预约详情
const fetchBookingDetail = async () => {
  try {
    loading.value = true
    const bookingId = route.params.id as string
    const response = await getBookingDetailApiV1BookingsBookingIdGet({
      booking_id: parseInt(bookingId),
    })
    console.log(response)
    if (response.data?.success && response.data.data) {
      booking.value = response.data.data
    } else {
      booking.value = null
    }
  } catch (error) {
    console.error('获取预约详情失败:', error)
    booking.value = null
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN')
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

// 获取状态标题
const getStatusTitle = (status: string) => {
  const titleMap: Record<string, string> = {
    pending: '等待商家确认',
    confirmed: '预约已确认',
    in_progress: '服务进行中',
    completed: '服务已完成',
    cancelled: '预约已取消',
    rejected: '预约被拒绝',
  }
  return titleMap[status] || '未知状态'
}

// 获取状态描述
const getStatusDescription = (status: string) => {
  const descMap: Record<string, string> = {
    pending: '您的预约正在等待商家确认，请耐心等待',
    confirmed: '您的预约已被商家确认，请按时前往指定地点',
    in_progress: '您的船舶服务正在进行中，请享受您的旅程',
    completed: '您的船舶服务已完成，感谢您的使用',
    cancelled: '您的预约已取消，如有疑问请联系客服',
    rejected: '很抱歉，您的预约被商家拒绝，建议您选择其他船只',
  }
  return descMap[status] || ''
}

// 获取状态警告类型
const getStatusAlertType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'info',
    rejected: 'error',
  }
  return typeMap[status] || 'info'
}

// 查看船只详情
const viewBoatDetail = () => {
  if (booking.value?.boat_id) {
    router.push(`/user/boats/${booking.value.boat_id}`)
  }
}

// 取消预约
const cancelBooking = async () => {
  if (!booking.value) return

  try {
    await ElMessageBox.confirm(
      `确定要取消预约"${booking.value.boat?.name || '该船只'}"吗？`,
      '确认取消',
      {
        confirmButtonText: '确定取消',
        cancelButtonText: '暂不取消',
        type: 'warning',
      },
    )

    await cancelBookingApiV1BookingsBookingIdCancelPatch(
      {
        booking_id: booking.value.id,
      },
      null,
    )

    ElMessage.success('预约已取消')
    await fetchBookingDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消预约失败:', error)
      ElMessage.error(error.response?.data?.message || '取消预约失败')
    }
  }
}

// 评价预约
const rateBooking = () => {
  router.push('/user/bookings')
}

// 再次预订
const rebookSame = () => {
  if (booking.value?.boat_id) {
    router.push(`/user/boats/${booking.value.boat_id}`)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchBookingDetail()
})
</script>

<style scoped>
.booking-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.loading-container,
.error-container {
  padding: 60px 0;
  text-align: center;
}

.breadcrumb {
  margin-bottom: 24px;
}

.status-alert {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.booking-info-card,
.boat-info-card,
.merchant-info-card,
.crew-info-card {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}

.info-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  min-width: 100px;
}

.booking-id {
  font-family: monospace;
  color: #1890ff;
  font-weight: 600;
}

.fee-amount {
  font-size: 18px;
  font-weight: 600;
  color: #f56565;
}

.notes-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
}

.note-item {
  margin-bottom: 16px;
}

.note-item label {
  font-weight: 600;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.note-item p {
  margin: 0;
  color: #333;
  line-height: 1.6;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.cancel-reason {
  color: #f56565 !important;
}

.boat-content,
.merchant-content,
.crew-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.boat-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.boat-image .image {
  width: 100%;
  height: 100%;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #999;
}

.boat-details,
.merchant-details,
.crew-details {
  flex: 1;
}

.boat-details h4,
.merchant-details h4,
.crew-details h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.boat-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.spec-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.spec-item label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
}

.merchant-details p,
.crew-details p {
  margin: 0 0 8px 0;
  color: #666;
}

.merchant-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.crew-actions {
  margin-left: auto;
}

.actions-card {
  position: sticky;
  top: 80px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
</style>
