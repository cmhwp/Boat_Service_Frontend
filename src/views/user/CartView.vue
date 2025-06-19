<template>
  <div class="cart-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="cartItems.length === 0" class="empty-container">
      <el-empty description="购物车是空的">
        <el-button type="primary" @click="$router.push('/user/products')"> 去逛逛 </el-button>
      </el-empty>
    </div>

    <div v-else class="cart-content">
      <!-- 购物车商品列表 -->
      <el-card class="cart-items-card">
        <template #header>
          <div class="cart-header">
            <el-checkbox
              v-model="selectAll"
              :indeterminate="isIndeterminate"
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <span class="cart-title">购物车 ({{ cartItems.length }}件商品)</span>
            <el-button
              text
              type="danger"
              :disabled="selectedItems.length === 0"
              @click="batchDeleteItems"
            >
              删除选中
            </el-button>
          </div>
        </template>

        <div class="cart-list">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-checkbox">
              <el-checkbox
                :model-value="selectedItems.includes(item.id)"
                @change="(checked: boolean) => handleItemSelect(item.id, checked)"
              />
            </div>

            <div class="item-image">
              <img
                :src="item.product?.images?.[0] || '/placeholder-product.jpg'"
                :alt="item.product?.name"
                @error="handleImageError"
                @click="viewProduct(item.product_id)"
              />
            </div>

            <div class="item-info">
              <h4 class="product-name" @click="viewProduct(item.product_id)">
                {{ item.product?.name }}
              </h4>
              <div class="product-meta">
                <span class="category">{{ getCategoryText(item.product?.category) }}</span>
                <span class="price">¥{{ item.product?.price }}/{{ item.product?.unit }}</span>
              </div>
              <div v-if="!isAvailable(item)" class="availability-warning">
                <el-alert
                  :title="getAvailabilityText(item)"
                  type="warning"
                  show-icon
                  :closable="false"
                />
              </div>
            </div>

            <div class="item-quantity">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="item.product?.stock || 999"
                :disabled="!isAvailable(item) || updating.includes(item.id)"
                @change="(value: number) => updateQuantity(item.id, value)"
              />
            </div>

            <div class="item-subtotal">
              <span class="subtotal">¥{{ item.subtotal.toFixed(2) }}</span>
            </div>

            <div class="item-actions">
              <el-button
                text
                type="danger"
                :loading="deleting.includes(item.id)"
                @click="deleteItem(item.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 结算区域 -->
      <el-card class="checkout-card">
        <div class="checkout-summary">
          <div class="summary-line">
            <span>已选商品({{ selectedValidItems.length }}件)：</span>
            <span class="amount">¥{{ selectedTotal.toFixed(2) }}</span>
          </div>
          <div class="summary-line">
            <span>运费：</span>
            <span class="amount">¥{{ shippingFee.toFixed(2) }}</span>
          </div>
          <div class="summary-line total-line">
            <span>合计：</span>
            <span class="total-amount">¥{{ (selectedTotal + shippingFee).toFixed(2) }}</span>
          </div>
        </div>

        <div class="checkout-actions">
          <el-button
            type="primary"
            size="large"
            :disabled="selectedValidItems.length === 0"
            :loading="checkingOut"
            @click="proceedToCheckout"
          >
            去结算 ({{ selectedValidItems.length }})
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCartItemsApiV1CartGet,
  updateCartItemApiV1CartCartItemIdPut,
  removeCartItemApiV1CartCartItemIdDelete,
  batchRemoveCartItemsApiV1CartBatchDelete,
  clearCartApiV1CartDelete,
} from '@/services/api/cart'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const updating = ref<number[]>([])
const deleting = ref<number[]>([])
const checkingOut = ref(false)
const cartItems = ref<API.CartItemResponseSchema[]>([])
const selectedItems = ref<number[]>([])

// 计算属性
const selectAll = computed({
  get: () => selectedItems.value.length === cartItems.value.length && cartItems.value.length > 0,
  set: (value: boolean) => {
    if (value) {
      selectedItems.value = cartItems.value.map((item) => item.id)
    } else {
      selectedItems.value = []
    }
  },
})

const isIndeterminate = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < cartItems.value.length
})

const selectedValidItems = computed(() => {
  return cartItems.value.filter(
    (item) => selectedItems.value.includes(item.id) && isAvailable(item),
  )
})

const selectedTotal = computed(() => {
  return selectedValidItems.value.reduce((total, item) => total + item.subtotal, 0)
})

const shippingFee = computed(() => {
  // 简单的运费计算：满100免运费，否则10元
  return selectedTotal.value >= 100 ? 0 : 10
})

// 获取购物车商品列表
const fetchCartItems = async () => {
  try {
    loading.value = true
    const response = await getCartItemsApiV1CartGet()

    if (response.data?.success && response.data.data) {
      cartItems.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('获取购物车失败:', error)
    ElMessage.error('获取购物车失败')
  } finally {
    loading.value = false
  }
}

// 更新商品数量
const updateQuantity = async (itemId: number, quantity: number) => {
  if (quantity < 1) return

  try {
    updating.value.push(itemId)
    const response = await updateCartItemApiV1CartCartItemIdPut(
      { cart_item_id: itemId },
      { quantity },
    )

    if (response.data?.success) {
      // 更新本地数据
      const item = cartItems.value.find((item) => item.id === itemId)
      if (item) {
        item.quantity = quantity
        item.subtotal = quantity * (item.product?.price || 0)
      }
      ElMessage.success('数量已更新')
    }
  } catch (error) {
    console.error('更新数量失败:', error)
    ElMessage.error('更新数量失败')
  } finally {
    updating.value = updating.value.filter((id) => id !== itemId)
  }
}

// 删除单个商品
const deleteItem = async (itemId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    deleting.value.push(itemId)
    const response = await removeCartItemApiV1CartCartItemIdDelete({
      cart_item_id: itemId,
    })

    if (response.data?.success) {
      cartItems.value = cartItems.value.filter((item) => item.id !== itemId)
      selectedItems.value = selectedItems.value.filter((id) => id !== itemId)
      ElMessage.success('商品已删除')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除商品失败')
    }
  } finally {
    deleting.value = deleting.value.filter((id) => id !== itemId)
  }
}

// 批量删除商品
const batchDeleteItems = async () => {
  if (selectedItems.value.length === 0) return

  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedItems.value.length}个商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await batchRemoveCartItemsApiV1CartBatchDelete(selectedItems.value)

    if (response.data?.success) {
      cartItems.value = cartItems.value.filter((item) => !selectedItems.value.includes(item.id))
      selectedItems.value = []
      ElMessage.success('商品已删除')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 处理全选
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedItems.value = cartItems.value.map((item) => item.id)
  } else {
    selectedItems.value = []
  }
}

// 处理单个商品选择
const handleItemSelect = (itemId: number, checked: boolean) => {
  if (checked) {
    if (!selectedItems.value.includes(itemId)) {
      selectedItems.value.push(itemId)
    }
  } else {
    selectedItems.value = selectedItems.value.filter((id) => id !== itemId)
  }
}

// 进入结算页面
const proceedToCheckout = () => {
  if (selectedValidItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }

  const selectedIds = selectedValidItems.value.map((item) => item.id)
  router.push({
    path: '/user/checkout',
    query: {
      type: 'cart',
      cart_item_ids: selectedIds.join(','),
    },
  })
}

// 查看商品详情
const viewProduct = (productId: number) => {
  router.push(`/user/products/${productId}`)
}

// 检查商品是否可用
const isAvailable = (item: API.CartItemResponseSchema) => {
  return item.product?.status === 'available' && (item.product?.stock || 0) > 0
}

// 获取可用性提示文本
const getAvailabilityText = (item: API.CartItemResponseSchema) => {
  if (item.product?.status === 'sold_out') return '商品已售罄'
  if (item.product?.status === 'inactive') return '商品已下架'
  if ((item.product?.stock || 0) <= 0) return '库存不足'
  return '商品不可用'
}

// 获取分类文本
const getCategoryText = (category?: API.ProductCategory) => {
  if (!category) return ''
  const categoryMap = {
    fruit: '水果',
    vegetable: '蔬菜',
    grain: '粮食',
    seafood: '海鲜',
    other: '其他',
  }
  return categoryMap[category] || '其他'
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

// 初始化
onMounted(() => {
  fetchCartItems()
})
</script>

<style scoped>
.cart-view {
  padding: 0;
}

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-items-card {
  flex: 1;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-title {
  font-weight: 500;
  color: #333;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.cart-item:hover {
  border-color: #d9d9d9;
}

.item-checkbox {
  flex-shrink: 0;
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

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.category {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.price {
  color: #ff4d4f;
  font-weight: 500;
}

.availability-warning {
  margin-top: 8px;
}

.item-quantity {
  flex-shrink: 0;
}

.item-subtotal {
  flex-shrink: 0;
  width: 100px;
  text-align: center;
}

.subtotal {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

.item-actions {
  flex-shrink: 0;
}

.checkout-card {
  width: 300px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.checkout-summary {
  margin-bottom: 20px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-line:last-child {
  border-bottom: none;
}

.total-line {
  font-size: 16px;
  font-weight: 600;
  padding-top: 12px;
  border-top: 2px solid #f0f0f0;
}

.amount {
  color: #666;
}

.total-amount {
  color: #ff4d4f;
  font-size: 18px;
}

.checkout-actions .el-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

@media (max-width: 1024px) {
  .cart-content {
    flex-direction: column;
  }

  .checkout-card {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .item-checkbox,
  .item-image,
  .item-info,
  .item-quantity,
  .item-subtotal,
  .item-actions {
    width: 100%;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-subtotal,
  .item-quantity {
    text-align: left;
  }
}
</style>
