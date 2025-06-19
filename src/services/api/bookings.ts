// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 创建船艇预约 创建船艇预约（用户端）

- **boat_id**: 船只ID（必填）
- **start_time**: 开始时间（必填）
- **end_time**: 结束时间（必填）
- **passenger_count**: 乘客人数（必填）
- **contact_name**: 联系人姓名（必填）
- **contact_phone**: 联系电话（必填）
- **user_notes**: 用户备注（可选）

系统会自动验证：
- 船只可用性和载客量限制
- 时间冲突检测
- 商家审核状态
- 自动计算费用 POST /api/v1/bookings/ */
export async function createBookingApiV1BookingsPost(
  body: API.BookingCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseBookingResponseSchema_>('/api/v1/bookings/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取预约详情 获取预约详情

只有预约用户和所属商家可以查看详情 GET /api/v1/bookings/${param0} */
export async function getBookingDetailApiV1BookingsBookingIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBookingDetailApiV1BookingsBookingIdGetParams,
  options?: { [key: string]: any }
) {
  const { booking_id: param0, ...queryParams } = params
  return request<API.ApiResponseBookingDetailSchema_>(`/api/v1/bookings/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 取消预约 取消预约（用户端）

限制条件：
- 只能取消待确认或已确认状态的预约
- 开始前2小时内无法取消 PATCH /api/v1/bookings/${param0}/cancel */
export async function cancelBookingApiV1BookingsBookingIdCancelPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelBookingApiV1BookingsBookingIdCancelPatchParams,
  body: string | null,
  options?: { [key: string]: any }
) {
  const { booking_id: param0, ...queryParams } = params
  return request<API.ApiResponseBookingResponseSchema_>(`/api/v1/bookings/${param0}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 更新预约状态 更新预约状态（商家端）

- **status**: 预约状态（必填）
- **merchant_notes**: 商家备注（可选）
- **cancel_reason**: 取消原因（取消时必填）

状态转换规则：
- pending -> confirmed/rejected
- confirmed -> in_progress/cancelled  
- in_progress -> completed PATCH /api/v1/bookings/${param0}/status */
export async function updateBookingStatusApiV1BookingsBookingIdStatusPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBookingStatusApiV1BookingsBookingIdStatusPatchParams,
  body: API.BookingStatusUpdateSchema,
  options?: { [key: string]: any }
) {
  const { booking_id: param0, ...queryParams } = params
  return request<API.ApiResponseBookingResponseSchema_>(`/api/v1/bookings/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 获取所有预约列表 获取所有预约列表（管理员端）

管理员可以查看所有商家的预约数据 GET /api/v1/bookings/admin/all */
export async function getAllBookingsApiV1BookingsAdminAllGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllBookingsApiV1BookingsAdminAllGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataBookingDetailSchema_>('/api/v1/bookings/admin/all', {
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

/** 手动触发自动取消超时预约 手动触发自动取消超时预约任务（管理员端）

将所有状态为待确认且创建时间超过20分钟的预约自动取消。

系统每5分钟会自动执行一次此任务，此接口用于手动立即执行。

返回信息：
- cancelled_count: 取消的预约数量
- cancelled_bookings: 被取消的预约详情列表（包含等待时间）
- total_expired: 总共找到的超时预约数量 POST /api/v1/bookings/admin/auto-cancel */
export async function manualAutoCancelExpiredBookingsApiV1BookingsAdminAutoCancelPost(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponse>('/api/v1/bookings/admin/auto-cancel', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 派单给船员 将预约派单给船员（商家端）

- **booking_id**: 预约ID（必填）
- **crew_id**: 船员ID（必填）
- **notes**: 派单备注（可选）

限制条件：
- 只能派单给已确认的预约
- 船员必须属于当前商家
- 船员在该时间段不能有冲突任务 POST /api/v1/bookings/assign-crew */
export async function assignCrewApiV1BookingsAssignCrewPost(
  body: API.CrewAssignmentSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseBookingResponseSchema_>('/api/v1/bookings/assign-crew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 检查船只可用性 检查船只在指定时间段的可用性

返回信息包括：
- 是否可用
- 不可用原因
- 冲突预约列表 GET /api/v1/bookings/availability */
export async function checkBoatAvailabilityApiV1BookingsAvailabilityGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkBoatAvailabilityApiV1BookingsAvailabilityGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseBookingAvailabilityResponseSchema_>(
    '/api/v1/bookings/availability',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  )
}

/** 获取船员任务统计 获取船员任务统计数据

包括：
- 各状态任务数量统计
- 总收入和本月收入
- 平均评分
- 服务完成情况

注：收入按60%分成计算 GET /api/v1/bookings/crew/stats */
export async function getCrewTaskStatsApiV1BookingsCrewStatsGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseCrewTaskStatsSchema_>('/api/v1/bookings/crew/stats', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取船员任务列表 获取船员任务列表（船员端）

支持按状态、日期等条件过滤 GET /api/v1/bookings/crew/tasks */
export async function getCrewTasksApiV1BookingsCrewTasksGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrewTasksApiV1BookingsCrewTasksGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataCrewTaskListItemSchema_>(
    '/api/v1/bookings/crew/tasks',
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

/** 获取船员任务详情 获取船员任务详情

包含完整的任务信息、客户信息、船只信息等 GET /api/v1/bookings/crew/tasks/${param0} */
export async function getCrewTaskDetailApiV1BookingsCrewTasksBookingIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrewTaskDetailApiV1BookingsCrewTasksBookingIdGetParams,
  options?: { [key: string]: any }
) {
  const { booking_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewTaskDetailSchema_>(`/api/v1/bookings/crew/tasks/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新任务状态 更新船员任务状态（船员端）

- **status**: 任务状态（必填，只能是in_progress或completed）
- **notes**: 船员备注（可选）

状态转换规则：
- confirmed -> in_progress（开始服务）
- in_progress -> completed（完成服务）

限制条件：
- 开始服务：需要在预约时间前30分钟内
- 完成服务：只能完成进行中的任务 PATCH /api/v1/bookings/crew/tasks/${param0}/status */
export async function updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatchParams,
  body: API.CrewTaskStatusUpdateSchema,
  options?: { [key: string]: any }
) {
  const { booking_id: param0, ...queryParams } = params
  return request<API.ApiResponseBookingResponseSchema_>(
    `/api/v1/bookings/crew/tasks/${param0}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  )
}

/** 获取船员今日任务 获取船员今日任务列表

返回今天需要执行的所有已确认和进行中的任务 GET /api/v1/bookings/crew/tasks/today */
export async function getCrewTodayTasksApiV1BookingsCrewTasksTodayGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseListCrewTaskListItemSchema_>('/api/v1/bookings/crew/tasks/today', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取商家预约列表 获取商家预约列表（商家端）

包含完整的预约信息和关联数据 GET /api/v1/bookings/merchant/list */
export async function getMerchantBookingsApiV1BookingsMerchantListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantBookingsApiV1BookingsMerchantListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataBookingDetailSchema_>(
    '/api/v1/bookings/merchant/list',
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

/** 获取预约统计数据 获取商家预约统计数据

包括：
- 各状态预约数量
- 总收入统计
- 平均评分 GET /api/v1/bookings/merchant/stats */
export async function getBookingStatsApiV1BookingsMerchantStatsGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseBookingStatsSchema_>('/api/v1/bookings/merchant/stats', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取我的预约列表 获取当前用户的预约列表

支持按状态、日期、船只等条件过滤 GET /api/v1/bookings/my */
export async function getMyBookingsApiV1BookingsMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyBookingsApiV1BookingsMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataBookingListItemSchema_>('/api/v1/bookings/my', {
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

/** 创建船员评价 对船员进行评价（用户端）

- **booking_id**: 预约ID（必填）
- **rating**: 评分1-5（必填）
- **comment**: 评价内容（可选）

限制条件：
- 只能评价已完成的预约
- 预约必须有指派船员
- 每个预约只能评价一次 POST /api/v1/bookings/ratings */
export async function createCrewRatingApiV1BookingsRatingsPost(
  body: API.CrewRatingCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseCrewRatingResponseSchema_>('/api/v1/bookings/ratings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取预约评价 获取指定预约的评价信息 GET /api/v1/bookings/ratings/${param0} */
export async function getBookingRatingApiV1BookingsRatingsBookingIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBookingRatingApiV1BookingsRatingsBookingIdGetParams,
  options?: { [key: string]: any }
) {
  const { booking_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewRatingResponseSchema_>(`/api/v1/bookings/ratings/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}
