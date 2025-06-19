<template>
  <div class="products-view">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-card>
        <el-row :gutter="16" align="middle">
          <el-col :span="8">
            <el-input
              v-model="searchQuery"
              placeholder="搜索农产品..."
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <search theme="outline" size="16" />
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="selectedCategory"
              placeholder="商品分类"
              clearable
              @change="handleCategoryChange"
            >
              <el-option label="全部分类" value="" />
              <el-option label="水果" value="fruit" />
              <el-option label="蔬菜" value="vegetable" />
              <el-option label="粮食" value="grain" />
              <el-option label="海鲜" value="seafood" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-slider
              v-model="priceRange"
              range
              :max="1000"
              :step="10"
              show-stops
              @change="handlePriceChange"
            />
            <div class="price-range-text">
              价格范围: ¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}
            </div>
          </el-col>
          <el-col :span="6" class="header-actions">
            <el-button @click="$router.push('/user/cart')">
              <shopping-cart theme="outline" size="16" />
              购物车
              <el-badge v-if="cartCount > 0" :value="cartCount" class="cart-badge" />
            </el-button>
            <el-button @click="$router.push('/user/orders')">
              <list theme="outline" size="16" />
              我的订单
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <el-card>
        <template #header>
          <div class="section-header">
            <h3>农产品列表</h3>
            <div class="sort-controls">
              <el-radio-group v-model="sortBy" @change="handleSort">
                <el-radio-button label="created_at">最新</el-radio-button>
                <el-radio-button label="sales_count">销量</el-radio-button>
                <el-radio-button label="price">价格</el-radio-button>
                <el-radio-button label="rating">评分</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>

        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="4" animated />
        </div>

        <div v-else-if="products.length === 0" class="empty-container">
          <el-empty description="暂无商品" />
        </div>

        <div v-else class="products-grid">
          <div v-for="product in products" :key="product.id" class="product-card">
            <el-card shadow="hover" @click="viewProductDetail(product.id)">
              <div class="product-image">
                <img
                  :src="product.images?.[0] || '/placeholder-product.jpg'"
                  :alt="product.name"
                  @error="handleImageError"
                />
                <div v-if="product.status !== 'available'" class="product-status-overlay">
                  <span>{{ getProductStatusText(product.status) }}</span>
                </div>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-category">{{ getCategoryText(product.category) }}</p>
                <div class="product-meta">
                  <div class="rating">
                    <el-rate :model-value="product.rating" disabled show-score />
                    <span class="sales-count">已售{{ product.sales_count }}{{ product.unit }}</span>
                  </div>
                  <div class="stock-info">
                    <span class="stock">库存{{ product.stock }}{{ product.unit }}</span>
                  </div>
                </div>
                <div class="product-price">
                  <span class="price">¥{{ product.price }}</span>
                  <span class="unit">/ {{ product.unit }}</span>
                </div>
                <div class="product-actions" @click.stop>
                  <el-button-group>
                    <el-button
                      type="primary"
                      size="small"
                      :disabled="product.status !== 'available' || product.stock <= 0"
                      @click="addToCart(product)"
                    >
                      加入购物车
                    </el-button>
                    <el-button
                      size="small"
                      :disabled="product.status !== 'available' || product.stock <= 0"
                      @click="buyNow(product)"
                    >
                      立即购买
                    </el-button>
                  </el-button-group>
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
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, ShoppingCart, List } from '@icon-park/vue-next'
import {
  searchProductsApiV1ProductsSearchGet,
  getPopularProductsApiV1ProductsPopularGet,
  getProductsByCategoryApiV1ProductsCategoryCategoryGet,
} from '@/services/api/products'
import { addToCartApiV1CartPost, getCartStatsApiV1CartStatsGet } from '@/services/api/cart'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const products = ref<API.ProductListItemSchema[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const searchQuery = ref('')
const selectedCategory = ref<API.ProductCategory | ''>('')
const priceRange = ref([0, 1000])
const sortBy = ref('created_at')
const cartCount = ref(0)

// 搜索防抖
let searchTimer: number | null = null

// 计算属性
const searchParams = computed(() => ({
  page: currentPage.value,
  page_size: pageSize.value,
  keyword: searchQuery.value || undefined,
  category: selectedCategory.value || undefined,
  min_price: priceRange.value[0] || undefined,
  max_price: priceRange.value[1] || undefined,
}))

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    let response

    if (searchQuery.value || priceRange.value[0] > 0 || priceRange.value[1] < 1000) {
      // 使用搜索接口
      response = await searchProductsApiV1ProductsSearchGet(searchParams.value)
    } else if (selectedCategory.value) {
      // 按分类获取
      response = await getProductsByCategoryApiV1ProductsCategoryCategoryGet({
        category: selectedCategory.value as API.ProductCategory,
        page: currentPage.value,
        page_size: pageSize.value,
      })
    } else {
      // 获取热门商品
      response = await getPopularProductsApiV1ProductsPopularGet({
        page: currentPage.value,
        page_size: pageSize.value,
      })
    }

    if (response.data?.success && response.data.data) {
      products.value = response.data.data.items
      total.value = response.data.data.total
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 获取购物车统计
const fetchCartStats = async () => {
  try {
    const response = await getCartStatsApiV1CartStatsGet()
    if (response.data?.success && response.data.data) {
      cartCount.value = response.data.data.total_items || 0
    }
  } catch (error) {
    console.error('获取购物车统计失败:', error)
  }
}

// 处理搜索
const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchProducts()
  }, 500)
}

// 处理分类变化
const handleCategoryChange = () => {
  currentPage.value = 1
  fetchProducts()
}

// 处理价格变化
const handlePriceChange = () => {
  currentPage.value = 1
  fetchProducts()
}

// 处理排序
const handleSort = () => {
  currentPage.value = 1
  fetchProducts()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProducts()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchProducts()
}

// 查看商品详情
const viewProductDetail = (productId: number) => {
  router.push(`/user/products/${productId}`)
}

// 添加到购物车
const addToCart = async (product: API.ProductListItemSchema) => {
  try {
    const response = await addToCartApiV1CartPost({
      product_id: product.id,
      quantity: 1,
    })

    if (response.data?.success) {
      ElMessage.success('已添加到购物车')
      fetchCartStats()
    }
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  }
}

// 立即购买
const buyNow = (product: API.ProductListItemSchema) => {
  router.push({
    path: '/user/checkout',
    query: {
      type: 'direct',
      product_id: product.id,
      quantity: 1,
    },
  })
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

// 监听参数变化
watch(
  searchParams,
  () => {
    fetchProducts()
  },
  { deep: true },
)

// 初始化
onMounted(() => {
  fetchProducts()
  fetchCartStats()
})
</script>

<style scoped>
.products-view {
  padding: 0;
}

.search-section {
  margin-bottom: 20px;
}

.price-range-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 8px;
}

.header-actions {
  text-align: right;
}

.cart-badge {
  margin-left: 8px;
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

.sort-controls .el-radio-group {
  --el-radio-button-checked-bg-color: #1890ff;
  --el-radio-button-checked-border-color: #1890ff;
}

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.product-card {
  height: 100%;
}

.product-card .el-card {
  height: 100%;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card .el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 12px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-status-overlay {
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
  font-weight: 500;
}

.product-info {
  padding: 0 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-category {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px 0;
}

.product-meta {
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.sales-count {
  color: #666;
}

.stock-info {
  font-size: 12px;
  color: #666;
}

.product-price {
  margin: 12px 0;
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: #ff4d4f;
}

.unit {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}

.product-actions {
  margin-top: 12px;
}

.product-actions .el-button-group {
  width: 100%;
}

.product-actions .el-button {
  flex: 1;
}

.pagination-container {
  margin-top: 24px;
  text-align: center;
}
</style>
