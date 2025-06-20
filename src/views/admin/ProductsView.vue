<template>
  <div class="admin-products-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>商品管理</h1>
      <p>管理平台所有商品信息</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-card>
        <el-form :model="filterForm" :inline="true" class="filter-form">
          <el-form-item label="商家">
            <el-input
              v-model="filterForm.merchant_id"
              placeholder="请输入商家ID"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="商品分类">
            <el-select v-model="filterForm.category" placeholder="请选择分类" clearable>
              <el-option label="水果" value="fruit" />
              <el-option label="蔬菜" value="vegetable" />
              <el-option label="粮食" value="grain" />
              <el-option label="海鲜" value="seafood" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="可售" value="available" />
              <el-option label="售罄" value="sold_out" />
              <el-option label="停售" value="inactive" />
            </el-select>
          </el-form-item>

          <el-form-item label="商品名称">
            <el-input
              v-model="filterForm.name"
              placeholder="请输入商品名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="价格区间">
            <el-input-number
              v-model="filterForm.min_price"
              placeholder="最低价格"
              :min="0"
              style="width: 120px"
            />
            <span style="margin: 0 8px">-</span>
            <el-input-number
              v-model="filterForm.max_price"
              placeholder="最高价格"
              :min="0"
              style="width: 120px"
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="filterForm.low_stock">仅显示低库存</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchProducts" :loading="loading">
              <Search theme="outline" size="14" />
              搜索
            </el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>商品列表</span>
            <div class="header-actions">
              <el-button type="primary" @click="refreshData">
                <Refresh theme="outline" size="14" />
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="products" v-loading="loading" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="商品信息" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <div class="product-image">
                  <el-image
                    v-if="row.images && row.images.length > 0"
                    :src="row.images[0]"
                    :preview-src-list="row.images"
                    fit="cover"
                    style="width: 50px; height: 50px"
                  />
                  <div v-else class="no-image">暂无图片</div>
                </div>
                <div class="product-details">
                  <div class="product-name">{{ row.name }}</div>
                  <div class="product-category">{{ getCategoryText(row.category) }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="merchant_name" label="商家" width="120" />
          <el-table-column label="价格/库存" width="120">
            <template #default="{ row }">
              <div>¥{{ row.price }}/{{ row.unit }}</div>
              <div :class="{ 'low-stock': row.stock < 10 }">库存: {{ row.stock }}</div>
            </template>
          </el-table-column>
          <el-table-column label="评分/销量" width="100">
            <template #default="{ row }">
              <div>{{ row.rating }}分</div>
              <div>销量: {{ row.sales_count }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="订单/销售额" width="120">
            <template #default="{ row }">
              <div>{{ row.order_count || 0 }}单</div>
              <div>¥{{ row.total_sales || 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.created_at) }}
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
                    <el-dropdown-item v-if="row.status === 'available'" command="deactivate">
                      下架商品
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'inactive'" command="activate">
                      上架商品
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'available'" command="sold_out">
                      设为售罄
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

    <!-- 商品详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="商品详情" width="800px">
      <div v-if="selectedProduct" class="product-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="商品ID">{{ selectedProduct.id }}</el-descriptions-item>
          <el-descriptions-item label="商品名称">{{ selectedProduct.name }}</el-descriptions-item>
          <el-descriptions-item label="商家ID">{{
            selectedProduct.merchant_id
          }}</el-descriptions-item>
          <el-descriptions-item label="商家名称">{{
            selectedProduct.merchant?.merchant_name
          }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{
            getCategoryText(selectedProduct.category)
          }}</el-descriptions-item>
          <el-descriptions-item label="价格"
            >¥{{ selectedProduct.price }}/{{ selectedProduct.unit }}</el-descriptions-item
          >
          <el-descriptions-item label="库存">{{ selectedProduct.stock }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedProduct.status)">
              {{ getStatusText(selectedProduct.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="评分">{{ selectedProduct.rating }}分</el-descriptions-item>
          <el-descriptions-item label="销量">{{
            selectedProduct.sales_count
          }}</el-descriptions-item>
          <el-descriptions-item label="订单数">{{
            selectedProduct.order_count || 0
          }}</el-descriptions-item>
          <el-descriptions-item label="销售额"
            >¥{{ selectedProduct.total_sales || 0 }}</el-descriptions-item
          >
          <el-descriptions-item label="创建时间" :span="2">{{
            formatDateTime(selectedProduct.created_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{
            formatDateTime(selectedProduct.updated_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="商品描述" :span="2">
            {{ selectedProduct.description || '无描述' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 商品图片 -->
        <div
          v-if="selectedProduct.images && selectedProduct.images.length > 0"
          class="product-images"
        >
          <h4>商品图片</h4>
          <div class="images-grid">
            <el-image
              v-for="(image, index) in selectedProduct.images"
              :key="index"
              :src="image"
              :preview-src-list="selectedProduct.images"
              fit="cover"
              style="width: 100px; height: 100px; margin-right: 10px"
            />
          </div>
        </div>

        <!-- 最近订单 -->
        <div
          v-if="selectedProduct.recent_orders && selectedProduct.recent_orders.length > 0"
          class="recent-orders"
        >
          <h4>最近订单</h4>
          <el-table :data="selectedProduct.recent_orders" size="small">
            <el-table-column prop="order_number" label="订单号" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="created_at" label="下单时间">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 操作确认对话框 -->
    <el-dialog v-model="operationDialogVisible" title="商品操作" width="500px">
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
  adminGetAllProductsApiV1ProductsAdminAllGet,
  adminGetProductDetailApiV1ProductsAdminProductIdGet,
  adminOperateProductApiV1ProductsAdminProductIdOperatePost,
} from '@/services/api/products'

// 响应式数据
const loading = ref(false)
const products = ref<API.AdminProductListItemSchema[]>([])
const detailDialogVisible = ref(false)
const operationDialogVisible = ref(false)
const operationSubmitting = ref(false)
const selectedProduct = ref<API.AdminProductDetailSchema | null>(null)
const selectedProductForOperation = ref<API.AdminProductListItemSchema | null>(null)
const operationFormRef = ref<FormInstance>()

// 筛选表单
const filterForm = reactive({
  merchant_id: '',
  category: '',
  status: '',
  name: '',
  min_price: undefined as number | undefined,
  max_price: undefined as number | undefined,
  low_stock: false,
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

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const params: API.adminGetAllProductsApiV1ProductsAdminAllGetParams = {
      page: pagination.page,
      page_size: pagination.page_size,
    }

    // 添加筛选条件
    if (filterForm.merchant_id) {
      params.merchant_id = Number(filterForm.merchant_id)
    }
    if (filterForm.category) {
      params.category = filterForm.category as API.ProductCategory
    }
    if (filterForm.status) {
      params.status = filterForm.status as API.ProductStatus
    }
    if (filterForm.name) {
      params.name = filterForm.name
    }
    if (filterForm.min_price !== undefined) {
      params.min_price = filterForm.min_price
    }
    if (filterForm.max_price !== undefined) {
      params.max_price = filterForm.max_price
    }
    if (filterForm.low_stock) {
      params.low_stock = true
    }

    const response = await adminGetAllProductsApiV1ProductsAdminAllGet(params)

    if (response.data?.success && response.data.data) {
      products.value = response.data.data.items || []
      pagination.total = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索商品
const searchProducts = () => {
  pagination.page = 1
  fetchProducts()
}

// 重置筛选
const resetFilter = () => {
  filterForm.merchant_id = ''
  filterForm.category = ''
  filterForm.status = ''
  filterForm.name = ''
  filterForm.min_price = undefined
  filterForm.max_price = undefined
  filterForm.low_stock = false
  pagination.page = 1
  fetchProducts()
}

// 刷新数据
const refreshData = () => {
  fetchProducts()
}

// 查看详情
const viewDetail = async (productId: number) => {
  try {
    const response = await adminGetProductDetailApiV1ProductsAdminProductIdGet({
      product_id: productId,
    })

    if (response.data?.success && response.data.data) {
      selectedProduct.value = response.data.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  }
}

// 处理操作
const handleOperation = (operation: string, product: API.AdminProductListItemSchema) => {
  selectedProductForOperation.value = product
  operationForm.operation = operation
  operationForm.reason = ''
  operationForm.notes = ''
  operationDialogVisible.value = true
}

// 确认操作
const confirmOperation = async () => {
  if (!operationFormRef.value || !selectedProductForOperation.value) return

  try {
    await operationFormRef.value.validate()
  } catch {
    return
  }

  try {
    operationSubmitting.value = true
    await adminOperateProductApiV1ProductsAdminProductIdOperatePost(
      { product_id: selectedProductForOperation.value.id },
      {
        operation: operationForm.operation,
        reason: operationForm.reason,
        notes: operationForm.notes,
      },
    )

    ElMessage.success('操作成功')
    operationDialogVisible.value = false
    await fetchProducts()
  } catch (error: any) {
    console.error('操作失败:', error)
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    operationSubmitting.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 获取分类文本
const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    fruit: '水果',
    vegetable: '蔬菜',
    grain: '粮食',
    seafood: '海鲜',
    other: '其他',
  }
  return categoryMap[category] || category
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    available: 'success',
    sold_out: 'warning',
    inactive: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: '可售',
    sold_out: '售罄',
    inactive: '停售',
  }
  return statusMap[status] || status
}

// 获取操作文本
const getOperationText = (operation: string) => {
  const operationMap: Record<string, string> = {
    deactivate: '下架商品',
    activate: '上架商品',
    sold_out: '设为售罄',
  }
  return operationMap[operation] || operation
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.page_size = val
  pagination.page = 1
  fetchProducts()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchProducts()
}

// 页面加载时获取数据
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.admin-products-view {
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

.products-section {
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

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  flex-shrink: 0;
}

.no-image {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 12px;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.product-category {
  font-size: 12px;
  color: #666;
}

.low-stock {
  color: #e6a23c;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.product-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.product-images {
  margin-top: 20px;
}

.product-images h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.recent-orders {
  margin-top: 20px;
}

.recent-orders h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}
</style>
