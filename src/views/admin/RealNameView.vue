<template>
  <div class="realname-admin-view">
    <el-card class="header-card">
      <div class="header">
        <h1>实名认证管理</h1>
        <div class="stats">
          <el-statistic title="待审核" :value="stats.pending" class="stat-item pending" />
          <el-statistic title="已通过" :value="stats.approved" class="stat-item approved" />
          <el-statistic title="已拒绝" :value="stats.rejected" class="stat-item rejected" />
        </div>
      </div>
    </el-card>

    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filters">
        <el-form-item label="状态筛选">
          <el-select
            v-model="filters.status"
            placeholder="全部"
            clearable
            @change="handleFilterChange"
            style="width: 120px"
          >
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="每页显示">
          <el-select
            v-model="pagination.pageSize"
            @change="handlePageSizeChange"
            style="width: 80px"
          >
            <el-option label="10条" :value="10" />
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 认证列表 -->
    <el-card>
      <el-table
        :data="authList"
        v-loading="loading"
        element-loading-text="加载中..."
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user_id" label="用户ID" width="100" />
        <el-table-column prop="real_name" label="真实姓名" width="120" />
        <el-table-column label="身份证号" width="180">
          <template #default="scope">
            {{ maskIdCard(scope.row.id_card) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.updated_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button @click="viewDetail(scope.row)" type="primary" size="small" icon="View">
              查看详情
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              @click="approveAuth(scope.row)"
              type="success"
              size="small"
              icon="Check"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              @click="rejectAuth(scope.row)"
              type="danger"
              size="small"
              icon="Close"
            >
              拒绝
            </el-button>
            <el-popconfirm
              title="确定要删除该认证记录吗？此操作不可恢复！"
              @confirm="deleteAuth(scope.row)"
            >
              <template #reference>
                <el-button type="warning" size="small" icon="Delete"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="authList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无实名认证记录" />
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-if="pagination.total > 0"
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="changePage"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="showDetailModal"
      title="实名认证详情"
      width="600px"
      :before-close="closeDetail"
    >
      <div v-if="currentDetail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="认证ID">{{ currentDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentDetail.user_id }}</el-descriptions-item>
          <el-descriptions-item label="真实姓名">{{
            currentDetail.real_name
          }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ currentDetail.id_card }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentDetail.status)">
              {{ getStatusText(currentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{
            formatDate(currentDetail.created_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDate(currentDetail.updated_at)
          }}</el-descriptions-item>
          <el-descriptions-item v-if="currentDetail.reject_reason" label="拒绝原因" :span="2">
            <el-alert :title="currentDetail.reject_reason" type="error" :closable="false" />
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">身份证照片</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="image-item">
              <p class="image-label">正面照片：</p>
              <el-image
                v-if="currentDetail.front_image"
                :src="currentDetail.front_image"
                fit="contain"
                style="width: 100%; height: 200px"
                :preview-src-list="[currentDetail.front_image]"
                preview-teleported
              />
              <el-empty v-else description="暂无图片" :image-size="100" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="image-item">
              <p class="image-label">背面照片：</p>
              <el-image
                v-if="currentDetail.back_image"
                :src="currentDetail.back_image"
                fit="contain"
                style="width: 100%; height: 200px"
                :preview-src-list="[currentDetail.back_image]"
                preview-teleported
              />
              <el-empty v-else description="暂无图片" :image-size="100" />
            </div>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <div v-if="currentDetail?.status === 'pending'">
          <el-button @click="closeDetail">取消</el-button>
          <el-button type="danger" @click="rejectAuth(currentDetail)">拒绝认证</el-button>
          <el-button type="success" @click="approveAuth(currentDetail)">通过认证</el-button>
        </div>
        <div v-else>
          <el-button @click="closeDetail">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 拒绝原因弹窗 -->
    <el-dialog
      v-model="showRejectModal"
      title="拒绝认证"
      width="500px"
      :before-close="closeRejectModal"
    >
      <el-form :model="{ rejectReason }" label-width="80px">
        <el-form-item label="拒绝原因" required>
          <el-input
            v-model="rejectReason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeRejectModal">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRealnameAuthListApiV1RealnameAuthListGet,
  getRealnameAuthDetailApiV1RealnameAuthAuthIdGet,
  updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPut,
  deleteRealnameAuthApiV1RealnameAuthAuthIdDelete,
} from '@/services/api/realnameAuth'

const loading = ref(false)
const authList = ref<API.RealnameAuthListItemSchema[]>([])
const showDetailModal = ref(false)
const showRejectModal = ref(false)
const currentDetail = ref<API.RealnameAuthResponseSchema | null>(null)
const currentRejectItem = ref<API.RealnameAuthListItemSchema | null>(null)
const rejectReason = ref('')

const filters = reactive({
  status: '' as API.RealnameAuthStatus | '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// 统计数据
const stats = computed(() => {
  const pending = authList.value.filter((item) => item.status === 'pending').length
  const approved = authList.value.filter((item) => item.status === 'approved').length
  const rejected = authList.value.filter((item) => item.status === 'rejected').length
  return { pending, approved, rejected }
})

// 获取认证列表
const fetchAuthList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      status: filters.status || undefined,
    }

    const response = await getRealnameAuthListApiV1RealnameAuthListGet(params)

    if (response.data && response.data.success) {
      authList.value = response.data.data?.items ?? []
      pagination.total = response.data.data?.total ?? 0
      pagination.totalPages = response.data.data?.total_pages ?? 0
    }
  } catch (error) {
    console.error('获取认证列表失败:', error)
    ElMessage.error('获取认证列表失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const viewDetail = async (item: API.RealnameAuthListItemSchema) => {
  try {
    const response = await getRealnameAuthDetailApiV1RealnameAuthAuthIdGet({
      auth_id: item.id,
    })

    if (response.data && response.data.success) {
      currentDetail.value = response.data?.data ?? null
      showDetailModal.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 通过认证
const approveAuth = async (
  item: API.RealnameAuthListItemSchema | API.RealnameAuthResponseSchema,
) => {
  try {
    await ElMessageBox.confirm('确定要通过该认证申请吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPut(
      { auth_id: item.id },
      { status: 'approved' },
    )

    if (response.data.success) {
      ElMessage.success('认证已通过')
      await fetchAuthList()
      if (showDetailModal.value) {
        closeDetail()
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审核失败:', error)
      ElMessage.error('审核失败')
    }
  }
}

// 拒绝认证
const rejectAuth = (item: API.RealnameAuthListItemSchema | API.RealnameAuthResponseSchema) => {
  currentRejectItem.value = item as API.RealnameAuthListItemSchema
  rejectReason.value = ''
  showRejectModal.value = true
}

// 确认拒绝
const confirmReject = async () => {
  if (!currentRejectItem.value) return
  if (!rejectReason.value.trim()) {
    ElMessage.error('请输入拒绝原因')
    return
  }

  try {
    const response = await updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPut(
      { auth_id: currentRejectItem.value.id },
      {
        status: 'rejected',
        reject_reason: rejectReason.value.trim(),
      },
    )

    if (response.data.success) {
      ElMessage.success('认证已拒绝')
      await fetchAuthList()
      closeRejectModal()
      if (showDetailModal.value) {
        closeDetail()
      }
    }
  } catch (error) {
    console.error('拒绝失败:', error)
    ElMessage.error('拒绝失败')
  }
}

// 删除认证记录
const deleteAuth = async (item: API.RealnameAuthListItemSchema) => {
  try {
    const response = await deleteRealnameAuthApiV1RealnameAuthAuthIdDelete({
      auth_id: item.id,
    })

    if (response.data.success) {
      ElMessage.success('记录已删除')
      await fetchAuthList()
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

// 筛选变化
const handleFilterChange = () => {
  pagination.current = 1
  fetchAuthList()
}

// 页面大小变化
const handlePageSizeChange = () => {
  pagination.current = 1
  fetchAuthList()
}

// 切换页面
const changePage = (page: number) => {
  pagination.current = page
  fetchAuthList()
}

// 关闭详情弹窗
const closeDetail = () => {
  showDetailModal.value = false
  currentDetail.value = null
}

// 关闭拒绝弹窗
const closeRejectModal = () => {
  showRejectModal.value = false
  currentRejectItem.value = null
  rejectReason.value = ''
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取状态文本
const getStatusText = (status: API.RealnameAuthStatus) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  }
  return statusMap[status] || status
}

// 获取状态标签类型
const getStatusTagType = (status: API.RealnameAuthStatus) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return typeMap[status] || 'info'
}

// 脱敏身份证号
const maskIdCard = (idCard: string) => {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.slice(0, 4) + '****' + idCard.slice(-4)
}

onMounted(() => {
  fetchAuthList()
})
</script>

<style scoped>
.realname-admin-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-card {
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: #333;
}

.stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item.pending :deep(.el-statistic__content) {
  color: #e6a23c;
}

.stat-item.approved :deep(.el-statistic__content) {
  color: #67c23a;
}

.stat-item.rejected :deep(.el-statistic__content) {
  color: #f56c6c;
}

.filter-card {
  margin-bottom: 20px;
}

.filters {
  margin: 0;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.image-label {
  margin-bottom: 10px;
  font-weight: 500;
  color: #555;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .stats {
    width: 100%;
    justify-content: space-around;
  }

  .filters {
    flex-direction: column;
  }
}
</style>
