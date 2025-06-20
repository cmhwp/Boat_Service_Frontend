<template>
  <div class="orders-view">
    <!-- 订单状态筛选 -->
    <div class="filter-section">
      <el-card>
        <el-row :gutter="16" align="middle">
          <el-col :span="4">
            <el-select
              v-model="selectedStatus"
              placeholder="订单状态"
              clearable
              @change="handleStatusChange"
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
              placeholder="搜索订单号或商品名称"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <search theme="outline" size="16" />
              </template>
            </el-input>
          </el-col>
          <el-col :span="6" class="header-actions">
            <el-button @click="$router.push('/user/products')">
              <shopping-cart theme="outline" size="16" />
              继续购物
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 订单列表 -->
    <div class="orders-section">
      <el-card>
        <template #header>
          <div class="section-header">
            <h3>我的订单</h3>
            <div class="order-stats">
              <span>共 {{ total }} 个订单</span>
            </div>
          </div>
        </template>

        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="4" animated />
        </div>

        <div v-else-if="orders.length === 0" class="empty-container">
          <el-empty description="暂无订单">
            <el-button type="primary" @click="$router.push('/user/products')"> 去购物 </el-button>
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
                <div class="order-items">
                  <div class="merchant-info">
                    <stock-market theme="outline" size="16" />
                    <span>{{ order.merchant_name }}</span>
                  </div>
                  <div class="items-summary">
                    <span>共 {{ order.item_count }} 种商品，{{ order.total_quantity }} 件</span>
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
                  <el-button size="small" @click="viewOrderDetail(order.id)"> 查看详情 </el-button>
                  <el-button
                    v-if="order.status === 'pending'"
                    type="primary"
                    size="small"
                    @click="payOrder(order.id)"
                  >
                    立即支付
                  </el-button>
                  <el-button
                    v-if="order.status === 'pending'"
                    type="danger"
                    size="small"
                    @click="cancelOrder(order.id)"
                  >
                    取消订单
                  </el-button>
                  <el-button
                    v-if="order.status === 'delivered'"
                    type="success"
                    size="small"
                    @click="confirmOrder(order.id)"
                  >
                    确认收货
                  </el-button>
                  <el-button
                    v-if="order.status === 'completed'"
                    size="small"
                    @click="repurchaseOrder(order.id)"
                  >
                    再次购买
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 支付对话框 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="选择支付方式"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="payment-methods">
        <el-radio-group v-model="selectedPaymentMethod">
          <el-radio label="alipay">
            <div class="payment-option">
              <wallet theme="outline" size="20" />
              <span>支付宝</span>
            </div>
          </el-radio>
          <el-radio label="wechat">
            <div class="payment-option">
              <wallet theme="outline" size="20" />
              <span>微信支付</span>
            </div>
          </el-radio>
          <el-radio label="bankcard">
            <div class="payment-option">
              <bank-card theme="outline" size="20" />
              <span>银行卡</span>
            </div>
          </el-radio>
          <el-radio label="balance">
            <div class="payment-option">
              <paper-money theme="outline" size="20" />
              <span>余额支付</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="paymentDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="paying" @click="confirmPayment"> 确认支付 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  ShoppingCart,
  StockMarket,
  Wallet,
  BankCard,
  PaperMoney,
} from '@icon-park/vue-next'
import {
  getMyOrdersApiV1OrdersMyGet,
  cancelOrderApiV1OrdersOrderIdCancelPatch,
  confirmReceiptApiV1OrdersOrderIdConfirmReceiptPatch,
} from '@/services/api/orders'
import { createPaymentApiV1OrdersPaymentPost } from '@/services/api/orders'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const paying = ref(false)
const orders = ref<API.OrderListItemSchema[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedStatus = ref<API.OrderStatus | ''>('')
const dateRange = ref<[string, string] | null>(null)
const searchQuery = ref('')
const paymentDialogVisible = ref(false)
const selectedPaymentMethod = ref<API.PaymentMethod>('alipay')
const currentOrderId = ref<number | null>(null)

// 搜索防抖
let searchTimer: number | null = null

// 计算属性
const searchParams = computed(() => ({
  page: currentPage.value,
  page_size: pageSize.value,
  status: selectedStatus.value || undefined,
  start_date: dateRange.value?.[0] || undefined,
  end_date: dateRange.value?.[1] || undefined,
}))

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await getMyOrdersApiV1OrdersMyGet(searchParams.value)

    if (response.data?.success && response.data.data) {
      orders.value = response.data.data.items
      total.value = response.data.data.total
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理状态变化
const handleStatusChange = () => {
  currentPage.value = 1
  fetchOrders()
}

// 处理日期变化
const handleDateChange = () => {
  currentPage.value = 1
  fetchOrders()
}

// 处理搜索
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchOrders()
  }, 500)
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchOrders()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchOrders()
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/user/orders/${orderId}`)
}

// 支付订单
const payOrder = (orderId: number) => {
  currentOrderId.value = orderId
  paymentDialogVisible.value = true
}

// 确认支付
const confirmPayment = async () => {
  if (!currentOrderId.value) return

  try {
    paying.value = true
    const response = await createPaymentApiV1OrdersPaymentPost({
      order_id: currentOrderId.value,
      payment_method: selectedPaymentMethod.value,
    })

    if (response.data?.success) {
      if (response.data.data?.is_success) {
        ElMessage.success('支付成功')
        paymentDialogVisible.value = false
        fetchOrders()
      } else {
        ElMessage.error('支付失败，请重试')
      }
    }
  } catch (error) {
    console.error('支付失败:', error)
    ElMessage.error('支付失败')
  } finally {
    paying.value = false
  }
}

// 取消订单
const cancelOrder = async (orderId: number) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入取消原因', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请输入取消原因...',
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return '请输入取消原因'
        }
        return true
      },
    })

    const response = await cancelOrderApiV1OrdersOrderIdCancelPatch({ order_id: orderId }, reason)

    if (response.data?.success) {
      ElMessage.success('订单已取消')
      fetchOrders()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

// 确认收货
const confirmOrder = async (orderId: number) => {
  try {
    const { value: notes } = await ElMessageBox.prompt(
      '确认已收到商品？可添加收货备注',
      '确认收货',
      {
        confirmButtonText: '确认收货',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入收货备注（可选）...',
        inputValidator: () => true, // 备注是可选的，所以总是返回true
      },
    )

    const response = await confirmReceiptApiV1OrdersOrderIdConfirmReceiptPatch(
      { order_id: orderId },
      notes || null,
    )

    if (response.data?.success) {
      ElMessage.success('已确认收货')
      fetchOrders()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  }
}

// 再次购买
const repurchaseOrder = (orderId: number) => {
  // 这里可以实现将订单中的商品重新添加到购物车的逻辑
  ElMessage.info('功能开发中...')
}

// 获取状态类型
const getStatusType = (status: API.OrderStatus) => {
  const statusMap = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    delivered: 'success',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'info',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: API.OrderStatus) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已送达',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return statusMap[status] || '未知'
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
  fetchOrders()
})
</script>

<style scoped>
.orders-view {
  padding: 0;
}

.filter-section {
  margin-bottom: 20px;
}

.header-actions {
  text-align: right;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  color: #333;
}

.order-stats {
  color: #666;
  font-size: 14px;
}

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.order-item {
  width: 100%;
}

.order-card {
  width: 100%;
}

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
  color: #333;
}

.order-date {
  font-size: 12px;
  color: #999;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.order-items {
  flex: 1;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.items-summary {
  color: #999;
  font-size: 14px;
}

.order-amount {
  min-width: 120px;
  text-align: right;
}

.amount-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.final-amount {
  font-weight: 600;
  color: #333;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.final-price {
  color: #ff4d4f;
  font-size: 16px;
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 100px;
}

.pagination-container {
  margin-top: 24px;
  text-align: center;
}

.payment-methods {
  padding: 20px 0;
}

.payment-methods .el-radio {
  display: block;
  margin-bottom: 16px;
  height: auto;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  transition: all 0.2s;
}

.payment-methods .el-radio.is-checked .payment-option {
  border-color: #1890ff;
  background: #f6ffed;
}

@media (max-width: 768px) {
  .order-content {
    flex-direction: column;
    gap: 16px;
  }

  .order-amount {
    width: 100%;
    text-align: left;
  }

  .order-actions {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: auto;
  }

  .filter-section .el-row {
    flex-direction: column;
    gap: 12px;
  }

  .filter-section .el-col {
    width: 100%;
  }
}
</style>
