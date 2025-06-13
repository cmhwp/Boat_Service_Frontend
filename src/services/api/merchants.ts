// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取商家列表 获取商家列表（仅管理员） GET /api/v1/merchants/ */
export async function getMerchantsListApiV1MerchantsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantsListApiV1MerchantsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataMerchantListItemSchema_>('/api/v1/merchants/', {
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

/** 根据ID获取商家详情 根据商家ID获取商家详情（仅管理员） GET /api/v1/merchants/${param0} */
export async function getMerchantByIdApiV1MerchantsMerchantIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantByIdApiV1MerchantsMerchantIdGetParams,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseMerchantDetailSchema_>(`/api/v1/merchants/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取商家审核历史 获取商家审核历史（仅管理员） GET /api/v1/merchants/${param0}/audit-history */
export async function getMerchantAuditHistoryApiV1MerchantsMerchantIdAuditHistoryGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantAuditHistoryApiV1MerchantsMerchantIdAuditHistoryGetParams,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseList_>(`/api/v1/merchants/${param0}/audit-history`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 申请成为商家 申请成为商家

- **merchant_name**: 商家名称（必填，最大100字符）
- **license_number**: 营业执照号（必填，最大50字符）
- **license_image**: 营业执照图片URL（必填，通过上传接口获得）
- **contact_phone**: 联系电话（必填，最大20字符）
- **address**: 地址（可选，最大255字符）
- **description**: 描述（可选）

申请提交后需要等待管理员审核 POST /api/v1/merchants/apply */
export async function applyMerchantApiV1MerchantsApplyPost(
  body: API.MerchantApplySchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseMerchantResponseSchema_>('/api/v1/merchants/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 审核商家申请 审核商家申请（仅管理员）

- **merchant_id**: 商家ID
- **audit_result**: 审核结果（approved/rejected）
- **comment**: 审核意见（可选，最大1000字符）

审核通过后商家状态变为active，用户角色变为merchant POST /api/v1/merchants/audit */
export async function auditMerchantApiV1MerchantsAuditPost(
  body: API.MerchantAuditSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseMerchantAuditResponseSchema_>('/api/v1/merchants/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取我的商家信息 获取当前用户的商家信息 GET /api/v1/merchants/me */
export async function getMyMerchantInfoApiV1MerchantsMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseMerchantDetailSchema_>('/api/v1/merchants/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新我的商家信息 更新当前用户的商家信息

- **merchant_name**: 商家名称（可选）
- **contact_phone**: 联系电话（可选）
- **address**: 地址（可选）
- **description**: 描述（可选）

只有审核通过的商家才能更新信息 PUT /api/v1/merchants/me */
export async function updateMyMerchantApiV1MerchantsMePut(
  body: API.MerchantUpdateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseMerchantResponseSchema_>('/api/v1/merchants/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取待审核商家列表 获取待审核商家列表（仅管理员） GET /api/v1/merchants/pending */
export async function getPendingMerchantsApiV1MerchantsPendingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPendingMerchantsApiV1MerchantsPendingGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataMerchantListItemSchema_>('/api/v1/merchants/pending', {
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

/** 上传营业执照 上传商家营业执照

- **file**: 营业执照图片文件（支持jpg、jpeg、png、gif、webp格式，最大10MB）

返回上传后的图片URL，用于申请商家时填写license_image字段 POST /api/v1/merchants/upload-license */
export async function uploadMerchantLicenseApiV1MerchantsUploadLicensePost(
  body: API.BodyUploadMerchantLicenseApiV1MerchantsUploadLicensePost,
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

  return request<API.ApiResponseUploadResponseSchema_>('/api/v1/merchants/upload-license', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
