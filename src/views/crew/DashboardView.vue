<template>
  <div class="crew-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">船员工作台</h1>
      <p class="page-description">管理您的工作任务和航行计划</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon task-icon">
              <el-icon size="24"><list /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">12</div>
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
              <div class="stats-number">48</div>
              <div class="stats-label">已完成任务</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon hours-icon">
              <el-icon size="24"><clock /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">156</div>
              <div class="stats-label">本月工作时长</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon safety-icon">
              <el-icon size="24"><shield /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">100%</div>
              <div class="stats-label">安全记录</div>
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
              <el-tag type="success" size="small">3个任务</el-tag>
            </div>
          </template>
          <div class="task-list">
            <div class="task-item">
              <div class="task-info">
                <div class="task-title">海风号 - 观光航线</div>
                <div class="task-time">09:00 - 11:00</div>
                <div class="task-status">
                  <el-tag type="success" size="small">进行中</el-tag>
                </div>
              </div>
              <div class="task-actions">
                <el-button size="small" type="primary" @click="handleTask('start', 1)">
                  开始任务
                </el-button>
              </div>
            </div>

            <div class="task-item">
              <div class="task-info">
                <div class="task-title">碧波号 - 休闲垂钓</div>
                <div class="task-time">14:00 - 17:00</div>
                <div class="task-status">
                  <el-tag type="warning" size="small">待开始</el-tag>
                </div>
              </div>
              <div class="task-actions">
                <el-button size="small" @click="handleTask('prepare', 2)">
                  准备中
                </el-button>
              </div>
            </div>

            <div class="task-item">
              <div class="task-info">
                <div class="task-title">晨曦号 - 维护检查</div>
                <div class="task-time">18:00 - 19:00</div>
                <div class="task-status">
                  <el-tag type="info" size="small">计划中</el-tag>
                </div>
              </div>
              <div class="task-actions">
                <el-button size="small" @click="handleTask('view', 3)">
                  查看详情
                </el-button>
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
            <el-button type="primary" size="large" class="action-btn" @click="handleAction('check-in')">
              <el-icon><clock /></el-icon>
              签到打卡
            </el-button>
            <el-button type="success" size="large" class="action-btn" @click="handleAction('safety-check')">
              <el-icon><shield /></el-icon>
              安全检查
            </el-button>
            <el-button type="warning" size="large" class="action-btn" @click="handleAction('report')">
              <el-icon><document /></el-icon>
              工作报告
            </el-button>
            <el-button type="info" size="large" class="action-btn" @click="handleAction('schedule')">
              <el-icon><calendar /></el-icon>
              查看排班
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 通知和天气 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>重要通知</h3>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="今天 08:00" placement="top">
              <div class="notice-item">
                <el-tag type="warning" size="small">重要</el-tag>
                <span>今日海况良好，风力3-4级，适宜出海</span>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="昨天 18:00" placement="top">
              <div class="notice-item">
                <el-tag type="info" size="small">提醒</el-tag>
                <span>请注意明日潮汐时间变化</span>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="前天 16:00" placement="top">
              <div class="notice-item">
                <el-tag type="success" size="small">培训</el-tag>
                <span>安全培训课程已更新，请及时学习</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>天气信息</h3>
          </template>
          <div class="weather-info">
            <div class="weather-current">
              <div class="weather-icon">
                <el-icon size="48" color="#1890ff"><sunny /></el-icon>
              </div>
              <div class="weather-details">
                <div class="temperature">22°C</div>
                <div class="condition">晴朗</div>
                <div class="wind">东南风 3-4级</div>
              </div>
            </div>
            <div class="weather-forecast">
              <div class="forecast-item">
                <div class="forecast-day">明天</div>
                <div class="forecast-icon">☀️</div>
                <div class="forecast-temp">18°C - 25°C</div>
              </div>
              <div class="forecast-item">
                <div class="forecast-day">后天</div>
                <div class="forecast-icon">⛅</div>
                <div class="forecast-temp">16°C - 22°C</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  List,
  Check,
  Clock,
  Shield,
  Document,
  Calendar,
  Sunny
} from '@element-plus/icons-vue'

const handleTask = (action: string, taskId: number) => {
  switch (action) {
    case 'start':
      ElMessage.success(`任务 ${taskId} 已开始`)
      break
    case 'prepare':
      ElMessage.info(`任务 ${taskId} 准备中`)
      break
    case 'view':
      ElMessage.info(`查看任务 ${taskId} 详情`)
      break
  }
}

const handleAction = (action: string) => {
  switch (action) {
    case 'check-in':
      ElMessage.success('签到成功')
      break
    case 'safety-check':
      ElMessage.info('安全检查功能开发中')
      break
    case 'report':
      ElMessage.info('工作报告功能开发中')
      break
    case 'schedule':
      ElMessage.info('查看排班功能开发中')
      break
  }
}
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

.hours-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.safety-icon {
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

.notice-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weather-current {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-details {
  flex: 1;
}

.temperature {
  font-size: 32px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.condition {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.wind {
  font-size: 14px;
  color: #666;
}

.weather-forecast {
  display: flex;
  gap: 20px;
}

.forecast-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.forecast-day {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.forecast-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.forecast-temp {
  font-size: 12px;
  color: #333;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__header h3) {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}
</style>