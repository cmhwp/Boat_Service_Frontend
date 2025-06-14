declare namespace API {
  type ApiResponseCrewApplicationResponseSchema_ = {
    /** Code */
    code: number
    data?: CrewApplicationResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseCrewDetailSchema_ = {
    /** Code */
    code: number
    data?: CrewDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseCrewResponseSchema_ = {
    /** Code */
    code: number
    data?: CrewResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

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

  type ApiResponseList_ = {
    /** Code */
    code: number
    /** Data */
    data?: any[] | null
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

  type ApiResponseMerchantAuditResponseSchema_ = {
    /** Code */
    code: number
    data?: MerchantAuditResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseMerchantDetailSchema_ = {
    /** Code */
    code: number
    data?: MerchantDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseMerchantResponseSchema_ = {
    /** Code */
    code: number
    data?: MerchantResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataCrewApplicationDetailSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataCrewApplicationDetailSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataCrewListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataCrewListItemSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataMerchantListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataMerchantListItemSchema_ | null
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

  type AuditResult = 'approved' | 'rejected'

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

  type BodyUploadMerchantLicenseApiV1MerchantsUploadLicensePost = {
    /** File 营业执照图片文件 */
    file: string
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

  type CrewApplicationDetailSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Id */
    merchant_id: number
    status: CrewApplicationStatus
    /** Apply Time */
    apply_time: string
    /** Handle Time */
    handle_time: string | null
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
    /** User */
    user?: Record<string, any> | null
    /** Merchant */
    merchant?: Record<string, any> | null
  }

  type CrewApplicationHandleSchema = {
    /** Application Id */
    application_id: number
    status: CrewApplicationStatus
    /** Boat License */
    boat_license?: string | null
  }

  type CrewApplicationResponseSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Id */
    merchant_id: number
    status: CrewApplicationStatus
    /** Apply Time */
    apply_time: string
    /** Handle Time */
    handle_time: string | null
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type CrewApplicationSchema = {
    /** Merchant Id */
    merchant_id: number
  }

  type CrewApplicationStatus = 'pending' | 'approved' | 'rejected'

  type CrewDetailSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Id */
    merchant_id: number
    /** Boat License */
    boat_license: string
    status: CrewStatus
    /** Rating */
    rating: number
    /** Join Time */
    join_time: string
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
    /** User */
    user?: Record<string, any> | null
    /** Merchant */
    merchant?: Record<string, any> | null
  }

  type CrewListItemSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Id */
    merchant_id: number
    /** Boat License */
    boat_license: string
    status: CrewStatus
    /** Rating */
    rating: number
    /** Join Time */
    join_time: string
  }

  type CrewResponseSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Id */
    merchant_id: number
    /** Boat License */
    boat_license: string
    status: CrewStatus
    /** Rating */
    rating: number
    /** Join Time */
    join_time: string
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type CrewStatus = 'active' | 'inactive'

  type CrewUpdateSchema = {
    /** Boat License */
    boat_license?: string | null
    status?: CrewStatus | null
    /** Rating */
    rating?: number | null
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

  type getAvailableMerchantsApiV1CrewMerchantsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getCrewApplicationsApiV1CrewApplicationsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getCrewDetailApiV1CrewCrewIdGetParams = {
    crew_id: number
  }

  type getCrewListApiV1CrewListGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getMerchantAuditHistoryApiV1MerchantsMerchantIdAuditHistoryGetParams = {
    merchant_id: number
  }

  type getMerchantByIdApiV1MerchantsMerchantIdGetParams = {
    merchant_id: number
  }

  type getMerchantsListApiV1MerchantsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: MerchantStatus | null
  }

  type getMyCrewApplicationsApiV1CrewMyApplicationsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getPendingMerchantsApiV1MerchantsPendingGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
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
    /** 搜索用户名或邮箱 */
    search?: string | null
    /** 用户角色筛选 */
    role?: UserRole | null
    /** 实名认证状态筛选 */
    realname_status?: RealnameStatus | null
    /** 账户状态筛选 */
    is_active?: boolean | null
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

  type MerchantApplySchema = {
    /** Merchant Name */
    merchant_name: string
    /** License Number */
    license_number: string
    /** License Image */
    license_image: string
    /** Contact Phone */
    contact_phone: string
    /** Address */
    address?: string | null
    /** Description */
    description?: string | null
  }

  type MerchantAuditResponseSchema = {
    /** Id */
    id: number
    /** Merchant Id */
    merchant_id: number
    /** Admin Id */
    admin_id: number
    audit_result: AuditResult
    /** Comment */
    comment: string | null
    /** Created At */
    created_at: string
  }

  type MerchantAuditSchema = {
    /** Merchant Id */
    merchant_id: number
    audit_result: AuditResult
    /** Comment */
    comment?: string | null
  }

  type MerchantDetailSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Name */
    merchant_name: string
    /** License Number */
    license_number: string
    /** License Image */
    license_image: string
    /** Contact Phone */
    contact_phone: string
    /** Address */
    address: string | null
    /** Description */
    description: string | null
    status: MerchantStatus
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
    /** User */
    user?: Record<string, any> | null
    /** Audits */
    audits?: any[] | null
  }

  type MerchantListItemSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Name */
    merchant_name: string
    /** License Number */
    license_number: string
    /** Contact Phone */
    contact_phone: string
    /** Address */
    address: string | null
    status: MerchantStatus
    /** Created At */
    created_at: string
  }

  type MerchantResponseSchema = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Merchant Name */
    merchant_name: string
    /** License Number */
    license_number: string
    /** License Image */
    license_image: string
    /** Contact Phone */
    contact_phone: string
    /** Address */
    address: string | null
    /** Description */
    description: string | null
    status: MerchantStatus
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type MerchantStatus = 'pending' | 'active' | 'suspended'

  type MerchantUpdateSchema = {
    /** Merchant Name */
    merchant_name?: string | null
    /** Contact Phone */
    contact_phone?: string | null
    /** Address */
    address?: string | null
    /** Description */
    description?: string | null
  }

  type PaginatedDataCrewApplicationDetailSchema_ = {
    /** Items */
    items: CrewApplicationDetailSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataCrewListItemSchema_ = {
    /** Items */
    items: CrewListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataMerchantListItemSchema_ = {
    /** Items */
    items: MerchantListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
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

  type updateCrewApiV1CrewCrewIdPutParams = {
    crew_id: number
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
