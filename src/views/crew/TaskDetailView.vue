<template>
  <div class="crew-task-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-button @click="$router.go(-1)" text>
        <el-icon><arrow-left /></el-icon>
        返回
      </el-button>
      <h1 class="page-title">任务详情</h1>
    </div>

    <div v-loading="loading">
      <div v-if="taskDetail" class="detail-content">
        <!-- 基本信息 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
              <el-tag :type="getStatusType(taskDetail.status)" size="large">
                {{ getStatusText(taskDetail.status) }}
              </el-tag>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="任务编号">{{
                  taskDetail.booking_number
                }}</el-descriptions-item>
                <el-descriptions-item label="船只名称">{{
                  taskDetail.boat?.name
                }}</el-descriptions-item>
                <el-descriptions-item label="乘客人数"
                  >{{ taskDetail.passenger_count }}人</el-descriptions-item
                >
                <el-descriptions-item label="服务时长"
                  >{{ taskDetail.duration_hours }}小时</el-descriptions-item
                >
                <el-descriptions-item label="服务费用"
                  >¥{{ taskDetail.total_amount }}</el-descriptions-item
                >
              </el-descriptions>
            </el-col>
            <el-col :span="12">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="开始时间">{{
                  formatDateTime(taskDetail.start_time)
                }}</el-descriptions-item>
                <el-descriptions-item label="结束时间">{{
                  formatDateTime(taskDetail.end_time)
                }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{
                  formatDateTime(taskDetail.created_at)
                }}</el-descriptions-item>
                <el-descriptions-item label="确认时间">
                  {{ taskDetail.confirmed_at ? formatDateTime(taskDetail.confirmed_at) : '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="完成时间">
                  {{ taskDetail.completed_at ? formatDateTime(taskDetail.completed_at) : '-' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-card>

        <!-- 客户信息 -->
        <el-card class="info-card">
          <template #header>
            <h3>客户信息</h3>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户姓名">{{
              taskDetail.customer?.name
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              taskDetail.customer?.phone
            }}</el-descriptions-item>
            <el-descriptions-item label="客户邮箱">{{
              taskDetail.customer?.email
            }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">
              {{ taskDetail.customer ? formatDateTime(taskDetail.customer.created_at) : '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 船只信息 -->
        <el-card class="info-card">
          <template #header>
            <h3>船只信息</h3>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="船只名称">{{
              taskDetail.boat?.name
            }}</el-descriptions-item>
            <el-descriptions-item label="船只类型">{{
              getBoatTypeText(taskDetail.boat?.boat_type)
            }}</el-descriptions-item>
            <el-descriptions-item label="载客量"
              >{{ taskDetail.boat?.capacity }}人</el-descriptions-item
            >
            <el-descriptions-item label="小时费率"
              >¥{{ taskDetail.boat?.hourly_rate }}/小时</el-descriptions-item
            >
            <el-descriptions-item label="当前位置">{{
              taskDetail.boat?.current_location || '-'
            }}</el-descriptions-item>
            <el-descriptions-item label="船只状态">{{
              getBoatStatusText(taskDetail.boat?.status)
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 商家信息 -->
        <el-card class="info-card">
          <template #header>
            <h3>商家信息</h3>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="商家名称">{{
              taskDetail.merchant?.merchant_name
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              taskDetail.merchant?.contact_phone
            }}</el-descriptions-item>
            <el-descriptions-item label="商家地址">{{
              taskDetail.merchant?.address
            }}</el-descriptions-item>
            <el-descriptions-item label="商家状态">{{
              getMerchantStatusText(taskDetail.merchant?.status)
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 备注信息 -->
        <el-card v-if="taskDetail.user_notes || taskDetail.merchant_notes" class="info-card">
          <template #header>
            <h3>备注信息</h3>
          </template>

          <div v-if="taskDetail.user_notes" class="notes-section">
            <h4>客户备注</h4>
            <div class="notes-content">{{ taskDetail.user_notes }}</div>
          </div>

          <div v-if="taskDetail.merchant_notes" class="notes-section">
            <h4>商家备注</h4>
            <div class="notes-content">{{ taskDetail.merchant_notes }}</div>
          </div>
        </el-card>

        <!-- 船员评价 -->
        <el-card v-if="taskDetail.crew_rating" class="info-card">
          <template #header>
            <h3>客户评价</h3>
          </template>

          <div class="rating-section">
            <div class="rating-score">
              <el-rate
                :model-value="taskDetail.crew_rating.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value} 分"
              />
            </div>
            <div v-if="taskDetail.crew_rating.comment" class="rating-comment">
              <h4>评价内容</h4>
              <div class="notes-content">{{ taskDetail.crew_rating.comment }}</div>
            </div>
            <div class="rating-time">
              评价时间：{{ formatDateTime(taskDetail.crew_rating.created_at) }}
            </div>
          </div>
        </el-card>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button
            v-if="taskDetail.status === 'confirmed'"
            type="primary"
            size="large"
            @click="handleUpdateStatus('in_progress')"
            :loading="updating"
          >
            <el-icon><video-play /></el-icon>
            开始任务
          </el-button>

          <el-button
            v-else-if="taskDetail.status === 'in_progress'"
            type="success"
            size="large"
            @click="handleUpdateStatus('completed')"
            :loading="updating"
          >
            <el-icon><check /></el-icon>
            完成任务
          </el-button>

          <el-button size="large" @click="$router.go(-1)">
            <el-icon><arrow-left /></el-icon>
            返回列表
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, VideoPlay, Check } from '@element-plus/icons-vue'
import {
  getCrewTaskDetailApiV1BookingsCrewTasksBookingIdGet,
  updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch,
} from '@/services/api/bookings'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const updating = ref(false)
const taskDetail = ref<API.CrewTaskDetailSchema | null>(null)

// 获取任务详情
const getTaskDetail = async () => {
  try {
    loading.value = true
    const taskId = Number(route.params.id)

    const response = await getCrewTaskDetailApiV1BookingsCrewTasksBookingIdGet({
      booking_id: taskId,
    })

    if (response.data.success) {
      taskDetail.value = response.data.data || null
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
    ElMessage.error('获取任务详情失败')
  } finally {
    loading.value = false
  }
}

// 更新任务状态
const handleUpdateStatus = async (status: 'in_progress' | 'completed') => {
  if (!taskDetail.value) return

  try {
    const confirmText = status === 'in_progress' ? '确认开始此任务？' : '确认完成此任务？'
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    updating.value = true
    const response = await updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch(
      { booking_id: taskDetail.value.id },
      { status },
    )

    if (response.data.success) {
      ElMessage.success(status === 'in_progress' ? '任务已开始' : '任务已完成')
      // 刷新任务详情
      await getTaskDetail()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新任务状态失败:', error)
      ElMessage.error('更新任务状态失败')
    }
  } finally {
    updating.value = false
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    confirmed: 'warning',
    in_progress: 'primary',
    completed: 'success',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    confirmed: '待开始',
    in_progress: '进行中',
    completed: '已完成',
  }
  return statusMap[status] || status
}

// 获取船只类型文本
const getBoatTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    passenger: '客运船',
    sightseeing: '观光船',
    fishing: '渔船',
  }
  return typeMap[type] || type
}

// 获取船只状态文本
const getBoatStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维护中',
    inactive: '停用',
  }
  return statusMap[status] || status
}

// 获取商家状态文本
const getMerchantStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    active: '正常',
    suspended: '暂停',
  }
  return statusMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateTimeStr: string) => {
  return new Date(dateTimeStr).toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  getTaskDetail()
})
</script>

<style scoped>
.crew-task-detail {
  padding: 0;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.notes-section {
  padding: 16px 0;
}

.notes-section:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.notes-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.notes-content {
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 6px;
  color: #6b7280;
  line-height: 1.5;
}

.rating-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating-score {
  display: flex;
  align-items: center;
}

.rating-comment h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.rating-time {
  font-size: 12px;
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 20px 0;
}
</style>
