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

  type ApiResponseIdCardUploadResponseSchema_ = {
    /** Code */
    code: number
    data?: IdCardUploadResponseSchema | null
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

  type ApiResponsePaginatedDataRealnameAuthListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataRealnameAuthListItemSchema_ | null
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

  type ApiResponseRealnameAuthResponseSchema_ = {
    /** Code */
    code: number
    data?: RealnameAuthResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseUploadResponseSchema_ = {
    /** Code */
    code: number
    data?: UploadResponseSchema | null
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

  type BodySubmitRealnameAuthApiV1RealnameAuthSubmitPost = {
    /** Real Name 真实姓名 */
    real_name: string
    /** Id Card 身份证号 */
    id_card: string
    /** Front Image 身份证正面照片 */
    front_image: string
    /** Back Image 身份证背面照片 */
    back_image: string
  }

  type BodyUpdateMyRealnameAuthApiV1RealnameAuthMePut = {
    /** Real Name 真实姓名 */
    real_name?: string | null
    /** Id Card 身份证号 */
    id_card?: string | null
    /** Front Image 身份证正面照片 */
    front_image?: string | null
    /** Back Image 身份证背面照片 */
    back_image?: string | null
  }

  type BodyUploadAvatarApiV1UsersUploadAvatarPost = {
    /** File 头像文件 */
    file: string
  }

  type BodyUploadIdCardImagesApiV1RealnameAuthUploadImagesPost = {
    /** Front Image 身份证正面照片 */
    front_image?: string | null
    /** Back Image 身份证背面照片 */
    back_image?: string | null
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

  type deleteRealnameAuthApiV1RealnameAuthAuthIdDeleteParams = {
    auth_id: number
  }

  type deleteUserApiV1UsersUserIdDeleteParams = {
    user_id: number
  }

  type ForgotPasswordSchema = {
    /** Email */
    email: string
  }

  type getRealnameAuthDetailApiV1RealnameAuthAuthIdGetParams = {
    auth_id: number
  }

  type getRealnameAuthListApiV1RealnameAuthListGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 认证状态筛选 */
    status?: RealnameAuthStatus | null
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

  type IdCardUploadResponseSchema = {
    /** Front Image */
    front_image?: string | null
    /** Back Image */
    back_image?: string | null
    /** Message */
    message: string
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

  type PaginatedDataRealnameAuthListItemSchema_ = {
    /** Items */
    items: RealnameAuthListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
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

  type RealnameAuthListItemSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Real Name */
    real_name: string
    /** Id Card */
    id_card: string
    status: RealnameAuthStatus
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type RealnameAuthResponseSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Real Name */
    real_name: string
    /** Id Card */
    id_card: string
    /** Front Image */
    front_image: string
    /** Back Image */
    back_image: string
    status: RealnameAuthStatus
    /** Reject Reason */
    reject_reason: string | null
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type RealnameAuthStatus = 'pending' | 'approved' | 'rejected'

  type RealnameAuthUpdateStatusSchema = {
    status: RealnameAuthStatus
    /** Reject Reason */
    reject_reason?: string | null
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

  type updateRealnameAuthStatusApiV1RealnameAuthAuthIdStatusPutParams = {
    auth_id: number
  }

  type updateUserApiV1UsersUserIdPutParams = {
    user_id: number
  }

  type UploadResponseSchema = {
    /** Url */
    url: string
    /** Filename */
    filename: string
    /** Size */
    size: number
    /** Content Type */
    content_type: string
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
    /** Avatar */
    avatar: string | null
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
    /** Avatar */
    avatar?: string | null
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
