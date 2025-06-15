<template>
  <div class="merchant-audit-view">
    <el-card class="header-card">
      <div class="header">
        <h1>商家审核管理</h1>
        <div class="stats">
          <el-statistic title="待审核" :value="stats.pending" class="stat-item pending" />
          <el-statistic title="已通过" :value="stats.active" class="stat-item active" />
          <el-statistic title="已暂停" :value="stats.suspended" class="stat-item suspended" />
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
            <el-option label="已通过" value="active" />
            <el-option label="已暂停" value="suspended" />
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
        <el-form-item>
          <el-button
            @click="showPendingOnly"
            type="primary"
            :class="{ 'is-plain': !onlyPending }"
            :plain="!onlyPending"
          >
            {{ onlyPending ? '显示全部' : '仅显示待审核' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商家列表 -->
    <el-card>
      <el-table
        :data="merchantList"
        v-loading="loading"
        element-loading-text="加载中..."
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="merchant_name" label="商家名称" width="150" />
        <el-table-column prop="license_number" label="营业执照号" width="180" />
        <el-table-column prop="contact_phone" label="联系电话" width="130" />
        <el-table-column label="地址" width="180">
          <template #default="scope">
            {{ scope.row.address || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="scope">
            <el-button @click="viewDetail(scope.row)" type="primary" size="small" icon="View">
              查看详情
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              @click="approveMerchant(scope.row)"
              type="success"
              size="small"
              icon="Check"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              @click="rejectMerchant(scope.row)"
              type="danger"
              size="small"
              icon="Close"
            >
              拒绝
            </el-button>
            <el-button
              @click="viewAuditHistory(scope.row)"
              type="info"
              size="small"
              icon="Document"
            >
              审核历史
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="merchantList.length === 0 && !loading" class="empty-state">
        <el-empty :description="onlyPending ? '暂无待审核商家申请' : '暂无商家记录'" />
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
    <el-dialog v-model="showDetailModal" title="商家详情" width="800px" :before-close="closeDetail">
      <div v-if="currentDetail">
        <el-tabs>
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="商家ID">{{ currentDetail.id }}</el-descriptions-item>
              <el-descriptions-item label="用户ID">{{
                currentDetail.user_id
              }}</el-descriptions-item>
              <el-descriptions-item label="商家名称">{{
                currentDetail.merchant_name
              }}</el-descriptions-item>
              <el-descriptions-item label="营业执照号">{{
                currentDetail.license_number
              }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{
                currentDetail.contact_phone
              }}</el-descriptions-item>
              <el-descriptions-item label="地址">{{
                currentDetail.address || '未填写'
              }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusTagType(currentDetail.status)">
                  {{ getStatusText(currentDetail.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="申请时间">{{
                formatDate(currentDetail.created_at)
              }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{
                formatDate(currentDetail.updated_at)
              }}</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">{{
                currentDetail.description || '未填写'
              }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="营业执照" name="license">
            <div class="license-section">
              <el-image
                v-if="currentDetail.license_image"
                :src="currentDetail.license_image"
                fit="contain"
                style="width: 100%; max-height: 400px"
                :preview-src-list="[currentDetail.license_image]"
                preview-teleported
              />
              <el-empty v-else description="暂无营业执照图片" />
            </div>
          </el-tab-pane>

          <el-tab-pane label="申请人信息" name="user" v-if="currentDetail.user">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户名">{{
                currentDetail.user.username
              }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{
                currentDetail.user.email
              }}</el-descriptions-item>
              <el-descriptions-item label="注册时间" :span="2">{{
                formatDate(currentDetail.user.created_at)
              }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div v-if="currentDetail?.status === 'pending'">
          <el-button @click="closeDetail">取消</el-button>
          <el-button type="danger" @click="rejectMerchant(currentDetail)">拒绝审核</el-button>
          <el-button type="success" @click="approveMerchant(currentDetail)">通过审核</el-button>
        </div>
        <div v-else>
          <el-button @click="closeDetail">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="showAuditModal"
      :title="auditType === 'approved' ? '通过审核' : '拒绝审核'"
      width="500px"
      :before-close="closeAuditModal"
    >
      <el-form :model="{ auditComment }" label-width="80px">
        <el-form-item label="审核意见" :required="auditType === 'rejected'">
          <el-input
            v-model="auditComment"
            type="textarea"
            :rows="4"
            :placeholder="
              auditType === 'approved' ? '请输入通过理由（可选）...' : '请输入拒绝原因...'
            "
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeAuditModal">取消</el-button>
        <el-button :type="auditType === 'approved' ? 'success' : 'danger'" @click="confirmAudit">
          确认{{ auditType === 'approved' ? '通过' : '拒绝' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 审核历史弹窗 -->
    <el-dialog
      v-model="showHistoryModal"
      title="审核历史"
      width="700px"
      :before-close="closeHistoryModal"
    >
      <div v-if="auditHistory.length > 0">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in auditHistory"
            :key="index"
            :timestamp="formatDate(record.created_at)"
            :type="record.audit_result === 'approved' ? 'success' : 'danger'"
          >
            <el-card>
              <div class="history-header">
                <el-tag
                  :type="record.audit_result === 'approved' ? 'success' : 'danger'"
                  size="small"
                >
                  {{ record.audit_result === 'approved' ? '通过' : '拒绝' }}
                </el-tag>
                <span class="audit-admin">审核员ID: {{ record.admin_id }}</span>
              </div>
              <div v-if="record.comment" class="history-comment">
                <el-text type="info">审核意见: {{ record.comment }}</el-text>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-else>
        <el-empty description="暂无审核历史" />
      </div>

      <template #footer>
        <el-button @click="closeHistoryModal">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMerchantsListApiV1MerchantsGet,
  getPendingMerchantsApiV1MerchantsPendingGet,
  getMerchantByIdApiV1MerchantsMerchantIdGet,
  getMerchantAuditHistoryApiV1MerchantsMerchantIdAuditHistoryGet,
  auditMerchantApiV1MerchantsAuditPost,
} from '@/services/api/merchants'

const loading = ref(false)
const merchantList = ref<API.MerchantListItemSchema[]>([])
const showDetailModal = ref(false)
const showAuditModal = ref(false)
const showHistoryModal = ref(false)
const currentDetail = ref<API.MerchantDetailSchema | null>(null)
const currentAuditItem = ref<API.MerchantListItemSchema | API.MerchantDetailSchema | null>(null)
const auditComment = ref('')
const auditType = ref<API.AuditResult>('approved')
const auditHistory = ref<API.MerchantAuditResponseSchema[]>([])
const onlyPending = ref(false)

const filters = reactive({
  status: '' as API.MerchantStatus | '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// 统计数据
const stats = computed(() => {
  const pending = merchantList.value.filter((item) => item.status === 'pending').length
  const active = merchantList.value.filter((item) => item.status === 'active').length
  const suspended = merchantList.value.filter((item) => item.status === 'suspended').length
  return { pending, active, suspended }
})

// 获取商家列表
const fetchMerchantList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      status: filters.status || undefined,
    }

    let response
    if (onlyPending.value) {
      response = await getPendingMerchantsApiV1MerchantsPendingGet(params)
    } else {
      response = await getMerchantsListApiV1MerchantsGet(params)
    }

    if (response.data && response.data.success) {
      merchantList.value = response.data.data?.items ?? []
      pagination.total = response.data.data?.total ?? 0
      pagination.totalPages = response.data.data?.total_pages ?? 0
    }
  } catch (error) {
    console.error('获取商家列表失败:', error)
    ElMessage.error('获取商家列表失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const viewDetail = async (item: API.MerchantListItemSchema) => {
  try {
    const response = await getMerchantByIdApiV1MerchantsMerchantIdGet({
      merchant_id: item.id,
    })

    if (response.data && response.data.success) {
      currentDetail.value = response.data.data ?? null
      showDetailModal.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 通过审核
const approveMerchant = (item: API.MerchantListItemSchema | API.MerchantDetailSchema) => {
  currentAuditItem.value = item
  auditType.value = 'approved'
  auditComment.value = ''
  showAuditModal.value = true
}

// 拒绝审核
const rejectMerchant = (item: API.MerchantListItemSchema | API.MerchantDetailSchema) => {
  currentAuditItem.value = item
  auditType.value = 'rejected'
  auditComment.value = ''
  showAuditModal.value = true
}

// 确认审核
const confirmAudit = async () => {
  if (!currentAuditItem.value) return
  if (auditType.value === 'rejected' && !auditComment.value.trim()) {
    ElMessage.error('拒绝审核时必须填写原因')
    return
  }

  try {
    const response = await auditMerchantApiV1MerchantsAuditPost({
      merchant_id: currentAuditItem.value.id,
      audit_result: auditType.value,
      comment: auditComment.value.trim() || undefined,
    })

    if (response.data.success) {
      ElMessage.success(`审核${auditType.value === 'approved' ? '通过' : '拒绝'}成功`)
      await fetchMerchantList()
      closeAuditModal()
      if (showDetailModal.value) {
        closeDetail()
      }
    }
  } catch (error) {
    console.error('审核失败:', error)
    ElMessage.error('审核失败')
  }
}

// 查看审核历史
const viewAuditHistory = async (item: API.MerchantListItemSchema) => {
  try {
    const response = await getMerchantAuditHistoryApiV1MerchantsMerchantIdAuditHistoryGet({
      merchant_id: item.id,
    })

    if (response.data && response.data.success) {
      auditHistory.value = response.data.data as API.MerchantAuditResponseSchema[]
      showHistoryModal.value = true
    }
  } catch (error) {
    console.error('获取审核历史失败:', error)
    ElMessage.error('获取审核历史失败')
  }
}

// 显示待审核
const showPendingOnly = () => {
  onlyPending.value = !onlyPending.value
  pagination.current = 1
  if (onlyPending.value) {
    filters.status = ''
  }
  fetchMerchantList()
}

// 筛选变化
const handleFilterChange = () => {
  if (onlyPending.value) {
    onlyPending.value = false
  }
  pagination.current = 1
  fetchMerchantList()
}

// 页面大小变化
const handlePageSizeChange = () => {
  pagination.current = 1
  fetchMerchantList()
}

// 切换页面
const changePage = (page: number) => {
  pagination.current = page
  fetchMerchantList()
}

// 关闭详情弹窗
const closeDetail = () => {
  showDetailModal.value = false
  currentDetail.value = null
}

// 关闭审核弹窗
const closeAuditModal = () => {
  showAuditModal.value = false
  currentAuditItem.value = null
  auditComment.value = ''
}

// 关闭历史弹窗
const closeHistoryModal = () => {
  showHistoryModal.value = false
  auditHistory.value = []
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取状态文本
const getStatusText = (status: API.MerchantStatus) => {
  const statusMap = {
    pending: '待审核',
    active: '已通过',
    suspended: '已暂停',
  }
  return statusMap[status] || status
}

// 获取状态标签类型
const getStatusTagType = (status: API.MerchantStatus) => {
  const typeMap = {
    pending: 'warning',
    active: 'success',
    suspended: 'danger',
  }
  return typeMap[status] || 'info'
}

onMounted(() => {
  fetchMerchantList()
})
</script>

<style scoped>
.merchant-audit-view {
  padding: 20px;
  max-width: 1600px;
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

.stat-item.suspended :deep(.el-statistic__content) {
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

.license-section {
  text-align: center;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.audit-admin {
  font-size: 12px;
  color: #666;
}

.history-comment {
  margin-top: 8px;
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
