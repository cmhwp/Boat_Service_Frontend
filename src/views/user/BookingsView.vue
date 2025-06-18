<template>
  <div class="bookings-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>我的预约</h1>
      <p>管理您的船舶预约记录</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-card>
        <el-form :model="filterForm" :inline="true" class="filter-form">
          <el-form-item label="预约状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待确认" value="pending" />
              <el-option label="已确认" value="confirmed" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
          </el-form-item>

          <el-form-item label="船只类型">
            <el-select v-model="filterForm.boat_type" placeholder="请选择船只类型" clearable>
              <el-option label="观光船" value="观光船" />
              <el-option label="快艇" value="快艇" />
              <el-option label="游轮" value="游轮" />
              <el-option label="帆船" value="帆船" />
            </el-select>
          </el-form-item>

          <el-form-item label="预约时间">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchBookings" :loading="loading">
              <search theme="outline" size="14" />
              搜索
            </el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 预约列表 -->
    <div class="bookings-section">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="bookings.length === 0" class="empty-container">
        <el-empty description="暂无预约记录">
          <el-button type="primary" @click="$router.push('/user/boats')"> 立即预订 </el-button>
        </el-empty>
      </div>

      <div v-else class="bookings-list">
        <el-card
          v-for="booking in bookings"
          :key="booking.id"
          class="booking-card"
          :class="{
            'booking-card--cancelled':
              booking.status === 'cancelled' || booking.status === 'rejected',
          }"
        >
          <div class="booking-content">
            <!-- 预约基本信息 -->
            <div class="booking-header">
              <div class="booking-info">
                <h3 class="boat-name">{{ booking.boat_name }}</h3>
                <div class="booking-meta">
                  <el-tag :type="getStatusType(booking.status)" size="small">
                    {{ getStatusText(booking.status) }}
                  </el-tag>
                  <span class="booking-id">预约号：{{ booking.booking_number }}</span>
                  <span class="booking-date">{{ formatDate(booking.created_at) }}</span>
                </div>
              </div>
              <div class="booking-fee">
                <span class="fee-amount">¥{{ booking.total_amount }}</span>
                <el-tag :type="getPaymentStatusType(booking.payment_status)" size="small">
                  {{ getPaymentStatusText(booking.payment_status) }}
                </el-tag>
              </div>
            </div>

            <!-- 预约详情 -->
            <div class="booking-details">
              <el-row :gutter="24">
                <el-col :span="12">
                  <div class="detail-group">
                    <h4>时间安排</h4>
                    <div class="detail-item">
                      <schedule theme="outline" size="16" />
                      <span
                        >{{ formatDateTime(booking.start_time) }} -
                        {{ formatDateTime(booking.end_time) }}</span
                      >
                    </div>
                    <div class="detail-item">
                      <group theme="outline" size="16" />
                      <span>{{ booking.passenger_count }} 人</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="detail-group">
                    <h4>联系信息</h4>
                    <div class="detail-item">
                      <user theme="outline" size="16" />
                      <span>{{ booking.contact_name }}</span>
                    </div>
                    <div class="detail-item">
                      <phone theme="outline" size="16" />
                      <span>{{ booking.contact_phone }}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <!-- 备注信息 -->
              <!-- 注意：BookingListItemSchema 不包含 user_notes 和 merchant_notes 字段 -->
              <!-- 这些信息需要在详情页面查看 -->

              <!-- 船员信息 -->
              <!-- 注意：BookingListItemSchema 不包含 assigned_crew 字段 -->
              <!-- 船员信息需要在详情页面查看 -->
            </div>

            <!-- 操作按钮 -->
            <div class="booking-actions">
              <el-button type="primary" size="small" @click="viewBookingDetail(booking.id)">
                查看详情
              </el-button>

              <el-button
                v-if="canCancel(booking)"
                type="danger"
                size="small"
                @click="cancelBooking(booking)"
              >
                取消预约
              </el-button>

              <el-button
                v-if="canRate(booking)"
                type="success"
                size="small"
                @click="rateBooking(booking)"
              >
                评价船员
              </el-button>

              <el-button
                v-if="booking.status === 'completed'"
                size="small"
                @click="rebookSame(booking)"
              >
                再次预订
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.page_size"
            :page-sizes="[10, 20, 50]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 评价对话框 -->
    <el-dialog v-model="ratingDialogVisible" title="评价船员" width="500px">
      <el-form ref="ratingFormRef" :model="ratingForm" :rules="ratingRules" label-width="80px">
        <el-form-item label="评分" prop="rating">
          <el-rate
            v-model="ratingForm.rating"
            :max="5"
            show-text
            :texts="['极差', '失望', '一般', '满意', '惊喜']"
          />
        </el-form-item>
        <el-form-item label="评价内容" prop="comment">
          <el-input
            v-model="ratingForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请分享您的使用体验..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="ratingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRating" :loading="ratingSubmitting">
          提交评价
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { Search, User, Phone, Schedule, Group } from '@icon-park/vue-next'
import {
  getMyBookingsApiV1BookingsMyGet,
  cancelBookingApiV1BookingsBookingIdCancelPatch,
  createCrewRatingApiV1BookingsRatingsPost,
} from '@/services/api/bookings'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const bookings = ref<API.BookingListItemSchema[]>([])
const ratingDialogVisible = ref(false)
const ratingSubmitting = ref(false)
const selectedBooking = ref<API.BookingListItemSchema | null>(null)
const ratingFormRef = ref<FormInstance>()

// 筛选表单
const filterForm = reactive({
  status: '',
  boat_type: '',
  dateRange: [] as string[],
})

// 分页数据
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0,
})

// 评价表单
const ratingForm = reactive({
  rating: 5,
  comment: '',
})

// 评价表单验证规则
const ratingRules: FormRules = {
  rating: [{ required: true, message: '请选择评分', trigger: 'blur' }],
}

// 获取预约列表
const fetchBookings = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.page,
      page_size: pagination.page_size,
    }

    // 添加筛选条件
    if (filterForm.status) {
      params.status = filterForm.status
    }
    if (filterForm.boat_type) {
      params.boat_type = filterForm.boat_type
    }
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      params.start_date = filterForm.dateRange[0]
      params.end_date = filterForm.dateRange[1]
    }

    const response = await getMyBookingsApiV1BookingsMyGet(params)
    console.log(response)

    if (response.data?.success && response.data.data) {
      bookings.value = response.data.data.items || []
      pagination.total = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索预约
const searchBookings = () => {
  pagination.page = 1
  fetchBookings()
}

// 重置筛选
const resetFilter = () => {
  filterForm.status = ''
  filterForm.boat_type = ''
  filterForm.dateRange = []
  pagination.page = 1
  fetchBookings()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
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

// 获取支付状态类型
const getPaymentStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    unpaid: 'warning',
    paid: 'success',
    refunded: 'info',
    refunding: 'warning',
  }
  return statusMap[status] || 'info'
}

// 获取支付状态文本
const getPaymentStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    unpaid: '未支付',
    paid: '已支付',
    refunded: '已退款',
    refunding: '退款中',
  }
  return statusMap[status] || status
}

// 判断是否可以取消
const canCancel = (booking: API.BookingListItemSchema) => {
  // 只有待确认和已确认的预约可以取消，后端会处理具体的业务规则
  return booking.status === 'pending' || booking.status === 'confirmed'
}

// 判断是否可以评价
const canRate = (booking: API.BookingListItemSchema) => {
  // BookingListItemSchema 不包含 assigned_crew 和 crew_rating 字段
  // 简化判断逻辑，只基于状态判断
  return booking.status === 'completed'
}

// 查看预约详情
const viewBookingDetail = (bookingId: number) => {
  router.push(`/user/bookings/${bookingId}`)
}

// 取消预约
const cancelBooking = async (booking: API.BookingListItemSchema) => {
  try {
    await ElMessageBox.confirm(`确定要取消预约"${booking.boat_name}"吗？`, '确认取消', {
      confirmButtonText: '确定取消',
      cancelButtonText: '暂不取消',
      type: 'warning',
    })

    await cancelBookingApiV1BookingsBookingIdCancelPatch(
      {
        booking_id: booking.id,
      },
      null,
    )

    ElMessage.success('预约已取消')
    await fetchBookings()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消预约失败:', error)
      ElMessage.error(error.response?.data?.message || '取消预约失败')
    }
  }
}

// 评价预约
const rateBooking = (booking: API.BookingListItemSchema) => {
  selectedBooking.value = booking
  ratingForm.rating = 5
  ratingForm.comment = ''
  ratingDialogVisible.value = true
}

// 提交评价
const submitRating = async () => {
  if (!ratingFormRef.value || !selectedBooking.value) return

  try {
    await ratingFormRef.value.validate()
  } catch {
    return
  }

  try {
    ratingSubmitting.value = true
    await createCrewRatingApiV1BookingsRatingsPost({
      booking_id: selectedBooking.value.id,
      rating: ratingForm.rating,
      comment: ratingForm.comment,
    })

    ElMessage.success('评价成功')
    ratingDialogVisible.value = false
    await fetchBookings()
  } catch (error: any) {
    console.error('评价失败:', error)
    ElMessage.error(error.response?.data?.message || '评价失败')
  } finally {
    ratingSubmitting.value = false
  }
}

// 再次预订
const rebookSame = (booking: API.BookingListItemSchema) => {
  // 由于 BookingListItemSchema 不包含 boat_id，我们需要通过其他方式获取
  // 可以通过预约详情页面或者从 boat_name 反推
  router.push('/user/boats')
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.page_size = val
  pagination.page = 1
  fetchBookings()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchBookings()
}

// 页面加载时获取数据
onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
.bookings-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-form {
  margin: 0;
}

.filter-form .el-form-item {
  margin-bottom: 0;
}

.bookings-section {
  margin-bottom: 24px;
}

.loading-container,
.empty-container {
  padding: 60px 0;
  text-align: center;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-card {
  transition: all 0.3s;
}

.booking-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.booking-card--cancelled {
  opacity: 0.8;
  background: #fafafa;
}

.booking-content {
  padding: 0;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.booking-info {
  flex: 1;
}

.boat-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.booking-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.booking-id {
  color: #999;
}

.booking-fee {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.fee-amount {
  font-size: 24px;
  font-weight: 600;
  color: #f56565;
}

.booking-details {
  margin-bottom: 20px;
}

.detail-group {
  margin-bottom: 16px;
}

.detail-group h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.notes-section {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.note-item:last-child {
  margin-bottom: 0;
}

.note-item label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.crew-section {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
}

.crew-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.crew-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crew-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.crew-name {
  font-weight: 500;
  color: #333;
}

.crew-phone {
  font-size: 14px;
  color: #666;
}

.booking-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
