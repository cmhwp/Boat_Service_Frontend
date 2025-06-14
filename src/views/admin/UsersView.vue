<template>
  <div class="users-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <p class="page-description">管理系统中的所有用户信息</p>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="search-card" shadow="never">
      <div class="search-form-container">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="用户名/邮箱">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索用户名或邮箱"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="用户角色">
            <el-select
              v-model="searchForm.role"
              placeholder="选择角色"
              clearable
              @change="handleSearch"
              style="width: 120px"
            >
              <el-option label="用户" value="user" />
              <el-option label="船员" value="crew" />
              <el-option label="商家" value="merchant" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>
          <el-form-item label="实名状态">
            <el-select
              v-model="searchForm.realnameStatus"
              placeholder="实名状态"
              clearable
              @change="handleSearch"
              style="width: 120px"
            >
              <el-option label="未认证" value="unverified" />
              <el-option label="审核中" value="pending" />
              <el-option label="已认证" value="verified" />
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态">
            <el-select
              v-model="searchForm.isActive"
              placeholder="账户状态"
              clearable
              @change="handleSearch"
              style="width: 120px"
            >
              <el-option label="激活" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" :loading="loading">
              <el-icon><search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户列表</span>
          <div class="card-extra">
            <el-button @click="handleRefresh" :loading="loading">
              <el-icon><refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="userList"
        v-loading="loading"
        element-loading-text="加载中..."
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :src="row.avatar" :size="40" style="margin-right: 12px">
                <el-icon><user /></el-icon>
              </el-avatar>
              <div>
                <div class="username">{{ row.username }}</div>
                <div class="email">{{ row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="手机号" width="130">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)" size="small">
              {{ getRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="实名状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getRealnameStatusTagType(row.realname_status)" size="small">
              {{ getRealnameStatusText(row.realname_status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="账户状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'" size="small">
              {{ row.is_active ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)" link>
              <el-icon><edit /></el-icon>
              编辑
            </el-button>
            <el-button
              :type="row.is_active ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
              link
            >
              <el-icon><switch /></el-icon>
              {{ row.is_active ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" link>
              <el-icon><delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialog.visible"
      :title="editDialog.isEdit ? '编辑用户' : '新增用户'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editDialog.form"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editDialog.form.username" disabled />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="editDialog.form.email" disabled />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editDialog.form.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="用户角色" prop="role">
          <el-select v-model="editDialog.form.role" placeholder="选择角色">
            <el-option label="用户" value="user" />
            <el-option label="船员" value="crew" />
            <el-option label="商家" value="merchant" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item label="实名状态" prop="realname_status">
          <el-select v-model="editDialog.form.realname_status" placeholder="选择实名状态">
            <el-option label="未认证" value="unverified" />
            <el-option label="审核中" value="pending" />
            <el-option label="已认证" value="verified" />
          </el-select>
        </el-form-item>

        <el-form-item label="账户状态" prop="is_active">
          <el-switch v-model="editDialog.form.is_active" active-text="正常" inactive-text="禁用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser" :loading="editDialog.loading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Edit, Delete, User, Switch } from '@element-plus/icons-vue'
import {
  getUsersListApiV1UsersGet,
  updateUserApiV1UsersUserIdPut,
  deleteUserApiV1UsersUserIdDelete,
} from '@/services/api/users'
import dayjs from 'dayjs'

// 响应式数据
const loading = ref(false)
const userList = ref<API.UserResponseSchema[]>([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  role: '',
  realnameStatus: '',
  isActive: undefined as boolean | undefined,
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 编辑对话框
const editDialog = reactive({
  visible: false,
  loading: false,
  isEdit: true,
  form: {
    id: 0,
    username: '',
    email: '',
    phone: '',
    role: 'user' as API.UserRole,
    realname_status: 'unverified' as API.RealnameStatus,
    is_active: true,
  },
})

const editFormRef = ref()

// 表单验证规则
const editFormRules = {
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
  realname_status: [{ required: true, message: '请选择实名状态', trigger: 'change' }],
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
    }

    const response = await getUsersListApiV1UsersGet(params)
    console.log(response)
    if (response.data.success && response.data) {
      userList.value = response.data.data?.items ?? []
      pagination.total = response.data.data?.total ?? 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    role: '',
    realnameStatus: '',
    isActive: undefined,
  })
  handleSearch()
}

// 刷新列表
const handleRefresh = () => {
  fetchUserList()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchUserList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchUserList()
}

// 编辑用户
const handleEdit = (user: API.UserResponseSchema) => {
  editDialog.form = {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    realname_status: user.realname_status,
    is_active: user.is_active,
  }
  editDialog.isEdit = true
  editDialog.visible = true
}

// 切换用户状态
const handleToggleStatus = (user: API.UserResponseSchema) => {
  const action = user.is_active ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}用户 "${user.username}" 吗？`, '确认操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const updateData: API.UserUpdateSchema = {
        is_active: !user.is_active,
      }
      await updateUserApiV1UsersUserIdPut({ user_id: user.id }, updateData)
      ElMessage.success(`${action}成功`)
      await fetchUserList()
    } catch (error) {
      console.error(`${action}用户失败:`, error)
      ElMessage.error(`${action}失败`)
    }
  })
}

// 删除用户
const handleDelete = (user: API.UserResponseSchema) => {
  ElMessageBox.confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复！`, '确认删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUserApiV1UsersUserIdDelete({ user_id: user.id })
      ElMessage.success('删除成功')
      await fetchUserList()
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 保存用户
const handleSaveUser = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    editDialog.loading = true

    const updateData: API.UserUpdateSchema = {
      phone: editDialog.form.phone || null,
      role: editDialog.form.role,
      realname_status: editDialog.form.realname_status,
      is_active: editDialog.form.is_active,
    }

    await updateUserApiV1UsersUserIdPut({ user_id: editDialog.form.id }, updateData)
    ElMessage.success('保存成功')
    editDialog.visible = false
    await fetchUserList()
  } catch (error) {
    console.error('保存用户失败:', error)
    ElMessage.error('保存失败')
  } finally {
    editDialog.loading = false
  }
}

// 工具函数
const getRoleText = (role: API.UserRole) => {
  const roleMap = {
    user: '用户',
    crew: '船员',
    merchant: '商家',
    admin: '管理员',
  }
  return roleMap[role] || role
}

const getRoleTagType = (role: API.UserRole) => {
  const typeMap = {
    user: '',
    crew: 'success',
    merchant: 'warning',
    admin: 'danger',
  }
  return typeMap[role] || ''
}

const getRealnameStatusText = (status: API.RealnameStatus) => {
  const statusMap = {
    unverified: '未认证',
    pending: '审核中',
    verified: '已认证',
  }
  return statusMap[status] || status
}

const getRealnameStatusTagType = (status: API.RealnameStatus) => {
  const typeMap = {
    unverified: 'info',
    pending: 'warning',
    verified: 'success',
  }
  return typeMap[status] || 'info'
}

const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

// 生命周期
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.users-management {
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

.search-card {
  margin-bottom: 16px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-form-container {
  overflow-x: auto;
  overflow-y: hidden;
}

.search-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 16px;
  min-width: max-content;
  padding: 0;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 0;
  white-space: nowrap;
}

.table-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.card-extra {
  display: flex;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.email {
  font-size: 12px;
  color: #6b7280;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-table) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
}

:deep(.el-dialog__body) {
  padding: 10px 20px 20px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
