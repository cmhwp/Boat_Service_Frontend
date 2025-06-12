<template>
  <div class="profile-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-description">管理您的个人信息和认证状态</p>
    </div>

    <div class="profile-content">
      <!-- 左侧内容区 -->
      <div class="left-content">
        <el-card class="content-card" shadow="hover">
          <el-tabs v-model="activeTab" class="profile-tabs">
            <!-- 基本信息标签页 -->
            <el-tab-pane label="基本信息" name="basic">
              <div class="basic-info-content">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="用户名">
                    {{ userInfo?.username || '未设置' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="邮箱">
                    {{ userInfo?.email || '未设置' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="手机号">
                    {{ userInfo?.phone || '未绑定' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="用户角色">
                    <el-tag :type="getRoleType(userInfo?.role)">
                      {{ getRoleText(userInfo?.role) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="账户状态">
                    <el-tag :type="userInfo?.is_active ? 'success' : 'danger'">
                      {{ userInfo?.is_active ? '正常' : '已停用' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="注册时间">
                    {{ formatDate(userInfo?.created_at) }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>

            <!-- 实名认证标签页 -->
            <el-tab-pane label="实名认证" name="realname">
              <div class="realname-content">
                <div v-if="realnameAuth" class="realname-info">
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="真实姓名">
                      {{ realnameAuth.real_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="身份证号">
                      {{ hideIdCard(realnameAuth.id_card) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="认证状态">
                      <el-tag :type="getStatusTagType(realnameAuth.status)">
                        {{ getStatusText(realnameAuth.status) }}
                      </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="申请时间">
                      {{ formatDate(realnameAuth.created_at) }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="realnameAuth.updated_at" label="更新时间">
                      {{ formatDate(realnameAuth.updated_at) }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="realnameAuth.reject_reason" label="拒绝原因">
                      <span class="reject-reason">{{ realnameAuth.reject_reason }}</span>
                    </el-descriptions-item>
                  </el-descriptions>

                  <!-- 身份证图片展示 -->
                  <div class="id-card-images">
                    <h4>身份证照片</h4>
                    <div class="image-preview">
                      <div class="image-item">
                        <img :src="realnameAuth.front_image" alt="身份证正面" class="id-card-img" />
                        <p>身份证正面</p>
                      </div>
                      <div class="image-item">
                        <img :src="realnameAuth.back_image" alt="身份证背面" class="id-card-img" />
                        <p>身份证背面</p>
                      </div>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="realname-actions">
                    <el-button
                      v-if="canModifyRealname"
                      type="primary"
                      @click="handleEditRealname"
                      :loading="realnameStore.submitting"
                    >
                      修改认证信息
                    </el-button>
                  </div>
                </div>

                <div v-else class="no-realname">
                  <el-empty description="您尚未进行实名认证">
                    <el-button
                      type="primary"
                      size="large"
                      @click="handleApplyRealname"
                      :loading="realnameStore.submitting"
                    >
                      立即认证
                    </el-button>
                  </el-empty>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <!-- 右侧头像和状态 -->
      <div class="right-content">
        <!-- 头像卡片 -->
        <el-card class="avatar-card" shadow="hover">
          <div class="avatar-section">
            <el-avatar
              :size="120"
              :src="userInfo?.avatar || undefined"
              :icon="UserFilled"
              class="user-avatar"
            />
            <div class="avatar-upload">
              <el-upload
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadAvatar"
                accept="image/*"
              >
                <el-button type="primary" plain>
                  <el-icon><upload /></el-icon>
                  更换头像
                </el-button>
              </el-upload>
            </div>
            <div class="user-name">
              {{ userInfo?.username || '用户' }}
            </div>
          </div>
        </el-card>

        <!-- 认证状态卡片 -->
        <el-card class="status-card" shadow="hover">
          <template #header>
            <h3>认证状态</h3>
          </template>
          <div class="status-content">
            <div class="status-display">
              <el-icon :size="48" :color="getStatusColor(realnameStatus)">
                <component :is="getStatusIcon(realnameStatus)" />
              </el-icon>
              <h4 class="status-text">{{ getStatusText(realnameStatus) }}</h4>
              <p class="status-description">{{ getStatusDescription(realnameStatus) }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 实名认证弹窗 -->
    <RealnameAuthModal
      v-model:visible="showRealnameModal"
      :edit-data="editRealnameData"
      :loading="realnameStore.submitting"
      @submit="handleRealnameSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, type UploadProps, type UploadRequestOptions } from 'element-plus'
import { UserFilled, Upload, SuccessFilled, WarningFilled, Loading } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useRealnameStore } from '@/stores/realname'
import { uploadAvatarApiV1UsersUploadAvatarPost } from '@/services/api/users'
import RealnameAuthModal from '@/components/RealnameAuthModal.vue'

// Store
const authStore = useAuthStore()
const realnameStore = useRealnameStore()

// 响应式数据
const activeTab = ref('basic')
const showRealnameModal = ref(false)
const editRealnameData = ref<API.RealnameAuthResponseSchema | null>(null)

// 计算属性
const userInfo = computed(() => authStore.user)
const realnameAuth = computed(() => realnameStore.realnameAuth)
const realnameStatus = computed(() => {
  if (!realnameAuth.value) return 'unverified'
  return realnameAuth.value.status
})
const canModifyRealname = computed(() => {
  if (!realnameAuth.value) return false
  return realnameAuth.value.status === 'pending' || realnameAuth.value.status === 'rejected'
})

// 生命周期
onMounted(async () => {
  await authStore.getCurrentUser()
  await realnameStore.getMyRealnameAuth()
})

// 方法
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const hideIdCard = (idCard: string) => {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.substring(0, 4) + '****' + idCard.substring(idCard.length - 4)
}

const getRoleType = (role?: API.UserRole) => {
  const roleMap = {
    admin: 'danger',
    merchant: 'warning',
    crew: 'info',
    user: 'success',
  }
  return roleMap[role || 'user'] as any
}

const getRoleText = (role?: API.UserRole) => {
  const roleMap = {
    admin: '管理员',
    merchant: '商户',
    crew: '船员',
    user: '普通用户',
  }
  return roleMap[role || 'user']
}

const getStatusColor = (status: string) => {
  const colorMap = {
    unverified: '#909399',
    pending: '#E6A23C',
    approved: '#67C23A',
    rejected: '#F56C6C',
  }
  return colorMap[status as keyof typeof colorMap] || '#909399'
}

const getStatusIcon = (status: string) => {
  const iconMap = {
    unverified: UserFilled,
    pending: Loading,
    approved: SuccessFilled,
    rejected: WarningFilled,
  }
  return iconMap[status as keyof typeof iconMap] || UserFilled
}

const getStatusText = (status: string) => {
  const textMap = {
    unverified: '未认证',
    pending: '审核中',
    approved: '已认证',
    rejected: '审核失败',
  }
  return textMap[status as keyof typeof textMap] || '未知状态'
}

const getStatusTagType = (status: string) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return typeMap[status as keyof typeof typeMap] || 'info'
}

const getStatusDescription = (status: string) => {
  const descMap = {
    unverified: '您还未进行实名认证',
    pending: '您的认证申请正在审核中',
    approved: '您已通过实名认证',
    rejected: '您的认证申请被拒绝',
  }
  return descMap[status as keyof typeof descMap] || ''
}

// 头像上传相关
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  const isLt10M = rawFile.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('头像文件必须是图片格式!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('头像文件大小不能超过10MB!')
    return false
  }
  return true
}

const uploadAvatar = async (options: UploadRequestOptions) => {
  try {
    // 不在body中包含file字段，只通过第二个参数传递File对象
    const formData = {} as API.BodyUploadAvatarApiV1UsersUploadAvatarPost
    const response = await uploadAvatarApiV1UsersUploadAvatarPost(formData, options.file as File)

    if (response.data?.success && response.data?.data) {
      await authStore.getCurrentUser()
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(response.data?.message || '头像上传失败')
    }
  } catch (error) {
    console.error('Upload avatar failed:', error)
    ElMessage.error('头像上传失败')
  }
}

// 实名认证相关
const handleApplyRealname = () => {
  editRealnameData.value = null
  showRealnameModal.value = true
  activeTab.value = 'realname'
}

const handleEditRealname = () => {
  editRealnameData.value = realnameAuth.value
  showRealnameModal.value = true
}

const handleRealnameSubmit = async (formData: any) => {
  const result = await realnameStore.submitRealnameAuth(formData)

  if (result.success) {
    showRealnameModal.value = false
    // 更新用户信息
    await authStore.getCurrentUser()
  }
}
</script>

<style scoped>
.profile-view {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.profile-content {
  display: flex;
  gap: 24px;
}

.left-content {
  flex: 1;
}

.right-content {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-card {
  height: fit-content;
}

.profile-tabs {
  padding: 0;
}

.basic-info-content {
  padding: 16px 0;
}

.realname-content {
  padding: 16px 0;
}

.realname-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reject-reason {
  color: #f56c6c;
  font-weight: 500;
}

.id-card-images {
  margin-top: 24px;
}

.id-card-images h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.image-preview {
  display: flex;
  gap: 24px;
}

.image-item {
  text-align: center;
}

.id-card-img {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.image-item p {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #6b7280;
}

.realname-actions {
  margin-top: 24px;
}

.no-realname {
  padding: 40px 0;
}

.avatar-card {
  margin-bottom: 24px;
}

.avatar-section {
  text-align: center;
  padding: 16px;
}

.user-avatar {
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-upload {
  margin-bottom: 16px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.status-card {
  height: fit-content;
}

.status-card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.status-content {
  text-align: center;
  padding: 16px;
}

.status-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-text {
  margin: 16px 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.status-description {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-tabs__content) {
  padding: 0;
}
</style>
