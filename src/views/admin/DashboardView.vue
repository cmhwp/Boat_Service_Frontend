<template>
  <div class="admin-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">管理员仪表板</h1>
      <p class="page-description">系统整体运行状况和关键数据概览</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon user-icon">
              <el-icon size="24"><user /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">1,234</div>
              <div class="stats-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon boat-icon">
              <el-icon size="24"><ship /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">89</div>
              <div class="stats-label">船艇总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon order-icon">
              <el-icon size="24"><list /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">567</div>
              <div class="stats-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon revenue-icon">
              <el-icon size="24"><money /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">¥12.5W</div>
              <div class="stats-label">总收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和数据 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>用户增长趋势</h3>
          </template>
          <div class="chart-placeholder">
            <el-icon size="48" color="#ccc"><data-analysis /></el-icon>
            <p>图表开发中...</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>订单统计</h3>
          </template>
          <div class="chart-placeholder">
            <el-icon size="48" color="#ccc"><pie-chart /></el-icon>
            <p>图表开发中...</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待处理事项 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>待处理事项</h3>
          </template>
          <el-list>
            <el-list-item>
              <div class="todo-item">
                <el-tag type="warning" size="small">待审核</el-tag>
                <span>15个实名认证申请待处理</span>
              </div>
            </el-list-item>
            <el-list-item>
              <div class="todo-item">
                <el-tag type="danger" size="small">重要</el-tag>
                <span>3个用户投诉待处理</span>
              </div>
            </el-list-item>
            <el-list-item>
              <div class="todo-item">
                <el-tag type="info" size="small">提醒</el-tag>
                <span>系统维护计划明日执行</span>
              </div>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>最新活动</h3>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="2024-01-01 10:00" placement="top">
              <div class="activity-item">
                <strong>用户张三</strong> 完成实名认证
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="2024-01-01 09:30" placement="top">
              <div class="activity-item">
                <strong>商家李四</strong> 添加新船艇
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="2024-01-01 09:00" placement="top">
              <div class="activity-item">
                <strong>船员王五</strong> 完成航行任务
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  User,
  Ship,
  List,
  Money,
  DataAnalysis,
  PieChart
} from '@element-plus/icons-vue'
</script>

<style scoped>
.admin-dashboard {
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

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.boat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.order-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.revenue-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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

.charts-row {
  margin-bottom: 24px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  gap: 12px;
}

.chart-placeholder p {
  margin: 0;
  font-size: 14px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-item {
  font-size: 14px;
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

:deep(.el-list-item) {
  padding: 12px 0;
}
</style>