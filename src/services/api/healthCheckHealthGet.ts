// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Health Check 健康检查 GET /health */
export async function healthCheckHealthGet(options?: { [key: string]: any }) {
  return request<any>('/health', {
    method: 'GET',
    ...(options || {}),
  })
}
