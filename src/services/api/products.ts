// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 添加商品 添加商品（商家端）

- **name**: 商品名称（必填，最大100字符）
- **category**: 商品分类（默认其他）
- **description**: 商品描述（可选）
- **price**: 商品价格（必填，大于0）
- **stock**: 库存数量（必填，大于等于0）
- **unit**: 计量单位（默认"份"）
- **images**: 商品图片列表（可选，最多10张）

只有审核通过的商家才能添加商品 POST /api/v1/products/ */
export async function createProductApiV1ProductsPost(
  body: API.ProductCreateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseProductResponseSchema_>('/api/v1/products/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取商品详情 获取商品详情（用户端） GET /api/v1/products/${param0} */
export async function getProductDetailApiV1ProductsProductIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductDetailApiV1ProductsProductIdGetParams,
  options?: { [key: string]: any }
) {
  const { product_id: param0, ...queryParams } = params
  return request<API.ApiResponseProductDetailSchema_>(`/api/v1/products/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 按分类获取商品 按分类获取商品列表（用户端） GET /api/v1/products/category/${param0} */
export async function getProductsByCategoryApiV1ProductsCategoryCategoryGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsByCategoryApiV1ProductsCategoryCategoryGetParams,
  options?: { [key: string]: any }
) {
  const { category: param0, ...queryParams } = params
  return request<API.ApiResponsePaginatedDataProductListItemSchema_>(
    `/api/v1/products/category/${param0}`,
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // page_size has a default value: 10
        page_size: '10',
        ...queryParams,
      },
      ...(options || {}),
    }
  )
}

/** 获取我的商品列表 获取我的商品列表（商家端） GET /api/v1/products/my */
export async function getMyProductsApiV1ProductsMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyProductsApiV1ProductsMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataProductListItemSchema_>('/api/v1/products/my', {
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

/** 获取我的商品详情 获取我的商品详情（商家端） GET /api/v1/products/my/${param0} */
export async function getMyProductDetailApiV1ProductsMyProductIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyProductDetailApiV1ProductsMyProductIdGetParams,
  options?: { [key: string]: any }
) {
  const { product_id: param0, ...queryParams } = params
  return request<API.ApiResponseProductDetailSchema_>(`/api/v1/products/my/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新我的商品信息 更新我的商品信息（商家端）

- **name**: 商品名称（可选）
- **category**: 商品分类（可选）
- **description**: 商品描述（可选）
- **price**: 商品价格（可选）
- **stock**: 库存数量（可选）
- **unit**: 计量单位（可选）
- **images**: 商品图片列表（可选）
- **status**: 状态（可选） PUT /api/v1/products/my/${param0} */
export async function updateMyProductApiV1ProductsMyProductIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMyProductApiV1ProductsMyProductIdPutParams,
  body: API.ProductUpdateSchema,
  options?: { [key: string]: any }
) {
  const { product_id: param0, ...queryParams } = params
  return request<API.ApiResponseProductResponseSchema_>(`/api/v1/products/my/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除我的商品 删除我的商品（商家端）- 软删除，将状态设置为inactive DELETE /api/v1/products/my/${param0} */
export async function deleteMyProductApiV1ProductsMyProductIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMyProductApiV1ProductsMyProductIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { product_id: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/products/my/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新商品库存 更新商品库存（商家端）

- **stock**: 库存数量（必填，大于等于0）
- **status**: 状态（可选）

库存为0时自动设置为售罄状态 PATCH /api/v1/products/my/${param0}/stock */
export async function updateProductStockApiV1ProductsMyProductIdStockPatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateProductStockApiV1ProductsMyProductIdStockPatchParams,
  body: API.ProductStockUpdateSchema,
  options?: { [key: string]: any }
) {
  const { product_id: param0, ...queryParams } = params
  return request<API.ApiResponseProductResponseSchema_>(`/api/v1/products/my/${param0}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 获取热门商品 获取热门商品（用户端）

按销量和评分排序显示热门商品 GET /api/v1/products/popular */
export async function getPopularProductsApiV1ProductsPopularGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPopularProductsApiV1ProductsPopularGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataProductListItemSchema_>('/api/v1/products/popular', {
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

/** 搜索商品 搜索商品（用户端）

- **keyword**: 搜索关键词（在商品名称和描述中搜索）
- **category**: 商品分类过滤
- **min_price**: 最低价格
- **max_price**: 最高价格
- **merchant_id**: 商家ID过滤

只显示状态为可售且所属商家已审核通过的商品
按销量和创建时间排序 GET /api/v1/products/search */
export async function searchProductsApiV1ProductsSearchGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchProductsApiV1ProductsSearchGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataProductListItemSchema_>('/api/v1/products/search', {
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

/** 上传商品图片 上传商品图片

- **file**: 商品图片文件（支持jpg、jpeg、png、gif、webp格式，最大10MB）

返回上传后的图片URL，用于添加或更新商品时填写images字段 POST /api/v1/products/upload-image */
export async function uploadProductImageApiV1ProductsUploadImagePost(
  body: API.BodyUploadProductImageApiV1ProductsUploadImagePost,
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

  return request<API.ApiResponseUploadResponseSchema_>('/api/v1/products/upload-image', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
