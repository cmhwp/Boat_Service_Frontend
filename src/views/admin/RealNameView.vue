<template>
  <div class="realname-admin-view">
    <div class="header">
      <h1>实名认证管理</h1>
      <div class="stats">
        <div class="stat-item">
          <span class="label">待审核</span>
          <span class="value pending">{{ stats.pending }}</span>
        </div>
        <div class="stat-item">
          <span class="label">已通过</span>
          <span class="value approved">{{ stats.approved }}</span>
        </div>
        <div class="stat-item">
          <span class="label">已拒绝</span>
          <span class="value rejected">{{ stats.rejected }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-item">
        <label>状态筛选：</label>
        <select v-model="filters.status" @change="handleFilterChange">
          <option value="">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
      <div class="filter-item">
        <label>每页显示：</label>
        <select v-model="pagination.pageSize" @change="handlePageSizeChange">
          <option :value="10">10条</option>
          <option :value="20">20条</option>
          <option :value="50">50条</option>
        </select>
      </div>
    </div>

    <!-- 认证列表 -->
    <div class="table-container" v-loading="loading">
      <table class="auth-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户ID</th>
            <th>真实姓名</th>
            <th>身份证号</th>
            <th>状态</th>
            <th>提交时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in authList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.user_id }}</td>
            <td>{{ item.real_name }}</td>
            <td>{{ maskIdCard(item.id_card) }}</td>
            <td>
              <span :class="['status', item.status]">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ formatDate(item.updated_at) }}</td>
            <td>
              <div class="actions">
                <button @click="viewDetail(item)" class="btn btn-info">查看详情</button>
                <button
                  v-if="item.status === 'pending'"
                  @click="approveAuth(item)"
                  class="btn btn-success"
                >
                  通过
                </button>
                <button
                  v-if="item.status === 'pending'"
                  @click="rejectAuth(item)"
                  class="btn btn-danger"
                >
                  拒绝
                </button>
                <button @click="deleteAuth(item)" class="btn btn-warning">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="authList.length === 0 && !loading" class="empty-state">
        <p>暂无实名认证记录</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="pagination.total > 0">
      <button
        @click="changePage(pagination.current - 1)"
        :disabled="pagination.current <= 1"
        class="btn"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ pagination.current }} 页，共 {{ pagination.totalPages }} 页， 共
        {{ pagination.total }} 条记录
      </span>
      <button
        @click="changePage(pagination.current + 1)"
        :disabled="pagination.current >= pagination.totalPages"
        class="btn"
      >
        下一页
      </button>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>实名认证详情</h3>
          <button @click="closeDetail" class="close-btn">×</button>
        </div>
        <div class="modal-body" v-if="currentDetail">
          <div class="detail-info">
            <div class="info-row">
              <label>认证ID：</label>
              <span>{{ currentDetail.id }}</span>
            </div>
            <div class="info-row">
              <label>用户ID：</label>
              <span>{{ currentDetail.user_id }}</span>
            </div>
            <div class="info-row">
              <label>真实姓名：</label>
              <span>{{ currentDetail.real_name }}</span>
            </div>
            <div class="info-row">
              <label>身份证号：</label>
              <span>{{ currentDetail.id_card }}</span>
            </div>
            <div class="info-row">
              <label>状态：</label>
              <span :class="['status', currentDetail.status]">
                {{ getStatusText(currentDetail.status) }}
              </span>
            </div>
            <div class="info-row" v-if="currentDetail.reject_reason">
              <label>拒绝原因：</label>
              <span class="reject-reason">{{ currentDetail.reject_reason }}</span>
            </div>
            <div class="info-row">
              <label>提交时间：</label>
              <span>{{ formatDate(currentDetail.created_at) }}</span>
            </div>
            <div class="info-row">
              <label>更新时间：</label>
              <span>{{ formatDate(currentDetail.updated_at) }}</span>
            </div>
          </div>

          <div class="images-section">
            <h4>身份证照片</h4>
            <div class="images-container">
              <div class="image-item">
                <label>正面照片：</label>
                <img
                  v-if="currentDetail.front_image"
                  :src="currentDetail.front_image"
                  alt="身份证正面"
                  @click="previewImage(currentDetail.front_image)"
                  class="id-card-image"
                />
                <span v-else class="no-image">暂无图片</span>
              </div>
              <div class="image-item">
                <label>背面照片：</label>
                <img
                  v-if="currentDetail.back_image"
                  :src="currentDetail.back_image"
                  alt="身份证背面"
                  @click="previewImage(currentDetail.back_image)"
                  class="id-card-image"
                />
                <span v-else class="no-image">暂无图片</span>
              </div>
            </div>
          </div>

          <div class="modal-actions" v-if="currentDetail.status === 'pending'">
            <button @click="approveAuth(currentDetail)" class="btn btn-success">通过认证</button>
            <button @click="rejectAuth(currentDetail)" class="btn btn-danger">拒绝认证</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="showImagePreview" class="modal-overlay" @click="closeImagePreview">
      <div class="image-modal" @click.stop>
        <img :src="previewImageUrl" alt="图片预览" />
        <button @click="closeImagePreview" class="close-btn">×</button>
      </div>
    </div>

    <!-- 拒绝原因弹窗 -->
    <div v-if="showRejectModal" class="modal-overlay" @click="closeRejectModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>拒绝认证</h3>
          <button @click="closeRejectModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>拒绝原因：</label>
            <textarea
              v-model="rejectReason"
              placeholder="请输入拒绝原因..."
              rows="4"
              class="reject-textarea"
            ></textarea>
          </div>
          <div class="modal-actions">
            <button @click="confirmReject" class="btn btn-danger">确认拒绝</button>
            <button @click="closeRejectModal" class="btn">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import {
  getRealnameAuthListApiV1RealnameAuthListGet,
  getRealnameAuthDetailApiV1RealnameAuthAuthIdGet,
  updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPut,
  deleteRealnameAuthApiV1RealnameAuthAuthIdDelete,
} from '@/services/api/realnameAuth'

const loading = ref(false)
const authList = ref<API.RealnameAuthListItemSchema[]>([])
const showDetailModal = ref(false)
const showImagePreview = ref(false)
const showRejectModal = ref(false)
const currentDetail = ref<API.RealnameAuthResponseSchema | null>(null)
const currentRejectItem = ref<API.RealnameAuthListItemSchema | null>(null)
const previewImageUrl = ref('')
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
    alert('获取认证列表失败')
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
    alert('获取详情失败')
  }
}

// 通过认证
const approveAuth = async (
  item: API.RealnameAuthListItemSchema | API.RealnameAuthResponseSchema,
) => {
  if (!confirm('确定要通过该认证申请吗？')) return

  try {
    const response = await updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPut(
      { auth_id: item.id },
      { status: 'approved' },
    )

    if (response.data.success) {
      alert('认证已通过')
      await fetchAuthList()
      if (showDetailModal.value) {
        closeDetail()
      }
    }
  } catch (error) {
    console.error('审核失败:', error)
    alert('审核失败')
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
    alert('请输入拒绝原因')
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
      alert('认证已拒绝')
      await fetchAuthList()
      closeRejectModal()
      if (showDetailModal.value) {
        closeDetail()
      }
    }
  } catch (error) {
    console.error('拒绝失败:', error)
    alert('拒绝失败')
  }
}

// 删除认证记录
const deleteAuth = async (item: API.RealnameAuthListItemSchema) => {
  if (!confirm('确定要删除该认证记录吗？此操作不可恢复！')) return

  try {
    const response = await deleteRealnameAuthApiV1RealnameAuthAuthIdDelete({
      auth_id: item.id,
    })

    if (response.data.success) {
      alert('记录已删除')
      await fetchAuthList()
    }
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败')
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
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.current = page
    fetchAuthList()
  }
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

// 预览图片
const previewImage = (url: string) => {
  previewImageUrl.value = url
  showImagePreview.value = true
}

// 关闭图片预览
const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageUrl.value = ''
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
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  margin: 0;
  color: #333;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px 15px;
  background: #f9f9f9;
  border-radius: 8px;
  min-width: 80px;
}

.stat-item .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-item .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
}

.value.pending {
  color: #ff9500;
}
.value.approved {
  color: #28a745;
}
.value.rejected {
  color: #dc3545;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #555;
}

.filter-item select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.auth-table {
  width: 100%;
  border-collapse: collapse;
}

.auth-table th,
.auth-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.auth-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.auth-table tbody tr:hover {
  background: #f8f9fa;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.approved {
  background: #d1edff;
  color: #0c5460;
}

.status.rejected {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn:hover {
  opacity: 0.8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.page-info {
  color: #666;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.info-row label {
  font-weight: 500;
  min-width: 100px;
  color: #555;
}

.info-row span {
  flex: 1;
}

.reject-reason {
  background: #f8d7da;
  padding: 8px;
  border-radius: 4px;
  color: #721c24;
}

.images-section h4 {
  margin-bottom: 15px;
  color: #333;
}

.images-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.image-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.id-card-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.id-card-image:hover {
  transform: scale(1.05);
}

.no-image {
  color: #999;
  font-style: italic;
}

.modal-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.image-modal {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.image-modal .close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.reject-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
}

.reject-textarea:focus {
  outline: none;
  border-color: #007bff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .filters {
    flex-direction: column;
    gap: 10px;
  }

  .auth-table {
    font-size: 12px;
  }

  .auth-table th,
  .auth-table td {
    padding: 8px 4px;
  }

  .actions {
    flex-direction: column;
  }

  .images-container {
    grid-template-columns: 1fr;
  }
}
</style>
