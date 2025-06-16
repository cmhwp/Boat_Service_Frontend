<template>
  <div class="crew-view">
    <!-- 头部统计 -->
    <el-card class="header-card">
      <div class="header">
        <h1>船员管理</h1>
        <div class="stats">
          <el-statistic
            title="待审核申请"
            :value="stats.pendingApplications"
            class="stat-item pending"
          />
          <el-statistic title="活跃船员" :value="stats.activeCrews" class="stat-item active" />
          <el-statistic title="总申请数" :value="stats.totalApplications" class="stat-item total" />
          <el-statistic title="总船员数" :value="stats.totalCrews" class="stat-item total" />
        </div>
      </div>
    </el-card>

    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-form
        :inline="true"
        :model="currentView === 'applications' ? applicationFilters : crewFilters"
        class="filters"
      >
        <el-form-item label="视图切换">
          <el-radio-group v-model="currentView" @change="handleViewChange">
            <el-radio-button value="applications">船员申请</el-radio-button>
            <el-radio-button value="crews">船员管理</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="currentView === 'applications' ? '申请状态' : '船员状态'">
          <el-select
            v-if="currentView === 'applications'"
            v-model="applicationFilters.status"
            placeholder="全部状态"
            clearable
            @change="fetchCurrentData"
            style="width: 120px"
          >
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
          <el-select
            v-else
            v-model="crewFilters.status"
            placeholder="全部状态"
            clearable
            @change="fetchCurrentData"
            style="width: 120px"
          >
            <el-option label="活跃" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="每页显示">
          <el-select
            v-if="currentView === 'applications'"
            v-model="applicationPagination.pageSize"
            @change="handlePageSizeChange"
            style="width: 80px"
          >
            <el-option label="10条" :value="10" />
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
          </el-select>
          <el-select
            v-else
            v-model="crewPagination.pageSize"
            @change="handlePageSizeChange"
            style="width: 80px"
          >
            <el-option label="10条" :value="10" />
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="fetchCurrentData" icon="Refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 主要内容 -->
    <el-card>
      <!-- 船员申请列表 -->
      <div v-if="currentView === 'applications'">
        <el-table
          :data="applicationList"
          v-loading="applicationLoading"
          element-loading-text="加载中..."
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="申请ID" width="80" />
          <el-table-column label="申请用户" width="150">
            <template #default="scope">
              <div v-if="scope.row.user">
                <div class="user-info">
                  <el-avatar :src="scope.row.user.avatar" :size="32" class="user-avatar">
                    {{ scope.row.user.username?.charAt(0) }}
                  </el-avatar>
                  <div class="user-details">
                    <div class="username">{{ scope.row.user.username }}</div>
                    <div class="email">{{ scope.row.user.email }}</div>
                  </div>
                </div>
              </div>
              <span v-else>用户信息不可用</span>
            </template>
          </el-table-column>
          <el-table-column label="申请状态" width="100">
            <template #default="scope">
              <el-tag :type="getApplicationStatusTagType(scope.row.status)" size="small">
                {{ getApplicationStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.apply_time) }}
            </template>
          </el-table-column>
          <el-table-column label="处理时间" width="180">
            <template #default="scope">
              {{ scope.row.handle_time ? formatDate(scope.row.handle_time) : '未处理' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="scope">
              <el-button
                @click="viewApplicationDetail(scope.row)"
                type="primary"
                size="small"
                icon="View"
              >
                查看详情
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending'"
                @click="handleApplication(scope.row, 'approved')"
                type="success"
                size="small"
                icon="Check"
              >
                通过
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending'"
                @click="handleApplication(scope.row, 'rejected')"
                type="danger"
                size="small"
                icon="Close"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="applicationList.length === 0 && !applicationLoading" class="empty-state">
          <el-empty description="暂无船员申请记录" />
        </div>

        <!-- 申请分页 -->
        <div class="pagination-container">
          <el-pagination
            v-if="applicationPagination.total > 0"
            v-model:current-page="applicationPagination.current"
            v-model:page-size="applicationPagination.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="applicationPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <!-- 船员管理列表 -->
      <div v-else>
        <el-table
          :data="crewList"
          v-loading="crewLoading"
          element-loading-text="加载中..."
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="船员ID" width="80" />
          <el-table-column label="船员信息" width="150">
            <template #default="scope">
              <div v-if="scope.row.user">
                <div class="user-info">
                  <el-avatar :src="scope.row.user.avatar" :size="32" class="user-avatar">
                    {{ scope.row.user.username?.charAt(0) }}
                  </el-avatar>
                  <div class="user-details">
                    <div class="username">{{ scope.row.user.username }}</div>
                    <div class="email">{{ scope.row.user.email }}</div>
                  </div>
                </div>
              </div>
              <span v-else>用户信息不可用</span>
            </template>
          </el-table-column>
          <el-table-column prop="boat_license" label="船员证号" width="150" />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getCrewStatusTagType(scope.row.status)" size="small">
                {{ getCrewStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="评分" width="150">
            <template #default="scope">
              <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900" />
            </template>
          </el-table-column>
          <el-table-column label="入职时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.join_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button @click="viewCrewDetail(scope.row)" type="primary" size="small" icon="View">
                查看详情
              </el-button>
              <el-button @click="editCrew(scope.row)" type="warning" size="small" icon="Edit">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="crewList.length === 0 && !crewLoading" class="empty-state">
          <el-empty description="暂无船员记录" />
        </div>

        <!-- 船员分页 -->
        <div class="pagination-container">
          <el-pagination
            v-if="crewPagination.total > 0"
            v-model:current-page="crewPagination.current"
            v-model:page-size="crewPagination.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="crewPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 申请详情弹窗 -->
    <el-dialog
      v-model="showApplicationDetailModal"
      title="申请详情"
      width="600px"
      :before-close="closeApplicationDetail"
    >
      <div v-if="currentApplication">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请ID">{{ currentApplication.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{
            currentApplication.user_id
          }}</el-descriptions-item>
          <el-descriptions-item label="用户名" v-if="currentApplication.user">{{
            currentApplication.user.username
          }}</el-descriptions-item>
          <el-descriptions-item label="邮箱" v-if="currentApplication.user">{{
            currentApplication.user.email
          }}</el-descriptions-item>
          <el-descriptions-item label="申请状态">
            <el-tag :type="getApplicationStatusTagType(currentApplication.status)">
              {{ getApplicationStatusText(currentApplication.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{
            formatDate(currentApplication.apply_time)
          }}</el-descriptions-item>
          <el-descriptions-item label="处理时间">{{
            currentApplication.handle_time ? formatDate(currentApplication.handle_time) : '未处理'
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDate(currentApplication.created_at)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div v-if="currentApplication?.status === 'pending'">
          <el-button @click="closeApplicationDetail">取消</el-button>
          <el-button type="danger" @click="handleApplication(currentApplication, 'rejected')"
            >拒绝申请</el-button
          >
          <el-button type="success" @click="handleApplication(currentApplication, 'approved')"
            >通过申请</el-button
          >
        </div>
        <div v-else>
          <el-button @click="closeApplicationDetail">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 船员详情弹窗 -->
    <el-dialog
      v-model="showCrewDetailModal"
      title="船员详情"
      width="600px"
      :before-close="closeCrewDetail"
    >
      <div v-if="currentCrew">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="船员ID">{{ currentCrew.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentCrew.user_id }}</el-descriptions-item>
          <el-descriptions-item label="用户名" v-if="currentCrew.user">{{
            currentCrew.user.username
          }}</el-descriptions-item>
          <el-descriptions-item label="邮箱" v-if="currentCrew.user">{{
            currentCrew.user.email
          }}</el-descriptions-item>
          <el-descriptions-item label="船员证号">{{
            currentCrew.boat_license
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getCrewStatusTagType(currentCrew.status)">
              {{ getCrewStatusText(currentCrew.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="评分">
            <el-rate v-model="currentCrew.rating" disabled show-score text-color="#ff9900" />
          </el-descriptions-item>
          <el-descriptions-item label="入职时间">{{
            formatDate(currentCrew.join_time)
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDate(currentCrew.created_at)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDate(currentCrew.updated_at)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="closeCrewDetail">关闭</el-button>
        <el-button v-if="currentCrew" type="warning" @click="editCrew(currentCrew)"
          >编辑信息</el-button
        >
      </template>
    </el-dialog>

    <!-- 处理申请弹窗 -->
    <el-dialog
      v-model="showHandleModal"
      :title="handleType === 'approved' ? '通过申请' : '拒绝申请'"
      width="500px"
      :before-close="closeHandleModal"
    >
      <el-form :model="handleForm" label-width="100px" ref="handleFormRef">
        <el-form-item
          v-if="handleType === 'approved'"
          label="船员证号"
          prop="boat_license"
          :rules="[{ required: true, message: '请输入船员证号', trigger: 'blur' }]"
        >
          <el-input v-model="handleForm.boat_license" placeholder="请输入船员证号" maxlength="50" />
        </el-form-item>
        <el-form-item v-else label="操作确认">
          <el-alert title="确定要拒绝该申请吗？此操作不可撤销。" type="warning" :closable="false" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeHandleModal">取消</el-button>
        <el-button :type="handleType === 'approved' ? 'success' : 'danger'" @click="confirmHandle">
          确认{{ handleType === 'approved' ? '通过' : '拒绝' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑船员弹窗 -->
    <el-dialog
      v-model="showEditModal"
      title="编辑船员信息"
      width="500px"
      :before-close="closeEditModal"
    >
      <el-form :model="editForm" label-width="100px" ref="editFormRef">
        <el-form-item
          label="船员证号"
          prop="boat_license"
          :rules="[{ required: true, message: '请输入船员证号', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.boat_license" placeholder="请输入船员证号" maxlength="50" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio value="active">活跃</el-radio>
            <el-radio value="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="editForm.rating" :max="5" show-score text-color="#ff9900" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeEditModal">取消</el-button>
        <el-button type="primary" @click="confirmEdit">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import {
  getCrewApplicationsApiV1CrewApplicationsGet,
  handleCrewApplicationApiV1CrewHandleApplicationPost,
  getCrewListApiV1CrewListGet,
  updateCrewApiV1CrewCrewIdPut,
  getCrewDetailApiV1CrewCrewIdGet,
} from '@/services/api/crew'

// 当前视图
const currentView = ref<'applications' | 'crews'>('applications')

// 响应式数据
const applicationLoading = ref(false)
const crewLoading = ref(false)
const applicationList = ref<API.CrewApplicationDetailSchema[]>([])
const crewList = ref<API.CrewListItemSchema[]>([])
const showApplicationDetailModal = ref(false)
const showCrewDetailModal = ref(false)
const showHandleModal = ref(false)
const showEditModal = ref(false)
const currentApplication = ref<API.CrewApplicationDetailSchema | null>(null)
const currentCrew = ref<API.CrewDetailSchema | null>(null)
const currentHandleApplication = ref<API.CrewApplicationDetailSchema | null>(null)
const currentEditCrew = ref<API.CrewListItemSchema | null>(null)
const handleType = ref<API.CrewApplicationStatus>('approved')
const handleFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()

// 筛选条件
const applicationFilters = reactive({
  status: '' as API.CrewApplicationStatus | '',
})

const crewFilters = reactive({
  status: '' as API.CrewStatus | '',
})

// 分页数据
const applicationPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const crewPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 表单数据
const handleForm = reactive({
  boat_license: '',
})

const editForm = reactive({
  boat_license: '',
  status: 'active' as API.CrewStatus,
  rating: 0,
})

// 统计数据
const stats = computed(() => {
  const pendingApplications = applicationList.value.filter(
    (item) => item.status === 'pending',
  ).length
  const activeCrews = crewList.value.filter((item) => item.status === 'active').length
  return {
    pendingApplications,
    activeCrews,
    totalApplications: applicationList.value.length,
    totalCrews: crewList.value.length,
  }
})

// 获取申请列表
const fetchApplications = async () => {
  try {
    applicationLoading.value = true
    const params = {
      page: applicationPagination.current,
      page_size: applicationPagination.pageSize,
    }

    const response = await getCrewApplicationsApiV1CrewApplicationsGet(params)

    if (response.data && response.data.success) {
      applicationList.value = response.data.data?.items ?? []
      applicationPagination.total = response.data.data?.total ?? 0
    }
  } catch (error) {
    console.error('获取申请列表失败:', error)
    ElMessage.error('获取申请列表失败')
  } finally {
    applicationLoading.value = false
  }
}

// 获取船员列表
const fetchCrews = async () => {
  try {
    crewLoading.value = true
    const params = {
      page: crewPagination.current,
      page_size: crewPagination.pageSize,
    }

    const response = await getCrewListApiV1CrewListGet(params)

    if (response.data && response.data.success) {
      crewList.value = response.data.data?.items ?? []
      crewPagination.total = response.data.data?.total ?? 0
    }
  } catch (error) {
    console.error('获取船员列表失败:', error)
    ElMessage.error('获取船员列表失败')
  } finally {
    crewLoading.value = false
  }
}

// 获取当前视图数据
const fetchCurrentData = () => {
  if (currentView.value === 'applications') {
    fetchApplications()
  } else {
    fetchCrews()
  }
}

// 查看申请详情
const viewApplicationDetail = (application: API.CrewApplicationDetailSchema) => {
  currentApplication.value = application
  showApplicationDetailModal.value = true
}

// 查看船员详情
const viewCrewDetail = async (crew: API.CrewListItemSchema) => {
  try {
    const response = await getCrewDetailApiV1CrewCrewIdGet({ crew_id: crew.id })
    if (response.data && response.data.success) {
      currentCrew.value = response.data.data ?? null
      showCrewDetailModal.value = true
    }
  } catch (error) {
    console.error('获取船员详情失败:', error)
    ElMessage.error('获取船员详情失败')
  }
}

// 处理申请
const handleApplication = (
  application: API.CrewApplicationDetailSchema,
  type: API.CrewApplicationStatus,
) => {
  currentHandleApplication.value = application
  handleType.value = type
  handleForm.boat_license = ''
  showHandleModal.value = true
}

// 确认处理申请
const confirmHandle = async () => {
  if (!currentHandleApplication.value) return

  if (handleType.value === 'approved') {
    if (!handleFormRef.value) return
    const valid = await handleFormRef.value.validate().catch(() => false)
    if (!valid) return
  }

  try {
    const payload: API.CrewApplicationHandleSchema = {
      application_id: currentHandleApplication.value.id,
      status: handleType.value,
    }

    if (handleType.value === 'approved') {
      payload.boat_license = handleForm.boat_license
    }

    const response = await handleCrewApplicationApiV1CrewHandleApplicationPost(payload)

    if (response.data.success) {
      ElMessage.success(`申请${handleType.value === 'approved' ? '通过' : '拒绝'}成功`)
      closeHandleModal()
      await fetchApplications()
      if (handleType.value === 'approved') {
        await fetchCrews()
      }
    }
  } catch (error) {
    console.error('处理申请失败:', error)
    ElMessage.error('处理申请失败')
  }
}

// 编辑船员
const editCrew = (crew: API.CrewListItemSchema | API.CrewDetailSchema) => {
  currentEditCrew.value = crew as API.CrewListItemSchema
  editForm.boat_license = crew.boat_license
  editForm.status = crew.status
  editForm.rating = crew.rating
  showEditModal.value = true
}

// 确认编辑
const confirmEdit = async () => {
  if (!currentEditCrew.value || !editFormRef.value) return

  const valid = await editFormRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    const response = await updateCrewApiV1CrewCrewIdPut(
      { crew_id: currentEditCrew.value.id },
      {
        boat_license: editForm.boat_license,
        status: editForm.status,
        rating: editForm.rating,
      },
    )

    if (response.data.success) {
      ElMessage.success('船员信息更新成功')
      closeEditModal()
      await fetchCrews()
      if (showCrewDetailModal.value && currentCrew.value) {
        await viewCrewDetail(currentEditCrew.value)
      }
    }
  } catch (error) {
    console.error('更新船员信息失败:', error)
    ElMessage.error('更新船员信息失败')
  }
}

// 视图切换
const handleViewChange = () => {
  fetchCurrentData()
}

// 分页处理
const handlePageChange = () => {
  fetchCurrentData()
}

const handlePageSizeChange = () => {
  if (currentView.value === 'applications') {
    applicationPagination.current = 1
  } else {
    crewPagination.current = 1
  }
  fetchCurrentData()
}

// 关闭弹窗
const closeApplicationDetail = () => {
  showApplicationDetailModal.value = false
  currentApplication.value = null
}

const closeCrewDetail = () => {
  showCrewDetailModal.value = false
  currentCrew.value = null
}

const closeHandleModal = () => {
  showHandleModal.value = false
  currentHandleApplication.value = null
  handleForm.boat_license = ''
}

const closeEditModal = () => {
  showEditModal.value = false
  currentEditCrew.value = null
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取申请状态文本
const getApplicationStatusText = (status: API.CrewApplicationStatus) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  }
  return statusMap[status] || status
}

// 获取申请状态标签类型
const getApplicationStatusTagType = (status: API.CrewApplicationStatus) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取船员状态文本
const getCrewStatusText = (status: API.CrewStatus) => {
  const statusMap = {
    active: '活跃',
    inactive: '停用',
  }
  return statusMap[status] || status
}

// 获取船员状态标签类型
const getCrewStatusTagType = (status: API.CrewStatus) => {
  const typeMap = {
    active: 'success',
    inactive: 'danger',
  }
  return typeMap[status] || 'info'
}

// 组件挂载时获取数据
onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.crew-view {
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

.stat-item.active :deep(.el-statistic__content) {
  color: #67c23a;
}

.stat-item.total :deep(.el-statistic__content) {
  color: #409eff;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.username {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email {
  color: #909399;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .user-details {
    width: 100%;
  }
}
</style>
