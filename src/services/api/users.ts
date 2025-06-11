// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取用户列表 获取用户列表（仅管理员） GET /api/v1/users/ */
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
