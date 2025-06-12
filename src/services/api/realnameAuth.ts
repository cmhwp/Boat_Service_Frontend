// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取实名认证详情 获取实名认证详情（仅管理员） GET /api/v1/realname-auth/${param0} */
export async function getRealnameAuthDetailApiV1RealnameAuthAuthIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRealnameAuthDetailApiV1RealnameAuthAuthIdGetParams,
  options?: { [key: string]: any }
) {
  const { auth_id: param0, ...queryParams } = params
  return request<API.ApiResponseRealnameAuthResponseSchema_>(`/api/v1/realname-auth/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 删除实名认证记录 删除实名认证记录（仅管理员） DELETE /api/v1/realname-auth/${param0} */
export async function deleteRealnameAuthApiV1RealnameAuthAuthIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRealnameAuthApiV1RealnameAuthAuthIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { auth_id: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/realname-auth/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新实名认证状态 更新实名认证状态（仅管理员）

- **status**: 认证状态（pending、approved、rejected）
- **reject_reason**: 拒绝原因（status为rejected时必填） PUT /api/v1/realname-auth/${param0}/status */
export async function updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPutParams,
  body: API.RealnameAuthUpdateStatusSchema,
  options?: { [key: string]: any }
) {
  const { auth_id: param0, ...queryParams } = params
  return request<API.ApiResponseRealnameAuthResponseSchema_>(
    `/api/v1/realname-auth/${param0}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  )
}

/** 获取实名认证列表 获取实名认证列表（仅管理员） GET /api/v1/realname-auth/list */
export async function getRealnameAuthListApiV1RealnameAuthListGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRealnameAuthListApiV1RealnameAuthListGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataRealnameAuthListItemSchema_>(
    '/api/v1/realname-auth/list',
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

/** 获取我的实名认证信息 获取当前用户的实名认证信息 GET /api/v1/realname-auth/me */
export async function getMyRealnameAuthApiV1RealnameAuthMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseRealnameAuthResponseSchema_>('/api/v1/realname-auth/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新我的实名认证信息 更新当前用户的实名认证信息

- **real_name**: 真实姓名（2-50个字符，仅支持中文和·）
- **id_card**: 身份证号（18位）
- **front_image**: 身份证正面照片
- **back_image**: 身份证背面照片

只有认证状态为待审核或已拒绝的用户可以更新认证信息
已通过认证的用户无法修改认证信息 PUT /api/v1/realname-auth/me */
export async function updateMyRealnameAuthApiV1RealnameAuthMePut(
  body: API.BodyUpdateMyRealnameAuthApiV1RealnameAuthMePut,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

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

  return request<API.ApiResponseRealnameAuthResponseSchema_>('/api/v1/realname-auth/me', {
    method: 'PUT',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** 提交实名认证 提交实名认证

- **real_name**: 真实姓名（2-50个字符，仅支持中文和·）
- **id_card**: 身份证号（18位）
- **front_image**: 身份证正面照片
- **back_image**: 身份证背面照片

需要同时上传身份证正反面照片和填写个人信息 POST /api/v1/realname-auth/submit */
export async function submitRealnameAuthApiV1RealnameAuthSubmitPost(
  body: API.BodySubmitRealnameAuthApiV1RealnameAuthSubmitPost,
  front_image?: File,
  back_image?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (front_image) {
    formData.append('front_image', front_image)
  }

  if (back_image) {
    formData.append('back_image', back_image)
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

  return request<API.ApiResponseRealnameAuthResponseSchema_>('/api/v1/realname-auth/submit', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** 上传身份证图片 上传身份证图片

- **front_image**: 身份证正面照片（可选）
- **back_image**: 身份证背面照片（可选）

至少需要上传一张图片，支持jpg、jpeg、png格式，最大10MB POST /api/v1/realname-auth/upload-images */
export async function uploadIdCardImagesApiV1RealnameAuthUploadImagesPost(
  body: API.BodyUploadIdCardImagesApiV1RealnameAuthUploadImagesPost,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

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

  return request<API.ApiResponseIdCardUploadResponseSchema_>(
    '/api/v1/realname-auth/upload-images',
    {
      method: 'POST',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    }
  )
}
