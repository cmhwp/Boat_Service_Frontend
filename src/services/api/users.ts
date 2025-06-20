// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取用户列表 获取用户列表（仅管理员）

支持以下筛选条件：
- **search**: 搜索用户名或邮箱
- **role**: 用户角色筛选 (user, crew, merchant, admin)
- **realname_status**: 实名认证状态筛选 (unverified, pending, verified)
- **is_active**: 账户状态筛选 (true/false) GET /api/v1/users/ */
export async function getUsersListApiV1UsersGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersListApiV1UsersGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponsePaginatedDataUserResponseSchema_>('/api/v1/users/', {
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

/** 根据ID获取用户 根据用户ID获取用户信息（仅管理员） GET /api/v1/users/${param0} */
export async function getUserByIdApiV1UsersUserIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdApiV1UsersUserIdGetParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponseSchema_>(`/api/v1/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新用户信息 更新指定用户信息（仅管理员） PUT /api/v1/users/${param0} */
export async function updateUserApiV1UsersUserIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserApiV1UsersUserIdPutParams,
  body: API.UserUpdateSchema,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponseSchema_>(`/api/v1/users/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除用户 删除指定用户（仅管理员） DELETE /api/v1/users/${param0} */
export async function deleteUserApiV1UsersUserIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserApiV1UsersUserIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 删除用户头像 删除用户头像 DELETE /api/v1/users/avatar */
export async function deleteAvatarApiV1UsersAvatarDelete(options?: { [key: string]: any }) {
  return request<API.ApiResponseDict_>('/api/v1/users/avatar', {
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 修改密码 修改当前用户密码 POST /api/v1/users/change-password */
export async function changePasswordApiV1UsersChangePasswordPost(
  body: API.ChangePasswordSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 忘记密码 忘记密码，发送重置链接

- **email**: 注册邮箱地址

如果邮箱存在，将发送密码重置链接，有效期30分钟 POST /api/v1/users/forgot-password */
export async function forgotPasswordApiV1UsersForgotPasswordPost(
  body: API.ForgotPasswordSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据船员ID获取用户信息 根据船员ID获取用户信息

- **crew_id**: 船员ID

返回船员关联的用户信息，包括头像、用户名和船员详细信息 GET /api/v1/users/info/by-crew */
export async function getUserInfoByCrewApiV1UsersInfoByCrewGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInfoByCrewApiV1UsersInfoByCrewGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/info/by-crew', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 根据商家ID获取用户信息 根据商家ID获取用户信息

- **merchant_id**: 商家ID

返回商家关联的用户信息，包括头像、用户名和商家详细信息 GET /api/v1/users/info/by-merchant */
export async function getUserInfoByMerchantApiV1UsersInfoByMerchantGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInfoByMerchantApiV1UsersInfoByMerchantGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/info/by-merchant', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 根据角色ID获取用户信息 根据商家ID或船员ID获取用户信息

- **merchant_id**: 商家ID（与crew_id二选一）
- **crew_id**: 船员ID（与merchant_id二选一）

返回对应角色的用户信息，包括头像、用户名和角色详细信息 GET /api/v1/users/info/by-role */
export async function getUserInfoByRoleApiV1UsersInfoByRoleGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInfoByRoleApiV1UsersInfoByRoleGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/info/by-role', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 用户登录 用户登录接口

- **identifier**: 用户名或邮箱
- **password**: 密码

返回访问令牌和用户信息 POST /api/v1/users/login */
export async function loginApiV1UsersLoginPost(
  body: API.UserLoginSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseLoginResponseSchema_>('/api/v1/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户退出登录 用户退出登录接口

退出当前登录状态，前端需要清除本地存储的token POST /api/v1/users/logout */
export async function logoutApiV1UsersLogoutPost(options?: { [key: string]: any }) {
  return request<API.ApiResponseDict_>('/api/v1/users/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 获取当前用户信息 获取当前登录用户的信息 GET /api/v1/users/me */
export async function getCurrentUserInfoApiV1UsersMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseUserResponseSchema_>('/api/v1/users/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新当前用户信息 更新当前登录用户的信息 PUT /api/v1/users/me */
export async function updateCurrentUserApiV1UsersMePut(
  body: API.UserUpdateSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseUserResponseSchema_>('/api/v1/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 完成用户注册 完成用户注册

- **username**: 用户名（3-50个字符）
- **email**: 邮箱地址
- **password**: 密码（至少6个字符）
- **verification_code**: 6位邮箱验证码

注册前需要先通过邮箱验证 POST /api/v1/users/register */
export async function completeRegistrationApiV1UsersRegisterPost(
  body: API.CompleteRegistrationSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseUserResponseSchema_>('/api/v1/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 重置密码 使用重置token重置密码

- **token**: 重置token（来自邮件链接）
- **new_password**: 新密码（至少6个字符）
- **confirm_password**: 确认新密码 POST /api/v1/users/reset-password */
export async function resetPasswordApiV1UsersResetPasswordPost(
  body: API.ResetPasswordSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送邮箱验证码 发送邮箱验证码

- **email**: 邮箱地址

验证码有效期5分钟，用于注册验证 POST /api/v1/users/send-verification-code */
export async function sendVerificationCodeApiV1UsersSendVerificationCodePost(
  body: API.SendVerificationCodeSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseVerificationCodeResponseSchema_>(
    '/api/v1/users/send-verification-code',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  )
}

/** 上传用户头像 上传用户头像

- **file**: 头像图片文件（支持jpg、jpeg、png、gif、webp格式，最大10MB）

自动压缩图片并上传到腾讯云COS POST /api/v1/users/upload-avatar */
export async function uploadAvatarApiV1UsersUploadAvatarPost(
  body: API.BodyUploadAvatarApiV1UsersUploadAvatarPost,
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

  return request<API.ApiResponseUploadResponseSchema_>('/api/v1/users/upload-avatar', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** 验证邮箱验证码 验证邮箱验证码

- **email**: 邮箱地址
- **code**: 6位验证码 POST /api/v1/users/verify-email-code */
export async function verifyEmailCodeApiV1UsersVerifyEmailCodePost(
  body: API.VerifyEmailCodeSchema,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/users/verify-email-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 验证重置token 验证密码重置token是否有效

- **token**: 重置token GET /api/v1/users/verify-reset-token/${param0} */
export async function verifyResetTokenApiV1UsersVerifyResetTokenTokenGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.verifyResetTokenApiV1UsersVerifyResetTokenTokenGetParams,
  options?: { [key: string]: any }
) {
  const { token: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/users/verify-reset-token/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}
