<template>
  <div class="qualification-container">
    <div class="page-header">
      <h1>资格认证</h1>
      <p class="description">提升您的权限，解锁更多功能</p>
    </div>

    <!-- 实名认证状态检查 -->
    <el-card v-if="realnameStatus !== 'approved'" class="warning-card" shadow="hover">
      <div class="warning-content">
        <el-icon color="#E6A23C" size="48">
          <warning-filled />
        </el-icon>
        <div class="warning-text">
          <h3>需要完成实名认证</h3>
          <p>申请资格认证前，您需要先完成实名认证。</p>
          <el-button type="primary" @click="goToRealname">前往实名认证</el-button>
        </div>
      </div>
    </el-card>

    <!-- 资格认证选项 -->
    <div v-else class="qualification-options">
      <!-- 商家认证卡片 -->
      <el-card class="qualification-card merchant-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon size="32" color="#1890ff">
              <shop />
            </el-icon>
            <h2>商家认证</h2>
          </div>
        </template>

        <div class="card-content">
          <div class="benefits">
            <h4>认证后可享受：</h4>
            <ul>
              <li>发布船舶租赁服务</li>
              <li>管理船员团队</li>
              <li>开展农文旅业务</li>
              <li>获得更多曝光机会</li>
            </ul>
          </div>

          <div class="status-info" v-if="merchantInfo">
            <el-tag :type="getMerchantStatusType(merchantInfo.status)" size="large">
              {{ getMerchantStatusText(merchantInfo.status) }}
            </el-tag>
            <p class="apply-time">申请时间：{{ formatDate(merchantInfo.created_at) }}</p>
          </div>

          <div class="card-actions">
            <el-button
              v-if="!merchantInfo"
              type="primary"
              size="large"
              @click="showMerchantModal = true"
              :loading="merchantStore.submitting"
            >
              申请商家认证
            </el-button>
            <el-button
              v-else-if="merchantInfo.status === 'suspended'"
              type="primary"
              size="large"
              @click="showMerchantModal = true"
              :loading="merchantStore.submitting"
            >
              重新申请
            </el-button>
            <el-button
              v-else-if="merchantInfo.status === 'active'"
              type="success"
              size="large"
              disabled
            >
              已通过认证
            </el-button>
            <el-button v-else type="warning" size="large" disabled> 审核中 </el-button>
          </div>
        </div>
      </el-card>

      <!-- 船员认证卡片 -->
      <el-card class="qualification-card crew-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon size="32" color="#52c41a">
              <user />
            </el-icon>
            <h2>船员认证</h2>
          </div>
        </template>

        <div class="card-content">
          <div class="benefits">
            <h4>认证后可享受：</h4>
            <ul>
              <li>接受船舶操作任务</li>
              <li>获得专业技能认证</li>
              <li>享受船员福利保障</li>
              <li>参与培训提升机会</li>
            </ul>
          </div>

          <div class="status-info" v-if="crewInfo">
            <el-tag :type="getCrewStatusType(crewInfo.status)" size="large">
              {{ getCrewStatusText(crewInfo.status) }}
            </el-tag>
            <p class="apply-time">加入时间：{{ formatDate(crewInfo.join_time) }}</p>
          </div>

          <div class="card-actions">
            <el-button
              v-if="!crewInfo || crewInfo.status === 'inactive'"
              type="primary"
              size="large"
              @click="showCrewModal = true"
              :loading="crewStore.submitting"
            >
              申请船员认证
            </el-button>
            <el-button
              v-else-if="crewInfo.status === 'active'"
              type="success"
              size="large"
              disabled
            >
              已通过认证
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 申请记录 -->
    <div v-if="realnameStatus === 'approved'" class="application-records">
      <el-card shadow="hover">
        <template #header>
          <h3>申请记录</h3>
        </template>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="商家申请" name="merchant" v-if="merchantInfo">
            <div class="merchant-info">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="商家名称">
                  {{ merchantInfo.merchant_name }}
                </el-descriptions-item>
                <el-descriptions-item label="营业执照号">
                  {{ merchantInfo.license_number }}
                </el-descriptions-item>
                <el-descriptions-item label="联系电话">
                  {{ merchantInfo.contact_phone }}
                </el-descriptions-item>
                <el-descriptions-item label="地址">
                  {{ merchantInfo.address || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item label="申请状态" :span="2">
                  <el-tag :type="getMerchantStatusType(merchantInfo.status)">
                    {{ getMerchantStatusText(merchantInfo.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="申请时间" :span="2">
                  {{ formatDate(merchantInfo.created_at) }}
                </el-descriptions-item>
                <el-descriptions-item v-if="merchantInfo.description" label="商家描述" :span="2">
                  {{ merchantInfo.description }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>

          <el-tab-pane label="船员申请" name="crew" v-if="applications.length > 0">
            <el-table :data="applications" style="width: 100%">
              <el-table-column prop="merchant.merchant_name" label="商家名称" width="180" />
              <el-table-column prop="apply_time" label="申请时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.apply_time) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="申请状态" width="120">
                <template #default="scope">
                  <el-tag :type="getApplicationStatusType(scope.row.status)">
                    {{ getApplicationStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="handle_time" label="处理时间">
                <template #default="scope">
                  {{ scope.row.handle_time ? formatDate(scope.row.handle_time) : '未处理' }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 商家申请弹窗 -->
    <MerchantApplyModal
      v-model:visible="showMerchantModal"
      :loading="merchantStore.submitting"
      @submit="handleMerchantApply"
    />

    <!-- 船员申请弹窗 -->
    <CrewApplyModal
      v-model:visible="showCrewModal"
      :loading="crewStore.submitting"
      @submit="handleCrewApply"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { WarningFilled, Shop, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useRealnameStore } from '@/stores/realname'
import { useMerchantStore } from '@/stores/merchant'
import { useCrewStore } from '@/stores/crew'
import MerchantApplyModal from '@/components/MerchantApplyModal.vue'
import CrewApplyModal from '@/components/CrewApplyModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const realnameStore = useRealnameStore()
const merchantStore = useMerchantStore()
const crewStore = useCrewStore()

// 响应式数据
const activeTab = ref('merchant')
const showMerchantModal = ref(false)
const showCrewModal = ref(false)

// 计算属性
const realnameStatus = computed(() => {
  if (!realnameStore.realnameAuth) return 'unverified'
  return realnameStore.realnameAuth.status
})

const merchantInfo = computed(() => merchantStore.merchantInfo)
const crewInfo = computed(() => crewStore.crewInfo)
const applications = computed(() => crewStore.applications)

// 生命周期
onMounted(async () => {
  await Promise.all([
    realnameStore.getMyRealnameAuth(),
    merchantStore.getMyMerchantInfo(),
    crewStore.getMyCrewInfo(),
    crewStore.getMyApplications(),
  ])
})

// 方法
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const goToRealname = () => {
  router.push('/user/profile')
}

// 商家状态相关
const getMerchantStatusType = (status: API.MerchantStatus) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'pending':
      return 'warning'
    case 'suspended':
      return 'danger'
    default:
      return 'info'
  }
}

const getMerchantStatusText = (status: API.MerchantStatus) => {
  switch (status) {
    case 'active':
      return '已通过'
    case 'pending':
      return '审核中'
    case 'suspended':
      return '已暂停'
    default:
      return '未知'
  }
}

// 船员状态相关
const getCrewStatusType = (status: API.CrewStatus) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'info'
    default:
      return 'info'
  }
}

const getCrewStatusText = (status: API.CrewStatus) => {
  switch (status) {
    case 'active':
      return '在职'
    case 'inactive':
      return '离职'
    default:
      return '未知'
  }
}

// 申请状态相关
const getApplicationStatusType = (status: API.CrewApplicationStatus) => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

const getApplicationStatusText = (status: API.CrewApplicationStatus) => {
  switch (status) {
    case 'approved':
      return '已通过'
    case 'pending':
      return '待审核'
    case 'rejected':
      return '已拒绝'
    default:
      return '未知'
  }
}

// 处理商家申请
const handleMerchantApply = async (formData: API.MerchantApplySchema) => {
  const result = await merchantStore.applyMerchant(formData)
  if (result.success) {
    showMerchantModal.value = false
    // 更新用户信息
    await authStore.getCurrentUser()
  }
}

// 处理船员申请
const handleCrewApply = async (merchantId: number) => {
  const result = await crewStore.applyCrew(merchantId)
  if (result.success) {
    showCrewModal.value = false
    // 更新用户信息
    await authStore.getCurrentUser()
  }
}
</script>

<style scoped>
.qualification-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 8px;
}

.description {
  color: #6b7280;
  font-size: 16px;
}

.warning-card {
  margin-bottom: 32px;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
}

.warning-text h3 {
  color: #e6a23c;
  margin-bottom: 8px;
}

.warning-text p {
  color: #6b7280;
  margin-bottom: 16px;
}

.qualification-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.qualification-card {
  transition: transform 0.3s ease;
}

.qualification-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header h2 {
  margin: 0;
  color: #1f2937;
}

.card-content {
  padding: 24px 0;
}

.benefits {
  margin-bottom: 24px;
}

.benefits h4 {
  color: #374151;
  margin-bottom: 12px;
}

.benefits ul {
  list-style: none;
  padding: 0;
}

.benefits li {
  padding: 6px 0;
  color: #6b7280;
  position: relative;
  padding-left: 20px;
}

.benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

.status-info {
  margin-bottom: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.apply-time {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
}

.card-actions {
  text-align: center;
}

.application-records {
  margin-top: 32px;
}

.merchant-info {
  padding: 16px 0;
}

.merchant-card {
  border-left: 4px solid #1890ff;
}

.crew-card {
  border-left: 4px solid #52c41a;
}
</style>
