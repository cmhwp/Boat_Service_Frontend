<template>
  <div class="boats-view">
    <!-- 页面标题和描述 -->
    <div class="page-header">
      <div class="header-content">
        <h1>船舶预订</h1>
        <p>选择您心仪的船艇，开启美妙的水上之旅</p>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-card>
        <el-form :model="searchForm" :inline="true" class="search-form">
          <el-form-item label="船只类型">
            <el-select v-model="searchForm.boat_type" placeholder="请选择船只类型" clearable>
              <el-option label="观光船" value="观光船" />
              <el-option label="快艇" value="快艇" />
              <el-option label="游轮" value="游轮" />
              <el-option label="帆船" value="帆船" />
            </el-select>
          </el-form-item>

          <el-form-item label="最小载客量">
            <el-input-number
              v-model="searchForm.min_capacity"
              :min="1"
              :max="100"
              placeholder="最小载客量"
            />
          </el-form-item>

          <el-form-item label="最大小时费率">
            <el-input-number
              v-model="searchForm.max_hourly_rate"
              :min="0"
              :precision="2"
              placeholder="最大小时费率"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchBoats" :loading="loading">
              <search theme="outline" size="14" />
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 船只列表 -->
    <div class="boats-section">
      <div v-if="loading" class="loading-container">
        <el-row :gutter="24">
          <el-col :span="8" v-for="i in 6" :key="i">
            <el-card class="boat-card">
              <el-skeleton :rows="4" animated />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div v-else-if="boats.length === 0" class="empty-container">
        <el-empty description="暂未找到符合条件的船只">
          <el-button type="primary" @click="resetSearch"> 重新搜索 </el-button>
        </el-empty>
      </div>

      <div v-else>
        <el-row :gutter="24">
          <el-col :span="8" v-for="boat in boats" :key="boat.id">
            <el-card class="boat-card" :body-style="{ padding: '0' }">
              <!-- 船只图片 -->
              <div class="boat-image">
                <el-image
                  :src="boat.images?.[0] || '/default-boat.jpg'"
                  :alt="boat.name"
                  fit="cover"
                  class="image"
                >
                  <template #error>
                    <div class="image-error">
                      <ship theme="outline" size="48" />
                    </div>
                  </template>
                </el-image>
                <div class="boat-type-tag">
                  <el-tag size="small">{{ boat.boat_type }}</el-tag>
                </div>
              </div>

              <!-- 船只信息 -->
              <div class="boat-info">
                <h3 class="boat-name">{{ boat.name }}</h3>
                <p class="boat-description">{{ boat.description || '暂无描述' }}</p>

                <div class="boat-details">
                  <div class="detail-item">
                    <user-group theme="outline" size="16" />
                    <span>载客量：{{ boat.capacity }}人</span>
                  </div>
                  <div class="detail-item">
                    <currency theme="outline" size="16" />
                    <span class="hourly-rate">¥{{ boat.hourly_rate }}/小时</span>
                  </div>
                  <div v-if="boat.current_location" class="detail-item">
                    <location theme="outline" size="16" />
                    <span>位置：{{ boat.current_location }}</span>
                  </div>
                </div>

                <!-- 商家信息 -->
                <div class="merchant-info">
                  <el-avatar :size="24" :src="boat.merchant?.avatar" :icon="UserFilled" />
                  <span class="merchant-name">{{
                    boat.merchant?.business_name || boat.merchant?.username
                  }}</span>
                  <el-rate
                    v-if="boat.merchant?.rating"
                    :value="boat.merchant.rating"
                    disabled
                    size="small"
                  />
                </div>

                <!-- 操作按钮 -->
                <div class="boat-actions">
                  <el-button type="primary" size="small" @click="viewBoatDetail(boat.id)">
                    查看详情
                  </el-button>
                  <el-button type="success" size="small" @click="quickBooking(boat)">
                    立即预订
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.page_size"
            :page-sizes="[12, 24, 48]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 快速预订对话框 -->
    <quick-booking-dialog
      v-model="bookingDialogVisible"
      :boat="selectedBoat"
      @success="handleBookingSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { Ship, Search, Currency, LocalTwo } from '@icon-park/vue-next'
import { getAvailableBoatsApiV1BoatsAvailableGet } from '@/services/api/boats'
import QuickBookingDialog from '@/components/QuickBookingDialog.vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const boats = ref<any[]>([])
const bookingDialogVisible = ref(false)
const selectedBoat = ref<any>(null)

// 搜索表单
const searchForm = reactive({
  boat_type: '',
  min_capacity: undefined as number | undefined,
  max_hourly_rate: undefined as number | undefined,
})

// 分页数据
const pagination = reactive({
  page: 1,
  page_size: 12,
  total: 0,
})

// 获取船只列表
const fetchBoats = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.page,
      page_size: pagination.page_size,
    }

    // 添加搜索条件
    if (searchForm.boat_type) {
      params.boat_type = searchForm.boat_type
    }
    if (searchForm.min_capacity) {
      params.min_capacity = searchForm.min_capacity
    }
    if (searchForm.max_hourly_rate) {
      params.max_hourly_rate = searchForm.max_hourly_rate
    }

    const response = await getAvailableBoatsApiV1BoatsAvailableGet(params)

    if (response.data?.success && response.data.data) {
      boats.value = response.data.data.items || []
      pagination.total = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取船只列表失败:', error)
    ElMessage.error('获取船只列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索船只
const searchBoats = () => {
  pagination.page = 1
  fetchBoats()
}

// 重置搜索
const resetSearch = () => {
  searchForm.boat_type = ''
  searchForm.min_capacity = undefined
  searchForm.max_hourly_rate = undefined
  pagination.page = 1
  fetchBoats()
}

// 查看船只详情
const viewBoatDetail = (boatId: number) => {
  router.push(`/user/boats/${boatId}`)
}

// 快速预订
const quickBooking = (boat: any) => {
  selectedBoat.value = boat
  bookingDialogVisible.value = true
}

// 处理预订成功
const handleBookingSuccess = () => {
  ElMessage.success('预订成功！')
  router.push('/user/bookings')
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.page_size = val
  pagination.page = 1
  fetchBoats()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchBoats()
}

// 页面加载时获取数据
onMounted(() => {
  fetchBoats()
})
</script>

<style scoped>
.boats-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: #333;
}

.header-content p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.search-section {
  margin-bottom: 24px;
}

.search-form {
  margin: 0;
}

.search-form .el-form-item {
  margin-bottom: 0;
}

.boats-section {
  margin-bottom: 24px;
}

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.boat-card {
  margin-bottom: 24px;
  height: 100%;
  transition: all 0.3s;
  cursor: pointer;
}

.boat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.boat-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.boat-image .image {
  width: 100%;
  height: 100%;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #999;
}

.boat-type-tag {
  position: absolute;
  top: 12px;
  left: 12px;
}

.boat-info {
  padding: 20px;
}

.boat-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.boat-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.boat-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.hourly-rate {
  color: #f56565;
  font-weight: 600;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.merchant-name {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.boat-actions {
  display: flex;
  gap: 8px;
}

.boat-actions .el-button {
  flex: 1;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
