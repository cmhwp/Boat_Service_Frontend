// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 添加船只 添加船只（商家端）

- **name**: 船只名称（必填，最大100字符）
- **license_number**: 船只证书号（必填，最大50字符，唯一）
- **boat_type**: 船只类型（默认观光船）
- **capacity**: 载客量（必填，1-100人）
- **hourly_rate**: 小时费率（必填，大于0）
- **description**: 船只描述（可选）
- **images**: 船只图片列表（可选，最多10张）
- **current_location**: 当前位置（可选）

只有审核通过的商家才能添加船只 POST /api/v1/boats/ */
export async function createBoatApiV1BoatsPost(
  body: API.BoatCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseBoatResponseSchema_>('/api/v1/boats/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取船只详情 获取船只详情（用户端） GET /api/v1/boats/${param0} */
export async function getBoatDetailApiV1BoatsBoatIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBoatDetailApiV1BoatsBoatIdGetParams,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatDetailSchema_>(`/api/v1/boats/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取可用船只列表 获取可用船只列表（用户端）

- **boat_type**: 船只类型过滤（可选）
- **min_capacity**: 最小载客量（可选）
- **max_hourly_rate**: 最大小时费率（可选）

只显示状态为可用且所属商家已审核通过的船只 GET /api/v1/boats/available */
export async function getAvailableBoatsApiV1BoatsAvailableGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAvailableBoatsApiV1BoatsAvailableGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataBoatListItemSchema_>('/api/v1/boats/available', {
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

/** 获取我的船只列表 获取我的船只列表（商家端） GET /api/v1/boats/my */
export async function getMyBoatsApiV1BoatsMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyBoatsApiV1BoatsMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataBoatListItemSchema_>('/api/v1/boats/my', {
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

/** 获取我的船只详情 获取我的船只详情（商家端） GET /api/v1/boats/my/${param0} */
export async function getMyBoatDetailApiV1BoatsMyBoatIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyBoatDetailApiV1BoatsMyBoatIdGetParams,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatDetailSchema_>(`/api/v1/boats/my/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新我的船只信息 更新我的船只信息（商家端）

- **name**: 船只名称（可选）
- **boat_type**: 船只类型（可选）
- **capacity**: 载客量（可选）
- **hourly_rate**: 小时费率（可选）
- **description**: 船只描述（可选）
- **images**: 船只图片列表（可选）
- **current_location**: 当前位置（可选）
- **status**: 状态（可选） PUT /api/v1/boats/my/${param0} */
export async function updateMyBoatApiV1BoatsMyBoatIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMyBoatApiV1BoatsMyBoatIdPutParams,
  body: API.BoatUpdateSchema,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatResponseSchema_>(`/api/v1/boats/my/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除我的船只 删除我的船只（商家端） DELETE /api/v1/boats/my/${param0} */
export async function deleteMyBoatApiV1BoatsMyBoatIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMyBoatApiV1BoatsMyBoatIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/boats/my/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新船只状态 更新船只状态（商家端）

- **status**: 状态（必填）
- **current_location**: 当前位置（可选）

可用状态：available（可用）、in_use（使用中）、maintenance（维护中）、inactive（停用） PATCH /api/v1/boats/my/${param0}/status */
export async function updateBoatStatusApiV1BoatsMyBoatIdStatusPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBoatStatusApiV1BoatsMyBoatIdStatusPatchParams,
  body: API.BoatStatusUpdateSchema,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatResponseSchema_>(`/api/v1/boats/my/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 上传船只图片 上传船只图片

- **file**: 船只图片文件（支持jpg、jpeg、png、gif、webp格式，最大10MB）

返回上传后的图片URL，用于添加或更新船只时填写images字段 POST /api/v1/boats/upload-image */
export async function uploadBoatImageApiV1BoatsUploadImagePost(
  body: API.BodyUploadBoatImageApiV1BoatsUploadImagePost,
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseUploadResponseSchema_>('/api/v1/boats/upload-image', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
