<template>
  <div class="product-detail-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="!product" class="empty-container">
      <el-empty description="商品不存在或已下架">
        <el-button @click="$router.push('/user/products')">返回商品列表</el-button>
      </el-empty>
    </div>

    <div v-else class="product-detail">
      <!-- 商品信息 -->
      <el-card class="product-info-card">
        <el-row :gutter="32">
          <!-- 商品图片 -->
          <el-col :span="12">
            <div class="product-images">
              <div class="main-image">
                <img :src="currentImage" :alt="product.name" @error="handleImageError" />
                <div v-if="product.status !== 'available'" class="status-overlay">
                  <span>{{ getProductStatusText(product.status) }}</span>
                </div>
              </div>
              <div v-if="product.images && product.images.length > 1" class="thumbnail-list">
                <div
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="thumbnail-item"
                  :class="{ active: currentImage === image }"
                  @click="currentImage = image"
                >
                  <img :src="image" :alt="`${product.name} ${index + 1}`" />
                </div>
              </div>
            </div>
          </el-col>

          <!-- 商品详情 -->
          <el-col :span="12">
            <div class="product-details">
              <div class="product-header">
                <h1 class="product-title">{{ product.name }}</h1>
                <div class="product-category">
                  <el-tag type="info">{{ getCategoryText(product.category) }}</el-tag>
                </div>
              </div>

              <div class="product-rating">
                <el-rate :model-value="product.rating" disabled show-score />
                <span class="sales-info">已售{{ product.sales_count }}{{ product.unit }}</span>
              </div>

              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
                <span class="unit">/ {{ product.unit }}</span>
              </div>

              <div class="product-stock">
                <span class="stock-label">库存：</span>
                <span class="stock-value" :class="{ 'low-stock': product.stock < 10 }">
                  {{ product.stock }}{{ product.unit }}
                </span>
              </div>

              <div v-if="product.description" class="product-description">
                <h3>商品描述</h3>
                <p>{{ product.description }}</p>
              </div>

              <!-- 购买操作 -->
              <div class="purchase-actions">
                <div class="quantity-selector">
                  <span class="quantity-label">数量：</span>
                  <el-input-number
                    v-model="quantity"
                    :min="1"
                    :max="product.stock"
                    :disabled="product.status !== 'available' || product.stock <= 0"
                  />
                </div>

                <div class="action-buttons">
                  <el-button
                    type="primary"
                    size="large"
                    :disabled="product.status !== 'available' || product.stock <= 0"
                    :loading="adding"
                    @click="addToCart"
                  >
                    <shopping-cart theme="outline" size="18" />
                    加入购物车
                  </el-button>
                  <el-button
                    size="large"
                    :disabled="product.status !== 'available' || product.stock <= 0"
                    @click="buyNow"
                  >
                    立即购买
                  </el-button>
                </div>
              </div>

              <!-- 商家信息 -->
              <div v-if="product.merchant" class="merchant-info">
                <h3>商家信息</h3>
                <div class="merchant-details">
                  <p><strong>商家名称：</strong>{{ product.merchant.merchant_name }}</p>
                  <p><strong>联系电话：</strong>{{ product.merchant.contact_phone }}</p>
                  <p v-if="product.merchant.address">
                    <strong>地址：</strong>{{ product.merchant.address }}
                  </p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 推荐商品 -->
      <el-card class="related-products" v-if="relatedProducts.length > 0">
        <template #header>
          <h3>相关推荐</h3>
        </template>
        <div class="related-grid">
          <div
            v-for="item in relatedProducts"
            :key="item.id"
            class="related-item"
            @click="viewProduct(item.id)"
          >
            <div class="related-image">
              <img
                :src="item.images?.[0] || '/placeholder-product.jpg'"
                :alt="item.name"
                @error="handleImageError"
              />
            </div>
            <div class="related-info">
              <h4>{{ item.name }}</h4>
              <div class="related-price">¥{{ item.price }}/{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@icon-park/vue-next'
import {
  getProductDetailApiV1ProductsProductIdGet,
  getProductsByCategoryApiV1ProductsCategoryCategoryGet,
} from '@/services/api/products'
import { addToCartApiV1CartPost } from '@/services/api/cart'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const adding = ref(false)
const product = ref<API.ProductDetailSchema | null>(null)
const relatedProducts = ref<API.ProductListItemSchema[]>([])
const quantity = ref(1)
const currentImage = ref('')

// 计算属性
const productId = computed(() => Number(route.params.id))

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    loading.value = true
    const response = await getProductDetailApiV1ProductsProductIdGet({
      product_id: productId.value,
    })

    if (response.data?.success && response.data.data) {
      product.value = response.data.data
      currentImage.value = product.value.images?.[0] || '/placeholder-product.jpg'

      // 获取相关商品
      fetchRelatedProducts()
    } else {
      ElMessage.error('商品不存在')
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 获取相关商品
const fetchRelatedProducts = async () => {
  if (!product.value) return

  try {
    const response = await getProductsByCategoryApiV1ProductsCategoryCategoryGet({
      category: product.value.category,
      page: 1,
      page_size: 8,
    })

    if (response.data?.success && response.data.data) {
      // 排除当前商品
      relatedProducts.value = response.data.data.items
        .filter((item) => item.id !== productId.value)
        .slice(0, 6)
    }
  } catch (error) {
    console.error('获取相关商品失败:', error)
  }
}

// 添加到购物车
const addToCart = async () => {
  if (!product.value) return

  try {
    adding.value = true
    const response = await addToCartApiV1CartPost({
      product_id: product.value.id,
      quantity: quantity.value,
    })

    if (response.data?.success) {
      ElMessage.success(`已添加${quantity.value}${product.value.unit}到购物车`)
    }
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  } finally {
    adding.value = false
  }
}

// 立即购买
const buyNow = () => {
  if (!product.value) return

  router.push({
    path: '/user/checkout',
    query: {
      type: 'direct',
      product_id: product.value.id,
      quantity: quantity.value,
    },
  })
}

// 查看商品
const viewProduct = (id: number) => {
  router.push(`/user/products/${id}`)
}

// 获取分类文本
const getCategoryText = (category: API.ProductCategory) => {
  const categoryMap = {
    fruit: '水果',
    vegetable: '蔬菜',
    grain: '粮食',
    seafood: '海鲜',
    other: '其他',
  }
  return categoryMap[category] || '其他'
}

// 获取商品状态文本
const getProductStatusText = (status: API.ProductStatus) => {
  const statusMap = {
    available: '可售',
    sold_out: '售罄',
    inactive: '下架',
  }
  return statusMap[status] || '未知'
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.jpg'
}

// 初始化
onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.product-detail-view {
  padding: 0;
}

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.product-info-card {
  margin-bottom: 20px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 500;
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumbnail-item.active {
  border-color: #1890ff;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  padding-left: 20px;
}

.product-header {
  margin-bottom: 16px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.product-category {
  margin-bottom: 16px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.sales-info {
  color: #666;
  font-size: 14px;
}

.product-price {
  margin-bottom: 16px;
}

.price {
  font-size: 32px;
  font-weight: 600;
  color: #ff4d4f;
}

.unit {
  font-size: 16px;
  color: #999;
  margin-left: 8px;
}

.product-stock {
  margin-bottom: 20px;
  font-size: 14px;
}

.stock-label {
  color: #666;
}

.stock-value {
  color: #52c41a;
  font-weight: 500;
}

.stock-value.low-stock {
  color: #faad14;
}

.product-description {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.product-description h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.product-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.purchase-actions {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.quantity-label {
  font-size: 14px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons .el-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

.merchant-info {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.merchant-info h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.merchant-details p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.related-products {
  margin-top: 20px;
}

.related-products h3 {
  margin: 0;
  color: #333;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.related-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.related-item:hover {
  transform: translateY(-2px);
}

.related-image {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info h4 {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-price {
  font-size: 14px;
  color: #ff4d4f;
  font-weight: 500;
}
</style>
