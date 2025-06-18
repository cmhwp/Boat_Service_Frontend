// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取购物车商品列表 获取用户购物车商品列表

返回信息包括：
- 购物车商品列表
- 总金额（仅计算可购买商品）
- 商品总数量
- 自动处理缺货和下架商品 GET /api/v1/cart/ */
export async function getCartItemsApiV1CartGet(options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/v1/cart/', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 添加商品到购物车 添加商品到购物车

- **product_id**: 商品ID（必填）
- **quantity**: 数量（必填，1-999）

系统会自动验证：
- 商品是否存在且可购买
- 库存是否充足
- 如果购物车中已有相同商品，则累加数量 POST /api/v1/cart/ */
export async function addToCartApiV1CartPost(
  body: API.CartAddSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseCartItemResponseSchema_>('/api/v1/cart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 清空购物车 清空用户购物车中的所有商品

返回删除的商品数量 DELETE /api/v1/cart/ */
export async function clearCartApiV1CartDelete(options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/v1/cart/', {
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 更新购物车商品数量 更新购物车中指定商品的数量

- **quantity**: 新的数量（必填，1-999）

限制条件：
- 只能修改当前用户的购物车商品
- 数量不能超过库存
- 商品必须是可购买状态 PUT /api/v1/cart/${param0} */
export async function updateCartItemApiV1CartCartItemIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCartItemApiV1CartCartItemIdPutParams,
  body: API.CartUpdateSchema,
  options?: { [key: string]: any }
) {
  const { cart_item_id: param0, ...queryParams } = params
  return request<API.ApiResponseCartItemResponseSchema_>(`/api/v1/cart/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除购物车商品 从购物车中删除指定商品

只能删除当前用户的购物车商品 DELETE /api/v1/cart/${param0} */
export async function removeCartItemApiV1CartCartItemIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeCartItemApiV1CartCartItemIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { cart_item_id: param0, ...queryParams } = params
  return request<API.ApiResponse>(`/api/v1/cart/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 批量删除购物车商品 批量删除购物车中的多个商品

- **cart_item_ids**: 购物车项ID列表（必填）

只能删除当前用户的购物车商品 DELETE /api/v1/cart/batch */
export async function batchRemoveCartItemsApiV1CartBatchDelete(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/cart/batch', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取购物车统计 获取购物车统计信息

返回信息包括：
- 购物车商品总数
- 可购买商品数量
- 可购买商品总金额
- 是否有不可购买商品 GET /api/v1/cart/stats */
export async function getCartStatsApiV1CartStatsGet(options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/v1/cart/stats', {
    method: 'GET',
    ...(options || {}),
  })
}
