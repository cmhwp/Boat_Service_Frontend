// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取分账记录列表（管理员） 获取分账记录列表 GET /api/v1/split-payments/ */
export async function getSplitPaymentsApiV1SplitPaymentsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSplitPaymentsApiV1SplitPaymentsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/split-payments/', {
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

/** 创建分账规则（管理员） 创建分账规则 POST /api/v1/split-payments/rules */
export async function createSplitRuleApiV1SplitPaymentsRulesPost(
  body: API.SplitRuleCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/split-payments/rules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取分账统计 获取分账统计（商家查看自己的，船员查看自己的，管理员查看全部） GET /api/v1/split-payments/stats */
export async function getSplitStatsApiV1SplitPaymentsStatsGet(options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/v1/split-payments/stats', {
    method: 'GET',
    ...(options || {}),
  })
}
