<template>
  <div class="bookings-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item>预约管理</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">预约管理</h1>
    </div>

    <!-- 统计数据 -->
    <div class="stats-cards" v-loading="statsLoading">
      <div class="stat-card">
        <div class="stat-icon pending">
          <el-icon><clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pending_bookings }}</div>
          <div class="stat-label">待确认</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon confirmed">
          <el-icon><check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.confirmed_bookings }}</div>
          <div class="stat-label">已确认</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon completed">
          <el-icon><success-filled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completed_bookings }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <el-icon><money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.total_revenue?.toLocaleString() || 0 }}</div>
          <div class="stat-label">总收入</div>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索预约单号或联系人"
          style="width: 300px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterStatus"
          placeholder="预约状态"
          style="width: 150px; margin-left: 16px"
          clearable
          @change="handleSearch"
        >
          <el-option label="待确认" value="pending" />
          <el-option label="已确认" value="confirmed" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-left: 16px"
          @change="handleSearch"
        />
        <el-select
          v-model="filterBoat"
          placeholder="选择船只"
          style="width: 200px; margin-left: 16px"
          clearable
          @change="handleSearch"
        >
          <el-option v-for="boat in boats" :key="boat.id" :label="boat.name" :value="boat.id" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><search /></el-icon>
          搜索
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button @click="handleRefresh">
          <el-icon><refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 预约列表 -->
    <div class="bookings-table" v-loading="loading">
      <el-table :data="bookings" style="width: 100%" stripe>
        <el-table-column prop="booking_number" label="预约单号" width="180" />
        <el-table-column prop="boat.name" label="船只" width="120" />
        <el-table-column label="预约时间" width="300">
          <template #default="{ row }">
            <div class="booking-time">
              <div>{{ formatDateTime(row.start_time) }}</div>
              <div style="font-size: 12px; color: #666">至 {{ formatDateTime(row.end_time) }}</div>
              <div style="font-size: 12px; color: #999">({{ row.duration_hours }}小时)</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系人" width="120">
          <template #default="{ row }">
            <div>{{ row.contact_name }}</div>
            <div style="font-size: 12px; color: #666">{{ row.contact_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="passenger_count" label="人数" width="80" />
        <el-table-column label="金额" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.total_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="船员" width="100">
          <template #default="{ row }">
            <span v-if="row.assigned_crew">{{ row.assigned_crew.user?.username }}</span>
            <span v-else class="text-muted">未派单</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
            <el-dropdown
              v-if="row.status === 'pending'"
              @command="(command: API.BookingStatus) => handleStatusChange(row, command)"
              style="margin-left: 8px"
            >
              <el-button size="small" type="primary">
                处理<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="confirmed">确认预约</el-dropdown-item>
                  <el-dropdown-item command="rejected">拒绝预约</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              v-if="row.status === 'confirmed' && !row.assigned_crew_id"
              size="small"
              type="success"
              @click="handleAssignCrew(row)"
              style="margin-left: 8px"
            >
              派单
            </el-button>
            <el-dropdown
              v-if="['confirmed', 'in_progress'].includes(row.status)"
              @command="(command: API.BookingStatus) => handleStatusChange(row, command)"
              style="margin-left: 8px"
            >
              <el-button size="small">
                更新<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="row.status === 'confirmed'" command="in_progress">
                    开始服务
                  </el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 'in_progress'" command="completed">
                    完成服务
                  </el-dropdown-item>
                  <el-dropdown-item command="cancelled">取消预约</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="pagination.total > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 预约详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="预约详情" width="800px">
      <div v-if="selectedBooking" class="booking-detail">
        <div class="detail-header">
          <div class="booking-number">预约单号：{{ selectedBooking.booking_number }}</div>
          <el-tag :type="getStatusTagType(selectedBooking.status)">
            {{ getStatusText(selectedBooking.status) }}
          </el-tag>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="船只信息">
            {{ selectedBooking.boat?.name }}
          </el-descriptions-item>
          <el-descriptions-item label="预约用户">
            {{ selectedBooking.user?.username }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ selectedBooking.contact_name }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ selectedBooking.contact_phone }}
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ formatDateTime(selectedBooking.start_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ formatDateTime(selectedBooking.end_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="预约时长">
            {{ selectedBooking.duration_hours }}小时
          </el-descriptions-item>
          <el-descriptions-item label="人数">
            {{ selectedBooking.passenger_count }}人
          </el-descriptions-item>
          <el-descriptions-item label="小时费率">
            ¥{{ selectedBooking.hourly_rate }}
          </el-descriptions-item>
          <el-descriptions-item label="总金额">
            <span class="price">¥{{ selectedBooking.total_amount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="指派船员">
            {{ selectedBooking.assigned_crew?.user?.username || '未派单' }}
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getPaymentStatusTagType(selectedBooking.payment_status)">
              {{ getPaymentStatusText(selectedBooking.payment_status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户备注" span="2">
            {{ selectedBooking.user_notes || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="商家备注" span="2">
            {{ selectedBooking.merchant_notes || '无' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedBooking.cancel_reason" label="取消原因" span="2">
            {{ selectedBooking.cancel_reason }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="time-records" style="margin-top: 20px">
          <h4>时间记录</h4>
          <el-steps direction="vertical" :active="getTimeStepActive(selectedBooking)">
            <el-step title="创建预约" :description="formatDateTime(selectedBooking.created_at)" />
            <el-step
              v-if="selectedBooking.confirmed_at"
              title="确认预约"
              :description="formatDateTime(selectedBooking.confirmed_at)"
            />
            <el-step
              v-if="selectedBooking.completed_at"
              title="完成服务"
              :description="formatDateTime(selectedBooking.completed_at)"
            />
            <el-step
              v-if="selectedBooking.cancelled_at"
              title="取消预约"
              :description="formatDateTime(selectedBooking.cancelled_at)"
            />
          </el-steps>
        </div>
      </div>
    </el-dialog>

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
            />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  ArrowDown,
  Clock,
  Check,
  SuccessFilled,
  Money,
} from '@element-plus/icons-vue'
import {
  getMerchantBookingsApiV1BookingsMerchantListGet,
  getBookingDetailApiV1BookingsBookingIdGet,
  updateBookingStatusApiV1BookingsBookingIdStatusPatch,
  assignCrewApiV1BookingsAssignCrewPost,
  getBookingStatsApiV1BookingsMerchantStatsGet,
} from '@/services/api/bookings'
import { getMyBoatsApiV1BoatsMyGet } from '@/services/api/boats'
import { getCrewListApiV1CrewListGet } from '@/services/api/crew'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const statsLoading = ref(false)
const bookings = ref<API.BookingDetailSchema[]>([])
const boats = ref<API.BoatListItemSchema[]>([])
const availableCrew = ref<API.CrewListItemSchema[]>([])
const stats = ref<API.BookingStatsSchema>({
  total_bookings: 0,
  pending_bookings: 0,
  confirmed_bookings: 0,
  completed_bookings: 0,
  cancelled_bookings: 0,
  total_revenue: 0,
  average_rating: 0,
})

// 搜索和筛选
const searchKeyword = ref('')
const filterStatus = ref<API.BookingStatus | ''>('')
const filterBoat = ref<number | ''>('')
const dateRange = ref<[Date, Date] | null>(null)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

// 弹窗相关
const detailDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const statusDialogVisible = ref(false)
const selectedBooking = ref<API.BookingDetailSchema | null>(null)

// 表单数据
const assignForm = reactive({
  booking_id: 0,
  crew_id: 0,
  notes: '',
})

const statusForm = reactive({
  status: '' as API.BookingStatus,
  merchant_notes: '',
  cancel_reason: '',
})

const assignLoading = ref(false)
const statusLoading = ref(false)

// 计算属性
const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
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

const getTimeStepActive = (booking: API.BookingDetailSchema) => {
  if (booking.cancelled_at) return 3
  if (booking.completed_at) return 2
  if (booking.confirmed_at) return 1
  return 0
}

// 方法
const loadBookings = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.page,
      page_size: pagination.pageSize,
    }

    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    if (filterBoat.value) {
      params.boat_id = filterBoat.value
    }
    if (dateRange.value) {
      params.start_date = dateRange.value[0].toISOString().split('T')[0]
      params.end_date = dateRange.value[1].toISOString().split('T')[0]
    }

    const response = await getMerchantBookingsApiV1BookingsMerchantListGet(params)
    if (response.data.success && response.data.data) {
      bookings.value = response.data.data.items
      pagination.total = response.data.data.total
    }
  } catch (error) {
    console.error('加载预约列表失败:', error)
    ElMessage.error('加载预约列表失败')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    statsLoading.value = true
    const response = await getBookingStatsApiV1BookingsMerchantStatsGet()
    if (response.data.success && response.data.data) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    statsLoading.value = false
  }
}

const loadBoats = async () => {
  try {
    const response = await getMyBoatsApiV1BoatsMyGet({ page: 1, page_size: 100 })
    if (response.data.success && response.data.data) {
      boats.value = response.data.data.items
    }
  } catch (error) {
    console.error('加载船只列表失败:', error)
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

const handleSearch = () => {
  pagination.page = 1
  loadBookings()
}

const handleRefresh = () => {
  loadBookings()
  loadStats()
}

const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize
  pagination.page = 1
  loadBookings()
}

const handleCurrentChange = (newPage: number) => {
  pagination.page = newPage
  loadBookings()
}

const handleDetail = (booking: API.BookingDetailSchema) => {
  router.push(`/merchant/bookings/${booking.id}`)
}

const handleStatusChange = (booking: API.BookingDetailSchema, status: API.BookingStatus) => {
  selectedBooking.value = booking
  statusForm.status = status
  statusForm.merchant_notes = ''
  statusForm.cancel_reason = ''
  statusDialogVisible.value = true
}

const handleConfirmStatusChange = async () => {
  try {
    statusLoading.value = true
    const response = await updateBookingStatusApiV1BookingsBookingIdStatusPatch(
      { booking_id: selectedBooking.value!.id },
      {
        status: statusForm.status,
        merchant_notes: statusForm.merchant_notes || undefined,
        cancel_reason: statusForm.cancel_reason || undefined,
      },
    )
    if (response.data.success) {
      ElMessage.success('预约状态更新成功')
      statusDialogVisible.value = false
      loadBookings()
      loadStats()
    }
  } catch (error) {
    console.error('更新预约状态失败:', error)
    ElMessage.error('更新预约状态失败')
  } finally {
    statusLoading.value = false
  }
}

const handleAssignCrew = (booking: API.BookingDetailSchema) => {
  selectedBooking.value = booking
  assignForm.booking_id = booking.id
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
      booking_id: assignForm.booking_id,
      crew_id: assignForm.crew_id,
      notes: assignForm.notes || undefined,
    })
    if (response.data.success) {
      ElMessage.success('派单成功')
      assignDialogVisible.value = false
      loadBookings()
    }
  } catch (error) {
    console.error('派单失败:', error)
    ElMessage.error('派单失败')
  } finally {
    assignLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadBookings()
  loadStats()
  loadBoats()
  loadCrew()
})
</script>

<style scoped>
.bookings-view {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 8px 0 0 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-icon.pending {
  background: #faad14;
}

.stat-icon.confirmed {
  background: #1890ff;
}

.stat-icon.completed {
  background: #52c41a;
}

.stat-icon.revenue {
  background: #722ed1;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.toolbar {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.bookings-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.booking-time {
  line-height: 1.4;
}

.price {
  color: #f56565;
  font-weight: 600;
}

.text-muted {
  color: #999;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.booking-detail {
  padding: 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.booking-number {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.time-records h4 {
  margin-bottom: 16px;
  color: #1a1a1a;
}
</style>
