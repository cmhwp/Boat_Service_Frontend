<template>
  <div class="merchant-dashboard">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">经营概况</h1>
      <div class="header-actions">
        <el-button type="primary" @click="refreshData">
          <refresh theme="outline" size="16" />
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 核心数据统计 -->
    <div class="stats-overview" v-loading="loading">
      <div class="stat-card revenue">
        <div class="stat-icon">
          <el-icon><money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ orderStats.paid_amount?.toLocaleString() || 0 }}</div>
          <div class="stat-label">已收款金额</div>
          <div class="stat-change positive">
            <trending-up theme="outline" size="12" />
            +15.3%
          </div>
        </div>
      </div>

      <div class="stat-card orders">
        <div class="stat-icon">
          <el-icon><shopping-bag /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ orderStats.total_orders || 0 }}</div>
          <div class="stat-label">总订单数</div>
          <div class="stat-change positive">
            <trending-up theme="outline" size="12" />
            +8.2%
          </div>
        </div>
      </div>

      <div class="stat-card bookings">
        <div class="stat-icon">
          <el-icon><calendar /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ bookingStats.total_bookings || 0 }}</div>
          <div class="stat-label">总预约数</div>
          <div class="stat-change positive">
            <trending-up theme="outline" size="12" />
            +12.5%
          </div>
        </div>
      </div>

      <div class="stat-card rating">
        <div class="stat-icon">
          <el-icon><star-filled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ bookingStats.average_rating?.toFixed(1) || '0.0' }}</div>
          <div class="stat-label">平均评分</div>
          <div class="stat-change positive">
            <trending-up theme="outline" size="12" />
            +0.2
          </div>
        </div>
      </div>
    </div>

    <!-- 业务分析 -->
    <el-row :gutter="20">
      <!-- 订单状态分析 -->
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <h3>订单状态分析</h3>
              <el-button text @click="$router.push('/merchant/orders')">查看全部</el-button>
            </div>
          </template>
          <div class="order-analysis">
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="warning" size="small">待支付</el-tag>
                <span>{{ orderStats.pending_orders || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="getPercentage(orderStats.pending_orders, orderStats.total_orders)"
                  :stroke-width="8"
                  color="#f59e0b"
                />
              </div>
            </div>
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="primary" size="small">已支付</el-tag>
                <span>{{ orderStats.paid_orders || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="getPercentage(orderStats.paid_orders, orderStats.total_orders)"
                  :stroke-width="8"
                  color="#3b82f6"
                />
              </div>
            </div>
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="success" size="small">已完成</el-tag>
                <span>{{ orderStats.completed_orders || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="getPercentage(orderStats.completed_orders, orderStats.total_orders)"
                  :stroke-width="8"
                  color="#10b981"
                />
              </div>
            </div>
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="danger" size="small">已取消</el-tag>
                <span>{{ orderStats.cancelled_orders || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="getPercentage(orderStats.cancelled_orders, orderStats.total_orders)"
                  :stroke-width="8"
                  color="#ef4444"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 预约状态分析 -->
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <h3>预约状态分析</h3>
              <el-button text @click="$router.push('/merchant/bookings')">查看全部</el-button>
            </div>
          </template>
          <div class="booking-analysis">
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="warning" size="small">待确认</el-tag>
                <span>{{ bookingStats.pending_bookings || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="
                    getPercentage(bookingStats.pending_bookings, bookingStats.total_bookings)
                  "
                  :stroke-width="8"
                  color="#f59e0b"
                />
              </div>
            </div>
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="primary" size="small">已确认</el-tag>
                <span>{{ bookingStats.confirmed_bookings || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="
                    getPercentage(bookingStats.confirmed_bookings, bookingStats.total_bookings)
                  "
                  :stroke-width="8"
                  color="#3b82f6"
                />
              </div>
            </div>
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="success" size="small">已完成</el-tag>
                <span>{{ bookingStats.completed_bookings || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="
                    getPercentage(bookingStats.completed_bookings, bookingStats.total_bookings)
                  "
                  :stroke-width="8"
                  color="#10b981"
                />
              </div>
            </div>
            <div class="analysis-item">
              <div class="item-label">
                <el-tag type="danger" size="small">已取消</el-tag>
                <span>{{ bookingStats.cancelled_bookings || 0 }}个</span>
              </div>
              <div class="item-progress">
                <el-progress
                  :percentage="
                    getPercentage(bookingStats.cancelled_bookings, bookingStats.total_bookings)
                  "
                  :stroke-width="8"
                  color="#ef4444"
                />
              </div>
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
      <div class="quick-actions">
        <div class="action-item" @click="$router.push('/merchant/boats/add')">
          <div class="action-icon boats">
            <ship theme="outline" size="24" />
          </div>
          <div class="action-content">
            <div class="action-title">添加船艇</div>
            <div class="action-desc">新增船艇信息</div>
          </div>
        </div>

        <div class="action-item" @click="$router.push('/merchant/goods/add')">
          <div class="action-icon goods">
            <shopping-bag theme="outline" size="24" />
          </div>
          <div class="action-content">
            <div class="action-title">添加商品</div>
            <div class="action-desc">发布新商品</div>
          </div>
        </div>

        <div class="action-item" @click="$router.push('/merchant/orders')">
          <div class="action-icon orders">
            <list theme="outline" size="24" />
          </div>
          <div class="action-content">
            <div class="action-title">订单管理</div>
            <div class="action-desc">处理订单状态</div>
          </div>
        </div>

        <div class="action-item" @click="$router.push('/merchant/bookings')">
          <div class="action-icon bookings">
            <calendar theme="outline" size="24" />
          </div>
          <div class="action-content">
            <div class="action-title">预约管理</div>
            <div class="action-desc">确认预约安排</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 待处理事项 -->
    <el-card class="pending-tasks-card">
      <template #header>
        <h3>待处理事项</h3>
      </template>
      <div class="pending-tasks">
        <div v-if="orderStats.pending_orders > 0" class="task-item urgent">
          <div class="task-icon">
            <el-icon><warning /></el-icon>
          </div>
          <div class="task-content">
            <div class="task-title">有 {{ orderStats.pending_orders }} 个订单待支付</div>
            <div class="task-desc">建议联系客户确认支付状态</div>
          </div>
          <el-button size="small" @click="$router.push('/merchant/orders?status=pending')">
            立即处理
          </el-button>
        </div>

        <div v-if="orderStats.paid_orders > 0" class="task-item">
          <div class="task-icon">
            <el-icon><bell /></el-icon>
          </div>
          <div class="task-content">
            <div class="task-title">有 {{ orderStats.paid_orders }} 个订单待发货</div>
            <div class="task-desc">请及时安排发货确保客户体验</div>
          </div>
          <el-button size="small" @click="$router.push('/merchant/orders?status=paid')">
            立即处理
          </el-button>
        </div>

        <div v-if="bookingStats.pending_bookings > 0" class="task-item">
          <div class="task-icon">
            <el-icon><clock /></el-icon>
          </div>
          <div class="task-content">
            <div class="task-title">有 {{ bookingStats.pending_bookings }} 个预约待确认</div>
            <div class="task-desc">请尽快确认预约安排</div>
          </div>
          <el-button size="small" @click="$router.push('/merchant/bookings?status=pending')">
            立即处理
          </el-button>
        </div>

        <div v-if="!hasPendingTasks" class="task-item success">
          <div class="task-icon">
            <el-icon><check /></el-icon>
          </div>
          <div class="task-content">
            <div class="task-title">暂无待处理事项</div>
            <div class="task-desc">所有业务运行正常</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Money,
  ShoppingBag,
  Calendar,
  StarFilled,
  Warning,
  Bell,
  Clock,
  Check,
} from '@element-plus/icons-vue'
import { Refresh, TrendingUp, Ship, List } from '@icon-park/vue-next'
import { getOrderStatsApiV1OrdersMerchantStatsGet } from '@/services/api/orders'
import { getBookingStatsApiV1BookingsMerchantStatsGet } from '@/services/api/bookings'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const orderStats = ref<API.OrderStatsSchema>({
  total_orders: 0,
  pending_orders: 0,
  paid_orders: 0,
  shipped_orders: 0,
  completed_orders: 0,
  cancelled_orders: 0,
  total_amount: 0,
  paid_amount: 0,
})

const bookingStats = ref<API.BookingStatsSchema>({
  total_bookings: 0,
  pending_bookings: 0,
  confirmed_bookings: 0,
  completed_bookings: 0,
  cancelled_bookings: 0,
  total_revenue: 0,
  average_rating: 0,
})

// 计算属性
const hasPendingTasks = computed(() => {
  return (
    orderStats.value.pending_orders > 0 ||
    orderStats.value.paid_orders > 0 ||
    bookingStats.value.pending_bookings > 0
  )
})

// 获取百分比
const getPercentage = (current: number, total: number) => {
  if (!total || total === 0) return 0
  return Math.round((current / total) * 100)
}

// 获取订单统计
const fetchOrderStats = async () => {
  try {
    const response = await getOrderStatsApiV1OrdersMerchantStatsGet()
    if (response.data?.success && response.data.data) {
      orderStats.value = response.data.data
    }
  } catch (error) {
    console.error('获取订单统计失败:', error)
  }
}

// 获取预约统计
const fetchBookingStats = async () => {
  try {
    const response = await getBookingStatsApiV1BookingsMerchantStatsGet()
    if (response.data?.success && response.data.data) {
      bookingStats.value = response.data.data
    }
  } catch (error) {
    console.error('获取预约统计失败:', error)
  }
}

// 刷新数据
const refreshData = async () => {
  try {
    loading.value = true
    await Promise.all([fetchOrderStats(), fetchBookingStats()])
    ElMessage.success('数据已刷新')
  } catch (error) {
    ElMessage.error('刷新数据失败')
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.merchant-dashboard {
  padding: 0;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 28px;
}

.stat-card.revenue .stat-icon {
  background: linear-gradient(135deg, #fce7f3 0%, #fce7f3 100%);
  color: #ec4899;
}

.stat-card.orders .stat-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #dbeafe 100%);
  color: #3b82f6;
}

.stat-card.bookings .stat-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #d1fae5 100%);
  color: #10b981;
}

.stat-card.rating .stat-icon {
  background: linear-gradient(135deg, #fef3cd 0%, #fef3cd 100%);
  color: #f59e0b;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

/* 分析卡片 */
.analysis-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.order-analysis,
.booking-analysis {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analysis-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.item-progress {
  width: 100%;
}

/* 快捷操作 */
.quick-actions-card {
  margin-bottom: 24px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.action-icon.boats {
  background: #dbeafe;
  color: #3b82f6;
}

.action-icon.goods {
  background: #d1fae5;
  color: #10b981;
}

.action-icon.orders {
  background: #fef3cd;
  color: #f59e0b;
}

.action-icon.bookings {
  background: #fce7f3;
  color: #ec4899;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 12px;
  color: #6b7280;
}

/* 待处理事项 */
.pending-tasks-card {
  margin-bottom: 24px;
}

.pending-tasks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f9fafb;
}

.task-item.urgent {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
}

.task-item.success {
  background: #f0fdf4;
  border-left: 4px solid #10b981;
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: white;
}

.task-item.urgent .task-icon {
  color: #ef4444;
}

.task-item.success .task-icon {
  color: #10b981;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.task-desc {
  font-size: 12px;
  color: #6b7280;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .action-item {
    justify-content: center;
    text-align: center;
  }
}
</style>
