<template>
  <div class="booking-detail-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item to="/merchant/bookings">预约管理</el-breadcrumb-item>
        <el-breadcrumb-item>预约详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-actions">
        <el-button @click="goBack">
          <el-icon><arrow-left /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div v-loading="loading" class="detail-content">
      <div v-if="booking" class="booking-detail">
        <!-- 基本信息 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
              <div class="header-actions">
                <el-tag :type="getStatusTagType(booking.status)" size="large">
                  {{ getStatusText(booking.status) }}
                </el-tag>
                <el-tag
                  :type="getPaymentStatusTagType(booking.payment_status)"
                  style="margin-left: 8px"
                >
                  {{ getPaymentStatusText(booking.payment_status) }}
                </el-tag>
              </div>
            </div>
          </template>

          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">预约单号：</span>
              <span class="value booking-number">{{ booking.booking_number }}</span>
              <el-button
                size="small"
                text
                @click="copyToClipboard(booking.booking_number)"
                style="margin-left: 8px"
              >
                <el-icon><document-copy /></el-icon>
                复制
              </el-button>
            </div>
            <div class="detail-row">
              <span class="label">预约用户：</span>
              <span class="value">{{ booking.user?.username }}</span>
              <span class="user-email">{{ booking.user?.email }}</span>
            </div>
            <div class="detail-row">
              <span class="label">联系人：</span>
              <span class="value">{{ booking.contact_name }}</span>
            </div>
            <div class="detail-row">
              <span class="label">联系电话：</span>
              <span class="value">{{ booking.contact_phone }}</span>
              <el-button
                size="small"
                text
                @click="callPhone(booking.contact_phone)"
                style="margin-left: 8px"
              >
                <el-icon><phone /></el-icon>
                拨打
              </el-button>
            </div>
            <div class="detail-row">
              <span class="label">船只信息：</span>
              <div class="boat-info">
                <span class="value">{{ booking.boat?.name }}</span>
                <el-tag size="small" style="margin-left: 8px">
                  {{ getBoatTypeText(booking.boat?.boat_type) }}
                </el-tag>
              </div>
            </div>
            <div class="detail-row">
              <span class="label">预约时间：</span>
              <div class="time-info">
                <div class="time-range">
                  <span class="start-time">{{ formatDateTime(booking.start_time) }}</span>
                  <span class="separator">至</span>
                  <span class="end-time">{{ formatDateTime(booking.end_time) }}</span>
                </div>
                <div class="duration">总时长：{{ booking.duration_hours }}小时</div>
              </div>
            </div>
            <div class="detail-row">
              <span class="label">乘客人数：</span>
              <span class="value">{{ booking.passenger_count }}人</span>
            </div>
            <div class="detail-row">
              <span class="label">小时费率：</span>
              <span class="value price">¥{{ booking.hourly_rate }}/小时</span>
            </div>
            <div class="detail-row">
              <span class="label">总金额：</span>
              <span class="value total-amount">¥{{ booking.total_amount }}</span>
            </div>
            <div class="detail-row">
              <span class="label">指派船员：</span>
              <span v-if="booking.assigned_crew" class="value">
                {{ booking.assigned_crew.user?.username }}
                <el-tag size="small" type="success" style="margin-left: 8px">
                  评分 {{ booking.assigned_crew.rating }}
                </el-tag>
              </span>
              <span v-else class="value text-muted">未派单</span>
              <el-button
                v-if="booking.status === 'confirmed' && !booking.assigned_crew_id"
                size="small"
                type="primary"
                @click="handleAssignCrew"
                style="margin-left: 8px"
              >
                派单
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 备注信息 -->
        <el-card class="detail-card">
          <template #header>
            <h3>备注信息</h3>
          </template>
          <div class="notes-content">
            <div class="note-item">
              <h4>用户备注</h4>
              <p>{{ booking.user_notes || '无备注' }}</p>
            </div>
            <div class="note-item">
              <h4>商家备注</h4>
              <p>{{ booking.merchant_notes || '无备注' }}</p>
              <el-button size="small" @click="handleEditNotes" style="margin-top: 8px">
                编辑备注
              </el-button>
            </div>
            <div v-if="booking.cancel_reason" class="note-item">
              <h4>取消原因</h4>
              <p class="cancel-reason">{{ booking.cancel_reason }}</p>
            </div>
          </div>
        </el-card>

        <!-- 时间轴 -->
        <el-card class="detail-card">
          <template #header>
            <h3>处理记录</h3>
          </template>
          <el-timeline>
            <el-timeline-item :timestamp="formatDateTime(booking.created_at)" color="#909399">
              <h4>预约创建</h4>
              <p>用户创建了预约申请</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="booking.confirmed_at"
              :timestamp="formatDateTime(booking.confirmed_at)"
              color="#67c23a"
            >
              <h4>预约确认</h4>
              <p>商家确认了预约申请</p>
            </el-timeline-item>
            <el-timeline-item v-if="booking.assigned_crew" timestamp="" color="#409eff">
              <h4>派单完成</h4>
              <p>已派单给船员：{{ booking.assigned_crew.user?.username }}</p>
            </el-timeline-item>
            <el-timeline-item v-if="booking.status === 'in_progress'" timestamp="" color="#e6a23c">
              <h4>服务进行中</h4>
              <p>预约服务正在进行中</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="booking.completed_at"
              :timestamp="formatDateTime(booking.completed_at)"
              color="#67c23a"
            >
              <h4>服务完成</h4>
              <p>预约服务已完成</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="booking.cancelled_at"
              :timestamp="formatDateTime(booking.cancelled_at)"
              color="#f56c6c"
            >
              <h4>预约取消</h4>
              <p>{{ booking.cancel_reason || '预约已取消' }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <!-- 评价信息 -->
        <el-card v-if="booking.crew_rating" class="detail-card">
          <template #header>
            <h3>用户评价</h3>
          </template>
          <div class="rating-content">
            <div class="rating-header">
              <el-rate
                :model-value="booking.crew_rating.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}分"
              />
              <span class="rating-date">
                {{ formatDateTime(booking.crew_rating.created_at) }}
              </span>
            </div>
            <div class="rating-comment">
              <p>{{ booking.crew_rating.comment || '用户未留言' }}</p>
            </div>
          </div>
        </el-card>

        <!-- 操作按钮 -->
        <el-card class="detail-card action-card">
          <div class="action-buttons">
            <el-button
              v-if="booking.status === 'pending'"
              type="success"
              @click="handleStatusChange('confirmed')"
            >
              <el-icon><check /></el-icon>
              确认预约
            </el-button>
            <el-button
              v-if="booking.status === 'pending'"
              type="danger"
              @click="handleStatusChange('rejected')"
            >
              <el-icon><close /></el-icon>
              拒绝预约
            </el-button>
            <el-button
              v-if="booking.status === 'confirmed'"
              type="primary"
              @click="handleStatusChange('in_progress')"
            >
              <el-icon><video-play /></el-icon>
              开始服务
            </el-button>
            <el-button
              v-if="booking.status === 'in_progress'"
              type="success"
              @click="handleStatusChange('completed')"
            >
              <el-icon><circle-check /></el-icon>
              完成服务
            </el-button>
            <el-button
              v-if="['confirmed', 'in_progress'].includes(booking.status)"
              type="warning"
              @click="handleStatusChange('cancelled')"
            >
              <el-icon><circle-close /></el-icon>
              取消预约
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 派单弹窗 -->
    <el-dialog v-model="assignDialogVisible" title="派单给船员" width="500px">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="选择船员" required>
          <el-select v-model="assignForm.crew_id" placeholder="请选择船员" style="width: 100%">
            <el-option
              v-for="crew in availableCrew"
              :key="crew.id"
              :label="crew.boat_license"
              :value="crew.id"
            >
              <div style="display: flex; justify-content: space-between">
                <span>{{ crew.boat_license }}</span>
                <span style="color: #8492a6; font-size: 13px"> 评分: {{ crew.rating }} </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派单备注">
          <el-input
            v-model="assignForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入派单备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign" :loading="assignLoading">
          确认派单
        </el-button>
      </template>
    </el-dialog>

    <!-- 状态更新弹窗 -->
    <el-dialog v-model="statusDialogVisible" title="更新预约状态" width="500px">
      <el-form :model="statusForm" label-width="80px">
        <el-form-item label="新状态">
          <el-tag :type="getStatusTagType(statusForm.status)">
            {{ getStatusText(statusForm.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="statusForm.merchant_notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        <el-form-item
          v-if="['cancelled', 'rejected'].includes(statusForm.status)"
          label="取消原因"
          required
        >
          <el-input
            v-model="statusForm.cancel_reason"
            type="textarea"
            :rows="3"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmStatusChange" :loading="statusLoading">
          确认更新
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑备注弹窗 -->
    <el-dialog v-model="notesDialogVisible" title="编辑商家备注" width="500px">
      <el-form :model="notesForm" label-width="80px">
        <el-form-item label="备注内容">
          <el-input
            v-model="notesForm.merchant_notes"
            type="textarea"
            :rows="4"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="notesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveNotes" :loading="notesLoading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Refresh,
  DocumentCopy,
  Phone,
  Check,
  Close,
  VideoPlay,
  CircleCheck,
  CircleClose,
} from '@element-plus/icons-vue'
import {
  getBookingDetailApiV1BookingsBookingIdGet,
  updateBookingStatusApiV1BookingsBookingIdStatusPatch,
  assignCrewApiV1BookingsAssignCrewPost,
} from '@/services/api/bookings'
import { getCrewListApiV1CrewListGet } from '@/services/api/crew'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const booking = ref<API.BookingDetailSchema | null>(null)
const availableCrew = ref<API.CrewListItemSchema[]>([])

// 弹窗状态
const assignDialogVisible = ref(false)
const statusDialogVisible = ref(false)
const notesDialogVisible = ref(false)

// 表单数据
const assignForm = reactive({
  crew_id: 0,
  notes: '',
})

const statusForm = reactive({
  status: '' as API.BookingStatus,
  merchant_notes: '',
  cancel_reason: '',
})

const notesForm = reactive({
  merchant_notes: '',
})

// 加载状态
const assignLoading = ref(false)
const statusLoading = ref(false)
const notesLoading = ref(false)

// 工具方法
const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusText = (status: API.BookingStatus) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    rejected: '已拒绝',
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: API.BookingStatus) => {
  const typeMap = {
    pending: 'warning',
    confirmed: 'primary',
    in_progress: 'success',
    completed: 'success',
    cancelled: 'info',
    rejected: 'danger',
  }
  return typeMap[status] || 'default'
}

const getPaymentStatusText = (status: API.PaymentStatus) => {
  const statusMap = {
    unpaid: '未支付',
    paid: '已支付',
    refunded: '已退款',
    refunding: '退款中',
  }
  return statusMap[status] || status
}

const getPaymentStatusTagType = (status: API.PaymentStatus) => {
  const typeMap = {
    unpaid: 'warning',
    paid: 'success',
    refunded: 'info',
    refunding: 'warning',
  }
  return typeMap[status] || 'default'
}

const getBoatTypeText = (type: API.BoatType) => {
  const typeMap = {
    passenger: '客运船',
    sightseeing: '观光船',
    fishing: '钓鱼船',
  }
  return typeMap[type] || type
}

// 方法
const loadBookingDetail = async () => {
  const bookingId = Number(route.params.id)
  if (!bookingId) {
    ElMessage.error('预约ID无效')
    router.push('/merchant/bookings')
    return
  }

  try {
    loading.value = true
    const response = await getBookingDetailApiV1BookingsBookingIdGet({
      booking_id: bookingId,
    })
    if (response.data.success && response.data.data) {
      booking.value = response.data.data
    } else {
      ElMessage.error('加载预约详情失败')
    }
  } catch (error) {
    console.error('加载预约详情失败:', error)
    ElMessage.error('加载预约详情失败')
  } finally {
    loading.value = false
  }
}

const loadCrew = async () => {
  try {
    const response = await getCrewListApiV1CrewListGet({ page: 1, page_size: 100 })
    if (response.data.success && response.data.data) {
      availableCrew.value = response.data.data.items
    }
  } catch (error) {
    console.error('加载船员列表失败:', error)
  }
}

const goBack = () => {
  router.push('/merchant/bookings')
}

const handleRefresh = () => {
  loadBookingDetail()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const callPhone = (phone: string) => {
  window.open(`tel:${phone}`)
}

const handleAssignCrew = () => {
  assignForm.crew_id = 0
  assignForm.notes = ''
  assignDialogVisible.value = true
}

const handleConfirmAssign = async () => {
  if (!assignForm.crew_id) {
    ElMessage.warning('请选择船员')
    return
  }

  try {
    assignLoading.value = true
    const response = await assignCrewApiV1BookingsAssignCrewPost({
      booking_id: booking.value!.id,
      crew_id: assignForm.crew_id,
      notes: assignForm.notes || undefined,
    })
    if (response.data.success) {
      ElMessage.success('派单成功')
      assignDialogVisible.value = false
      loadBookingDetail()
    }
  } catch (error) {
    console.error('派单失败:', error)
    ElMessage.error('派单失败')
  } finally {
    assignLoading.value = false
  }
}

const handleStatusChange = (status: API.BookingStatus) => {
  statusForm.status = status
  statusForm.merchant_notes = ''
  statusForm.cancel_reason = ''
  statusDialogVisible.value = true
}

const handleConfirmStatusChange = async () => {
  try {
    statusLoading.value = true
    const response = await updateBookingStatusApiV1BookingsBookingIdStatusPatch(
      { booking_id: booking.value!.id },
      {
        status: statusForm.status,
        merchant_notes: statusForm.merchant_notes || undefined,
        cancel_reason: statusForm.cancel_reason || undefined,
      },
    )
    if (response.data.success) {
      ElMessage.success('预约状态更新成功')
      statusDialogVisible.value = false
      loadBookingDetail()
    }
  } catch (error) {
    console.error('更新预约状态失败:', error)
    ElMessage.error('更新预约状态失败')
  } finally {
    statusLoading.value = false
  }
}

const handleEditNotes = () => {
  notesForm.merchant_notes = booking.value?.merchant_notes || ''
  notesDialogVisible.value = true
}

const handleSaveNotes = async () => {
  try {
    notesLoading.value = true
    const response = await updateBookingStatusApiV1BookingsBookingIdStatusPatch(
      { booking_id: booking.value!.id },
      {
        status: booking.value!.status,
        merchant_notes: notesForm.merchant_notes || undefined,
      },
    )
    if (response.data.success) {
      ElMessage.success('备注更新成功')
      notesDialogVisible.value = false
      loadBookingDetail()
    }
  } catch (error) {
    console.error('更新备注失败:', error)
    ElMessage.error('更新备注失败')
  } finally {
    notesLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadBookingDetail()
  loadCrew()
})
</script>

<style scoped>
.booking-detail-view {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.detail-row .label {
  min-width: 100px;
  color: #666;
  font-weight: 500;
}

.detail-row .value {
  flex: 1;
  color: #1a1a1a;
}

.booking-number {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.user-email {
  color: #666;
  font-size: 14px;
  margin-left: 8px;
}

.boat-info {
  display: flex;
  align-items: center;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  color: #666;
}

.duration {
  font-size: 14px;
  color: #666;
}

.price {
  color: #f56565;
  font-weight: 600;
  font-size: 16px;
}

.total-amount {
  color: #f56565;
  font-weight: 700;
  font-size: 18px;
}

.text-muted {
  color: #999;
}

.notes-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-item h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.note-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.cancel-reason {
  color: #f56c6c !important;
}

.rating-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-date {
  color: #999;
  font-size: 14px;
}

.rating-comment p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.action-card {
  border-top: 3px solid #1890ff;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  min-width: 120px;
}
</style>
