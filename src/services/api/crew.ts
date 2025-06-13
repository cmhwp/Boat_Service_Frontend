// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取船员详情 获取船员详情 GET /api/v1/crew/${param0} */
export async function getCrewDetailApiV1CrewCrewIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrewDetailApiV1CrewCrewIdGetParams,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewDetailSchema_>(`/api/v1/crew/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新船员信息 更新船员信息（仅商家）

- **boat_license**: 船员证号（可选）
- **status**: 状态（可选，active/inactive）
- **rating**: 评分（可选，0-5分）

只有商家可以更新自己旗下的船员信息 PUT /api/v1/crew/${param0} */
export async function updateCrewApiV1CrewCrewIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCrewApiV1CrewCrewIdPutParams,
  body: API.CrewUpdateSchema,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewResponseSchema_>(`/api/v1/crew/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 获取船员申请列表 获取商家的船员申请列表（仅商家） GET /api/v1/crew/applications */
export async function getCrewApplicationsApiV1CrewApplicationsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrewApplicationsApiV1CrewApplicationsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataCrewApplicationDetailSchema_>(
    '/api/v1/crew/applications',
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

/** 申请成为船员 申请加入商家成为船员

- **merchant_id**: 商家ID（必填）

用户向指定商家申请加入成为船员，需要等待商家处理
同一用户不能重复申请同一商家，如果之前被拒绝可以重新申请 POST /api/v1/crew/apply */
export async function applyCrewApiV1CrewApplyPost(
  body: API.CrewApplicationSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseCrewApplicationResponseSchema_>('/api/v1/crew/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 处理船员申请 处理船员申请（仅商家）

- **application_id**: 申请ID
- **status**: 处理结果（approved/rejected）
- **boat_license**: 船员证号（同意申请时必填）

只有商家可以处理向自己提交的船员申请
同意申请时需要提供船员证号，用户角色会自动更新为crew POST /api/v1/crew/handle-application */
export async function handleCrewApplicationApiV1CrewHandleApplicationPost(
  body: API.CrewApplicationHandleSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseCrewApplicationResponseSchema_>('/api/v1/crew/handle-application', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取船员列表 获取商家的船员列表（仅商家） GET /api/v1/crew/list */
export async function getCrewListApiV1CrewListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrewListApiV1CrewListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataCrewListItemSchema_>('/api/v1/crew/list', {
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

/** 获取我的船员信息 获取当前用户的船员信息 GET /api/v1/crew/me */
export async function getMyCrewInfoApiV1CrewMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseCrewDetailSchema_>('/api/v1/crew/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取可申请的商家列表 获取可申请的商家列表

- **page**: 页码（默认1）
- **page_size**: 每页数量（默认10，最大100）

返回所有审核通过（active状态）的商家列表，用户可以从中选择申请成为船员 GET /api/v1/crew/merchants */
export async function getAvailableMerchantsApiV1CrewMerchantsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAvailableMerchantsApiV1CrewMerchantsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataMerchantListItemSchema_>('/api/v1/crew/merchants', {
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

/** 获取我的申请列表 获取我的船员申请列表 GET /api/v1/crew/my-applications */
export async function getMyCrewApplicationsApiV1CrewMyApplicationsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyCrewApplicationsApiV1CrewMyApplicationsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataCrewApplicationDetailSchema_>(
    '/api/v1/crew/my-applications',
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

/** 船员离职 船员离职

船员主动离职，状态变为inactive
如果用户只是船员角色，用户角色会变回普通用户 POST /api/v1/crew/resign */
export async function resignCrewApiV1CrewResignPost(options?: { [key: string]: any }) {
  return request<API.ApiResponseDict_>('/api/v1/crew/resign', {
    method: 'POST',
    ...(options || {}),
  })
}
