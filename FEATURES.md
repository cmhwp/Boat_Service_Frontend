# 新功能使用指南

## 🎉 v2.0 新增功能

### 1. WebSocket 实时通知

系统已集成WebSocket实时通知功能，在用户登录后自动连接。

**功能特性：**
- 自动连接和断线重连
- 心跳保持连接
- 桌面通知推送
- 未读数量徽章提醒

**通知类型：**
- 预约相关：预约确认、预约取消、预约完成
- 订单相关：订单支付、订单发货、订单送达
- 船员相关：船员任务分配
- 评价相关：收到新评价、评价被回复
- 系统通知：重要系统消息

**使用位置：**
- 用户端：顶部导航栏右侧通知铃铛图标
- 商家端：顶部导航栏右侧通知铃铛图标  
- 船员端：顶部导航栏右侧通知铃铛图标

### 2. 船艇服务评价系统

用户在船艇服务完成后可以对服务进行评价。

**评价维度：**
- 服务质量评分（1-5星）
- 船艇状况评分（1-5星）
- 性价比评分（1-5星）

**额外功能：**
- 文字评价（最多500字）
- 评价标签（预设或自定义）
- 评价图片上传
- 商家回复功能
- 评价有帮助投票

**使用流程：**
1. 进入"我的预约"
2. 找到已完成的预约
3. 点击"评价服务"按钮
4. 填写评分和评价内容
5. 提交评价

**评价入口：**
- 用户端 > 我的预约 > 预约详情 > 评价服务按钮

### 3. 农产品评价系统

用户收到农产品订单后可以进行评价。

**评价维度：**
- 商品质量评分（1-5星）
- 新鲜程度评分（1-5星）
- 包装评分（1-5星）

**额外功能：**
- 文字评价（最多500字）
- 评价标签（预设或自定义）
- 评价图片上传
- 匿名评价选项
- 商家回复功能
- 评价有帮助投票

**使用流程：**
1. 进入"我的订单"
2. 找到已完成的订单
3. 点击商品的"评价"按钮
4. 填写评分和评价内容
5. 选择是否匿名
6. 提交评价

**评价入口：**
- 用户端 > 我的订单 > 订单详情 > 评价商品按钮

### 4. 分账系统

平台自动对预约服务和商品订单进行分账，按照预设比例分配收入。

**分账对象：**
- 平台（Platform）
- 商家（Merchant）
- 船员（Crew，仅限船艇预约）

**分账规则：**
- 船艇预约：平台10% + 商家70% + 船员20%
- 农产品订单：平台5% + 商家95%

**商家查看分账：**
1. 登录商家后台
2. 点击左侧菜单"分账记录"
3. 查看分账统计和明细
4. 支持按类型、状态、日期筛选

**分账状态：**
- 待分账（Pending）：已创建但未处理
- 已完成（Completed）：分账已完成
- 失败（Failed）：分账处理失败

### 5. 邮件通知增强

系统会在关键业务节点自动发送邮件通知。

**预约确认邮件：**
- 触发时机：商家确认预约后
- 邮件内容：预约详情、船艇信息、时间地点
- 样式：精美HTML模板

**订单发货邮件：**
- 触发时机：商家标记订单为"已发货"
- 邮件内容：订单详情、收货信息、商品清单
- 样式：精美HTML模板

## 📱 前端组件说明

### NotificationCenter 组件

**位置：** `src/components/NotificationCenter.vue`

**功能：**
- 显示实时通知列表
- 标记已读/未读
- 删除通知
- 跳转到相关页面

### BoatServiceReviewDialog 组件

**位置：** `src/components/BoatServiceReviewDialog.vue`

**使用方法：**
```vue
<template>
  <boat-service-review-dialog ref="reviewDialog" @success="handleReviewSuccess" />
  <el-button @click="openReview">评价服务</el-button>
</template>

<script setup>
import { ref } from 'vue'
import BoatServiceReviewDialog from '@/components/BoatServiceReviewDialog.vue'

const reviewDialog = ref()

function openReview() {
  reviewDialog.value.open(bookingId)
}

function handleReviewSuccess() {
  // 评价成功后的处理
  loadData()
}
</script>
```

### ProductReviewDialog 组件

**位置：** `src/components/ProductReviewDialog.vue`

**使用方法：**
```vue
<template>
  <product-review-dialog ref="reviewDialog" @success="handleReviewSuccess" />
  <el-button @click="openReview">评价商品</el-button>
</template>

<script setup>
import { ref } from 'vue'
import ProductReviewDialog from '@/components/ProductReviewDialog.vue'

const reviewDialog = ref()

function openReview() {
  reviewDialog.value.open(orderId, orderItemId)
}

function handleReviewSuccess() {
  // 评价成功后的处理
  loadData()
}
</script>
```

## 🔧 技术实现

### WebSocket 连接管理

**文件：** `src/utils/websocket.ts`

**核心功能：**
- 自动连接和重连机制
- 心跳保活
- 消息路由和处理
- 连接状态管理

### 通知Store

**文件：** `src/stores/notification.ts`

**功能：**
- 通知列表管理
- 未读数量统计
- 已读标记
- 通知删除

### API集成

**新增API模块：**
- `src/services/api/fenzhangguanli.ts` - 分账管理API
- `src/services/api/tongzhiguanli.ts` - 通知管理API
- `src/services/api/pingjiaguanli.ts` - 评价管理API

这些API通过`npm run openapi`命令自动生成，基于后端OpenAPI规范。

## 🎨 UI/UX改进

### 1. 通知中心
- 小红点未读提醒
- 下拉弹窗展示
- 分类图标显示
- 相对时间显示

### 2. 评价对话框
- 星级评分组件
- 标签快速选择
- 字数限制提示
- 友好的交互提示

### 3. 分账统计
- 统计卡片展示
- 图表可视化
- 筛选查询
- 分页展示

## 📝 环境变量配置

在`.env`文件中添加WebSocket配置：

```env
VITE_WS_URL=ws://localhost:8000/api/v1/notifications/ws
```

生产环境建议使用wss协议：

```env
VITE_WS_URL=wss://your-domain.com/api/v1/notifications/ws
```

## 🚀 部署注意事项

1. **WebSocket支持**：确保服务器和代理支持WebSocket协议
2. **CORS配置**：WebSocket连接需要正确的CORS设置
3. **邮件服务**：确保SMTP服务配置正确
4. **定时任务**：分账处理可能需要定时任务支持

## 📚 更多信息

- 后端API文档：访问 `/docs` 查看Swagger UI
- WebSocket协议：基于FastAPI WebSocket
- 评价系统：支持图片上传到腾讯云COS
- 分账系统：支持自定义分账规则

---

**版本：** v2.0  
**更新日期：** 2025年  
**维护者：** 开发团队

