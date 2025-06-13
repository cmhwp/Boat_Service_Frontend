<template>
  <el-dialog v-model="dialogVisible" title="申请船员认证" width="600px" :before-close="handleClose">
    <div class="modal-content">
      <div class="info-section">
        <el-alert title="申请须知" type="info" :show-icon="true" :closable="false">
          <template #default>
            <ul class="notice-list">
              <li>请选择您希望加入的商家</li>
              <li>申请提交后需等待商家审核</li>
              <li>审核通过后您将获得船员认证</li>
              <li>同一商家只能申请一次</li>
            </ul>
          </template>
        </el-alert>
      </div>

      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="选择商家" prop="merchant_id">
          <el-select
            v-model="formData.merchant_id"
            placeholder="请选择要申请的商家"
            filterable
            remote
            :remote-method="searchMerchants"
            :loading="searching"
            style="width: 100%"
            :disabled="loading"
          >
            <el-option
              v-for="merchant in merchantOptions"
              :key="merchant.id"
              :label="merchant.merchant_name"
              :value="merchant.id"
            >
              <div class="merchant-option">
                <div class="merchant-name">{{ merchant.merchant_name }}</div>
                <div class="merchant-info">
                  <span class="contact">{{ merchant.contact_phone }}</span>
                  <span class="address" v-if="merchant.address">{{ merchant.address }}</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申请说明">
          <el-input
            v-model="formData.remarks"
            type="textarea"
            placeholder="请简要说明您的船员经验和技能（可选）"
            maxlength="500"
            show-word-limit
            :rows="4"
            :disabled="loading"
          />
        </el-form-item>
      </el-form>

      <!-- 已申请的商家列表 -->
      <div v-if="appliedMerchants.length > 0" class="applied-section">
        <h4>已申请的商家：</h4>
        <div class="applied-list">
          <el-tag
            v-for="application in appliedMerchants"
            :key="application.id"
            :type="getStatusTagType(application.status)"
            class="applied-tag"
          >
            {{ application.merchant?.merchant_name }} - {{ getStatusText(application.status) }}
          </el-tag>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!formData.merchant_id"
        >
          提交申请
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getMerchantsListApiV1MerchantsGet } from '@/services/api/merchants'
import { useCrewStore } from '@/stores/crew'

// Props
interface Props {
  visible: boolean
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  loading: false,
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [merchantId: number]
}>()

const crewStore = useCrewStore()

// 响应式数据
const formRef = ref<FormInstance>()
const merchantOptions = ref<API.MerchantListItemSchema[]>([])
const searching = ref(false)

// 表单数据
const formData = reactive({
  merchant_id: null as number | null,
  remarks: '',
})

// 表单验证规则
const formRules: FormRules = {
  merchant_id: [{ required: true, message: '请选择要申请的商家', trigger: 'change' }],
}

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

const appliedMerchants = computed(() => {
  return crewStore.applications.filter((app) => app.status !== 'rejected')
})

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetForm()
      loadInitialMerchants()
    }
  },
)

// 生命周期
onMounted(() => {
  loadInitialMerchants()
})

// 方法
const loadInitialMerchants = async () => {
  await searchMerchants('')
}

const searchMerchants = async (query: string) => {
  searching.value = true
  try {
    const response = await getMerchantsListApiV1MerchantsGet({
      page: 1,
      page_size: 50,
      status: 'active' as API.MerchantStatus,
    })

    if (response.data?.success && response.data?.data) {
      let merchants = response.data.data.items

      // 如果有搜索关键词，进行前端过滤
      if (query) {
        merchants = merchants.filter(
          (merchant) =>
            merchant.merchant_name.toLowerCase().includes(query.toLowerCase()) ||
            (merchant.address && merchant.address.toLowerCase().includes(query.toLowerCase())),
        )
      }

      // 过滤掉已经申请过的商家
      const appliedMerchantIds = crewStore.applications
        .filter((app) => app.status === 'pending' || app.status === 'approved')
        .map((app) => app.merchant_id)

      merchantOptions.value = merchants.filter(
        (merchant) => !appliedMerchantIds.includes(merchant.id),
      )
    }
  } catch (error) {
    console.error('Search merchants failed:', error)
    ElMessage.error('获取商家列表失败')
  } finally {
    searching.value = false
  }
}

const getStatusTagType = (status: API.CrewApplicationStatus) => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

const getStatusText = (status: API.CrewApplicationStatus) => {
  switch (status) {
    case 'approved':
      return '已通过'
    case 'pending':
      return '待审核'
    case 'rejected':
      return '已拒绝'
    default:
      return '未知'
  }
}

const resetForm = () => {
  Object.assign(formData, {
    merchant_id: null,
    remarks: '',
  })
  formRef.value?.resetFields()
}

const handleClose = () => {
  if (props.loading) {
    ElMessage.warning('正在处理中，请稍候...')
    return
  }

  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value || !formData.merchant_id) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    emit('submit', formData.merchant_id)
  } catch (error) {
    ElMessage.error('请检查表单信息')
  }
}
</script>

<style scoped>
.modal-content {
  padding: 0;
}

.info-section {
  margin-bottom: 24px;
}

.notice-list {
  margin: 0;
  padding-left: 20px;
}

.notice-list li {
  margin: 4px 0;
  color: #606266;
}

.merchant-option {
  padding: 4px 0;
}

.merchant-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.merchant-info {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 12px;
}

.contact {
  color: #67c23a;
}

.address {
  color: #909399;
}

.applied-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.applied-section h4 {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.applied-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.applied-tag {
  margin: 0;
}

.dialog-footer {
  text-align: right;
  padding-top: 20px;
}
</style>
