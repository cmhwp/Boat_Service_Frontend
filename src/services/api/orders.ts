// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取订单详情 获取订单详情

只有订单用户可以查看详情 GET /api/v1/orders/${param0} */
export async function getOrderDetailApiV1OrdersOrderIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderDetailApiV1OrdersOrderIdGetParams,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderDetailSchema_>(`/api/v1/orders/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 取消订单 取消订单（用户操作）

- **cancel_reason**: 取消原因（必填）

限制条件：
- 只能取消待支付状态的订单
- 只能取消自己的订单 PATCH /api/v1/orders/${param0}/cancel */
export async function cancelOrderApiV1OrdersOrderIdCancelPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelOrderApiV1OrdersOrderIdCancelPatchParams,
  body: string,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponseSchema_>(`/api/v1/orders/${param0}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 更新订单状态 更新订单状态（商家操作）

- **status**: 订单状态（必填）
- **merchant_notes**: 商家备注（可选）
- **cancel_reason**: 取消原因（取消时必填）

状态转换规则：
- paid -> shipped/cancelled
- shipped -> delivered
- delivered -> completed

取消已支付订单会自动恢复库存 PATCH /api/v1/orders/${param0}/status */
export async function updateOrderStatusApiV1OrdersOrderIdStatusPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateOrderStatusApiV1OrdersOrderIdStatusPatchParams,
  body: API.OrderStatusUpdateSchema,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponseSchema_>(`/api/v1/orders/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 立即购买创建订单 立即购买创建订单（跳过购物车）

- **product_id**: 商品ID（必填）
- **quantity**: 数量（必填）
- **receiver_name**: 收货人姓名（必填）
- **receiver_phone**: 收货人电话（必填）
- **receiver_address**: 收货地址（必填）
- **user_notes**: 用户备注（可选）

适用于直接下单的场景，跳过购物车步骤 POST /api/v1/orders/direct */
export async function createDirectOrderApiV1OrdersDirectPost(
  body: API.DirectOrderCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseOrderResponseSchema_>('/api/v1/orders/direct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 从购物车创建订单 从购物车创建订单

- **cart_item_ids**: 购物车商品ID列表（必填）
- **receiver_name**: 收货人姓名（必填）
- **receiver_phone**: 收货人电话（必填）
- **receiver_address**: 收货地址（必填）
- **user_notes**: 用户备注（可选）

系统会自动验证：
- 购物车商品存在且可购买
- 同一订单只能包含同一商家商品
- 库存充足性检查
- 自动计算金额和运费 POST /api/v1/orders/from-cart */
export async function createOrderFromCartApiV1OrdersFromCartPost(
  body: API.OrderCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseOrderResponseSchema_>('/api/v1/orders/from-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取商家订单列表 获取商家订单列表（商家端）

包含完整的订单信息和用户数据 GET /api/v1/orders/merchant/list */
export async function getMerchantOrdersApiV1OrdersMerchantListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantOrdersApiV1OrdersMerchantListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataOrderDetailSchema_>('/api/v1/orders/merchant/list', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',

      ...params,
    },
    ...(options || {}),
  })
}

/** 获取订单统计 获取商家订单统计数据

包括：
- 各状态订单数量
- 订单总金额
- 已收款金额 GET /api/v1/orders/merchant/stats */
export async function getOrderStatsApiV1OrdersMerchantStatsGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseOrderStatsSchema_>('/api/v1/orders/merchant/stats', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取我的订单列表 获取当前用户的订单列表

支持按状态、日期过滤和分页查询 GET /api/v1/orders/my */
export async function getMyOrdersApiV1OrdersMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyOrdersApiV1OrdersMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataOrderListItemSchema_>('/api/v1/orders/my', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',

      ...params,
    },
    ...(options || {}),
  })
}

/** 创建支付 创建支付（模拟支付）

- **order_id**: 订单ID（必填）
- **payment_method**: 支付方式（必填）

支持的支付方式：
- alipay: 支付宝
- wechat: 微信支付
- bankcard: 银行卡
- balance: 余额支付

模拟支付有90%成功率，支付成功后自动扣减库存 POST /api/v1/orders/payment */
export async function createPaymentApiV1OrdersPaymentPost(
  body: API.PaymentCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaymentResponseSchema_>('/api/v1/orders/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
