<template>
  <el-dialog
    v-model="visible"
    title="评价船艇服务"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="服务质量" prop="service_rating">
        <el-rate
          v-model="form.service_rating"
          :texts="['非常差', '差', '一般', '好', '非常好']"
          show-text
        />
      </el-form-item>

      <el-form-item label="船艇状况" prop="boat_rating">
        <el-rate
          v-model="form.boat_rating"
          :texts="['非常差', '差', '一般', '好', '非常好']"
          show-text
        />
      </el-form-item>

      <el-form-item label="性价比" prop="value_rating">
        <el-rate
          v-model="form.value_rating"
          :texts="['非常差', '差', '一般', '好', '非常好']"
          show-text
        />
      </el-form-item>

      <el-form-item label="评价内容">
        <el-input
          v-model="form.comment"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
          placeholder="分享您的体验..."
        />
      </el-form-item>

      <el-form-item label="评价标签">
        <div class="tags-container">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            class="tag-item"
            @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="showTagInput"
            ref="tagInputRef"
            v-model="newTag"
            size="small"
            style="width: 100px"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <el-button
            v-else
            size="small"
            @click="showTagInput = true"
          >
            + 添加标签
          </el-button>
        </div>
        <div class="preset-tags">
          <span class="preset-label">常用标签：</span>
          <el-tag
            v-for="tag in presetTags"
            :key="tag"
            size="small"
            class="preset-tag"
            @click="addPresetTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        提交评价
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createBoatServiceReviewApiV1ReviewsBoatServicePost } from '@/services/api/pingjiaguanli'

const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const bookingId = ref(0)

const form = reactive({
  booking_id: 0,
  service_rating: 5,
  boat_rating: 5,
  value_rating: 5,
  comment: '',
  tags: [] as string[]
})

const rules: FormRules = {
  service_rating: [
    { required: true, message: '请评分', trigger: 'change' }
  ],
  boat_rating: [
    { required: true, message: '请评分', trigger: 'change' }
  ],
  value_rating: [
    { required: true, message: '请评分', trigger: 'change' }
  ]
}

// 标签相关
const showTagInput = ref(false)
const newTag = ref('')
const tagInputRef = ref()
const presetTags = ['服务好', '船新', '船长专业', '风景美', '性价比高', '准时', '安全']

function open(id: number) {
  bookingId.value = id
  form.booking_id = id
  visible.value = true
}

function handleClose() {
  formRef.value?.resetFields()
  form.comment = ''
  form.tags = []
  form.service_rating = 5
  form.boat_rating = 5
  form.value_rating = 5
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
    form.tags.push(tag)
  }
  newTag.value = ''
  showTagInput.value = false
}

function addPresetTag(tag: string) {
  if (!form.tags.includes(tag) && form.tags.length < 5) {
    form.tags.push(tag)
  }
}

async function handleSubmit() {
  await formRef.value?.validate()

  submitting.value = true
  try {
    await createBoatServiceReviewApiV1ReviewsBoatServicePost(form as any)
    ElMessage.success('评价提交成功！')
    visible.value = false
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin: 0;
}

.preset-tags {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.preset-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.preset-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.preset-tag:hover {
  transform: scale(1.05);
}
</style>

