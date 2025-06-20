<template>
  <div class="crew-dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <div class="welcome-text">
          <h1 class="welcome-title">船员工作台</h1>
          <p class="welcome-subtitle">{{ getWelcomeMessage() }}</p>
        </div>
        <div class="weather-info">
          <div class="weather-item">
            <el-icon class="weather-icon"><sunny /></el-icon>
            <span>今日适宜出航</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心数据卡片 -->
    <div class="stats-section">
      <el-row :gutter="16" v-loading="statsLoading">
        <el-col :xs="12" :sm="6" :md="6" :lg="6">
          <div class="stat-card pending-tasks">
            <div class="stat-icon">
              <el-icon size="28"><clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">
                {{ (taskStats?.confirmed_tasks || 0) + (taskStats?.in_progress_tasks || 0) }}
              </div>
              <div class="stat-label">待完成任务</div>
              <div class="stat-trend">
                <span class="trend-text">今日任务 {{ todayTasks.length }} 个</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="12" :sm="6" :md="6" :lg="6">
          <div class="stat-card completed-tasks">
            <div class="stat-icon">
              <el-icon size="28"><check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ taskStats?.completed_tasks || 0 }}</div>
              <div class="stat-label">已完成任务</div>
              <div class="stat-trend">
                <span class="trend-text">完成率 {{ getCompletionRate() }}%</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="12" :sm="6" :md="6" :lg="6">
          <div class="stat-card monthly-income">
            <div class="stat-icon">
              <el-icon size="28"><money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">
                ¥{{ formatNumber(taskStats?.current_month_earnings || 0) }}
              </div>
              <div class="stat-label">本月收入</div>
              <div class="stat-trend">
                <span class="trend-text">{{ taskStats?.current_month_tasks || 0 }} 次服务</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="12" :sm="6" :md="6" :lg="6">
          <div class="stat-card rating-score">
            <div class="stat-icon">
              <el-icon size="28"><star-filled /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ (taskStats?.average_rating || 5.0).toFixed(1) }}</div>
              <div class="stat-label">服务评分</div>
              <div class="stat-trend">
                <el-rate
                  :model-value="taskStats?.average_rating || 5.0"
                  disabled
                  size="small"
                  show-score
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="16" class="main-section">
      <!-- 今日任务 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="16">
        <el-card class="today-tasks-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon class="header-icon"><calendar /></el-icon>
                <span class="header-title">今日任务</span>
                <el-badge
                  :value="todayTasks.length"
                  :max="99"
                  class="task-badge"
                  :type="todayTasks.length > 0 ? 'primary' : 'info'"
                />
              </div>
              <div class="header-actions">
                <el-button size="small" @click="refreshData" :loading="todayTasksLoading" circle>
                  <el-icon><refresh /></el-icon>
                </el-button>
                <el-button size="small" type="primary" @click="router.push('/crew/tasks')">
                  查看全部
                </el-button>
              </div>
            </div>
          </template>

          <div class="task-container" v-loading="todayTasksLoading">
            <div v-if="todayTasks.length === 0" class="empty-tasks">
              <el-empty description="今日暂无任务" :image-size="120">
                <el-button type="primary" @click="router.push('/crew/tasks')">
                  查看历史任务
                </el-button>
              </el-empty>
            </div>

            <div v-else class="task-timeline">
              <div
                v-for="(task, index) in todayTasks"
                :key="task.id"
                class="task-timeline-item"
                :class="getTaskItemClass(task.status)"
              >
                <div class="timeline-dot"></div>
                <div class="task-card">
                  <div class="task-header">
                    <div class="task-title">
                      <span class="boat-name">{{ task.boat_name }}</span>
                      <el-tag :type="getStatusType(task.status)" size="small" class="status-tag">
                        {{ getStatusText(task.status) }}
                      </el-tag>
                    </div>
                    <div class="task-time">
                      {{ formatTimeRange(task.start_time, task.end_time) }}
                    </div>
                  </div>

                  <div class="task-details">
                    <div class="detail-item">
                      <el-icon><user /></el-icon>
                      <span>{{ task.customer_name }} ({{ task.passenger_count }}人)</span>
                    </div>
                    <div class="detail-item">
                      <el-icon><money /></el-icon>
                      <span>¥{{ task.total_amount }}</span>
                    </div>
                  </div>

                  <div class="task-actions">
                    <el-button size="small" @click="viewTaskDetail(task.id)" plain>
                      详情
                    </el-button>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 快捷操作和统计 -->
      <el-col :xs="24" :sm="24" :md="10" :lg="8">
        <!-- 快捷操作 -->
        <el-card class="quick-actions-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><operation /></el-icon>
              <span class="header-title">快捷操作</span>
            </div>
          </template>

          <div class="quick-actions-grid">
            <div class="action-item" @click="router.push('/crew/tasks')">
              <div class="action-icon tasks-icon">
                <el-icon size="20"><list /></el-icon>
              </div>
              <span class="action-text">任务列表</span>
            </div>

            <div class="action-item" @click="router.push('/crew/tasks?status=in_progress')">
              <div class="action-icon current-icon">
                <el-icon size="20"><clock /></el-icon>
              </div>
              <span class="action-text">当前任务</span>
            </div>

            <div class="action-item" @click="router.push('/crew/tasks?status=completed')">
              <div class="action-icon history-icon">
                <el-icon size="20"><check /></el-icon>
              </div>
              <span class="action-text">历史记录</span>
            </div>

            <div class="action-item" @click="refreshData">
              <div class="action-icon refresh-icon">
                <el-icon size="20"><refresh /></el-icon>
              </div>
              <span class="action-text">刷新数据</span>
            </div>
          </div>
        </el-card>

        <!-- 收入统计 -->
        <el-card class="income-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><wallet /></el-icon>
              <span class="header-title">收入统计</span>
            </div>
          </template>

          <div class="income-stats">
            <div class="income-item primary">
              <div class="income-label">本月收入</div>
              <div class="income-value">
                ¥{{ formatNumber(taskStats?.current_month_earnings || 0) }}
              </div>
              <div class="income-desc">{{ taskStats?.current_month_tasks || 0 }} 次服务</div>
            </div>

            <div class="income-item">
              <div class="income-label">累计收入</div>
              <div class="income-value">¥{{ formatNumber(taskStats?.total_earnings || 0) }}</div>
              <div class="income-desc">{{ taskStats?.total_tasks || 0 }} 次服务</div>
            </div>

            <div class="performance-summary">
              <div class="performance-item">
                <span class="label">服务完成率</span>
                <span class="value">{{ getCompletionRate() }}%</span>
              </div>
              <div class="performance-item">
                <span class="label">客户满意度</span>
                <span class="value">{{ (taskStats?.average_rating || 5.0).toFixed(1) }}/5.0</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  List,
  Check,
  Clock,
  Money,
  StarFilled,
  Refresh,
  Calendar,
  Operation,
  User,
  Wallet,
  Sunny,
} from '@element-plus/icons-vue'
import {
  getCrewTaskStatsApiV1BookingsCrewStatsGet,
  getCrewTasksApiV1BookingsCrewTasksGet,
  updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch,
} from '@/services/api/bookings'

const router = useRouter()

// 响应式数据
const taskStats = ref<API.CrewTaskStatsSchema | null>(null)
const todayTasks = ref<API.CrewTaskListItemSchema[]>([])
const statsLoading = ref(false)
const todayTasksLoading = ref(false)
const updating = ref<number | null>(null)

// 计算属性
const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息'
  if (hour < 12) return '早上好！新的一天开始了'
  if (hour < 18) return '下午好！继续加油'
  return '晚上好！今天辛苦了'
})

// 获取欢迎信息
const getWelcomeMessage = () => {
  const hour = new Date().getHours()
  const taskCount = todayTasks.value.length
  const baseMessage = welcomeMessage.value

  if (taskCount > 0) {
    return `${baseMessage}，今日还有 ${taskCount} 个任务等待完成`
  }
  return `${baseMessage}，今日任务已全部完成`
}

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
    const today = new Date().toISOString().split('T')[0]
    const response = await getCrewTasksApiV1BookingsCrewTasksGet({
      page: 1,
      page_size: 10,
      start_date: today,
      end_date: today,
    })
    if (response.data.success && response.data.data) {
      todayTasks.value = response.data.data.items || []
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

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

// 格式化时间范围
const formatTimeRange = (startTime: string, endTime: string) => {
  const start = new Date(startTime).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const end = new Date(endTime).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${start} - ${end}`
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

// 获取任务项样式类
const getTaskItemClass = (status: string) => {
  return {
    'task-confirmed': status === 'confirmed',
    'task-in-progress': status === 'in_progress',
    'task-completed': status === 'completed',
  }
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
  min-height: 100vh;
  padding: 0;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  color: white;
  padding: 32px 24px;
  margin-bottom: 24px;
  border-radius: 0 0 24px 24px;
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.weather-icon {
  color: #ffd700;
}

/* 统计卡片 */
.stats-section {
  margin-bottom: 24px;
  padding: 0 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
}

.pending-tasks::before {
  background: linear-gradient(90deg, #ffa726, #ff9800);
}
.completed-tasks::before {
  background: linear-gradient(90deg, #66bb6a, #4caf50);
}
.monthly-income::before {
  background: linear-gradient(90deg, #42a5f5, #2196f3);
}
.rating-score::before {
  background: linear-gradient(90deg, #ef5350, #f44336);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.pending-tasks .stat-icon {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  color: white;
}
.completed-tasks .stat-icon {
  background: linear-gradient(135deg, #66bb6a, #4caf50);
  color: white;
}
.monthly-income .stat-icon {
  background: linear-gradient(135deg, #42a5f5, #2196f3);
  color: white;
}
.rating-score .stat-icon {
  background: linear-gradient(135deg, #ef5350, #f44336);
  color: white;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 12px;
  color: #999;
}

.trend-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 主要内容区域 */
.main-section {
  padding: 0 24px;
  margin-bottom: 24px;
}

/* 今日任务卡片 */
.today-tasks-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #667eea;
  font-size: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.task-badge {
  margin-left: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 任务时间线 */
.task-timeline {
  position: relative;
  padding-left: 24px;
}

.task-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #e0e0e0, transparent);
}

.task-timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.task-timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-confirmed .timeline-dot {
  background: #ffa726;
}
.task-in-progress .timeline-dot {
  background: #42a5f5;
}
.task-completed .timeline-dot {
  background: #66bb6a;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.task-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.task-header {
  margin-bottom: 12px;
}

.task-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.boat-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.task-time {
  font-size: 14px;
  color: #666;
}

.task-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.task-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 空状态 */
.empty-tasks {
  padding: 40px 20px;
  text-align: center;
}

/* 快捷操作卡片 */
.quick-actions-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-item:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.tasks-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.current-icon {
  background: linear-gradient(135deg, #ffa726, #ff9800);
}
.history-icon {
  background: linear-gradient(135deg, #66bb6a, #4caf50);
}
.refresh-icon {
  background: linear-gradient(135deg, #42a5f5, #2196f3);
}

.action-text {
  font-size: 14px;
  font-weight: 500;
}

/* 收入卡片 */
.income-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.income-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.income-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
  text-align: center;
}

.income-item.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.income-label {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.income-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.income-desc {
  font-size: 12px;
  opacity: 0.7;
}

.performance-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.performance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.performance-item .label {
  color: #666;
}

.performance-item .value {
  font-weight: 600;
  color: #1a1a1a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-banner {
    margin: -24px -24px 24px -24px;
    border-radius: 0;
    padding: 24px;
  }

  .banner-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stats-section,
  .main-section {
    padding: 0 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-number {
    font-size: 28px;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .task-details {
    flex-direction: column;
    gap: 8px;
  }

  .task-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 24px;
  }

  .stat-number {
    font-size: 24px;
  }

  .task-timeline {
    padding-left: 16px;
  }

  .timeline-dot {
    left: -12px;
  }
}
</style>
