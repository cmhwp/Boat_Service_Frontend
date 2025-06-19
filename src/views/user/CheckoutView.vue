<template>
  <div class="checkout-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else class="checkout-content">
      <!-- 收货地址 -->
      <el-card class="address-card">
        <template #header>
          <div class="card-header">
            <h3>收货地址</h3>
          </div>
        </template>

        <el-form
          ref="addressFormRef"
          :model="addressForm"
          :rules="addressRules"
          label-width="100px"
        >
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="收货人" prop="receiver_name">
                <el-input v-model="addressForm.receiver_name" placeholder="请输入收货人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="receiver_phone">
                <el-input v-model="addressForm.receiver_phone" placeholder="请输入手机号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="收货地址" prop="receiver_address">
            <el-input
              v-model="addressForm.receiver_address"
              type="textarea"
              :rows="3"
              placeholder="请输入详细收货地址"
            />
          </el-form-item>
          <el-form-item label="订单备注">
            <el-input
              v-model="addressForm.user_notes"
              type="textarea"
              :rows="2"
              placeholder="选填，对本次订单的说明（选填）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 商品信息 -->
      <el-card class="products-card">
        <template #header>
          <div class="card-header">
            <h3>商品信息</h3>
          </div>
        </template>

        <div v-if="checkoutType === 'cart'" class="cart-products">
          <div v-for="item in cartItems" :key="item.id" class="product-item">
            <div class="product-image">
              <img
                :src="item.product?.images?.[0] || '/placeholder-product.jpg'"
                :alt="item.product?.name"
                @error="handleImageError"
              />
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ item.product?.name }}</h4>
              <div class="product-meta">
                <span class="category">{{ getCategoryText(item.product?.category) }}</span>
                <span class="price">¥{{ item.product?.price }}/{{ item.product?.unit }}</span>
              </div>
            </div>
            <div class="product-quantity">
              <span>数量：{{ item.quantity }}{{ item.product?.unit }}</span>
            </div>
            <div class="product-subtotal">
              <span class="subtotal">¥{{ item.subtotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="checkoutType === 'direct'" class="direct-product">
          <div class="product-item">
            <div class="product-image">
              <img
                :src="directProduct?.images?.[0] || '/placeholder-product.jpg'"
                :alt="directProduct?.name"
                @error="handleImageError"
              />
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ directProduct?.name }}</h4>
              <div class="product-meta">
                <span class="category">{{ getCategoryText(directProduct?.category) }}</span>
                <span class="price">¥{{ directProduct?.price }}/{{ directProduct?.unit }}</span>
              </div>
            </div>
            <div class="product-quantity">
              <span>数量：{{ directQuantity }}{{ directProduct?.unit }}</span>
            </div>
            <div class="product-subtotal">
              <span class="subtotal">¥{{ directSubtotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 支付方式 -->
      <el-card class="payment-card">
        <template #header>
          <div class="card-header">
            <h3>支付方式</h3>
          </div>
        </template>

        <el-radio-group v-model="selectedPaymentMethod" class="payment-methods">
          <el-radio value="alipay" class="payment-option">
            <div class="payment-item">
              <div class="payment-icon">
                <wallet theme="outline" size="24" />
              </div>
              <div class="payment-info">
                <span class="payment-name">支付宝</span>
                <span class="payment-desc">推荐使用支付宝，安全快速</span>
              </div>
            </div>
          </el-radio>
          <el-radio value="wechat" class="payment-option">
            <div class="payment-item">
              <div class="payment-icon">
                <wallet theme="outline" size="24" />
              </div>
              <div class="payment-info">
                <span class="payment-name">微信支付</span>
                <span class="payment-desc">微信安全支付</span>
              </div>
            </div>
          </el-radio>
          <el-radio value="bankcard" class="payment-option">
            <div class="payment-item">
              <div class="payment-icon">
                <bank-card theme="outline" size="24" />
              </div>
              <div class="payment-info">
                <span class="payment-name">银行卡支付</span>
                <span class="payment-desc">支持各大银行储蓄卡及信用卡</span>
              </div>
            </div>
          </el-radio>
          <el-radio value="balance" class="payment-option">
            <div class="payment-item">
              <div class="payment-icon">
                <paper-money theme="outline" size="24" />
              </div>
              <div class="payment-info">
                <span class="payment-name">余额支付</span>
                <span class="payment-desc">使用账户余额支付</span>
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </el-card>

      <!-- 订单汇总 -->
      <el-card class="summary-card">
        <div class="order-summary">
          <div class="summary-line">
            <span>商品金额：</span>
            <span class="amount">¥{{ orderAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-line">
            <span>运费：</span>
            <span class="amount">¥{{ shippingFee.toFixed(2) }}</span>
          </div>
          <div v-if="discountAmount > 0" class="summary-line">
            <span>优惠金额：</span>
            <span class="amount discount">-¥{{ discountAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-line total-line">
            <span>应付金额：</span>
            <span class="total-amount">¥{{ finalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <div class="checkout-actions">
          <el-button type="primary" size="large" :loading="submitting" @click="submitOrder">
            提交订单
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Wallet, BankCard, PaperMoney } from '@icon-park/vue-next'
import { getCartItemsApiV1CartGet } from '@/services/api/cart'
import { getProductDetailApiV1ProductsProductIdGet } from '@/services/api/products'
import {
  createDirectOrderApiV1OrdersDirectPost,
  createOrderFromCartApiV1OrdersFromCartPost,
  createPaymentApiV1OrdersPaymentPost,
} from '@/services/api/orders'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const submitting = ref(false)
const checkoutType = ref<'cart' | 'direct'>('cart')
const cartItemIds = ref<number[]>([])
const cartItems = ref<API.CartItemResponseSchema[]>([])
const directProduct = ref<API.ProductDetailSchema | null>(null)
const directQuantity = ref(1)
const selectedPaymentMethod = ref<API.PaymentMethod>('alipay')

// 表单引用
const addressFormRef = ref<FormInstance>()

// 收货地址表单
const addressForm = ref({
  receiver_name: '',
  receiver_phone: '',
  receiver_address: '',
  user_notes: '',
})

// 表单验证规则
const addressRules: FormRules = {
  receiver_name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  receiver_phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  receiver_address: [
    { required: true, message: '请输入收货地址', trigger: 'blur' },
    { min: 10, max: 200, message: '地址长度在 10 到 200 个字符', trigger: 'blur' },
  ],
}

// 计算属性
const orderAmount = computed(() => {
  if (checkoutType.value === 'cart') {
    return cartItems.value.reduce((total, item) => total + item.subtotal, 0)
  } else {
    return directSubtotal.value
  }
})

const directSubtotal = computed(() => {
  return directProduct.value ? directProduct.value.price * directQuantity.value : 0
})

const shippingFee = computed(() => {
  // 满100免运费
  return orderAmount.value >= 100 ? 0 : 10
})

const discountAmount = computed(() => {
  // 这里可以添加优惠计算逻辑
  return 0
})

const finalAmount = computed(() => {
  return orderAmount.value + shippingFee.value - discountAmount.value
})

// 初始化页面数据
const initPageData = async () => {
  try {
    const { type, cart_item_ids, product_id, quantity } = route.query

    if (type === 'cart' && cart_item_ids) {
      checkoutType.value = 'cart'
      cartItemIds.value = String(cart_item_ids).split(',').map(Number)
      await fetchCartItems()
    } else if (type === 'direct' && product_id && quantity) {
      checkoutType.value = 'direct'
      directQuantity.value = Number(quantity)
      await fetchProductDetail(Number(product_id))
    } else {
      ElMessage.error('参数错误')
      router.back()
      return
    }
  } catch (error) {
    console.error('初始化页面数据失败:', error)
    ElMessage.error('页面加载失败')
    router.back()
  } finally {
    loading.value = false
  }
}

// 获取购物车商品
const fetchCartItems = async () => {
  try {
    const response = await getCartItemsApiV1CartGet()
    if (response.data?.success && response.data.data) {
      const allCartItems: API.CartItemResponseSchema[] = response.data.data.items || []
      cartItems.value = allCartItems.filter((item) => cartItemIds.value.includes(item.id))
    }
  } catch (error) {
    console.error('获取购物车商品失败:', error)
    throw error
  }
}

// 获取商品详情
const fetchProductDetail = async (productId: number) => {
  try {
    const response = await getProductDetailApiV1ProductsProductIdGet({ product_id: productId })
    if (response.data?.success && response.data.data) {
      directProduct.value = response.data.data
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    throw error
  }
}

// 提交订单
const submitOrder = async () => {
  if (!addressFormRef.value) return

  try {
    await addressFormRef.value.validate()

    submitting.value = true

    let orderResponse
    if (checkoutType.value === 'cart') {
      // 从购物车创建订单
      const orderData: API.OrderCreateSchema = {
        cart_item_ids: cartItemIds.value,
        receiver_name: addressForm.value.receiver_name,
        receiver_phone: addressForm.value.receiver_phone,
        receiver_address: addressForm.value.receiver_address,
        user_notes: addressForm.value.user_notes || undefined,
      }
      orderResponse = await createOrderFromCartApiV1OrdersFromCartPost(orderData)
    } else {
      // 立即购买创建订单
      const orderData: API.DirectOrderCreateSchema = {
        product_id: directProduct.value!.id,
        quantity: directQuantity.value,
        receiver_name: addressForm.value.receiver_name,
        receiver_phone: addressForm.value.receiver_phone,
        receiver_address: addressForm.value.receiver_address,
        user_notes: addressForm.value.user_notes || undefined,
      }
      orderResponse = await createDirectOrderApiV1OrdersDirectPost(orderData)
    }

    if (!orderResponse.data?.success || !orderResponse.data.data) {
      throw new Error(orderResponse.data?.message || '创建订单失败')
    }

    const order = orderResponse.data.data
    ElMessage.success('订单创建成功')

    // 立即支付
    await processPayment(order.id)
  } catch (error: any) {
    console.error('提交订单失败:', error)
    ElMessage.error(error.message || '提交订单失败')
  } finally {
    submitting.value = false
  }
}

// 处理支付
const processPayment = async (orderId: number) => {
  try {
    const paymentData: API.PaymentCreateSchema = {
      order_id: orderId,
      payment_method: selectedPaymentMethod.value,
    }

    const paymentResponse = await createPaymentApiV1OrdersPaymentPost(paymentData)

    if (!paymentResponse.data?.success || !paymentResponse.data.data) {
      throw new Error(paymentResponse.data?.message || '支付失败')
    }

    const payment = paymentResponse.data.data

    if (payment.is_success) {
      ElMessage.success('支付成功！')
      // 跳转到订单详情页面
      router.push(`/user/orders/${orderId}`)
    } else {
      ElMessage.error('支付失败，请重试')
      // 跳转到订单列表页面
      router.push('/user/orders')
    }
  } catch (error: any) {
    console.error('支付失败:', error)
    ElMessage.error(error.message || '支付失败')
    // 支付失败也跳转到订单列表
    router.push('/user/orders')
  }
}

// 获取分类文本
const getCategoryText = (category?: API.ProductCategory) => {
  const categoryMap = {
    fruit: '水果',
    vegetable: '蔬菜',
    grain: '粮食',
    seafood: '海鲜',
    other: '其他',
  }
  return category ? categoryMap[category] || '未知' : '未知'
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

// 组件挂载时初始化
onMounted(() => {
  initPageData()
})
</script>

<style scoped>
.checkout-view {
  padding: 20px 0;
}

.loading-container {
  padding: 40px 0;
}

.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 商品信息样式 */
.cart-products,
.direct-product {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 16px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #909399;
}

.product-quantity {
  font-size: 14px;
  color: #606266;
}

.product-subtotal {
  text-align: right;
}

.subtotal {
  font-size: 18px;
  font-weight: 600;
  color: #e6a23c;
}

/* 支付方式样式 */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  width: 100%;
  margin: 0;
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.payment-option.is-checked {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
  color: #409eff;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.payment-desc {
  font-size: 14px;
  color: #909399;
}

/* 订单汇总样式 */
.summary-card {
  position: sticky;
  bottom: 20px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
}

.order-summary {
  margin-bottom: 20px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 16px;
}

.summary-line:not(.total-line) {
  color: #606266;
  border-bottom: 1px solid #f5f7fa;
}

.total-line {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 2px solid #e4e7ed;
}

.amount {
  font-weight: 500;
}

.amount.discount {
  color: #67c23a;
}

.total-amount {
  color: #e6a23c;
  font-size: 20px;
  font-weight: 700;
}

.checkout-actions {
  display: flex;
  justify-content: center;
}

.checkout-actions .el-button {
  width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .checkout-content {
    margin: 0 16px;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .product-image {
    align-self: center;
  }

  .product-subtotal {
    text-align: left;
    align-self: flex-end;
  }

  .payment-methods {
    gap: 8px;
  }

  .payment-option {
    padding: 12px;
  }

  .summary-card {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: 0;
    border: none;
    border-top: 1px solid #e4e7ed;
  }
}
</style>
