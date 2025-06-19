<template>
  <div class="crew-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">船员工作台</h1>
      <p class="page-description">管理您的工作任务和航行计划</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row" v-loading="statsLoading">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon task-icon">
              <el-icon size="24"><list /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">
                {{ (taskStats?.confirmed_tasks || 0) + (taskStats?.in_progress_tasks || 0) }}
              </div>
              <div class="stats-label">待完成任务</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon completed-icon">
              <el-icon size="24"><check /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ taskStats?.completed_tasks || 0 }}</div>
              <div class="stats-label">已完成任务</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon income-icon">
              <el-icon size="24"><money /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">¥{{ taskStats?.current_month_earnings || 0 }}</div>
              <div class="stats-label">本月收入</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon rating-icon">
              <el-icon size="24"><star-filled /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ taskStats?.average_rating || 5.0 }}</div>
              <div class="stats-label">平均评分</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 今日任务和快捷操作 -->
    <el-row :gutter="20" class="main-content">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>今日任务</h3>
              <el-tag type="success" size="small">{{ todayTasks.length }}个任务</el-tag>
            </div>
          </template>
          <div class="task-list" v-loading="todayTasksLoading">
            <div v-if="todayTasks.length === 0" class="empty-state">
              <el-empty description="今日暂无任务" />
            </div>
            <div v-else class="task-item" v-for="task in todayTasks" :key="task.id">
              <div class="task-info">
                <div class="task-title">{{ task.boat_name }} - {{ task.passenger_count }}人</div>
                <div class="task-time">
                  {{ formatTime(task.start_time) }} - {{ formatTime(task.end_time) }}
                </div>
                <div class="task-status">
                  <el-tag :type="getStatusType(task.status)" size="small">
                    {{ getStatusText(task.status) }}
                  </el-tag>
                </div>
              </div>
              <div class="task-actions">
                <el-button
                  v-if="task.status === 'confirmed'"
                  size="small"
                  type="primary"
                  @click="handleUpdateTaskStatus(task.id, 'in_progress')"
                  :loading="updating === task.id"
                >
                  开始任务
                </el-button>
                <el-button
                  v-else-if="task.status === 'in_progress'"
                  size="small"
                  type="success"
                  @click="handleUpdateTaskStatus(task.id, 'completed')"
                  :loading="updating === task.id"
                >
                  完成任务
                </el-button>
                <el-button size="small" @click="viewTaskDetail(task.id)"> 查看详情 </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>快捷操作</h3>
          </template>
          <div class="quick-actions">
            <el-button
              type="primary"
              size="large"
              class="action-btn"
              @click="router.push('/crew/tasks')"
            >
              <el-icon><list /></el-icon>
              任务列表
            </el-button>
            <el-button
              type="success"
              size="large"
              class="action-btn"
              @click="router.push('/crew/tasks/current')"
            >
              <el-icon><clock /></el-icon>
              当前任务
            </el-button>
            <el-button
              type="warning"
              size="large"
              class="action-btn"
              @click="router.push('/crew/tasks/completed')"
            >
              <el-icon><check /></el-icon>
              已完成任务
            </el-button>
            <el-button type="info" size="large" class="action-btn" @click="refreshData">
              <el-icon><refresh /></el-icon>
              刷新数据
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收入统计和工作表现 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>收入统计</h3>
          </template>
          <div class="income-stats">
            <div class="income-item">
              <div class="income-label">本月收入</div>
              <div class="income-value">¥{{ taskStats?.current_month_earnings || 0 }}</div>
            </div>
            <div class="income-item">
              <div class="income-label">累计收入</div>
              <div class="income-value">¥{{ taskStats?.total_earnings || 0 }}</div>
            </div>
            <div class="income-item">
              <div class="income-label">本月任务</div>
              <div class="income-value">{{ taskStats?.current_month_tasks || 0 }}次</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>工作表现</h3>
          </template>
          <div class="performance-stats">
            <div class="performance-item">
              <div class="performance-label">服务完成率</div>
              <div class="performance-value">{{ getCompletionRate() }}%</div>
            </div>
            <div class="performance-item">
              <div class="performance-label">客户满意度</div>
              <div class="performance-value">{{ taskStats?.average_rating || 5.0 }}/5.0</div>
            </div>
            <div class="performance-item">
              <div class="performance-label">总任务数</div>
              <div class="performance-value">{{ taskStats?.total_tasks || 0 }}次</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { List, Check, Clock, Money, StarFilled, Refresh } from '@element-plus/icons-vue'
import {
  getCrewTaskStatsApiV1BookingsCrewStatsGet,
  getCrewTodayTasksApiV1BookingsCrewTasksTodayGet,
  updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch,
} from '@/services/api/bookings'

const router = useRouter()

// 响应式数据
const taskStats = ref<API.CrewTaskStatsSchema | null>(null)
const todayTasks = ref<API.CrewTaskListItemSchema[]>([])
const statsLoading = ref(false)
const todayTasksLoading = ref(false)
const updating = ref<number | null>(null)

// 获取任务统计
const getTaskStats = async () => {
  try {
    statsLoading.value = true
    const response = await getCrewTaskStatsApiV1BookingsCrewStatsGet()
    if (response.data.success) {
      taskStats.value = response.data.data || null
    }
  } catch (error) {
    console.error('获取任务统计失败:', error)
    ElMessage.error('获取任务统计失败')
  } finally {
    statsLoading.value = false
  }
}

// 获取今日任务
const getTodayTasks = async () => {
  try {
    todayTasksLoading.value = true
    const response = await getCrewTodayTasksApiV1BookingsCrewTasksTodayGet()
    if (response.data.success) {
      todayTasks.value = response.data.data || []
    }
  } catch (error) {
    console.error('获取今日任务失败:', error)
    ElMessage.error('获取今日任务失败')
  } finally {
    todayTasksLoading.value = false
  }
}

// 更新任务状态
const handleUpdateTaskStatus = async (bookingId: number, status: 'in_progress' | 'completed') => {
  try {
    const confirmText = status === 'in_progress' ? '确认开始此任务？' : '确认完成此任务？'
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    updating.value = bookingId
    const response = await updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch(
      { booking_id: bookingId },
      { status },
    )

    if (response.data.success) {
      ElMessage.success(status === 'in_progress' ? '任务已开始' : '任务已完成')
      // 刷新数据
      await Promise.all([getTodayTasks(), getTaskStats()])
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新任务状态失败:', error)
      ElMessage.error('更新任务状态失败')
    }
  } finally {
    updating.value = null
  }
}

// 查看任务详情
const viewTaskDetail = (bookingId: number) => {
  router.push(`/crew/tasks/${bookingId}`)
}

// 格式化时间
const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
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

// 计算完成率
const getCompletionRate = () => {
  if (!taskStats.value || taskStats.value.total_tasks === 0) return 100
  return Math.round((taskStats.value.completed_tasks / taskStats.value.total_tasks) * 100)
}

// 刷新数据
const refreshData = async () => {
  await Promise.all([getTaskStats(), getTodayTasks()])
  ElMessage.success('数据已刷新')
}

// 初始化数据
onMounted(async () => {
  await Promise.all([getTaskStats(), getTodayTasks()])
})
</script>

<style scoped>
.crew-dashboard {
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

.stats-row {
  margin-bottom: 24px;
}

.stats-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.task-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.completed-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.income-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.rating-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #6b7280;
}

.main-content {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #52c41a;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.task-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-btn {
  height: 80px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.income-stats,
.performance-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.income-item,
.performance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.income-label,
.performance-label {
  font-size: 14px;
  color: #666;
}

.income-value,
.performance-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
