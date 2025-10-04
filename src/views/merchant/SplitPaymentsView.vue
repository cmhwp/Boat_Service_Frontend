<template>
  <div class="split-payments-page">
    <el-page-header @back="$router.back()" content="分账记录" />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #ecf5ff; color: #409eff;">
              <el-icon :size="32"><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ stats.total_merchant_amount.toFixed(2) }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #f0f9ff; color: #67c23a;">
              <el-icon :size="32"><CircleCheck /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.completed_count }}</div>
              <div class="stat-label">已完成分账</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #fef0f0; color: #f56c6c;">
              <el-icon :size="32"><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.pending_count }}</div>
              <div class="stat-label">待分账</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #fff7e6; color: #e6a23c;">
              <el-icon :size="32"><PieChart /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.total_count }}</div>
              <div class="stat-label">总记录数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="分账类型">
          <el-select v-model="queryParams.split_type" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="预约服务" value="booking" />
            <el-option label="订单商品" value="order" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="待分账" value="pending" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>

        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分账记录表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="split_number" label="分账单号" width="200" />
        
        <el-table-column prop="split_type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.split_type === 'booking' ? 'primary' : 'success'">
              {{ row.split_type === 'booking' ? '预约' : '订单' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="total_amount" label="总金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.total_amount.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="platform_amount" label="平台分成" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text secondary">¥{{ row.platform_amount.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="merchant_amount" label="商家收入" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text primary">¥{{ row.merchant_amount.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="crew_amount" label="船员分成" width="120" align="right">
          <template #default="{ row }">
            <span v-if="row.crew_amount > 0" class="amount-text">
              ¥{{ row.crew_amount.toFixed(2) }}
            </span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              effect="plain"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="200">
          <template #default="{ row }">
            <el-text v-if="row.notes" class="notes-text" truncated>
              {{ row.notes }}
            </el-text>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.page_size"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Money, CircleCheck, Clock, PieChart, Search } from '@element-plus/icons-vue'
import { getSplitPaymentsApiV1SplitPaymentsGet } from '@/services/api/fenzhangguanli'
import { getSplitStatsApiV1SplitPaymentsStatsGet } from '@/services/api/fenzhangguanli'
import { formatDate } from 'date-fns'

// 统计数据 商家查看自己的，船员查看自己的，管理员查看全部
const stats = reactive({
  total_count: 0,
  pending_count: 0,
  completed_count: 0,
  failed_count: 0,
  total_platform_amount: 0,
  total_merchant_amount: 0,
  total_crew_amount: 0
})

// 查询参数 商家查看自己的，船员查看自己的，管理员查看全部
const queryParams = reactive({
  split_type: '',
  status: '',
  start_date: '',
  end_date: '',
  page: 1,
  page_size: 20
})

const dateRange = ref<[string, string] | null>(null)
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

onMounted(() => {
  loadStats()
  loadData()
})

async function loadStats() {
  try {
    const res = await getSplitStatsApiV1SplitPaymentsStatsGet()
    if (res.data) {
      Object.assign(stats, res.data)
    }
  } catch (error: any) {
    ElMessage.error('加载统计数据失败')
  }
}

async function loadData() {
  loading.value = true
  try {
    // 处理日期范围
    if (dateRange.value) {
      queryParams.start_date = dateRange.value[0]
      queryParams.end_date = dateRange.value[1]
    } else {
      queryParams.start_date = ''
      queryParams.end_date = ''
    }

    const res = await getSplitPaymentsApiV1SplitPaymentsGet(queryParams)
    if (res.data) {
      tableData.value = res.data.data.items || []
      total.value = res.data.data.total || 0
    }
  } catch (error: any) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  loadData()
}

function handleReset() {
  queryParams.split_type = ''
  queryParams.status = ''
  dateRange.value = null
  queryParams.page = 1
  loadData()
}

function getStatusType(status: string) {
  const map: Record<string, any> = {
    pending: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return map[status] || 'info'
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    pending: '待分账',
    completed: '已完成',
    failed: '失败'
  }
  return map[status] || status
}

function formatDateTime(dateString: string) {
  try {
    return formatDate(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.split-payments-page {
  padding: 20px;
}

.stats-row {
  margin-top: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.filter-card {
  margin-top: 20px;
}

.table-card {
  margin-top: 20px;
}

.amount-text {
  font-weight: 500;
  font-family: 'Monaco', 'Menlo', monospace;
}

.amount-text.primary {
  color: var(--el-color-success);
  font-weight: 600;
}

.amount-text.secondary {
  color: var(--el-text-color-secondary);
}

.text-muted {
  color: var(--el-text-color-placeholder);
}

.notes-text {
  max-width: 100%;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

