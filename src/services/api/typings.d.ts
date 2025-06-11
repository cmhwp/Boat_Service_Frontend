declare namespace API {
  type ApiResponseDict_ = {
    /** Code */
    code: number
    /** Data */
    data?: Record<string, any> | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseLoginResponseSchema_ = {
    /** Code */
    code: number
    data?: LoginResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataUserResponseSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataUserResponseSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseUserResponseSchema_ = {
    /** Code */
    code: number
    data?: UserResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseVerificationCodeResponseSchema_ = {
    /** Code */
    code: number
    data?: VerificationCodeResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ChangePasswordSchema = {
    /** Old Password */
    old_password: string
    /** New Password */
    new_password: string
    /** Confirm Password */
    confirm_password: string
  }

  type CompleteRegistrationSchema = {
    /** Username */
    username: string
    /** Email */
    email: string
    /** Password */
    password: string
    /** Verification Code */
    verification_code: string
  }

  type deleteUserApiV1UsersUserIdDeleteParams = {
    user_id: number
  }

  type ForgotPasswordSchema = {
    /** Email */
    email: string
  }

  type getUserByIdApiV1UsersUserIdGetParams = {
    user_id: number
  }

  type getUsersListApiV1UsersGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[]
  }

  type LoginResponseSchema = {
    /** Access Token */
    access_token: string
    /** Token Type */
    token_type?: string
    /** Expires In */
    expires_in: number
    user: UserResponseSchema
  }

  type PaginatedDataUserResponseSchema_ = {
    /** Items */
    items: UserResponseSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type RealnameStatus = 'unverified' | 'pending' | 'verified'

  type ResetPasswordSchema = {
    /** Token */
    token: string
    /** New Password */
    new_password: string
    /** Confirm Password */
    confirm_password: string
  }

  type SendVerificationCodeSchema = {
    /** Email */
    email: string
  }

  type updateUserApiV1UsersUserIdPutParams = {
    user_id: number
  }

  type UserLoginSchema = {
    /** Identifier */
    identifier: string
    /** Password */
    password: string
  }

  type UserResponseSchema = {
    /** Id */
    id: number
    /** Username */
    username: string
    /** Email */
    email: string
    /** Phone */
    phone: string | null
    role: UserRole
    /** Is Active */
    is_active: boolean
    realname_status: RealnameStatus
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type UserRole = 'user' | 'crew' | 'merchant' | 'admin'

  type UserUpdateSchema = {
    /** Phone */
    phone?: string | null
    role?: UserRole | null
    /** Is Active */
    is_active?: boolean | null
    realname_status?: RealnameStatus | null
  }

  type ValidationError = {
    /** Location */
    loc: (string | number)[]
    /** Message */
    msg: string
    /** Error Type */
    type: string
  }

  type VerificationCodeResponseSchema = {
    /** Message */
    message: string
    /** Expires In */
    expires_in: number
  }

  type VerifyEmailCodeSchema = {
    /** Email */
    email: string
    /** Code */
    code: string
  }

  type verifyResetTokenApiV1UsersVerifyResetTokenTokenGetParams = {
    token: string
  }
}
