<template>
  <div class="crew-tasks">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">{{ getPageTitle() }}</h1>
      <p class="page-description">{{ getPageDescription() }}</p>
    </div>

    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filters.status" placeholder="选择状态" clearable @change="loadTasks">
            <el-option label="全部" value="" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="filters.startDate"
            type="date"
            placeholder="开始日期"
            @change="loadTasks"
          />
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="filters.endDate"
            type="date"
            placeholder="结束日期"
            @change="loadTasks"
          />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="loadTasks">
            <el-icon><search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetFilters">
            <el-icon><refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 任务列表 -->
    <el-card>
      <div v-loading="loading" class="task-table">
        <el-table :data="tasks" stripe>
          <el-table-column prop="booking_number" label="任务编号" width="150" />
          <el-table-column prop="boat_name" label="船只名称" width="120" />
          <el-table-column prop="customer_name" label="客户姓名" width="100" />
          <el-table-column prop="passenger_count" label="乘客人数" width="100" align="center">
            <template #default="{ row }"> {{ row.passenger_count }}人 </template>
          </el-table-column>
          <el-table-column label="服务时间" width="160">
            <template #default="{ row }">
              <div>{{ formatDate(row.start_time) }}</div>
              <div class="text-gray">
                {{ formatTime(row.start_time) }} - {{ formatTime(row.end_time) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="total_amount" label="服务费用" width="100" align="right">
            <template #default="{ row }"> ¥{{ row.total_amount }} </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="viewDetail(row.id)"> 详情 </el-button>
              <el-button
                v-if="row.status === 'confirmed'"
                size="small"
                type="primary"
                @click="handleUpdateStatus(row.id, 'in_progress')"
                :loading="updating === row.id"
              >
                开始
              </el-button>
              <el-button
                v-else-if="row.status === 'in_progress'"
                size="small"
                type="success"
                @click="handleUpdateStatus(row.id, 'completed')"
                :loading="updating === row.id"
              >
                完成
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="loadTasks"
            @size-change="loadTasks"
          />
        </div>
      </div>
    </el-card>

    <!-- 任务详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="任务详情" width="600px">
      <div v-if="selectedTask" class="task-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务编号">{{
            selectedTask.booking_number
          }}</el-descriptions-item>
          <el-descriptions-item label="船只名称">{{ selectedTask.boat_name }}</el-descriptions-item>
          <el-descriptions-item label="客户姓名">{{
            selectedTask.customer_name
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            selectedTask.customer_phone
          }}</el-descriptions-item>
          <el-descriptions-item label="乘客人数"
            >{{ selectedTask.passenger_count }}人</el-descriptions-item
          >
          <el-descriptions-item label="服务费用"
            >¥{{ selectedTask.total_amount }}</el-descriptions-item
          >
          <el-descriptions-item label="开始时间">{{
            formatDateTime(selectedTask.start_time)
          }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{
            formatDateTime(selectedTask.end_time)
          }}</el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-tag :type="getStatusType(selectedTask.status)">
              {{ getStatusText(selectedTask.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(selectedTask.created_at)
          }}</el-descriptions-item>
        </el-descriptions>

        <div v-if="selectedTask.user_notes" class="notes-section">
          <h4>客户备注</h4>
          <p>{{ selectedTask.user_notes }}</p>
        </div>

        <div v-if="selectedTask.merchant_notes" class="notes-section">
          <h4>商家备注</h4>
          <p>{{ selectedTask.merchant_notes }}</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="selectedTask?.status === 'confirmed'"
          type="primary"
          @click="handleUpdateStatus(selectedTask.id, 'in_progress')"
          :loading="updating === selectedTask.id"
        >
          开始任务
        </el-button>
        <el-button
          v-else-if="selectedTask?.status === 'in_progress'"
          type="success"
          @click="handleUpdateStatus(selectedTask.id, 'completed')"
          :loading="updating === selectedTask.id"
        >
          完成任务
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getCrewTasksApiV1BookingsCrewTasksGet,
  updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch,
} from '@/services/api/bookings'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const updating = ref<number | null>(null)
const tasks = ref<API.CrewTaskListItemSchema[]>([])
const selectedTask = ref<API.CrewTaskListItemSchema | null>(null)
const detailDialogVisible = ref(false)

// 筛选器
const filters = reactive({
  status: '',
  startDate: '',
  endDate: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 根据路由获取页面标题
const getPageTitle = () => {
  const path = route.path
  if (path.includes('current')) return '当前任务'
  if (path.includes('completed')) return '已完成任务'
  return '任务列表'
}

// 根据路由获取页面描述
const getPageDescription = () => {
  const path = route.path
  if (path.includes('current')) return '查看当前进行中的任务'
  if (path.includes('completed')) return '查看已完成的任务记录'
  return '查看和管理您的所有工作任务'
}

// 根据路由设置默认筛选状态
const setDefaultFilter = () => {
  const path = route.path
  if (path.includes('current')) {
    filters.status = 'in_progress'
  } else if (path.includes('completed')) {
    filters.status = 'completed'
  } else {
    filters.status = ''
  }
}

// 加载任务列表
const loadTasks = async () => {
  try {
    loading.value = true

    const params: any = {
      page: pagination.page,
      page_size: pagination.pageSize,
    }

    if (filters.status) {
      params.status = filters.status
    }
    if (filters.startDate) {
      params.start_date = filters.startDate
    }
    if (filters.endDate) {
      params.end_date = filters.endDate
    }

    const response = await getCrewTasksApiV1BookingsCrewTasksGet(params)

    if (response.data.success && response.data.data) {
      tasks.value = response.data.data.items
      pagination.total = response.data.data.total
    }
  } catch (error) {
    console.error('加载任务列表失败:', error)
    ElMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

// 重置筛选器
const resetFilters = () => {
  filters.status = ''
  filters.startDate = ''
  filters.endDate = ''
  pagination.page = 1
  setDefaultFilter()
  loadTasks()
}

// 查看详情
const viewDetail = (taskId: number) => {
  selectedTask.value = tasks.value.find((task) => task.id === taskId) || null
  detailDialogVisible.value = true
}

// 更新任务状态
const handleUpdateStatus = async (taskId: number, status: 'in_progress' | 'completed') => {
  try {
    const confirmText = status === 'in_progress' ? '确认开始此任务？' : '确认完成此任务？'
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    updating.value = taskId
    const response = await updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch(
      { booking_id: taskId },
      { status },
    )
    if (response.data.success) {
      ElMessage.success(status === 'in_progress' ? '任务已开始' : '任务已完成')
      detailDialogVisible.value = false
      loadTasks()
    }
  } catch (error) {
    console.log(error)
    if (error !== 'cancel') {
      console.error('更新任务状态失败:', error)
      ElMessage.error('更新任务状态失败')
    }
  } finally {
    updating.value = null
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
    cancelled:'已取消',
    completed: '已完成',
  }
  return statusMap[status] || status
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 格式化时间
const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 格式化日期时间
const formatDateTime = (dateTimeStr: string) => {
  return new Date(dateTimeStr).toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  setDefaultFilter()
  loadTasks()
})
</script>

<style scoped>
.crew-tasks {
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

.filter-card {
  margin-bottom: 20px;
}

.task-table {
  min-height: 400px;
}

.text-gray {
  color: #6b7280;
  font-size: 12px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.task-detail {
  padding: 20px 0;
}

.notes-section {
  margin-top: 20px;
}

.notes-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.notes-section p {
  margin: 0;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
