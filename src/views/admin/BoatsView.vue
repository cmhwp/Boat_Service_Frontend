<template>
  <div class="admin-boats-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>船艇管理</h1>
      <p>管理平台所有船艇信息</p>
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

          <el-form-item label="船艇类型">
            <el-select v-model="filterForm.boat_type" placeholder="请选择类型" clearable>
              <el-option label="观光船" value="passenger" />
              <el-option label="游轮" value="sightseeing" />
              <el-option label="渔船" value="fishing" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="可用" value="available" />
              <el-option label="使用中" value="in_use" />
              <el-option label="维护中" value="maintenance" />
              <el-option label="停用" value="inactive" />
            </el-select>
          </el-form-item>

          <el-form-item label="船艇名称">
            <el-input
              v-model="filterForm.name"
              placeholder="请输入船艇名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="证书号">
            <el-input
              v-model="filterForm.license_number"
              placeholder="请输入证书号"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchBoats" :loading="loading">
              <Search theme="outline" size="14" />
              搜索
            </el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 船艇列表 -->
    <div class="boats-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>船艇列表</span>
            <div class="header-actions">
              <el-button type="primary" @click="refreshData">
                <Refresh theme="outline" size="14" />
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="boats" v-loading="loading" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="船艇信息" min-width="200">
            <template #default="{ row }">
              <div class="boat-info">
                <div class="boat-image">
                  <el-image
                    v-if="row.images && row.images.length > 0"
                    :src="row.images[0]"
                    :preview-src-list="row.images"
                    fit="cover"
                    style="width: 50px; height: 50px"
                  />
                  <div v-else class="no-image">暂无图片</div>
                </div>
                <div class="boat-details">
                  <div class="boat-name">{{ row.name }}</div>
                  <div class="boat-type">{{ getBoatTypeText(row.boat_type) }}</div>
                  <div class="license-number">证书号: {{ row.license_number }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="merchant_name" label="商家" width="120" />
          <el-table-column label="载客量/费率" width="120">
            <template #default="{ row }">
              <div>{{ row.capacity }}人</div>
              <div>¥{{ row.hourly_rate }}/小时</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="current_location" label="当前位置" width="120" />
          <el-table-column label="预约/收入" width="120">
            <template #default="{ row }">
              <div>{{ row.booking_count || 0 }}次</div>
              <div>¥{{ row.total_income || 0 }}</div>
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
                    <el-dropdown-item v-if="row.status !== 'inactive'" command="suspend">
                      暂停船艇
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'inactive'" command="activate">
                      激活船艇
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status !== 'maintenance'" command="maintenance">
                      设为维护
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

    <!-- 船艇详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="船艇详情" width="800px">
      <div v-if="selectedBoat" class="boat-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="船艇ID">{{ selectedBoat.id }}</el-descriptions-item>
          <el-descriptions-item label="船艇名称">{{ selectedBoat.name }}</el-descriptions-item>
          <el-descriptions-item label="商家ID">{{ selectedBoat.merchant_id }}</el-descriptions-item>
          <el-descriptions-item label="商家名称">{{
            selectedBoat.merchant?.merchant_name
          }}</el-descriptions-item>
          <el-descriptions-item label="证书号">{{
            selectedBoat.license_number
          }}</el-descriptions-item>
          <el-descriptions-item label="船艇类型">{{
            getBoatTypeText(selectedBoat.boat_type)
          }}</el-descriptions-item>
          <el-descriptions-item label="载客量">{{ selectedBoat.capacity }}人</el-descriptions-item>
          <el-descriptions-item label="小时费率"
            >¥{{ selectedBoat.hourly_rate }}</el-descriptions-item
          >
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedBoat.status)">
              {{ getStatusText(selectedBoat.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前位置">{{
            selectedBoat.current_location || '未设置'
          }}</el-descriptions-item>
          <el-descriptions-item label="预约次数"
            >{{ selectedBoat.booking_count || 0 }}次</el-descriptions-item
          >
          <el-descriptions-item label="总收入"
            >¥{{ selectedBoat.total_income || 0 }}</el-descriptions-item
          >
          <el-descriptions-item label="创建时间" :span="2">{{
            formatDateTime(selectedBoat.created_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{
            formatDateTime(selectedBoat.updated_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="船艇描述" :span="2">
            {{ selectedBoat.description || '无描述' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 船艇图片 -->
        <div v-if="selectedBoat.images && selectedBoat.images.length > 0" class="boat-images">
          <h4>船艇图片</h4>
          <div class="images-grid">
            <el-image
              v-for="(image, index) in selectedBoat.images"
              :key="index"
              :src="image"
              :preview-src-list="selectedBoat.images"
              fit="cover"
              style="width: 100px; height: 100px; margin-right: 10px"
            />
          </div>
        </div>

        <!-- 最近预约 -->
        <div
          v-if="selectedBoat.recent_bookings && selectedBoat.recent_bookings.length > 0"
          class="recent-bookings"
        >
          <h4>最近预约</h4>
          <el-table :data="selectedBoat.recent_bookings" size="small">
            <el-table-column prop="booking_number" label="预约号" />
            <el-table-column prop="start_time" label="开始时间">
              <template #default="{ row }">
                {{ formatDateTime(row.start_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="passenger_count" label="乘客人数" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 操作确认对话框 -->
    <el-dialog v-model="operationDialogVisible" title="船艇操作" width="500px">
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
  adminGetAllBoatsApiV1BoatsAdminAllGet,
  adminGetBoatDetailApiV1BoatsAdminBoatIdGet,
  adminOperateBoatApiV1BoatsAdminBoatIdOperatePost,
} from '@/services/api/boats'

// 响应式数据
const loading = ref(false)
const boats = ref<API.AdminBoatListItemSchema[]>([])
const detailDialogVisible = ref(false)
const operationDialogVisible = ref(false)
const operationSubmitting = ref(false)
const selectedBoat = ref<API.AdminBoatDetailSchema | null>(null)
const selectedBoatForOperation = ref<API.AdminBoatListItemSchema | null>(null)
const operationFormRef = ref<FormInstance>()

// 筛选表单
const filterForm = reactive({
  merchant_id: '',
  boat_type: '',
  status: '',
  name: '',
  license_number: '',
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

// 获取船艇列表
const fetchBoats = async () => {
  try {
    loading.value = true
    const params: API.adminGetAllBoatsApiV1BoatsAdminAllGetParams = {
      page: pagination.page,
      page_size: pagination.page_size,
    }

    // 添加筛选条件
    if (filterForm.merchant_id) {
      params.merchant_id = Number(filterForm.merchant_id)
    }
    if (filterForm.boat_type) {
      params.boat_type = filterForm.boat_type as API.BoatType
    }
    if (filterForm.status) {
      params.status = filterForm.status as API.BoatStatus
    }
    if (filterForm.name) {
      params.name = filterForm.name
    }
    if (filterForm.license_number) {
      params.license_number = filterForm.license_number
    }

    const response = await adminGetAllBoatsApiV1BoatsAdminAllGet(params)

    if (response.data?.success && response.data.data) {
      boats.value = response.data.data.items || []
      pagination.total = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取船艇列表失败:', error)
    ElMessage.error('获取船艇列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索船艇
const searchBoats = () => {
  pagination.page = 1
  fetchBoats()
}

// 重置筛选
const resetFilter = () => {
  filterForm.merchant_id = ''
  filterForm.boat_type = ''
  filterForm.status = ''
  filterForm.name = ''
  filterForm.license_number = ''
  pagination.page = 1
  fetchBoats()
}

// 刷新数据
const refreshData = () => {
  fetchBoats()
}

// 查看详情
const viewDetail = async (boatId: number) => {
  try {
    const response = await adminGetBoatDetailApiV1BoatsAdminBoatIdGet({
      boat_id: boatId,
    })

    if (response.data?.success && response.data.data) {
      selectedBoat.value = response.data.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取船艇详情失败:', error)
    ElMessage.error('获取船艇详情失败')
  }
}

// 处理操作
const handleOperation = (operation: string, boat: API.AdminBoatListItemSchema) => {
  selectedBoatForOperation.value = boat
  operationForm.operation = operation
  operationForm.reason = ''
  operationForm.notes = ''
  operationDialogVisible.value = true
}

// 确认操作
const confirmOperation = async () => {
  if (!operationFormRef.value || !selectedBoatForOperation.value) return

  try {
    await operationFormRef.value.validate()
  } catch {
    return
  }

  try {
    operationSubmitting.value = true
    await adminOperateBoatApiV1BoatsAdminBoatIdOperatePost(
      { boat_id: selectedBoatForOperation.value.id },
      {
        operation: operationForm.operation,
        reason: operationForm.reason,
        notes: operationForm.notes,
      },
    )

    ElMessage.success('操作成功')
    operationDialogVisible.value = false
    await fetchBoats()
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

// 获取船艇类型文本
const getBoatTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    passenger: '观光船',
    sightseeing: '游轮',
    fishing: '渔船',
  }
  return typeMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    available: 'success',
    in_use: 'primary',
    maintenance: 'warning',
    inactive: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维护中',
    inactive: '停用',
  }
  return statusMap[status] || status
}

// 获取操作文本
const getOperationText = (operation: string) => {
  const operationMap: Record<string, string> = {
    suspend: '暂停船艇',
    activate: '激活船艇',
    maintenance: '设为维护',
  }
  return operationMap[operation] || operation
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.page_size = val
  pagination.page = 1
  fetchBoats()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchBoats()
}

// 页面加载时获取数据
onMounted(() => {
  fetchBoats()
})
</script>

<style scoped>
.admin-boats-view {
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

.boats-section {
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

.boat-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.boat-image {
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

.boat-details {
  flex: 1;
}

.boat-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.boat-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.license-number {
  font-size: 12px;
  color: #999;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.boat-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.boat-images {
  margin-top: 20px;
}

.boat-images h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.recent-bookings {
  margin-top: 20px;
}

.recent-bookings h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}
</style>
