<template>
  <div class="dashboard-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">管理员仪表盘</h1>
      <p class="page-description">总览系统运营数据和关键指标</p>
      <div class="last-updated" v-if="dashboardData">
        <el-icon><refresh /></el-icon>
        最后更新：{{ formatDateTime(dashboardData.last_updated) }}
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="page-actions">
      <el-button type="primary" @click="loadDashboardData" :loading="loading">
        <el-icon><refresh /></el-icon>
        刷新数据
      </el-button>
    </div>

    <div v-loading="loading" element-loading-text="加载仪表盘数据..." style="min-height: 400px">
      <div v-if="dashboardData">
        <!-- 核心指标卡片 -->
        <div class="metrics-grid">
          <!-- 用户统计 -->
          <el-card class="metric-card" shadow="hover">
            <div class="metric-content">
              <div class="metric-icon user-icon">
                <el-icon><user /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-title">用户总数</div>
                <div class="metric-value">
                  {{ dashboardData.user_stats.total_users.toLocaleString() }}
                </div>
                <div class="metric-desc">
                  <span class="metric-change positive"
                    >+{{ dashboardData.recent_activity.recent_users }}</span
                  >
                  近7天新增
                </div>
              </div>
            </div>
          </el-card>

          <!-- 商家统计 -->
          <el-card class="metric-card" shadow="hover">
            <div class="metric-content">
              <div class="metric-icon merchant-icon">
                <el-icon><shop /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-title">商家总数</div>
                <div class="metric-value">
                  {{ dashboardData.merchant_stats.total_merchants.toLocaleString() }}
                </div>
                <div class="metric-desc">
                  <span class="metric-change positive"
                    >+{{ dashboardData.recent_activity.recent_merchants }}</span
                  >
                  近7天新增
                </div>
              </div>
            </div>
          </el-card>

          <!-- 订单统计 -->
          <el-card class="metric-card" shadow="hover">
            <div class="metric-content">
              <div class="metric-icon order-icon">
                <el-icon><shopping-cart /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-title">订单总数</div>
                <div class="metric-value">
                  {{ dashboardData.order_stats.total_orders.toLocaleString() }}
                </div>
                <div class="metric-desc">
                  <span class="metric-change positive"
                    >+{{ dashboardData.recent_activity.recent_orders }}</span
                  >
                  近7天新增
                </div>
              </div>
            </div>
          </el-card>

          <!-- 预约统计 -->
          <el-card class="metric-card" shadow="hover">
            <div class="metric-content">
              <div class="metric-icon booking-icon">
                <el-icon><calendar /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-title">预约总数</div>
                <div class="metric-value">
                  {{ dashboardData.booking_stats.total_bookings.toLocaleString() }}
                </div>
                <div class="metric-desc">
                  <span class="metric-change positive"
                    >+{{ dashboardData.recent_activity.recent_bookings }}</span
                  >
                  近7天新增
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 财务统计卡片 -->
        <el-row :gutter="20" class="financial-row">
          <el-col :span="8">
            <el-card class="financial-card" shadow="hover">
              <div class="financial-content">
                <div class="financial-title">总收入</div>
                <div class="financial-value">
                  ¥{{ dashboardData.financial_stats.total_revenue.toLocaleString() }}
                </div>
                <div class="financial-breakdown">
                  <div class="breakdown-item">
                    <span
                      >订单收入：¥{{
                        dashboardData.financial_stats.order_revenue.toLocaleString()
                      }}</span
                    >
                  </div>
                  <div class="breakdown-item">
                    <span
                      >预约收入：¥{{
                        dashboardData.financial_stats.booking_revenue.toLocaleString()
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="financial-card" shadow="hover">
              <div class="financial-content">
                <div class="financial-title">平台收入</div>
                <div class="financial-value">
                  ¥{{ dashboardData.financial_stats.platform_commission.toLocaleString() }}
                </div>
                <div class="financial-desc">平台抽成收入</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="financial-card" shadow="hover">
              <div class="financial-content">
                <div class="financial-title">商家收入</div>
                <div class="financial-value">
                  ¥{{ dashboardData.financial_stats.merchant_earnings.toLocaleString() }}
                </div>
                <div class="financial-desc">商家总收入</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 详细统计表格 -->
        <el-row :gutter="20" class="detail-row">
          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">用户统计详情</span>
                </div>
              </template>
              <div class="stats-table">
                <div class="stats-row">
                  <span class="stats-label">活跃用户</span>
                  <span class="stats-value">{{
                    dashboardData.user_stats.active_users.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">非活跃用户</span>
                  <span class="stats-value">{{
                    dashboardData.user_stats.inactive_users.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">已实名认证</span>
                  <span class="stats-value">{{
                    dashboardData.user_stats.verified_users.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">待认证用户</span>
                  <span class="stats-value">{{
                    dashboardData.user_stats.pending_verification.toLocaleString()
                  }}</span>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">商家统计详情</span>
                </div>
              </template>
              <div class="stats-table">
                <div class="stats-row">
                  <span class="stats-label">活跃商家</span>
                  <span class="stats-value">{{
                    dashboardData.merchant_stats.active_merchants.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">待审核商家</span>
                  <span class="stats-value">{{
                    dashboardData.merchant_stats.pending_merchants.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">暂停商家</span>
                  <span class="stats-value">{{
                    dashboardData.merchant_stats.suspended_merchants.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">近期申请</span>
                  <span class="stats-value">{{
                    dashboardData.merchant_stats.recent_applications.toLocaleString()
                  }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="detail-row">
          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">商品统计详情</span>
                </div>
              </template>
              <div class="stats-table">
                <div class="stats-row">
                  <span class="stats-label">可售商品</span>
                  <span class="stats-value">{{
                    dashboardData.product_stats.available_products.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">售罄商品</span>
                  <span class="stats-value">{{
                    dashboardData.product_stats.sold_out_products.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">下架商品</span>
                  <span class="stats-value">{{
                    dashboardData.product_stats.inactive_products.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">低库存商品</span>
                  <span class="stats-value">{{
                    dashboardData.product_stats.low_stock_products.toLocaleString()
                  }}</span>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="detail-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">船舶统计详情</span>
                </div>
              </template>
              <div class="stats-table">
                <div class="stats-row">
                  <span class="stats-label">可用船舶</span>
                  <span class="stats-value">{{
                    dashboardData.boat_stats.available_boats.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">使用中船舶</span>
                  <span class="stats-value">{{
                    dashboardData.boat_stats.in_use_boats.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">维护中船舶</span>
                  <span class="stats-value">{{
                    dashboardData.boat_stats.maintenance_boats.toLocaleString()
                  }}</span>
                </div>
                <div class="stats-row">
                  <span class="stats-label">停用船舶</span>
                  <span class="stats-value">{{
                    dashboardData.boat_stats.inactive_boats.toLocaleString()
                  }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 订单和预约状态统计 -->
        <el-row :gutter="20" class="status-row">
          <el-col :span="12">
            <el-card class="status-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">订单状态分布</span>
                </div>
              </template>
              <div class="status-grid">
                <div class="status-item">
                  <el-tag type="warning" size="small">待支付</el-tag>
                  <span class="status-count">{{ dashboardData.order_stats.pending_orders }}</span>
                </div>
                <div class="status-item">
                  <el-tag type="success" size="small">已支付</el-tag>
                  <span class="status-count">{{ dashboardData.order_stats.paid_orders }}</span>
                </div>
                <div class="status-item">
                  <el-tag type="primary" size="small">已完成</el-tag>
                  <span class="status-count">{{ dashboardData.order_stats.completed_orders }}</span>
                </div>
                <div class="status-item">
                  <el-tag type="danger" size="small">已取消</el-tag>
                  <span class="status-count">{{ dashboardData.order_stats.cancelled_orders }}</span>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="status-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">预约状态分布</span>
                </div>
              </template>
              <div class="status-grid">
                <div class="status-item">
                  <el-tag type="warning" size="small">待确认</el-tag>
                  <span class="status-count">{{
                    dashboardData.booking_stats.pending_bookings
                  }}</span>
                </div>
                <div class="status-item">
                  <el-tag type="success" size="small">已确认</el-tag>
                  <span class="status-count">{{
                    dashboardData.booking_stats.confirmed_bookings
                  }}</span>
                </div>
                <div class="status-item">
                  <el-tag type="primary" size="small">已完成</el-tag>
                  <span class="status-count">{{
                    dashboardData.booking_stats.completed_bookings
                  }}</span>
                </div>
                <div class="status-item">
                  <el-tag type="danger" size="small">已取消</el-tag>
                  <span class="status-count">{{
                    dashboardData.booking_stats.cancelled_bookings
                  }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 无数据状态 -->
      <el-empty v-else-if="!loading" description="暂无数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Shop, ShoppingCart, Calendar, Refresh } from '@element-plus/icons-vue'
import { getDashboardOverviewApiV1AdminDashboardOverviewGet } from '@/services/api/adminDashboard'
import dayjs from 'dayjs'

// 响应式数据
const loading = ref(false)
const dashboardData = ref<API.DashboardOverviewSchema | null>(null)

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    const response = await getDashboardOverviewApiV1AdminDashboardOverviewGet()
    console.log(response)
    if (response.data.message && response.data.data) {
      dashboardData.value = response.data?.data
    } else {
      ElMessage.error(response.data.message || '获取仪表盘数据失败')
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
    ElMessage.error('获取仪表盘数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 24px;
  position: relative;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.page-description {
  color: #8c8c8c;
  margin: 0 0 12px 0;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8c8c8c;
  font-size: 12px;
}

.page-actions {
  margin-bottom: 24px;
}

/* 核心指标卡片样式 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-content {
  display: flex;
  align-items: center;
  padding: 8px;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.user-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.merchant-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.order-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.booking-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.metric-info {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.metric-desc {
  font-size: 12px;
  color: #8c8c8c;
}

.metric-change {
  font-weight: 500;
}

.metric-change.positive {
  color: #52c41a;
}

.metric-change.negative {
  color: #ff4d4f;
}

/* 财务统计卡片样式 */
.financial-row {
  margin-bottom: 24px;
}

.financial-card {
  height: 160px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.financial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.financial-content {
  padding: 8px;
}

.financial-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.financial-value {
  font-size: 32px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.financial-breakdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breakdown-item {
  font-size: 12px;
  color: #8c8c8c;
}

.financial-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
}

/* 详细统计表格样式 */
.detail-row {
  margin-bottom: 24px;
}

.detail-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.stats-table {
  padding: 8px 0;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.stats-row:last-child {
  border-bottom: none;
}

.stats-label {
  font-size: 14px;
  color: #595959;
}

.stats-value {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

/* 状态统计样式 */
.status-row {
  margin-bottom: 24px;
}

.status-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  padding: 8px 0;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-count {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-value {
    font-size: 24px;
  }

  .financial-value {
    font-size: 24px;
  }
}
</style>
