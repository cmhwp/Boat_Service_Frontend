<template>
  <div class="orders-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">订单管理</h1>
    </div>

    <!-- 统计数据 -->
    <div class="stats-cards" v-loading="statsLoading">
      <div class="stat-card">
        <div class="stat-icon pending">
          <el-icon><clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pending_orders }}</div>
          <div class="stat-label">待支付</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon paid">
          <el-icon><check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.paid_orders }}</div>
          <div class="stat-label">已支付</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon completed">
          <el-icon><success-filled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completed_orders }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <el-icon><money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.paid_amount?.toLocaleString() || 0 }}</div>
          <div class="stat-label">已收款</div>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-row :gutter="16" align="middle">
        <el-col :span="4">
          <el-select
            v-model="filters.status"
            placeholder="订单状态"
            clearable
            @change="handleFilterChange"
          >
            <el-option label="全部订单" value="" />
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已送达" value="delivered" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已退款" value="refunded" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索订单号或客户信息"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <search theme="outline" size="16" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="6" class="filter-actions">
          <el-button @click="resetFilters">重置筛选</el-button>
          <el-button type="primary" @click="exportOrders">导出数据</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 订单列表 -->
    <el-card class="orders-card">
      <template #header>
        <div class="card-header">
          <h3>订单列表</h3>
          <div class="order-stats">
            <span>共 {{ pagination.total }} 个订单</span>
          </div>
        </div>
      </template>

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <div v-else-if="orders.length === 0" class="empty-container">
        <el-empty description="暂无订单数据">
          <el-button @click="fetchOrders">刷新数据</el-button>
        </el-empty>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-item">
          <el-card class="order-card" shadow="hover">
            <!-- 订单头部 -->
            <template #header>
              <div class="order-header">
                <div class="order-info">
                  <span class="order-number">订单号：{{ order.order_number }}</span>
                  <span class="order-date">{{ formatDateTime(order.created_at) }}</span>
                </div>
                <div class="order-status">
                  <el-tag :type="getStatusType(order.status)" size="large">
                    {{ getStatusText(order.status) }}
                  </el-tag>
                </div>
              </div>
            </template>

            <!-- 订单内容 -->
            <div class="order-content">
              <div class="order-customer">
                <div class="customer-info">
                  <user theme="outline" size="16" />
                  <span class="customer-name">{{ order.user?.username || '客户' }}</span>
                  <span class="customer-phone">{{ order.receiver_phone }}</span>
                </div>
                <div class="delivery-address">
                  <local theme="outline" size="16" />
                  <span>{{ order.receiver_address }}</span>
                </div>
              </div>

              <div class="order-items">
                <div class="items-summary">
                  <span>共 {{ order.order_items?.length || 0 }} 种商品</span>
                  <span>总数量：{{ getTotalQuantity(order.order_items) }} 件</span>
                </div>
              </div>

              <div class="order-amount">
                <div class="amount-line">
                  <span>商品总额：</span>
                  <span>¥{{ order.total_amount.toFixed(2) }}</span>
                </div>
                <div class="amount-line final-amount">
                  <span>实付金额：</span>
                  <span class="final-price">¥{{ order.final_amount.toFixed(2) }}</span>
                </div>
              </div>

              <div class="order-actions">
                <el-button size="small" @click="viewOrderDetail(order.id)">查看详情</el-button>
                <el-button
                  v-if="order.status === 'paid'"
                  type="primary"
                  size="small"
                  @click="updateOrderStatus(order.id, 'shipped')"
                >
                  发货
                </el-button>
                <el-button
                  v-if="order.status === 'shipped'"
                  type="success"
                  size="small"
                  @click="updateOrderStatus(order.id, 'delivered')"
                >
                  确认送达
                </el-button>
                <el-button
                  v-if="['paid', 'shipped'].includes(order.status)"
                  type="danger"
                  size="small"
                  @click="cancelOrder(order.id)"
                >
                  取消订单
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="pagination.total > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 更新状态对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      :title="`${getStatusActionText(pendingStatus)} - ${currentOrder?.order_number}`"
      width="500px"
    >
      <el-form ref="statusFormRef" :model="statusForm" label-width="80px">
        <el-form-item label="备注信息" prop="merchant_notes">
          <el-input
            v-model="statusForm.merchant_notes"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmStatusUpdate" :loading="updating">
          确认{{ getStatusActionText(pendingStatus) }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 取消订单对话框 -->
    <el-dialog
      v-model="cancelDialogVisible"
      :title="`取消订单 - ${currentOrder?.order_number}`"
      width="500px"
    >
      <el-form ref="cancelFormRef" :model="cancelForm" label-width="80px">
        <el-form-item label="取消原因" prop="cancel_reason">
          <el-input
            v-model="cancelForm.cancel_reason"
            type="textarea"
            :rows="4"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmCancelOrder" :loading="updating">
          确认取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock, Check, SuccessFilled, Money } from '@element-plus/icons-vue'
import { Search, User, Local } from '@icon-park/vue-next'
import {
  getMerchantOrdersApiV1OrdersMerchantListGet,
  getOrderStatsApiV1OrdersMerchantStatsGet,
  updateOrderStatusApiV1OrdersOrderIdStatusPatch,
} from '@/services/api/orders'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const statsLoading = ref(false)
const updating = ref(false)
const orders = ref<API.OrderDetailSchema[]>([])
const stats = ref<API.OrderStatsSchema>({
  total_orders: 0,
  pending_orders: 0,
  paid_orders: 0,
  shipped_orders: 0,
  completed_orders: 0,
  cancelled_orders: 0,
  total_amount: 0,
  paid_amount: 0,
})

// 筛选条件
const filters = reactive({
  status: '' as API.OrderStatus | '',
})

const dateRange = ref<[string, string] | null>(null)
const searchQuery = ref('')

// 分页数据
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 对话框状态
const statusDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const currentOrder = ref<API.OrderDetailSchema | null>(null)
const pendingStatus = ref<API.OrderStatus>('shipped')

// 表单数据
const statusForm = reactive({
  merchant_notes: '',
})

const cancelForm = reactive({
  cancel_reason: '',
})

// 搜索防抖
let searchTimer: number | null = null

// 计算属性
const searchParams = computed(() => ({
  page: pagination.current,
  page_size: pagination.pageSize,
  status: filters.status || undefined,
  start_date: dateRange.value?.[0] || undefined,
  end_date: dateRange.value?.[1] || undefined,
}))

// 获取订单统计
const fetchOrderStats = async () => {
  try {
    statsLoading.value = true
    const response = await getOrderStatsApiV1OrdersMerchantStatsGet()

    if (response.data?.success && response.data.data) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('获取订单统计失败:', error)
    ElMessage.error('获取订单统计失败')
  } finally {
    statsLoading.value = false
  }
}

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await getMerchantOrdersApiV1OrdersMerchantListGet(searchParams.value)

    if (response.data?.success && response.data.data) {
      orders.value = response.data.data.items
      pagination.total = response.data.data.total
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理筛选变化
const handleFilterChange = () => {
  pagination.current = 1
  fetchOrders()
}

// 处理日期变化
const handleDateChange = () => {
  pagination.current = 1
  fetchOrders()
}

// 处理搜索
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    pagination.current = 1
    fetchOrders()
  }, 500)
}

// 重置筛选
const resetFilters = () => {
  filters.status = ''
  dateRange.value = null
  searchQuery.value = ''
  pagination.current = 1
  fetchOrders()
}

// 导出订单
const exportOrders = () => {
  ElMessage.info('导出功能开发中...')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.current = 1
  fetchOrders()
}

const handleCurrentChange = (page: number) => {
  pagination.current = page
  fetchOrders()
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/merchant/orders/${orderId}`)
}

// 更新订单状态
const updateOrderStatus = (orderId: number, status: API.OrderStatus) => {
  const order = orders.value.find((o) => o.id === orderId)
  if (!order) return

  currentOrder.value = order
  pendingStatus.value = status
  statusForm.merchant_notes = ''
  statusDialogVisible.value = true
}

// 确认状态更新
const confirmStatusUpdate = async () => {
  if (!currentOrder.value) return

  try {
    updating.value = true
    const response = await updateOrderStatusApiV1OrdersOrderIdStatusPatch(
      { order_id: currentOrder.value.id },
      {
        status: pendingStatus.value,
        merchant_notes: statusForm.merchant_notes || undefined,
      },
    )

    if (response.data?.success) {
      ElMessage.success(`订单已${getStatusActionText(pendingStatus.value)}`)
      statusDialogVisible.value = false
      fetchOrders()
      fetchOrderStats()
    }
  } catch (error) {
    console.error('更新订单状态失败:', error)
    ElMessage.error('更新订单状态失败')
  } finally {
    updating.value = false
  }
}

// 取消订单
const cancelOrder = (orderId: number) => {
  const order = orders.value.find((o) => o.id === orderId)
  if (!order) return

  currentOrder.value = order
  cancelForm.cancel_reason = ''
  cancelDialogVisible.value = true
}

// 确认取消订单
const confirmCancelOrder = async () => {
  if (!currentOrder.value) return

  try {
    updating.value = true
    const response = await updateOrderStatusApiV1OrdersOrderIdStatusPatch(
      { order_id: currentOrder.value.id },
      {
        status: 'cancelled',
        cancel_reason: cancelForm.cancel_reason,
      },
    )

    if (response.data?.success) {
      ElMessage.success('订单已取消')
      cancelDialogVisible.value = false
      fetchOrders()
      fetchOrderStats()
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  } finally {
    updating.value = false
  }
}

// 计算商品总数量
const getTotalQuantity = (items?: API.OrderItemResponseSchema[]) => {
  if (!items) return 0
  return items.reduce((total, item) => total + item.quantity, 0)
}

// 获取状态类型
const getStatusType = (status: API.OrderStatus) => {
  const statusTypeMap: Record<API.OrderStatus, string> = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    delivered: 'success',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'info',
  }
  return statusTypeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: API.OrderStatus) => {
  const statusTextMap: Record<API.OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已送达',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return statusTextMap[status] || '未知'
}

// 获取状态操作文本
const getStatusActionText = (status: API.OrderStatus) => {
  const actionTextMap: Record<API.OrderStatus, string> = {
    pending: '确认',
    paid: '发货',
    shipped: '发货',
    delivered: '送达',
    completed: '完成',
    cancelled: '取消',
    refunded: '退款',
  }
  return actionTextMap[status] || '更新'
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 初始化
onMounted(() => {
  fetchOrderStats()
  fetchOrders()
})
</script>

<style scoped>
.orders-view {
  padding: 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 8px 0 0 0;
  font-size: 24px;
  font-weight: 500;
  color: #1f2937;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.stat-icon.pending {
  background: #fef3cd;
  color: #f59e0b;
}

.stat-icon.paid {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-icon.completed {
  background: #d1fae5;
  color: #10b981;
}

.stat-icon.revenue {
  background: #fce7f3;
  color: #ec4899;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* 筛选卡片 */
.filter-card {
  margin-bottom: 20px;
}

.filter-actions {
  text-align: right;
}

/* 订单卡片 */
.orders-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.order-stats {
  color: #6b7280;
  font-size: 14px;
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  margin-bottom: 0;
}

.order-card {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number {
  font-weight: 500;
  color: #1f2937;
}

.order-date {
  font-size: 12px;
  color: #6b7280;
}

/* 订单内容 */
.order-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  align-items: start;
}

/* 客户信息 */
.order-customer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.customer-name {
  font-weight: 500;
  color: #1f2937;
}

.customer-phone {
  color: #6b7280;
}

.delivery-address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

/* 订单商品 */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.items-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #6b7280;
}

/* 订单金额 */
.order-amount {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.amount-line {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  min-width: 120px;
}

.amount-line.final-amount {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  border-top: 1px solid #e5e7eb;
  padding-top: 4px;
  margin-top: 4px;
}

.final-price {
  color: #f59e0b;
  font-weight: 600;
}

/* 订单操作 */
.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.order-actions .el-button {
  width: 80px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 加载和空状态 */
.loading-container,
.empty-container {
  padding: 40px;
  text-align: center;
}

/* 响应式 */
@media (max-width: 1200px) {
  .order-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .order-actions {
    flex-direction: row;
    justify-content: flex-start;
  }

  .order-actions .el-button {
    width: auto;
  }
}
</style>
