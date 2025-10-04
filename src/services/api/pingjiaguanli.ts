// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 标记评价有帮助 标记评价有帮助 POST /api/v1/reviews/${param0}/${param1}/helpful */
export async function markReviewHelpfulApiV1ReviewsReviewTypeReviewIdHelpfulPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.markReviewHelpfulApiV1ReviewsReviewTypeReviewIdHelpfulPostParams,
  options?: { [key: string]: any }
) {
  const { review_type: param0, review_id: param1, ...queryParams } = params
  return request<API.ApiResponse>(`/api/v1/reviews/${param0}/${param1}/helpful`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取船艇服务评价列表 获取船艇服务评价列表（公开） GET /api/v1/reviews/boat-service */
export async function getBoatServiceReviewsApiV1ReviewsBoatServiceGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBoatServiceReviewsApiV1ReviewsBoatServiceGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/reviews/boat-service', {
    method: 'GET',
    params: {
      // sort_by has a default value: created_at
      sort_by: 'created_at',
      // sort_order has a default value: desc
      sort_order: 'desc',
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 创建船艇服务评价 创建船艇服务评价（用户完成预约后） POST /api/v1/reviews/boat-service */
export async function createBoatServiceReviewApiV1ReviewsBoatServicePost(
  body: API.BoatServiceReviewCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/reviews/boat-service', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 回复船艇服务评价 商家回复船艇服务评价 POST /api/v1/reviews/boat-service/${param0}/reply */
export async function replyBoatServiceReviewApiV1ReviewsBoatServiceReviewIdReplyPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.replyBoatServiceReviewApiV1ReviewsBoatServiceReviewIdReplyPostParams,
  body: API.MerchantReplySchema,
  options?: { [key: string]: any }
) {
  const { review_id: param0, ...queryParams } = params
  return request<API.ApiResponse>(`/api/v1/reviews/boat-service/${param0}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 获取农产品评价列表 获取农产品评价列表（公开） GET /api/v1/reviews/product */
export async function getProductReviewsApiV1ReviewsProductGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductReviewsApiV1ReviewsProductGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/reviews/product', {
    method: 'GET',
    params: {
      // sort_by has a default value: created_at
      sort_by: 'created_at',
      // sort_order has a default value: desc
      sort_order: 'desc',
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 创建农产品评价 创建农产品评价（用户收货后） POST /api/v1/reviews/product */
export async function createProductReviewApiV1ReviewsProductPost(
  body: API.ProductReviewCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/reviews/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 回复农产品评价 商家回复农产品评价 POST /api/v1/reviews/product/${param0}/reply */
export async function replyProductReviewApiV1ReviewsProductReviewIdReplyPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.replyProductReviewApiV1ReviewsProductReviewIdReplyPostParams,
  body: API.MerchantReplySchema,
  options?: { [key: string]: any }
) {
  const { review_id: param0, ...queryParams } = params
  return request<API.ApiResponse>(`/api/v1/reviews/product/${param0}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}
