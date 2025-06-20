<template>
  <div class="admin-orders-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>订单管理</h1>
      <p>管理平台所有订单信息</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-card>
        <el-form :model="filterForm" :inline="true" class="filter-form">
          <el-form-item label="订单状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待支付" value="pending" />
              <el-option label="已支付" value="paid" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已送达" value="delivered" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
              <el-option label="已退款" value="refunded" />
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

          <el-form-item label="订单号">
            <el-input
              v-model="filterForm.order_number"
              placeholder="请输入订单号"
              clearable
              style="width: 200px"
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
            <el-button type="primary" @click="searchOrders" :loading="loading">
              <Search theme="outline" size="14" />
              搜索
            </el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 订单列表 -->
    <div class="orders-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>订单列表</span>
            <div class="header-actions">
              <el-button type="primary" @click="refreshData">
                <Refresh theme="outline" size="14" />
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="orders" v-loading="loading" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="order_number" label="订单号" width="160" />
          <el-table-column label="商家/用户" width="150">
            <template #default="{ row }">
              <div>{{ row.merchant_name }}</div>
              <div class="text-secondary">{{ row.user_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="金额信息" width="120">
            <template #default="{ row }">
              <div>总额: ¥{{ row.total_amount }}</div>
              <div>实付: ¥{{ row.final_amount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" width="120">
            <template #default="{ row }">
              <div>{{ row.item_count }}种商品</div>
              <div>共{{ row.total_quantity }}件</div>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" width="100">
            <template #default="{ row }">
              {{ getPaymentMethodText(row.payment_method) }}
            </template>
          </el-table-column>
          <el-table-column label="用户联系方式" width="120">
            <template #default="{ row }">
              {{ row.user_phone || '未提供' }}
            </template>
          </el-table-column>
          <el-table-column label="时间" width="100">
            <template #default="{ row }">
              <div>{{ formatDate(row.created_at) }}</div>
              <div v-if="row.paid_at" class="text-secondary">付: {{ formatDate(row.paid_at) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="viewDetail(row.id)"> 详情 </el-button>
              <el-dropdown @command="(command: any) => handleOperation(command, row)">
                <el-button size="small" type="primary">
                  操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-if="row.status !== 'cancelled' && row.status !== 'completed'"
                      command="force_cancel"
                    >
                      强制取消
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="row.status === 'paid' || row.status === 'shipped'"
                      command="refund"
                    >
                      处理退款
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="订单详情" width="900px">
      <div v-if="selectedOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{
            selectedOrder.order_number
          }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ selectedOrder.user_id }}</el-descriptions-item>
          <el-descriptions-item label="商家ID">{{
            selectedOrder.merchant_id
          }}</el-descriptions-item>
          <el-descriptions-item label="订单总金额"
            >¥{{ selectedOrder.total_amount }}</el-descriptions-item
          >
          <el-descriptions-item label="优惠金额"
            >¥{{ selectedOrder.discount_amount }}</el-descriptions-item
          >
          <el-descriptions-item label="运费"
            >¥{{ selectedOrder.shipping_fee }}</el-descriptions-item
          >
          <el-descriptions-item label="实付金额"
            >¥{{ selectedOrder.final_amount }}</el-descriptions-item
          >
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(selectedOrder.status)">
              {{ getStatusText(selectedOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{
            getPaymentMethodText(selectedOrder.payment_method)
          }}</el-descriptions-item>
          <el-descriptions-item label="收货人">{{
            selectedOrder.receiver_name
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            selectedOrder.receiver_phone
          }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{
            selectedOrder.receiver_address
          }}</el-descriptions-item>
          <el-descriptions-item label="用户备注" :span="2">{{
            selectedOrder.user_notes || '无'
          }}</el-descriptions-item>
          <el-descriptions-item label="商家备注" :span="2">{{
            selectedOrder.merchant_notes || '无'
          }}</el-descriptions-item>
          <el-descriptions-item v-if="selectedOrder.cancel_reason" label="取消原因" :span="2">{{
            selectedOrder.cancel_reason
          }}</el-descriptions-item>
        </el-descriptions>

        <!-- 时间信息 -->
        <div class="time-info">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{
              formatDateTime(selectedOrder.created_at)
            }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{
              formatDateTime(selectedOrder.updated_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.paid_at" label="支付时间">{{
              formatDateTime(selectedOrder.paid_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.shipped_at" label="发货时间">{{
              formatDateTime(selectedOrder.shipped_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.delivered_at" label="送达时间">{{
              formatDateTime(selectedOrder.delivered_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.completed_at" label="完成时间">{{
              formatDateTime(selectedOrder.completed_at)
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.cancelled_at" label="取消时间">{{
              formatDateTime(selectedOrder.cancelled_at)
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 用户信息 -->
        <div v-if="selectedOrder.user" class="user-info">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{
              selectedOrder.user.username
            }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ selectedOrder.user.email }}</el-descriptions-item>
            <el-descriptions-item label="手机">{{
              selectedOrder.user.phone || '未填写'
            }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ selectedOrder.user.role }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 商家信息 -->
        <div v-if="selectedOrder.merchant" class="merchant-info">
          <h4>商家信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="商家名称">{{
              selectedOrder.merchant.merchant_name
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              selectedOrder.merchant.contact_phone
            }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{
              selectedOrder.merchant.address || '未填写'
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 订单商品 -->
        <div
          v-if="selectedOrder.order_items && selectedOrder.order_items.length > 0"
          class="order-items"
        >
          <h4>订单商品</h4>
          <el-table :data="selectedOrder.order_items" size="small">
            <el-table-column prop="product_name" label="商品名称" />
            <el-table-column prop="unit_price" label="单价">
              <template #default="{ row }"> ¥{{ row.unit_price }} </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="product_unit" label="单位" />
            <el-table-column prop="total_price" label="小计">
              <template #default="{ row }"> ¥{{ row.total_price }} </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 支付记录 -->
        <div
          v-if="selectedOrder.payment_records && selectedOrder.payment_records.length > 0"
          class="payment-records"
        >
          <h4>支付记录</h4>
          <el-table :data="selectedOrder.payment_records" size="small">
            <el-table-column prop="payment_number" label="支付单号" />
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }"> ¥{{ row.amount }} </template>
            </el-table-column>
            <el-table-column prop="payment_method" label="支付方式">
              <template #default="{ row }">
                {{ getPaymentMethodText(row.payment_method) }}
              </template>
            </el-table-column>
            <el-table-column prop="is_success" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.is_success ? 'success' : 'danger'">
                  {{ row.is_success ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 操作确认对话框 -->
    <el-dialog v-model="operationDialogVisible" title="订单操作" width="500px">
      <el-form
        ref="operationFormRef"
        :model="operationForm"
        :rules="operationRules"
        label-width="80px"
      >
        <el-form-item label="操作类型">
          <span>{{ getOperationText(operationForm.operation) }}</span>
        </el-form-item>
        <el-form-item label="操作原因" prop="reason">
          <el-input
            v-model="operationForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入操作原因"
          />
        </el-form-item>
        <el-form-item label="管理员备注">
          <el-input
            v-model="operationForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入管理员备注（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="operationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmOperation" :loading="operationSubmitting">
          确认操作
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { Search, Refresh } from '@icon-park/vue-next'
import {
  adminGetAllOrdersApiV1OrdersAdminAllGet,
  adminGetOrderDetailApiV1OrdersAdminOrderIdGet,
  adminOperateOrderApiV1OrdersAdminOrderIdOperatePost,
} from '@/services/api/orders'

// 响应式数据
const loading = ref(false)
const orders = ref<API.AdminOrderListItemSchema[]>([])
const detailDialogVisible = ref(false)
const operationDialogVisible = ref(false)
const operationSubmitting = ref(false)
const selectedOrder = ref<API.AdminOrderDetailSchema | null>(null)
const selectedOrderForOperation = ref<API.AdminOrderListItemSchema | null>(null)
const operationFormRef = ref<FormInstance>()

// 筛选表单
const filterForm = reactive({
  status: '',
  merchant_id: '',
  user_id: '',
  order_number: '',
  dateRange: [] as string[],
})

// 分页数据
const pagination = reactive({
  page: 1,
  page_size: 20,
  total: 0,
})

// 操作表单
const operationForm = reactive({
  operation: '',
  reason: '',
  notes: '',
})

// 操作表单验证规则
const operationRules: FormRules = {
  reason: [{ required: true, message: '请输入操作原因', trigger: 'blur' }],
}

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true
    const params: API.adminGetAllOrdersApiV1OrdersAdminAllGetParams = {
      page: pagination.page,
      page_size: pagination.page_size,
    }

    // 添加筛选条件
    if (filterForm.status) {
      params.status = filterForm.status as API.OrderStatus
    }
    if (filterForm.merchant_id) {
      params.merchant_id = Number(filterForm.merchant_id)
    }
    if (filterForm.user_id) {
      params.user_id = Number(filterForm.user_id)
    }
    if (filterForm.order_number) {
      params.order_number = filterForm.order_number
    }
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      params.start_date = filterForm.dateRange[0]
      params.end_date = filterForm.dateRange[1]
    }

    const response = await adminGetAllOrdersApiV1OrdersAdminAllGet(params)

    if (response.data?.success && response.data.data) {
      orders.value = response.data.data.items || []
      pagination.total = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索订单
const searchOrders = () => {
  pagination.page = 1
  fetchOrders()
}

// 重置筛选
const resetFilter = () => {
  filterForm.status = ''
  filterForm.merchant_id = ''
  filterForm.user_id = ''
  filterForm.order_number = ''
  filterForm.dateRange = []
  pagination.page = 1
  fetchOrders()
}

// 刷新数据
const refreshData = () => {
  fetchOrders()
}

// 查看详情
const viewDetail = async (orderId: number) => {
  try {
    const response = await adminGetOrderDetailApiV1OrdersAdminOrderIdGet({
      order_id: orderId,
    })

    if (response.data?.success && response.data.data) {
      selectedOrder.value = response.data.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 处理操作
const handleOperation = (operation: string, order: API.AdminOrderListItemSchema) => {
  selectedOrderForOperation.value = order
  operationForm.operation = operation
  operationForm.reason = ''
  operationForm.notes = ''
  operationDialogVisible.value = true
}

// 确认操作
const confirmOperation = async () => {
  if (!operationFormRef.value || !selectedOrderForOperation.value) return

  try {
    await operationFormRef.value.validate()
  } catch {
    return
  }

  try {
    operationSubmitting.value = true
    await adminOperateOrderApiV1OrdersAdminOrderIdOperatePost(
      { order_id: selectedOrderForOperation.value.id },
      {
        operation: operationForm.operation,
        reason: operationForm.reason,
        notes: operationForm.notes,
      },
    )

    ElMessage.success('操作成功')
    operationDialogVisible.value = false
    await fetchOrders()
  } catch (error: any) {
    console.error('操作失败:', error)
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    operationSubmitting.value = false
  }
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
    paid: 'success',
    shipped: 'primary',
    delivered: 'info',
    completed: 'success',
    cancelled: 'info',
    refunded: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已送达',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return statusMap[status] || status
}

// 获取支付方式文本
const getPaymentMethodText = (method: string | null | undefined) => {
  if (!method) return '未支付'
  const methodMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    bankcard: '银行卡',
    balance: '余额支付',
  }
  return methodMap[method] || method
}

// 获取操作文本
const getOperationText = (operation: string) => {
  const operationMap: Record<string, string> = {
    force_cancel: '强制取消订单',
    refund: '处理退款',
  }
  return operationMap[operation] || operation
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.page_size = val
  pagination.page = 1
  fetchOrders()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchOrders()
}

// 页面加载时获取数据
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.admin-orders-view {
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

.orders-section {
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

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.order-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.time-info,
.user-info,
.merchant-info,
.order-items,
.payment-records {
  margin-top: 20px;
}

.time-info h4,
.user-info h4,
.merchant-info h4,
.order-items h4,
.payment-records h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}
</style>
