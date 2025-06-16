<template>
  <div class="goods-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">商品列表</h1>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称"
          style="width: 300px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterStatus"
          placeholder="商品状态"
          style="width: 150px; margin-left: 16px"
          clearable
          @change="handleSearch"
        >
          <el-option label="可售" value="available" />
          <el-option label="售罄" value="sold_out" />
          <el-option label="停售" value="inactive" />
        </el-select>
        <el-select
          v-model="filterCategory"
          placeholder="商品分类"
          style="width: 150px; margin-left: 16px"
          clearable
          @change="handleSearch"
        >
          <el-option label="水果" value="fruit" />
          <el-option label="蔬菜" value="vegetable" />
          <el-option label="粮食" value="grain" />
          <el-option label="海鲜" value="seafood" />
          <el-option label="其他" value="other" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><search /></el-icon>
          搜索
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><plus /></el-icon>
          添加商品
        </el-button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="goods-grid" v-loading="loading">
      <div v-if="goods.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无商品数据">
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
        </el-empty>
      </div>
      <div v-else class="goods-list">
        <div v-for="product in goods" :key="product.id" class="product-card">
          <div class="product-image">
            <img
              v-if="product.images && product.images.length > 0"
              :src="product.images[0]"
              :alt="product.name"
              @error="handleImageError"
            />
            <div v-else class="no-image">
              <el-icon size="48"><goods /></el-icon>
              <span>暂无图片</span>
            </div>
          </div>
          <div class="product-info">
            <div class="product-header">
              <h3 class="product-name">{{ product.name }}</h3>
              <el-tag :type="getStatusTagType(product.status)" size="small">
                {{ getStatusText(product.status) }}
              </el-tag>
            </div>
            <div class="product-details">
              <div class="detail-item">
                <span class="label">分类：</span>
                <span class="value">{{ getCategoryText(product.category) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">价格：</span>
                <span class="value price">¥{{ product.price }}/{{ product.unit }}</span>
              </div>
              <div class="detail-item">
                <span class="label">库存：</span>
                <span
                  class="value"
                  :class="{ 'stock-low': product.stock <= 10, 'stock-out': product.stock === 0 }"
                >
                  {{ product.stock }}{{ product.unit }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">评分：</span>
                <span class="value">
                  <el-rate
                    v-model="product.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    size="small"
                  />
                </span>
              </div>
              <div class="detail-item">
                <span class="label">销量：</span>
                <span class="value">{{ product.sales_count }}</span>
              </div>
              <div class="detail-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ formatDate(product.created_at) }}</span>
              </div>
            </div>
            <div class="product-actions">
              <el-button size="small" @click="handleView(product)">查看详情</el-button>
              <el-button size="small" type="primary" @click="handleEdit(product)">编辑</el-button>
              <el-button size="small" type="warning" @click="handleStockUpdate(product)">
                库存管理
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(product)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="pagination.total > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 商品详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="商品详情" width="800px">
      <div v-if="selectedProduct" class="product-detail">
        <div class="detail-images">
          <el-carousel
            v-if="selectedProduct.images && selectedProduct.images.length > 0"
            height="300px"
          >
            <el-carousel-item v-for="image in selectedProduct.images" :key="image">
              <img :src="image" :alt="selectedProduct.name" class="detail-image" />
            </el-carousel-item>
          </el-carousel>
          <div v-else class="no-detail-image">
            <el-icon size="80"><goods /></el-icon>
            <span>暂无图片</span>
          </div>
        </div>
        <div class="detail-content">
          <h2>{{ selectedProduct.name }}</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">商品分类：</span>
              <span class="value">{{ getCategoryText(selectedProduct.category) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">商品价格：</span>
              <span class="value price"
                >¥{{ selectedProduct.price }}/{{ selectedProduct.unit }}</span
              >
            </div>
            <div class="detail-row">
              <span class="label">库存数量：</span>
              <span class="value">{{ selectedProduct.stock }}{{ selectedProduct.unit }}</span>
            </div>
            <div class="detail-row">
              <span class="label">状态：</span>
              <el-tag :type="getStatusTagType(selectedProduct.status)">
                {{ getStatusText(selectedProduct.status) }}
              </el-tag>
            </div>
            <div class="detail-row">
              <span class="label">评分：</span>
              <el-rate
                v-model="selectedProduct.rating"
                disabled
                show-score
                text-color="#ff9900"
                size="small"
              />
            </div>
            <div class="detail-row">
              <span class="label">销售数量：</span>
              <span class="value">{{ selectedProduct.sales_count }}</span>
            </div>
            <div class="detail-row">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDate(selectedProduct.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">更新时间：</span>
              <span class="value">{{ formatDate(selectedProduct.updated_at) }}</span>
            </div>
          </div>
          <div v-if="selectedProduct.description" class="description">
            <h3>商品描述</h3>
            <p>{{ selectedProduct.description }}</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 库存管理弹窗 -->
    <el-dialog v-model="stockDialogVisible" title="库存管理" width="500px">
      <div v-if="selectedProduct" class="stock-management">
        <div class="current-stock">
          <h3>{{ selectedProduct.name }}</h3>
          <p>当前库存：{{ selectedProduct.stock }}{{ selectedProduct.unit }}</p>
        </div>
        <el-form ref="stockFormRef" :model="stockForm" :rules="stockRules" label-width="100px">
          <el-form-item label="新库存数量" prop="stock" required>
            <el-input-number v-model="stockForm.stock" :min="0" :max="99999" style="width: 100%" />
            <span class="form-help">单位：{{ selectedProduct.unit }}</span>
          </el-form-item>
          <el-form-item label="商品状态" prop="status">
            <el-select v-model="stockForm.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="可售" value="available" />
              <el-option label="售罄" value="sold_out" />
              <el-option label="停售" value="inactive" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="stockUpdateLoading" @click="handleStockSubmit">
          {{ stockUpdateLoading ? '更新中...' : '确定更新' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { Commodity } from '@icon-park/vue-next'
import {
  getMyProductsApiV1ProductsMyGet,
  deleteMyProductApiV1ProductsMyProductIdDelete,
  updateProductStockApiV1ProductsMyProductIdStockPatch,
} from '@/services/api/products'
import dayjs from 'dayjs'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const goods = ref<API.ProductListItemSchema[]>([])
const searchKeyword = ref('')
const filterStatus = ref<API.ProductStatus | ''>('')
const filterCategory = ref<API.ProductCategory | ''>('')
const detailDialogVisible = ref(false)
const stockDialogVisible = ref(false)
const stockUpdateLoading = ref(false)
const selectedProduct = ref<API.ProductDetailSchema | null>(null)

// 表单引用
const stockFormRef = ref<FormInstance>()

// 库存表单数据
const stockForm = reactive<API.ProductStockUpdateSchema>({
  stock: 0,
  status: 'available',
})

// 库存表单验证规则
const stockRules: FormRules = {
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量不能小于0', trigger: 'blur' },
  ],
}

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 获取商品列表
const fetchGoods = async () => {
  try {
    loading.value = true
    const params: API.getMyProductsApiV1ProductsMyGetParams = {
      page: pagination.page,
      page_size: pagination.pageSize,
    }

    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    if (filterCategory.value) {
      params.category = filterCategory.value
    }

    const response = await getMyProductsApiV1ProductsMyGet(params)
    if (response.data.success && response.data.data) {
      goods.value = response.data.data.items
      pagination.total = response.data.data.total
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  fetchGoods()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchGoods()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchGoods()
}

// 添加商品
const handleAdd = () => {
  router.push('/merchant/goods/add')
}

// 查看详情
const handleView = (product: API.ProductListItemSchema) => {
  selectedProduct.value = product as API.ProductDetailSchema
  detailDialogVisible.value = true
}

// 编辑商品
const handleEdit = (product: API.ProductListItemSchema) => {
  router.push(`/merchant/goods/edit/${product.id}`)
}

// 库存管理
const handleStockUpdate = (product: API.ProductListItemSchema) => {
  selectedProduct.value = product as API.ProductDetailSchema
  stockForm.stock = product.stock
  stockForm.status = product.status
  stockDialogVisible.value = true
}

// 库存更新提交
const handleStockSubmit = async () => {
  if (!stockFormRef.value || !selectedProduct.value) return

  try {
    await stockFormRef.value.validate()

    stockUpdateLoading.value = true

    const response = await updateProductStockApiV1ProductsMyProductIdStockPatch(
      { product_id: selectedProduct.value.id },
      stockForm,
    )

    if (response.data.success) {
      ElMessage.success('库存更新成功')
      stockDialogVisible.value = false
      fetchGoods()
    } else {
      ElMessage.error(response.data.message || '库存更新失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('库存更新失败:', error)
      ElMessage.error('库存更新失败')
    }
  } finally {
    stockUpdateLoading.value = false
  }
}

// 删除商品
const handleDelete = async (product: API.ProductListItemSchema) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品"${product.name}"吗？此操作不可恢复。`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await deleteMyProductApiV1ProductsMyProductIdDelete({ product_id: product.id })
    if (response.data.success) {
      ElMessage.success('删除成功')
      fetchGoods()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 图片错误处理
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

// 获取状态标签类型
const getStatusTagType = (status: API.ProductStatus) => {
  const statusMap = {
    available: 'success',
    sold_out: 'warning',
    inactive: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: API.ProductStatus) => {
  const statusMap = {
    available: '可售',
    sold_out: '售罄',
    inactive: '停售',
  }
  return statusMap[status] || status
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
  return categoryMap[category] || category
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 页面加载时获取数据
onMounted(() => {
  fetchGoods()
})
</script>

<style scoped>
.goods-view {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 8px 0 0 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: #fff;
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #9ca3af;
}

.product-info {
  padding: 20px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.product-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.product-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.detail-item .label {
  width: 80px;
  color: #6b7280;
  font-size: 14px;
}

.detail-item .value {
  flex: 1;
  color: #1f2937;
  font-size: 14px;
}

.detail-item .value.price {
  color: #f59e0b;
  font-weight: 600;
}

.detail-item .value.stock-low {
  color: #f59e0b;
  font-weight: 600;
}

.detail-item .value.stock-out {
  color: #ef4444;
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  color: #6b7280;
}

.pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* 详情弹窗样式 */
.product-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-images {
  width: 100%;
}

.detail-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.no-detail-image {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #9ca3af;
}

.detail-content h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  align-items: center;
}

.detail-row .label {
  width: 80px;
  color: #6b7280;
  font-weight: 500;
}

.detail-row .value {
  flex: 1;
  color: #1f2937;
}

.detail-row .value.price {
  color: #f59e0b;
  font-weight: 600;
}

.description h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.description p {
  margin: 0;
  line-height: 1.6;
  color: #4b5563;
}

/* 库存管理样式 */
.stock-management {
  padding: 16px 0;
}

.current-stock h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.current-stock p {
  margin: 0 0 24px 0;
  color: #6b7280;
}

.form-help {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}
</style>
