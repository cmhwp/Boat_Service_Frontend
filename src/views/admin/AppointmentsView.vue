<template>
  <div class="admin-appointments-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>预约管理</h1>
      <p>管理平台所有船艇预约信息</p>
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

          <el-form-item label="商家ID">
            <el-input
              v-model="filterForm.merchant_id"
              placeholder="请输入商家ID"
              clearable
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="用户ID">
            <el-input
              v-model="filterForm.user_id"
              placeholder="请输入用户ID"
              clearable
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="日期范围">
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
      <el-card>
        <template #header>
          <div class="card-header">
            <span>预约列表</span>
            <div class="header-actions">
              <el-button type="primary" @click="refreshData">
                <refresh theme="outline" size="14" />
                刷新
              </el-button>
              <el-button type="warning" @click="triggerAutoCancel">
                <AutoFocus theme="outline" size="14" />
                触发自动取消
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="bookings" v-loading="loading" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="booking_number" label="预约号" width="160" />
          <el-table-column label="船艇信息" width="150">
            <template #default="{ row }">
              <div>{{ row.boat?.name || '未知船艇' }}</div>
              <div class="text-secondary">{{ row.boat?.boat_type || '' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" width="120">
            <template #default="{ row }">
              <div>{{ row.user?.username || '未知用户' }}</div>
              <div class="text-secondary">{{ row.contact_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="商家信息" width="120">
            <template #default="{ row }">
              {{ row.merchant?.merchant_name || '未知商家' }}
            </template>
          </el-table-column>
          <el-table-column label="预约时间" width="160">
            <template #default="{ row }">
              <div>{{ formatDateTime(row.start_time) }}</div>
              <div class="text-secondary">{{ formatDateTime(row.end_time) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="人数/时长" width="100">
            <template #default="{ row }">
              <div>{{ row.passenger_count }}人</div>
              <div class="text-secondary">{{ row.duration_hours }}小时</div>
            </template>
          </el-table-column>
          <el-table-column label="费用信息" width="120">
            <template #default="{ row }">
              <div>¥{{ row.hourly_rate }}/时</div>
              <div>总计: ¥{{ row.total_amount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
              <div v-if="row.payment_status" class="payment-status">
                <el-tag size="small" :type="getPaymentStatusType(row.payment_status)">
                  {{ getPaymentStatusText(row.payment_status) }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="船员" width="100">
            <template #default="{ row }">
              {{ row.assigned_crew?.username || '未指派' }}
            </template>
          </el-table-column>
          <el-table-column label="联系方式" width="120">
            <template #default="{ row }">
              {{ row.contact_phone }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="100">
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="viewDetail(row)"> 详情 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.page_size"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 预约详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="预约详情" width="800px">
      <div v-if="selectedBooking" class="booking-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预约ID">{{ selectedBooking.id }}</el-descriptions-item>
          <el-descriptions-item label="预约号">{{
            selectedBooking.booking_number
          }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ selectedBooking.user_id }}</el-descriptions-item>
          <el-descriptions-item label="船艇ID">{{ selectedBooking.boat_id }}</el-descriptions-item>
          <el-descriptions-item label="商家ID">{{
            selectedBooking.merchant_id
          }}</el-descriptions-item>
          <el-descriptions-item label="船员ID">{{
            selectedBooking.assigned_crew_id || '未指派'
          }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{
            formatDateTime(selectedBooking.start_time)
          }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{
            formatDateTime(selectedBooking.end_time)
          }}</el-descriptions-item>
          <el-descriptions-item label="预约时长"
            >{{ selectedBooking.duration_hours }}小时</el-descriptions-item
          >
          <el-descriptions-item label="乘客人数"
            >{{ selectedBooking.passenger_count }}人</el-descriptions-item
          >
          <el-descriptions-item label="小时费率"
            >¥{{ selectedBooking.hourly_rate }}</el-descriptions-item
          >
          <el-descriptions-item label="总金额"
            >¥{{ selectedBooking.total_amount }}</el-descriptions-item
          >
          <el-descriptions-item label="预约状态">
            <el-tag :type="getStatusType(selectedBooking.status)">
              {{ getStatusText(selectedBooking.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getPaymentStatusType(selectedBooking.payment_status)">
              {{ getPaymentStatusText(selectedBooking.payment_status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系人">{{
            selectedBooking.contact_name
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            selectedBooking.contact_phone
          }}</el-descriptions-item>
          <el-descriptions-item label="用户备注" :span="2">{{
            selectedBooking.user_notes || '无'
          }}</el-descriptions-item>
          <el-descriptions-item label="商家备注" :span="2">{{
            selectedBooking.merchant_notes || '无'
          }}</el-descriptions-item>
          <el-descriptions-item v-if="selectedBooking.cancel_reason" label="取消原因" :span="2">{{
            selectedBooking.cancel_reason
          }}</el-descriptions-item>
        </el-descriptions>

        <!-- 时间信息 -->
        <div class="time-info">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{
              formatDateTime(selectedBooking.created_at)
            }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{
              formatDateTime(selectedBooking.updated_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedBooking.confirmed_at" label="确认时间">{{
              formatDateTime(selectedBooking.confirmed_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedBooking.completed_at" label="完成时间">{{
              formatDateTime(selectedBooking.completed_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedBooking.cancelled_at" label="取消时间">{{
              formatDateTime(selectedBooking.cancelled_at)
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 用户信息 -->
        <div v-if="selectedBooking.user" class="user-info">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{
              selectedBooking.user.username
            }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{
              selectedBooking.user.email
            }}</el-descriptions-item>
            <el-descriptions-item label="手机">{{
              selectedBooking.user.phone || '未填写'
            }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{
              selectedBooking.user.role
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 船艇信息 -->
        <div v-if="selectedBooking.boat" class="boat-info">
          <h4>船艇信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="船艇名称">{{
              selectedBooking.boat.name
            }}</el-descriptions-item>
            <el-descriptions-item label="船艇类型">{{
              selectedBooking.boat.boat_type
            }}</el-descriptions-item>
            <el-descriptions-item label="载客量"
              >{{ selectedBooking.boat.capacity }}人</el-descriptions-item
            >
            <el-descriptions-item label="当前位置">{{
              selectedBooking.boat.current_location || '未设置'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 商家信息 -->
        <div v-if="selectedBooking.merchant" class="merchant-info">
          <h4>商家信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="商家名称">{{
              selectedBooking.merchant.merchant_name
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              selectedBooking.merchant.contact_phone
            }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{
              selectedBooking.merchant.address || '未填写'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 船员信息 -->
        <div v-if="selectedBooking.assigned_crew" class="crew-info">
          <h4>船员信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="船员姓名">{{
              selectedBooking.assigned_crew.username
            }}</el-descriptions-item>
            <el-descriptions-item label="船员评分">{{
              selectedBooking.assigned_crew.rating || '暂无评分'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 评价信息 -->
        <div v-if="selectedBooking.crew_rating" class="rating-info">
          <h4>船员评价</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="评分"
              >{{ selectedBooking.crew_rating.rating }}分</el-descriptions-item
            >
            <el-descriptions-item label="评价内容">{{
              selectedBooking.crew_rating.comment || '无评价内容'
            }}</el-descriptions-item>
            <el-descriptions-item label="评价时间">{{
              formatDateTime(selectedBooking.crew_rating.created_at)
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, AutoFocus } from '@icon-park/vue-next'
import {
  getAllBookingsApiV1BookingsAdminAllGet,
  manualAutoCancelExpiredBookingsApiV1BookingsAdminAutoCancelPost,
} from '@/services/api/bookings'

// 响应式数据
const loading = ref(false)
const bookings = ref<API.BookingDetailSchema[]>([])
const detailDialogVisible = ref(false)
const selectedBooking = ref<API.BookingDetailSchema | null>(null)

// 筛选表单
const filterForm = reactive({
  status: '',
  merchant_id: '',
  user_id: '',
  dateRange: [] as string[],
})

// 分页数据
const pagination = reactive({
  page: 1,
  page_size: 20,
  total: 0,
})

// 获取预约列表
const fetchBookings = async () => {
  try {
    loading.value = true
    const params: API.getAllBookingsApiV1BookingsAdminAllGetParams = {
      page: pagination.page,
      page_size: pagination.page_size,
    }

    // 添加筛选条件
    if (filterForm.status) {
      params.status = filterForm.status as API.BookingStatus
    }
    if (filterForm.merchant_id) {
      params.merchant_id = Number(filterForm.merchant_id)
    }
    if (filterForm.user_id) {
      params.user_id = Number(filterForm.user_id)
    }
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      params.start_date = filterForm.dateRange[0]
      params.end_date = filterForm.dateRange[1]
    }

    const response = await getAllBookingsApiV1BookingsAdminAllGet(params)

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
  filterForm.merchant_id = ''
  filterForm.user_id = ''
  filterForm.dateRange = []
  pagination.page = 1
  fetchBookings()
}

// 刷新数据
const refreshData = () => {
  fetchBookings()
}

// 触发自动取消超时预约
const triggerAutoCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要手动触发自动取消超时预约吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await manualAutoCancelExpiredBookingsApiV1BookingsAdminAutoCancelPost()

    if (response.data?.success) {
      ElMessage.success('自动取消任务执行成功')
      await fetchBookings()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('执行自动取消任务失败:', error)
      ElMessage.error(error.response?.data?.message || '执行自动取消任务失败')
    }
  }
}

// 查看详情
const viewDetail = (booking: API.BookingDetailSchema) => {
  selectedBooking.value = booking
  detailDialogVisible.value = true
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
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
.admin-appointments-view {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.text-secondary {
  font-size: 12px;
  color: #666;
}

.payment-status {
  margin-top: 4px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.booking-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.time-info,
.user-info,
.boat-info,
.merchant-info,
.crew-info,
.rating-info {
  margin-top: 20px;
}

.time-info h4,
.user-info h4,
.boat-info h4,
.merchant-info h4,
.crew-info h4,
.rating-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}
</style>
