<template>
  <div class="boats-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item>我的船艇</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">我的船艇</h1>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索船艇名称或证书号"
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
          placeholder="船艇状态"
          style="width: 150px; margin-left: 16px"
          clearable
          @change="handleSearch"
        >
          <el-option label="可用" value="available" />
          <el-option label="使用中" value="in_use" />
          <el-option label="维护中" value="maintenance" />
          <el-option label="停用" value="inactive" />
        </el-select>
        <el-select
          v-model="filterType"
          placeholder="船艇类型"
          style="width: 150px; margin-left: 16px"
          clearable
          @change="handleSearch"
        >
          <el-option label="客运船" value="passenger" />
          <el-option label="观光船" value="sightseeing" />
          <el-option label="钓鱼船" value="fishing" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><search /></el-icon>
          搜索
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><plus /></el-icon>
          添加船艇
        </el-button>
      </div>
    </div>

    <!-- 船艇列表 -->
    <div class="boats-grid" v-loading="loading">
      <div v-if="boats.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无船艇数据">
          <el-button type="primary" @click="handleAdd">添加船艇</el-button>
        </el-empty>
      </div>
      <div v-else class="boats-list">
        <div v-for="boat in boats" :key="boat.id" class="boat-card">
          <div class="boat-image">
            <img
              v-if="boat.images && boat.images.length > 0"
              :src="boat.images[0]"
              :alt="boat.name"
              @error="handleImageError"
            />
            <div v-else class="no-image">
              <el-icon size="48"><ship /></el-icon>
              <span>暂无图片</span>
            </div>
          </div>
          <div class="boat-info">
            <div class="boat-header">
              <h3 class="boat-name">{{ boat.name }}</h3>
              <el-tag :type="getStatusTagType(boat.status)" size="small">
                {{ getStatusText(boat.status) }}
              </el-tag>
            </div>
            <div class="boat-details">
              <div class="detail-item">
                <span class="label">类型：</span>
                <span class="value">{{ getTypeText(boat.boat_type) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">载客量：</span>
                <span class="value">{{ boat.capacity }}人</span>
              </div>
              <div class="detail-item">
                <span class="label">小时费率：</span>
                <span class="value price">¥{{ boat.hourly_rate }}/小时</span>
              </div>
              <div class="detail-item">
                <span class="label">当前位置：</span>
                <span class="value">{{ boat.current_location || '未设置' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ formatDate(boat.created_at) }}</span>
              </div>
            </div>
            <div class="boat-actions">
              <el-button size="small" @click="handleView(boat)">查看详情</el-button>
              <el-button size="small" type="primary" @click="handleEdit(boat)">编辑</el-button>
              <el-dropdown @command="(command:any) => handleStatusChange(boat, command)">
                <el-button size="small">
                  状态管理<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="available" :disabled="boat.status === 'available'">
                      设为可用
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="maintenance"
                      :disabled="boat.status === 'maintenance'"
                    >
                      设为维护中
                    </el-dropdown-item>
                    <el-dropdown-item command="inactive" :disabled="boat.status === 'inactive'">
                      设为停用
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button size="small" type="danger" @click="handleDelete(boat)">删除</el-button>
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

    <!-- 船艇详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="船艇详情" width="800px">
      <div v-if="selectedBoat" class="boat-detail">
        <div class="detail-images">
          <el-carousel v-if="selectedBoat.images && selectedBoat.images.length > 0" height="300px">
            <el-carousel-item v-for="image in selectedBoat.images" :key="image">
              <img :src="image" :alt="selectedBoat.name" class="detail-image" />
            </el-carousel-item>
          </el-carousel>
          <div v-else class="no-detail-image">
            <el-icon size="80"><ship /></el-icon>
            <span>暂无图片</span>
          </div>
        </div>
        <div class="detail-content">
          <h2>{{ selectedBoat.name }}</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">证书号：</span>
              <span class="value">{{ selectedBoat.license_number }}</span>
            </div>
            <div class="detail-row">
              <span class="label">船艇类型：</span>
              <span class="value">{{ getTypeText(selectedBoat.boat_type) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">载客量：</span>
              <span class="value">{{ selectedBoat.capacity }}人</span>
            </div>
            <div class="detail-row">
              <span class="label">小时费率：</span>
              <span class="value price">¥{{ selectedBoat.hourly_rate }}/小时</span>
            </div>
            <div class="detail-row">
              <span class="label">状态：</span>
              <el-tag :type="getStatusTagType(selectedBoat.status)">
                {{ getStatusText(selectedBoat.status) }}
              </el-tag>
            </div>
            <div class="detail-row">
              <span class="label">当前位置：</span>
              <span class="value">{{ selectedBoat.current_location || '未设置' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDate(selectedBoat.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">更新时间：</span>
              <span class="value">{{ formatDate(selectedBoat.updated_at) }}</span>
            </div>
          </div>
          <div v-if="selectedBoat.description" class="description">
            <h3>船艇描述</h3>
            <p>{{ selectedBoat.description }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, ArrowDown } from '@element-plus/icons-vue'
import { Ship } from '@icon-park/vue-next'
import {
  getMyBoatsApiV1BoatsMyGet,
  deleteMyBoatApiV1BoatsMyBoatIdDelete,
  updateBoatStatusApiV1BoatsMyBoatIdStatusPatch,
} from '@/services/api/boats'
import dayjs from 'dayjs'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const boats = ref<API.BoatListItemSchema[]>([])
const searchKeyword = ref('')
const filterStatus = ref<API.BoatStatus | ''>('')
const filterType = ref<API.BoatType | ''>('')
const detailDialogVisible = ref(false)
const selectedBoat = ref<API.BoatDetailSchema | null>(null)

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 获取船艇列表
const fetchBoats = async () => {
  try {
    loading.value = true
    const params: API.getMyBoatsApiV1BoatsMyGetParams = {
      page: pagination.page,
      page_size: pagination.pageSize,
    }

    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    const response = await getMyBoatsApiV1BoatsMyGet(params)
    if (response.data.success && response.data.data) {
      boats.value = response.data.data?.items
      pagination.total = response.data.data?.total
    }
  } catch (error) {
    console.error('获取船艇列表失败:', error)
    ElMessage.error('获取船艇列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  fetchBoats()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchBoats()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchBoats()
}

// 添加船艇
const handleAdd = () => {
  router.push('/merchant/boats/add')
}

// 查看详情
const handleView = (boat: API.BoatListItemSchema) => {
  selectedBoat.value = boat as API.BoatDetailSchema
  detailDialogVisible.value = true
}

// 编辑船艇
const handleEdit = (boat: API.BoatListItemSchema) => {
  router.push(`/merchant/boats/edit/${boat.id}`)
}

// 状态变更
const handleStatusChange = async (boat: API.BoatListItemSchema, status: API.BoatStatus) => {
  try {
    const response = await updateBoatStatusApiV1BoatsMyBoatIdStatusPatch(
      { boat_id: boat.id },
      { status },
    )
    if (response.data.success) {
      ElMessage.success('状态更新成功')
      fetchBoats()
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除船艇
const handleDelete = async (boat: API.BoatListItemSchema) => {
  try {
    await ElMessageBox.confirm(`确定要删除船艇"${boat.name}"吗？此操作不可恢复。`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await deleteMyBoatApiV1BoatsMyBoatIdDelete({ boat_id: boat.id })
    if (response.data.success) {
      ElMessage.success('删除成功')
      fetchBoats()
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
const getStatusTagType = (status: API.BoatStatus) => {
  const statusMap = {
    available: 'success',
    in_use: 'warning',
    maintenance: 'info',
    inactive: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: API.BoatStatus) => {
  const statusMap = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维护中',
    inactive: '停用',
  }
  return statusMap[status] || status
}

// 获取类型文本
const getTypeText = (type: API.BoatType) => {
  const typeMap = {
    passenger: '客运船',
    sightseeing: '观光船',
    fishing: '钓鱼船',
  }
  return typeMap[type] || type
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 页面加载时获取数据
onMounted(() => {
  fetchBoats()
})
</script>

<style scoped>
.boats-view {
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

.boats-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.boat-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: #fff;
}

.boat-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.boat-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.boat-image img {
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

.boat-info {
  padding: 20px;
}

.boat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.boat-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.boat-details {
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

.boat-actions {
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
.boat-detail {
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
</style>
