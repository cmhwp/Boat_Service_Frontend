<template>
  <div class="order-detail-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="!order" class="empty-container">
      <el-empty description="订单不存在">
        <el-button @click="$router.push('/merchant/orders')">返回订单列表</el-button>
      </el-empty>
    </div>

    <div v-else class="order-detail">
      <!-- 页面头部 -->
      <div class="page-header">
        <el-breadcrumb>
          <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
          <el-breadcrumb-item to="/merchant/orders">订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-actions">
          <el-button @click="$router.push('/merchant/orders')">返回列表</el-button>
          <el-button
            v-if="order.status === 'paid'"
            type="primary"
            @click="updateOrderStatus('shipped')"
          >
            发货
          </el-button>
          <el-button
            v-if="order.status === 'shipped'"
            type="success"
            @click="updateOrderStatus('delivered')"
          >
            确认送达
          </el-button>
          <el-button
            v-if="['paid', 'shipped'].includes(order.status)"
            type="danger"
            @click="cancelOrder"
          >
            取消订单
          </el-button>
        </div>
      </div>

      <!-- 订单状态条 -->
      <el-card class="status-card">
        <div class="status-header">
          <h2>订单号：{{ order.order_number }}</h2>
          <el-tag :type="getStatusType(order.status)" size="large">
            {{ getStatusText(order.status) }}
          </el-tag>
        </div>
        <div class="status-timeline">
          <el-steps :active="getStatusStep(order.status)" finish-status="success">
            <el-step title="订单创建" :description="formatDateTime(order.created_at)" />
            <el-step
              title="支付完成"
              :description="order.paid_at ? formatDateTime(order.paid_at) : ''"
            />
            <el-step
              title="商家发货"
              :description="order.shipped_at ? formatDateTime(order.shipped_at) : ''"
            />
            <el-step
              title="确认送达"
              :description="order.delivered_at ? formatDateTime(order.delivered_at) : ''"
            />
            <el-step
              title="订单完成"
              :description="order.completed_at ? formatDateTime(order.completed_at) : ''"
            />
          </el-steps>
        </div>
      </el-card>

      <!-- 收货信息 -->
      <el-card class="customer-info-card">
        <template #header>
          <h3>收货信息</h3>
        </template>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="info-group">
              <div class="info-item">
                <span class="label">收货人：</span>
                <span class="value">{{ order.receiver_name }}</span>
              </div>
              <div class="info-item">
                <span class="label">联系电话：</span>
                <span class="value">{{ order.receiver_phone }}</span>
              </div>
              <div class="info-item">
                <span class="label">收货地址：</span>
                <span class="value">{{ order.receiver_address }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 商品信息 -->
      <el-card class="order-items-card">
        <template #header>
          <h3>商品信息</h3>
        </template>

        <div class="order-items-table">
          <el-table :data="order.order_items" style="width: 100%" stripe>
            <el-table-column label="商品信息" min-width="300">
              <template #default="{ row }">
                <div class="product-info">
                  <img
                    :src="row.product_image || '/placeholder-product.jpg'"
                    :alt="row.product_name"
                    class="product-image"
                    @error="handleImageError"
                  />
                  <div class="product-details">
                    <h4 class="product-name">{{ row.product_name }}</h4>
                    <p class="product-specs">规格：{{ row.product_unit }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="unit_price" label="单价" width="120" align="right">
              <template #default="{ row }"> ¥{{ row.unit_price.toFixed(2) }} </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100" align="center">
              <template #default="{ row }"> {{ row.quantity }}{{ row.product_unit }} </template>
            </el-table-column>
            <el-table-column prop="total_price" label="小计" width="120" align="right">
              <template #default="{ row }"> ¥{{ row.total_price.toFixed(2) }} </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="order-summary">
          <div class="summary-line">
            <span>商品总额：</span>
            <span>¥{{ order.total_amount.toFixed(2) }}</span>
          </div>
          <div v-if="order.discount_amount > 0" class="summary-line">
            <span>优惠金额：</span>
            <span class="discount">-¥{{ order.discount_amount.toFixed(2) }}</span>
          </div>
          <div v-if="order.shipping_fee > 0" class="summary-line">
            <span>运费：</span>
            <span>¥{{ order.shipping_fee.toFixed(2) }}</span>
          </div>
          <div class="summary-line total">
            <span>实付金额：</span>
            <span class="total-amount">¥{{ order.final_amount.toFixed(2) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 订单备注 -->
      <el-card v-if="order.user_notes || order.merchant_notes" class="notes-card">
        <template #header>
          <h3>订单备注</h3>
        </template>
        <div v-if="order.user_notes" class="note-item">
          <h4>客户备注：</h4>
          <p>{{ order.user_notes }}</p>
        </div>
        <div v-if="order.merchant_notes" class="note-item">
          <h4>商家备注：</h4>
          <p>{{ order.merchant_notes }}</p>
        </div>
      </el-card>

      <!-- 操作记录 -->
      <el-card class="operation-record-card">
        <template #header>
          <h3>操作记录</h3>
        </template>
        <div class="operation-list">
          <div class="operation-item">
            <div class="operation-time">{{ formatDateTime(order.created_at) }}</div>
            <div class="operation-desc">客户创建订单</div>
          </div>
          <div v-if="order.paid_at" class="operation-item">
            <div class="operation-time">{{ formatDateTime(order.paid_at) }}</div>
            <div class="operation-desc">客户完成支付</div>
          </div>
          <div v-if="order.shipped_at" class="operation-item">
            <div class="operation-time">{{ formatDateTime(order.shipped_at) }}</div>
            <div class="operation-desc">商家确认发货</div>
          </div>
          <div v-if="order.delivered_at" class="operation-item">
            <div class="operation-time">{{ formatDateTime(order.delivered_at) }}</div>
            <div class="operation-desc">确认送达</div>
          </div>
          <div v-if="order.completed_at" class="operation-item">
            <div class="operation-time">{{ formatDateTime(order.completed_at) }}</div>
            <div class="operation-desc">订单完成</div>
          </div>
          <div v-if="order.cancelled_at" class="operation-item">
            <div class="operation-time">{{ formatDateTime(order.cancelled_at) }}</div>
            <div class="operation-desc">订单已取消</div>
            <div v-if="order.cancel_reason" class="operation-reason">
              取消原因：{{ order.cancel_reason }}
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 更新状态对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      :title="`${getStatusActionText(pendingStatus)} - ${order?.order_number}`"
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
      :title="`取消订单 - ${order?.order_number}`"
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getMerchantOrderDetailApiV1OrdersMerchantOrderIdGet,
  updateOrderStatusApiV1OrdersOrderIdStatusPatch,
} from '@/services/api/orders'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const updating = ref(false)
const order = ref<API.OrderDetailSchema | null>(null)

// 对话框状态
const statusDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const pendingStatus = ref<API.OrderStatus>('shipped')

// 表单数据
const statusForm = reactive({
  merchant_notes: '',
})

const cancelForm = reactive({
  cancel_reason: '',
})

// 获取订单详情
const fetchOrderDetail = async () => {
  const orderId = Number(route.params.id)
  if (!orderId) {
    ElMessage.error('订单ID无效')
    router.push('/merchant/orders')
    return
  }

  try {
    loading.value = true
    const response = await getMerchantOrderDetailApiV1OrdersMerchantOrderIdGet({
      order_id: orderId,
    })

    if (response.data?.success && response.data.data) {
      order.value = response.data.data
    } else {
      ElMessage.error('订单不存在')
      router.push('/merchant/orders')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
    router.push('/merchant/orders')
  } finally {
    loading.value = false
  }
}

// 更新订单状态
const updateOrderStatus = (status: API.OrderStatus) => {
  if (!order.value) return

  pendingStatus.value = status
  statusForm.merchant_notes = ''
  statusDialogVisible.value = true
}

// 确认状态更新
const confirmStatusUpdate = async () => {
  if (!order.value) return

  try {
    updating.value = true
    const response = await updateOrderStatusApiV1OrdersOrderIdStatusPatch(
      { order_id: order.value.id },
      {
        status: pendingStatus.value,
        merchant_notes: statusForm.merchant_notes || undefined,
      },
    )

    if (response.data?.success) {
      ElMessage.success(`订单已${getStatusActionText(pendingStatus.value)}`)
      statusDialogVisible.value = false
      fetchOrderDetail()
    }
  } catch (error) {
    console.error('更新订单状态失败:', error)
    ElMessage.error('更新订单状态失败')
  } finally {
    updating.value = false
  }
}

// 取消订单
const cancelOrder = () => {
  if (!order.value) return

  cancelForm.cancel_reason = ''
  cancelDialogVisible.value = true
}

// 确认取消订单
const confirmCancelOrder = async () => {
  if (!order.value) return

  try {
    updating.value = true
    const response = await updateOrderStatusApiV1OrdersOrderIdStatusPatch(
      { order_id: order.value.id },
      {
        status: 'cancelled',
        cancel_reason: cancelForm.cancel_reason,
      },
    )

    if (response.data?.success) {
      ElMessage.success('订单已取消')
      cancelDialogVisible.value = false
      fetchOrderDetail()
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  } finally {
    updating.value = false
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

// 获取状态步骤
const getStatusStep = (status: API.OrderStatus) => {
  const stepMap: Record<API.OrderStatus, number> = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    completed: 4,
    cancelled: -1,
    refunded: -1,
  }
  return stepMap[status] || 0
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
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-view {
  padding: 0;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 状态卡片 */
.status-card {
  margin-bottom: 20px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #1f2937;
}

.status-timeline {
  margin-top: 20px;
}

/* 信息卡片 */
.customer-info-card,
.order-items-card,
.notes-card,
.operation-record-card {
  margin-bottom: 20px;
}

.info-group {
  margin-bottom: 20px;
}

.info-group h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  align-items: flex-start;
}

.info-item .label {
  min-width: 80px;
  color: #6b7280;
  font-size: 14px;
}

.info-item .value {
  color: #1f2937;
  font-size: 14px;
  word-break: break-all;
}

/* 商品表格 */
.order-items-table {
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
}

.product-specs {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

/* 订单汇总 */
.order-summary {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.summary-line {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
}

.summary-line.total {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  margin-top: 8px;
}

.discount {
  color: #ef4444;
}

.total-amount {
  color: #f59e0b;
}

/* 备注信息 */
.note-item {
  margin-bottom: 16px;
}

.note-item:last-child {
  margin-bottom: 0;
}

.note-item h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.note-item p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  word-break: break-all;
}

/* 操作记录 */
.operation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operation-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.operation-time {
  min-width: 140px;
  font-size: 12px;
  color: #6b7280;
}

.operation-desc {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.operation-reason {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* 加载和空状态 */
.loading-container,
.empty-container {
  padding: 60px;
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .status-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .product-info {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .operation-item {
    flex-direction: column;
    gap: 8px;
  }

  .operation-time {
    min-width: auto;
  }
}
</style>
