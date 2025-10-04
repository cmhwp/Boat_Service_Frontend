// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取通知列表 获取当前用户的通知列表 GET /api/v1/notifications/ */
export async function getNotificationsApiV1NotificationsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationsApiV1NotificationsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/notifications/', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 20
      page_size: '20',
      ...params,
    },
    ...(options || {}),
  })
}

/** 删除通知 删除指定通知 DELETE /api/v1/notifications/${param0} */
export async function deleteNotificationApiV1NotificationsNotificationIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteNotificationApiV1NotificationsNotificationIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { notification_id: param0, ...queryParams } = params
  return request<API.ApiResponse>(`/api/v1/notifications/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 标记全部已读 标记所有通知为已读 POST /api/v1/notifications/mark-all-read */
export async function markAllNotificationsAsReadApiV1NotificationsMarkAllReadPost(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponse>('/api/v1/notifications/mark-all-read', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 标记通知为已读 标记指定通知为已读 POST /api/v1/notifications/mark-read */
export async function markNotificationsAsReadApiV1NotificationsMarkReadPost(
  body: API.NotificationMarkReadSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponse>('/api/v1/notifications/mark-read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取通知统计 获取通知统计信息 GET /api/v1/notifications/stats */
export async function getNotificationStatsApiV1NotificationsStatsGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponse>('/api/v1/notifications/stats', {
    method: 'GET',
    ...(options || {}),
  })
}
