<template>
  <el-dialog v-model="dialogVisible" title="船舶预订" width="600px" :before-close="handleClose">
    <div v-if="boat" class="booking-dialog">
      <!-- 船只信息 -->
      <div class="boat-summary">
        <div class="boat-image">
          <el-image
            :src="boat.images?.[0] || '/default-boat.jpg'"
            :alt="boat.name"
            fit="cover"
            class="image"
          >
            <template #error>
              <div class="image-error">
                <ship theme="outline" size="32" />
              </div>
            </template>
          </el-image>
        </div>
        <div class="boat-info">
          <h3>{{ boat.name }}</h3>
          <p class="boat-type">{{ boat.boat_type }}</p>
          <div class="boat-specs">
            <span>载客量：{{ boat.capacity }}人</span>
            <span>¥{{ boat.hourly_rate }}/小时</span>
          </div>
        </div>
      </div>

      <!-- 预订表单 -->
      <el-form
        ref="formRef"
        :model="bookingForm"
        :rules="rules"
        label-width="100px"
        class="booking-form"
      >
        <el-form-item label="开始时间" prop="start_time" required>
          <el-date-picker
            v-model="bookingForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            :disabled-date="disabledDate"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time" required>
          <el-date-picker
            v-model="bookingForm.end_time"
            type="datetime"
            placeholder="选择结束时间"
            :disabled-date="disabledDate"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="乘客人数" prop="passenger_count" required>
          <el-input-number
            v-model="bookingForm.passenger_count"
            :min="1"
            :max="boat.capacity"
            style="width: 100%"
          />
          <div class="form-hint">最多可容纳 {{ boat.capacity }} 人</div>
        </el-form-item>

        <el-form-item label="联系人" prop="contact_name" required>
          <el-input v-model="bookingForm.contact_name" placeholder="请输入联系人姓名" />
        </el-form-item>

        <el-form-item label="联系电话" prop="contact_phone" required>
          <el-input v-model="bookingForm.contact_phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="备注" prop="user_notes">
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
        <div class="fee-item">
          <span>小时费率：</span>
          <span>¥{{ boat.hourly_rate }}/小时</span>
        </div>
        <div class="fee-item total">
          <span>预估费用：</span>
          <span>¥{{ estimatedFee }}</span>
        </div>
      </div>

      <!-- 可用性检查结果 -->
      <div v-if="availabilityResult" class="availability-result">
        <el-alert
          :title="availabilityResult.available ? '船只可用' : '船只不可用'"
          :type="availabilityResult.available ? 'success' : 'error'"
          :description="availabilityResult.message"
          show-icon
          :closable="false"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="checkAvailability" :loading="checkingAvailability">
          检查可用性
        </el-button>
        <el-button
          type="primary"
          @click="submitBooking"
          :loading="submitting"
          :disabled="!canSubmit"
        >
          确认预订
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Ship } from '@icon-park/vue-next'
import {
  createBookingApiV1BookingsPost,
  checkBoatAvailabilityApiV1BookingsAvailabilityGet,
} from '@/services/api/bookings'

interface Props {
  modelValue: boolean
  boat: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const submitting = ref(false)
const checkingAvailability = ref(false)
const availabilityResult = ref<any>(null)

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
const rules: FormRules = {
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
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const estimatedHours = computed(() => {
  if (!bookingForm.value.start_time || !bookingForm.value.end_time) return 0
  const start = new Date(bookingForm.value.start_time)
  const end = new Date(bookingForm.value.end_time)
  return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)))
})

const estimatedFee = computed(() => {
  if (!props.boat || estimatedHours.value <= 0) return 0
  return estimatedHours.value * props.boat.hourly_rate
})

const canSubmit = computed(() => {
  return availabilityResult.value?.available === true
})

// 日期禁用逻辑
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7 // 不能选择过去的日期
}

const disabledHours = () => {
  const hours = []
  const now = new Date()
  const selectedDate = bookingForm.value.start_time ? new Date(bookingForm.value.start_time) : null

  if (selectedDate && selectedDate.toDateString() === now.toDateString()) {
    // 如果是今天，禁用已过去的小时
    for (let i = 0; i < now.getHours(); i++) {
      hours.push(i)
    }
  }
  return hours
}

const disabledMinutes = (hour: number) => {
  const minutes = []
  const now = new Date()
  const selectedDate = bookingForm.value.start_time ? new Date(bookingForm.value.start_time) : null

  if (
    selectedDate &&
    selectedDate.toDateString() === now.toDateString() &&
    hour === now.getHours()
  ) {
    // 如果是今天的当前小时，禁用已过去的分钟
    for (let i = 0; i <= now.getMinutes(); i++) {
      minutes.push(i)
    }
  }
  return minutes
}

// 检查可用性
const checkAvailability = async () => {
  if (!formRef.value) return

  // 验证必填字段
  try {
    await formRef.value.validateField(['start_time', 'end_time', 'passenger_count'])
  } catch {
    return
  }

  try {
    checkingAvailability.value = true
    const response = await checkBoatAvailabilityApiV1BookingsAvailabilityGet({
      boat_id: props.boat.id,
      start_time: bookingForm.value.start_time,
      end_time: bookingForm.value.end_time,
    })

    if (response.data?.success) {
      availabilityResult.value = response.data.data
    }
  } catch (error: any) {
    console.error('检查可用性失败:', error)
    ElMessage.error('检查可用性失败')
  } finally {
    checkingAvailability.value = false
  }
}

// 提交预订
const submitBooking = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  if (!canSubmit.value) {
    ElMessage.warning('请先检查船只可用性')
    return
  }

  try {
    submitting.value = true
    const response = await createBookingApiV1BookingsPost({
      boat_id: props.boat.id,
      start_time: bookingForm.value.start_time,
      end_time: bookingForm.value.end_time,
      passenger_count: bookingForm.value.passenger_count,
      contact_name: bookingForm.value.contact_name,
      contact_phone: bookingForm.value.contact_phone,
      user_notes: bookingForm.value.user_notes,
    })

    if (response.data?.success) {
      ElMessage.success('预订成功！')
      emit('success')
      handleClose()
    }
  } catch (error: any) {
    console.error('预订失败:', error)
    ElMessage.error(error.response?.data?.message || '预订失败')
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
  availabilityResult.value = null
  emit('update:modelValue', false)
}

// 监听时间变化，重置可用性检查结果
watch([() => bookingForm.value.start_time, () => bookingForm.value.end_time], () => {
  availabilityResult.value = null
})
</script>

<style scoped>
.booking-dialog {
  padding: 0;
}

.boat-summary {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.boat-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
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

.boat-info {
  flex: 1;
}

.boat-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.boat-type {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.boat-specs {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #333;
}

.booking-form {
  margin-bottom: 24px;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
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

.availability-result {
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
