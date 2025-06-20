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

/** 确认收货 用户确认收货

- **order_id**: 订单ID（路径参数）
- **user_notes**: 用户备注（可选）

限制条件：
- 只能确认已送达状态的订单
- 只能确认自己的订单
- 确认收货后订单状态变为已完成

业务说明：
- 确认收货是订单流程的最后一步
- 确认后订单不可再修改状态
- 可以添加收货备注（如商品质量、服务评价等） PATCH /api/v1/orders/${param0}/confirm-receipt */
export async function confirmReceiptApiV1OrdersOrderIdConfirmReceiptPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.confirmReceiptApiV1OrdersOrderIdConfirmReceiptPatchParams,
  body: string | null,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponseSchema_>(`/api/v1/orders/${param0}/confirm-receipt`, {
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

/** 管理员获取订单详情 管理员获取订单详情

包含完整的订单信息、用户信息、商家信息、支付记录等 GET /api/v1/orders/admin/${param0} */
export async function adminGetOrderDetailApiV1OrdersAdminOrderIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminGetOrderDetailApiV1OrdersAdminOrderIdGetParams,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseAdminOrderDetailSchema_>(`/api/v1/orders/admin/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 管理员操作订单 管理员操作订单

- **operation**: 操作类型（必填）
  - force_cancel: 强制取消订单
  - refund: 处理退款
- **reason**: 操作原因（必填）
- **notes**: 管理员备注（可选）

支持的操作：
- 强制取消：可取消除已完成外的任何状态订单，已支付订单会恢复库存
- 处理退款：只能对已支付订单操作，会恢复库存并设置为退款状态 POST /api/v1/orders/admin/${param0}/operate */
export async function adminOperateOrderApiV1OrdersAdminOrderIdOperatePost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminOperateOrderApiV1OrdersAdminOrderIdOperatePostParams,
  body: API.AdminOrderOperationSchema,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponseSchema_>(`/api/v1/orders/admin/${param0}/operate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 管理员获取所有订单 管理员获取所有订单列表

- **status**: 状态过滤（可选）
- **start_date**: 开始日期（可选）
- **end_date**: 结束日期（可选）
- **merchant_id**: 商家ID过滤（可选）
- **user_id**: 用户ID过滤（可选）
- **order_number**: 订单号搜索（可选）

包含用户信息、商家信息、支付信息等完整数据 GET /api/v1/orders/admin/all */
export async function adminGetAllOrdersApiV1OrdersAdminAllGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminGetAllOrdersApiV1OrdersAdminAllGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataAdminOrderListItemSchema_>(
    '/api/v1/orders/admin/all',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // page_size has a default value: 10
        page_size: '10',

        ...params,
      },
      ...(options || {}),
    }
  )
}

/** 管理员获取平台订单统计 管理员获取平台订单统计

包含：
- 各状态订单数量统计
- 总金额和已支付金额
- 平台抽成和商家收入统计 GET /api/v1/orders/admin/statistics */
export async function adminGetOrderStatisticsApiV1OrdersAdminStatisticsGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseDict_>('/api/v1/orders/admin/statistics', {
    method: 'GET',
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

/** 获取商家订单详情 获取商家订单详情（商家端）

- **order_id**: 订单ID

只能查看属于当前商家的订单详情，包含：
- 完整的订单信息
- 用户信息
- 订单项目详情
- 支付信息
- 物流状态等 GET /api/v1/orders/merchant/${param0} */
export async function getMerchantOrderDetailApiV1OrdersMerchantOrderIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantOrderDetailApiV1OrdersMerchantOrderIdGetParams,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderDetailSchema_>(`/api/v1/orders/merchant/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
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

/** 获取订单统计 获取商家订单统计

包含各状态订单数量、金额统计等 GET /api/v1/orders/merchant/stats */
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
  return request<API.app_schemas_response_ApiResponsePaymentResponseSchema_2>(
    '/api/v1/orders/payment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  )
}
