# 绿色智能船艇农文旅平台 - 前端开发指南

## 📦 项目概述

基于 Vue 3 + TypeScript + Element Plus + Vite 构建的现代化Web应用。

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
│   ├── auth/       # 认证相关组件
│   ├── NotificationCenter.vue       # 通知中心
│   ├── BoatServiceReviewDialog.vue  # 船艇服务评价对话框
│   ├── ProductReviewDialog.vue      # 商品评价对话框
│   └── ...
├── layouts/         # 布局组件
│   ├── UserLayout.vue      # 用户端布局
│   ├── MerchantLayout.vue  # 商家端布局
│   ├── CrewLayout.vue      # 船员端布局
│   └── AdminLayout.vue     # 管理员布局
├── router/          # 路由配置
├── services/        # API服务
│   └── api/        # 自动生成的API (通过openapi)
├── stores/          # Pinia状态管理
│   ├── auth.ts            # 认证状态
│   ├── notification.ts    # 通知状态
│   ├── merchant.ts        # 商家状态
│   └── ...
├── utils/           # 工具函数
│   ├── request.ts         # HTTP请求封装
│   └── websocket.ts       # WebSocket管理
├── views/           # 页面视图
│   ├── admin/      # 管理员页面
│   ├── merchant/   # 商家页面
│   ├── crew/       # 船员页面
│   ├── user/       # 用户页面
│   └── auth/       # 认证页面
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 🎯 核心功能

### 1. API自动生成

使用 OpenAPI 规范自动生成前端API客户端：

```bash
npm run openapi
```

这将根据后端的 OpenAPI 规范生成 `src/services/api/` 下的所有API文件。

**配置文件：** `openapi.config.js`

### 2. 路由系统

使用 Vue Router 4 实现多角色路由系统：

- `/` - 首页
- `/auth/*` - 认证相关（登录/注册）
- `/user/*` - 用户中心
- `/merchant/*` - 商家后台
- `/crew/*` - 船员工作台
- `/admin/*` - 管理员后台

**路由守卫：**
- 认证检查：未登录用户重定向到登录页
- 角色检查：根据用户角色访问对应页面
- 页面标题：自动设置浏览器标题

### 3. 状态管理

使用 Pinia 进行状态管理：

**主要 Store：**

```typescript
// 认证状态
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// 通知状态  
import { useNotificationStore } from '@/stores/notification'
const notificationStore = useNotificationStore()

// 商家状态
import { useMerchantStore } from '@/stores/merchant'
const merchantStore = useMerchantStore()
```

### 4. WebSocket 实时通知

**自动连接：**
用户登录后自动连接WebSocket，登出后自动断开。

**使用方法：**

```typescript
import { wsConnected, unreadCount } from '@/utils/websocket'

// 检查连接状态
console.log(wsConnected.value) // true/false

// 获取未读数量
console.log(unreadCount.value) // 数字
```

**配置：**
在 `.env.development` 中设置：
```env
VITE_WS_URL=ws://localhost:8000/api/v1/notifications/ws
```

### 5. 组件库

使用 Element Plus 作为UI组件库，通过 `unplugin-vue-components` 实现按需自动导入。

**自动导入配置：**
- Element Plus 组件自动导入
- Element Plus 图标自动导入
- Vue API 自动导入（ref, computed等）

### 6. 评价系统

**船艇服务评价：**

```vue
<template>
  <boat-service-review-dialog 
    ref="reviewDialog" 
    @success="handleSuccess" 
  />
</template>

<script setup>
import { ref } from 'vue'
import BoatServiceReviewDialog from '@/components/BoatServiceReviewDialog.vue'

const reviewDialog = ref()

function openReview(bookingId) {
  reviewDialog.value.open(bookingId)
}

function handleSuccess() {
  console.log('评价提交成功')
}
</script>
```

**农产品评价：**

```vue
<template>
  <product-review-dialog 
    ref="reviewDialog" 
    @success="handleSuccess" 
  />
</template>

<script setup>
import { ref } from 'vue'
import ProductReviewDialog from '@/components/ProductReviewDialog.vue'

const reviewDialog = ref()

function openReview(orderId, orderItemId) {
  reviewDialog.value.open(orderId, orderItemId)
}
</script>
```

## 🛠️ 开发工具

### TypeScript

项目使用 TypeScript 进行类型检查：

```bash
npm run type-check
```

### ESLint

代码风格检查和自动修复：

```bash
npm run lint
```

### Prettier

代码格式化：

```bash
npm run format
```

## 🎨 样式规范

### CSS 变量

使用 Element Plus 的 CSS 变量系统：

```css
.custom-class {
  color: var(--el-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
}
```

### 响应式设计

使用 Element Plus 的栅格系统：

```vue
<el-row :gutter="20">
  <el-col :xs="24" :sm="12" :md="8" :lg="6">
    <!-- 内容 -->
  </el-col>
</el-row>
```

## 📡 API 调用

### 基础用法

```typescript
import { getUsersApiV1UsersGet } from '@/services/api/users'

async function loadUsers() {
  try {
    const res = await getUsersApiV1UsersGet({
      page: 1,
      page_size: 20
    })
    
    if (res.data?.success) {
      const users = res.data.data.items
      console.log(users)
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}
```

### 错误处理

所有API请求都通过 `utils/request.ts` 统一处理：

- 自动添加 Authorization header
- 401 自动跳转登录
- 统一错误提示
- 请求/响应拦截器

## 🔐 认证系统

### Token 管理

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 登录
await authStore.login({
  username: 'user',
  password: 'password'
})

// 登出
authStore.logout()

// 检查认证状态
if (authStore.isAuthenticated) {
  console.log('已登录')
}

// 检查角色
if (authStore.isAdmin) {
  console.log('管理员')
}
```

### 路由守卫

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 需要登录
  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  // 角色检查
  if (to.meta?.requiredRole && authStore.user?.role !== to.meta.requiredRole) {
    next('/')
    return
  }
  
  next()
})
```

## 📊 数据可视化

使用 ECharts 进行数据可视化：

```vue
<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref()

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    // ECharts 配置
  })
})
</script>
```

## 🌐 国际化

项目使用 Element Plus 的中文语言包。

如需添加其他语言，修改 `main.ts`：

```typescript
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

app.use(ElementPlus, {
  locale: zhCn
})
```

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

生成的文件在 `dist/` 目录。

### 环境变量

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://api.your-domain.com
VITE_WS_URL=wss://api.your-domain.com/api/v1/notifications/ws
VITE_APP_TITLE=绿色智能船艇农文旅平台
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/boat-service-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📝 常见问题

### 1. API 404 错误

检查后端服务是否启动，以及 API Base URL 配置是否正确。

### 2. WebSocket 连接失败

- 检查后端 WebSocket 端点是否可用
- 确认 `VITE_WS_URL` 配置正确
- 开发环境使用 `ws://`，生产环境使用 `wss://`

### 3. 组件自动导入不生效

运行 `npm run dev` 会自动生成类型声明文件：
- `components.d.ts` - 组件类型
- `auto-imports.d.ts` - API类型

### 4. TypeScript 类型错误

重新生成API类型：

```bash
npm run openapi
npm run type-check
```

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)

## 📧 联系方式

如有问题，请联系开发团队。

---

**版本：** v2.0  
**最后更新：** 2025年

