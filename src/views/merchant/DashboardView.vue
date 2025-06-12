<template>
  <div class="merchant-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">商家经营概况</h1>
      <p class="page-description">查看您的店铺经营数据和业务状况</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon ship-icon">
              <el-icon size="24"><ship /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">8</div>
              <div class="stats-label">我的船艇</div>
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
              <div class="stats-number">124</div>
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
              <div class="stats-number">¥25,680</div>
              <div class="stats-label">本月收入</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon rating-icon">
              <el-icon size="24"><star /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">4.8</div>
              <div class="stats-label">店铺评分</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="quick-actions-card">
      <template #header>
        <h3>快捷操作</h3>
      </template>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-button type="primary" size="large" class="action-btn" @click="handleAction('add-boat')">
            <el-icon><plus /></el-icon>
            添加船艇
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="success" size="large" class="action-btn" @click="handleAction('view-orders')">
            <el-icon><view /></el-icon>
            查看订单
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="warning" size="large" class="action-btn" @click="handleAction('manage-routes')">
            <el-icon><map /></el-icon>
            管理航线
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="info" size="large" class="action-btn" @click="handleAction('view-finance')">
            <el-icon><document /></el-icon>
            财务报表
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 待处理事项和最新订单 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>待处理事项</h3>
          </template>
          <el-list>
            <el-list-item>
              <div class="todo-item">
                <el-tag type="warning" size="small">待确认</el-tag>
                <span>5个新订单待确认</span>
              </div>
            </el-list-item>
            <el-list-item>
              <div class="todo-item">
                <el-tag type="danger" size="small">紧急</el-tag>
                <span>船艇"海风号"需要维护</span>
              </div>
            </el-list-item>
            <el-list-item>
              <div class="todo-item">
                <el-tag type="info" size="small">提醒</el-tag>
                <span>明日有3个预约航次</span>
              </div>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>最新订单</h3>
          </template>
          <div class="order-list">
            <div class="order-item">
              <div class="order-info">
                <div class="order-id">#202401001</div>
                <div class="order-customer">张先生</div>
                <div class="order-boat">海风号 - 观光航线</div>
              </div>
              <div class="order-status">
                <el-tag type="success" size="small">已确认</el-tag>
              </div>
            </div>
            <div class="order-item">
              <div class="order-info">
                <div class="order-id">#202401002</div>
                <div class="order-customer">李女士</div>
                <div class="order-boat">碧波号 - 休闲垂钓</div>
              </div>
              <div class="order-status">
                <el-tag type="warning" size="small">待确认</el-tag>
              </div>
            </div>
            <div class="order-item">
              <div class="order-info">
                <div class="order-id">#202401003</div>
                <div class="order-customer">王先生</div>
                <div class="order-boat">晨曦号 - 日出观赏</div>
              </div>
              <div class="order-status">
                <el-tag type="info" size="small">进行中</el-tag>
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
  Ship,
  List,
  Money,
  Star,
  Plus,
  View,
  Map,
  Document
} from '@element-plus/icons-vue'

const handleAction = (action: string) => {
  switch (action) {
    case 'add-boat':
      ElMessage.info('添加船艇功能开发中')
      break
    case 'view-orders':
      ElMessage.info('查看订单功能开发中')
      break
    case 'manage-routes':
      ElMessage.info('管理航线功能开发中')
      break
    case 'view-finance':
      ElMessage.info('财务报表功能开发中')
      break
  }
}
</script>

<style scoped>
.merchant-dashboard {
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

.ship-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.revenue-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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

.quick-actions-card {
  margin-bottom: 24px;
}

.action-btn {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.order-info {
  flex: 1;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.order-customer {
  font-size: 13px;
  color: #333;
  margin-bottom: 2px;
}

.order-boat {
  font-size: 12px;
  color: #666;
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