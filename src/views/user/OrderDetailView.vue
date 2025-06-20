<template>
  <div class="order-detail-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="!order" class="empty-container">
      <el-empty description="订单不存在">
        <el-button @click="$router.push('/user/orders')">返回订单列表</el-button>
      </el-empty>
    </div>

    <div v-else class="order-detail">
      <!-- 订单基本信息 -->
      <el-card class="order-info-card">
        <template #header>
          <div class="card-header">
            <h3>订单信息</h3>
            <el-tag :type="getStatusType(order.status)" size="large">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>
        </template>

        <el-row :gutter="24">
          <el-col :span="12">
            <div class="info-group">
              <h4>订单基本信息</h4>
              <div class="info-item">
                <span class="label">订单号：</span>
                <span class="value">{{ order.order_number }}</span>
              </div>
              <div class="info-item">
                <span class="label">下单时间：</span>
                <span class="value">{{ formatDateTime(order.created_at) }}</span>
              </div>
              <div v-if="order.paid_at" class="info-item">
                <span class="label">支付时间：</span>
                <span class="value">{{ formatDateTime(order.paid_at) }}</span>
              </div>
              <div v-if="order.shipped_at" class="info-item">
                <span class="label">发货时间：</span>
                <span class="value">{{ formatDateTime(order.shipped_at) }}</span>
              </div>
              <div v-if="order.completed_at" class="info-item">
                <span class="label">完成时间：</span>
                <span class="value">{{ formatDateTime(order.completed_at) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-group">
              <h4>金额信息</h4>
              <div class="amount-details">
                <div class="amount-line">
                  <span>商品总额：</span>
                  <span>¥{{ order.total_amount.toFixed(2) }}</span>
                </div>
                <div class="amount-line">
                  <span>优惠金额：</span>
                  <span class="discount">-¥{{ order.discount_amount.toFixed(2) }}</span>
                </div>
                <div class="amount-line">
                  <span>运费：</span>
                  <span>¥{{ order.shipping_fee.toFixed(2) }}</span>
                </div>
                <div class="amount-line total-line">
                  <span>实付金额：</span>
                  <span class="final-amount">¥{{ order.final_amount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 订单状态追踪 -->
      <el-card class="status-track-card">
        <template #header>
          <h3>订单状态追踪</h3>
        </template>
        <el-steps :active="getStatusStep(order.status)" align-center>
          <el-step title="订单提交" :description="formatDateTime(order.created_at)" />
          <el-step
            title="支付完成"
            :description="order.paid_at ? formatDateTime(order.paid_at) : ''"
          />
          <el-step
            title="商家发货"
            :description="order.shipped_at ? formatDateTime(order.shipped_at) : ''"
          />
          <el-step
            title="确认收货"
            :description="order.completed_at ? formatDateTime(order.completed_at) : ''"
          />
        </el-steps>
      </el-card>

      <!-- 商品信息 -->
      <el-card class="order-items-card">
        <template #header>
          <div class="card-header">
            <h3>商品信息</h3>
            <div class="merchant-info">
              <stock-market theme="outline" size="16" />
              <span>{{ order.merchant?.merchant_name }}</span>
            </div>
          </div>
        </template>

        <div class="order-items-list">
          <div v-for="item in order.order_items" :key="item.id" class="order-item">
            <div class="item-image">
              <img
                :src="item.product_image || '/placeholder-product.jpg'"
                :alt="item.product_name"
                @error="handleImageError"
                @click="viewProduct(item.product_id)"
              />
            </div>
            <div class="item-info">
              <h4 class="product-name" @click="viewProduct(item.product_id)">
                {{ item.product_name }}
              </h4>
              <div class="product-specs">
                <span class="unit-price"
                  >单价：¥{{ item.unit_price.toFixed(2) }}/{{ item.product_unit }}</span
                >
                <span class="quantity">数量：{{ item.quantity }}{{ item.product_unit }}</span>
              </div>
            </div>
            <div class="item-total">
              <span class="total-price">¥{{ item.total_price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 收货信息 -->
      <el-card class="delivery-info-card">
        <template #header>
          <h3>收货信息</h3>
        </template>
        <div class="delivery-details">
          <div class="delivery-item">
            <user theme="outline" size="16" />
            <span>{{ order.receiver_name }}</span>
          </div>
          <div class="delivery-item">
            <phone theme="outline" size="16" />
            <span>{{ order.receiver_phone }}</span>
          </div>
          <div class="delivery-item">
            <local theme="outline" size="16" />
            <span>{{ order.receiver_address }}</span>
          </div>
        </div>
      </el-card>

      <!-- 备注信息 -->
      <el-card v-if="order.user_notes || order.merchant_notes" class="notes-card">
        <template #header>
          <h3>备注信息</h3>
        </template>
        <div v-if="order.user_notes" class="note-item">
          <h4>用户备注：</h4>
          <p>{{ order.user_notes }}</p>
        </div>
        <div v-if="order.merchant_notes" class="note-item">
          <h4>商家备注：</h4>
          <p>{{ order.merchant_notes }}</p>
        </div>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button @click="$router.push('/user/orders')"> 返回订单列表 </el-button>
        <el-button v-if="order.status === 'pending'" type="primary" @click="payOrder">
          立即支付
        </el-button>
        <el-button v-if="order.status === 'pending'" type="danger" @click="cancelOrder">
          取消订单
        </el-button>
        <el-button v-if="order.status === 'delivered'" type="success" @click="confirmOrder">
          确认收货
        </el-button>
        <el-button v-if="order.status === 'completed'" @click="repurchaseOrder">
          再次购买
        </el-button>
      </div>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { StockMarket, User, Phone, Local, Wallet, BankCard, PaperMoney } from '@icon-park/vue-next'
import {
  getOrderDetailApiV1OrdersOrderIdGet,
  cancelOrderApiV1OrdersOrderIdCancelPatch,
  confirmReceiptApiV1OrdersOrderIdConfirmReceiptPatch,
  createPaymentApiV1OrdersPaymentPost,
} from '@/services/api/orders'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const paying = ref(false)
const order = ref<API.OrderDetailSchema | null>(null)
const paymentDialogVisible = ref(false)
const selectedPaymentMethod = ref<API.PaymentMethod>('alipay')

// 计算属性
const orderId = computed(() => Number(route.params.id))

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    loading.value = true
    const response = await getOrderDetailApiV1OrdersOrderIdGet({
      order_id: orderId.value,
    })

    if (response.data?.success && response.data.data) {
      order.value = response.data.data
    } else {
      ElMessage.error('订单不存在')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 支付订单
const payOrder = () => {
  paymentDialogVisible.value = true
}

// 确认支付
const confirmPayment = async () => {
  if (!order.value) return

  try {
    paying.value = true
    const response = await createPaymentApiV1OrdersPaymentPost({
      order_id: order.value.id,
      payment_method: selectedPaymentMethod.value,
    })

    if (response.data?.success) {
      if (response.data.data?.is_success) {
        ElMessage.success('支付成功')
        paymentDialogVisible.value = false
        fetchOrderDetail()
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
const cancelOrder = async () => {
  if (!order.value) return

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

    const response = await cancelOrderApiV1OrdersOrderIdCancelPatch(
      { order_id: order.value.id },
      reason,
    )

    if (response.data?.success) {
      ElMessage.success('订单已取消')
      fetchOrderDetail()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

// 确认收货
const confirmOrder = async () => {
  if (!order.value) return

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
      { order_id: order.value.id },
      notes || null,
    )

    if (response.data?.success) {
      ElMessage.success('已确认收货')
      fetchOrderDetail()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  }
}

// 再次购买
const repurchaseOrder = () => {
  ElMessage.info('功能开发中...')
}

// 查看商品详情
const viewProduct = (productId: number) => {
  router.push(`/user/products/${productId}`)
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

// 获取状态步骤
const getStatusStep = (status: API.OrderStatus) => {
  const stepMap = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    completed: 4,
    cancelled: 0,
    refunded: 0,
  }
  return stepMap[status] || 0
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

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
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

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
}

.info-group h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.label {
  color: #666;
  min-width: 80px;
}

.value {
  color: #333;
  flex: 1;
}

.amount-details {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.amount-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.amount-line:last-child {
  margin-bottom: 0;
}

.discount {
  color: #52c41a;
}

.total-line {
  font-weight: 600;
  font-size: 16px;
  border-top: 1px solid #e8e8e8;
  padding-top: 8px;
  margin-top: 8px;
}

.final-amount {
  color: #ff4d4f;
  font-size: 18px;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-name:hover {
  color: #1890ff;
}

.product-specs {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.item-total {
  flex-shrink: 0;
  text-align: right;
}

.total-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

.delivery-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.note-item {
  margin-bottom: 16px;
}

.note-item:last-child {
  margin-bottom: 0;
}

.note-item h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.note-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 0;
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
  .order-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-total {
    text-align: left;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .product-specs {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
