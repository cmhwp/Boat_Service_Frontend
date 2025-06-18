<template>
  <div class="boat-detail-view">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="!boat" class="error-container">
      <el-result icon="warning" title="船只不存在" sub-title="抱歉，您查看的船只不存在或已下架">
        <template #extra>
          <el-button type="primary" @click="$router.push('/user/boats')"> 返回船只列表 </el-button>
        </template>
      </el-result>
    </div>

    <div v-else class="boat-detail-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/user/boats' }">船舶预订</el-breadcrumb-item>
        <el-breadcrumb-item>{{ boat.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <el-row :gutter="32">
        <!-- 左侧内容区 -->
        <el-col :span="16">
          <!-- 船只图片 -->
          <div class="boat-images">
            <el-carousel v-if="boat.images && boat.images.length > 0" height="400px">
              <el-carousel-item v-for="(image, index) in boat.images" :key="index">
                <el-image
                  :src="image"
                  :alt="`${boat.name} - 图片${index + 1}`"
                  fit="cover"
                  class="carousel-image"
                >
                  <template #error>
                    <div class="image-error">
                      <ship theme="outline" size="64" />
                    </div>
                  </template>
                </el-image>
              </el-carousel-item>
            </el-carousel>
            <div v-else class="no-image">
              <ship theme="outline" size="64" />
              <p>暂无图片</p>
            </div>
          </div>

          <!-- 船只详细信息 -->
          <el-card class="boat-info-card">
            <template #header>
              <h2>船只详情</h2>
            </template>

            <div class="info-grid">
              <div class="info-item">
                <label>船只名称：</label>
                <span>{{ boat.name }}</span>
              </div>

              <div class="info-item">
                <label>船只类型：</label>
                <el-tag>{{ boat.boat_type }}</el-tag>
              </div>

              <div class="info-item">
                <label>证书编号：</label>
                <span>{{ boat.license_number }}</span>
              </div>

              <div class="info-item">
                <label>载客量：</label>
                <span>{{ boat.capacity }} 人</span>
              </div>

              <div class="info-item">
                <label>小时费率：</label>
                <span class="price">¥{{ boat.hourly_rate }}/小时</span>
              </div>

              <div class="info-item">
                <label>当前状态：</label>
                <el-tag :type="getStatusType(boat.status)">
                  {{ getStatusText(boat.status) }}
                </el-tag>
              </div>

              <div v-if="boat.current_location" class="info-item">
                <label>当前位置：</label>
                <span>{{ boat.current_location }}</span>
              </div>

              <div v-if="boat.description" class="info-item full-width">
                <label>船只描述：</label>
                <p class="description">{{ boat.description }}</p>
              </div>
            </div>
          </el-card>

          <!-- 商家信息 -->
          <el-card class="merchant-info-card">
            <template #header>
              <h3>商家信息</h3>
            </template>

            <div class="merchant-content">
              <div class="merchant-basic">
                <el-avatar :size="60" :src="boat.merchant?.avatar" :icon="UserFilled" />
                <div class="merchant-details">
                  <h4>{{ boat.merchant?.business_name || boat.merchant?.username }}</h4>
                  <p v-if="boat.merchant?.business_address">
                    地址：{{ boat.merchant.business_address }}
                  </p>
                  <div class="merchant-stats">
                    <el-rate
                      v-if="boat.merchant?.rating"
                      :value="boat.merchant.rating"
                      disabled
                      show-score
                    />
                    <span v-if="boat.merchant?.total_bookings">
                      已服务 {{ boat.merchant.total_bookings }} 次
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="boat.merchant?.description" class="merchant-description">
                <p>{{ boat.merchant.description }}</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧预订区 -->
        <el-col :span="8">
          <el-affix :offset="80">
            <el-card class="booking-card">
              <template #header>
                <div class="booking-header">
                  <h3>立即预订</h3>
                  <div class="price-display">
                    <span class="price">¥{{ boat.hourly_rate }}</span>
                    <span class="unit">/小时</span>
                  </div>
                </div>
              </template>

              <el-form
                ref="bookingFormRef"
                :model="bookingForm"
                :rules="bookingRules"
                label-position="top"
              >
                <el-form-item label="开始时间" prop="start_time">
                  <el-date-picker
                    v-model="bookingForm.start_time"
                    type="datetime"
                    placeholder="选择开始时间"
                    :disabled-date="disabledDate"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </el-form-item>

                <el-form-item label="结束时间" prop="end_time">
                  <el-date-picker
                    v-model="bookingForm.end_time"
                    type="datetime"
                    placeholder="选择结束时间"
                    :disabled-date="disabledDate"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </el-form-item>

                <el-form-item label="乘客人数" prop="passenger_count">
                  <el-input-number
                    v-model="bookingForm.passenger_count"
                    :min="1"
                    :max="boat.capacity"
                    style="width: 100%"
                  />
                </el-form-item>

                <el-form-item label="联系人" prop="contact_name">
                  <el-input v-model="bookingForm.contact_name" placeholder="请输入联系人姓名" />
                </el-form-item>

                <el-form-item label="联系电话" prop="contact_phone">
                  <el-input v-model="bookingForm.contact_phone" placeholder="请输入联系电话" />
                </el-form-item>

                <el-form-item label="备注">
                  <el-input
                    v-model="bookingForm.user_notes"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注信息（可选）"
                  />
                </el-form-item>
              </el-form>

              <!-- 费用预估 -->
              <div v-if="estimatedFee > 0" class="fee-estimation">
                <div class="fee-item">
                  <span>预估时长：</span>
                  <span>{{ estimatedHours }} 小时</span>
                </div>
                <div class="fee-item total">
                  <span>预估费用：</span>
                  <span>¥{{ estimatedFee }}</span>
                </div>
              </div>

              <div class="booking-actions">
                <el-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  :disabled="boat.status !== 'available'"
                  @click="submitBooking"
                  block
                >
                  {{ boat.status === 'available' ? '立即预订' : '船只不可用' }}
                </el-button>
              </div>
            </el-card>
          </el-affix>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { Ship } from '@icon-park/vue-next'
import { getBoatDetailApiV1BoatsBoatIdGet } from '@/services/api/boats'
import { createBookingApiV1BookingsPost } from '@/services/api/bookings'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const submitting = ref(false)
const boat = ref<API.BoatDetailSchema | null>(null)
const bookingFormRef = ref<FormInstance>()

// 预订表单
const bookingForm = ref({
  start_time: '',
  end_time: '',
  passenger_count: 1,
  contact_name: '',
  contact_phone: '',
  user_notes: '',
})

// 表单验证规则
const bookingRules: FormRules = {
  start_time: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
  end_time: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
  passenger_count: [{ required: true, message: '请输入乘客人数', trigger: 'blur' }],
  contact_name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contact_phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
}

// 计算属性
const estimatedHours = computed(() => {
  if (!bookingForm.value.start_time || !bookingForm.value.end_time) return 0
  const start = new Date(bookingForm.value.start_time)
  const end = new Date(bookingForm.value.end_time)
  return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)))
})

const estimatedFee = computed(() => {
  if (!boat.value || estimatedHours.value <= 0) return 0
  return estimatedHours.value * boat.value.hourly_rate
})

// 获取船只详情
const fetchBoatDetail = async () => {
  try {
    loading.value = true
    const boatId = route.params.id as string
    const response = await getBoatDetailApiV1BoatsBoatIdGet({
      boat_id: parseInt(boatId),
    })

    if (response.data?.success && response.data.data) {
      boat.value = response.data.data
    } else {
      boat.value = null
    }
  } catch (error) {
    console.error('获取船只详情失败:', error)
    boat.value = null
  } finally {
    loading.value = false
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    available: 'success',
    in_use: 'primary',
    maintenance: 'warning',
    inactive: 'info',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维护中',
    inactive: '停用',
  }
  return statusMap[status] || status
}

// 日期禁用逻辑
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7 // 不能选择过去的日期
}

// 提交预订
const submitBooking = async () => {
  if (!bookingFormRef.value || !boat.value) return

  try {
    await bookingFormRef.value.validate()
  } catch {
    return
  }

  try {
    submitting.value = true
    const response = await createBookingApiV1BookingsPost({
      boat_id: boat.value.id,
      start_time: bookingForm.value.start_time,
      end_time: bookingForm.value.end_time,
      passenger_count: bookingForm.value.passenger_count,
      contact_name: bookingForm.value.contact_name,
      contact_phone: bookingForm.value.contact_phone,
      user_notes: bookingForm.value.user_notes,
    })

    if (response.data?.success) {
      ElMessage.success('预订成功！')
      router.push('/user/bookings')
    }
  } catch (error: any) {
    console.error('预订失败:', error)
    ElMessage.error(error.response?.data?.message || '预订失败')
  } finally {
    submitting.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchBoatDetail()
})
</script>

<style scoped>
.boat-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.loading-container,
.error-container {
  padding: 60px 0;
  text-align: center;
}

.breadcrumb {
  margin-bottom: 24px;
}

.boat-images {
  margin-bottom: 24px;
}

.carousel-image {
  width: 100%;
  height: 100%;
}

.image-error,
.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  background: #f5f5f5;
  color: #999;
}

.no-image p {
  margin-top: 16px;
  font-size: 16px;
}

.boat-info-card {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: flex-start;
}

.info-item label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.price {
  color: #f56565;
  font-weight: 600;
  font-size: 18px;
}

.description {
  margin: 8px 0 0 0;
  line-height: 1.6;
  color: #666;
}

.merchant-info-card {
  margin-bottom: 24px;
}

.merchant-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.merchant-basic {
  display: flex;
  gap: 16px;
}

.merchant-details {
  flex: 1;
}

.merchant-details h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.merchant-details p {
  margin: 0 0 8px 0;
  color: #666;
}

.merchant-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.merchant-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.booking-card {
  position: sticky;
  top: 80px;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-header h3 {
  margin: 0;
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-display .price {
  font-size: 24px;
  font-weight: 600;
  color: #f56565;
}

.price-display .unit {
  color: #666;
  font-size: 14px;
}

.fee-estimation {
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.fee-item:last-child {
  margin-bottom: 0;
}

.fee-item.total {
  font-weight: 600;
  font-size: 16px;
  color: #1890ff;
  border-top: 1px solid #e1e1e1;
  padding-top: 8px;
  margin-top: 8px;
}

.booking-actions {
  margin-top: 16px;
}
</style>
