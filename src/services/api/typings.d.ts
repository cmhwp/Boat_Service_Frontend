declare namespace API {
  type ApiResponseBoatDetailSchema_ = {
    /** Code */
    code: number
    data?: BoatDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseBoatResponseSchema_ = {
    /** Code */
    code: number
    data?: BoatResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

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

  type ApiResponsePaginatedDataBoatListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataBoatListItemSchema_ | null
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

  type ApiResponsePaginatedDataProductListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataProductListItemSchema_ | null
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

  type ApiResponseProductDetailSchema_ = {
    /** Code */
    code: number
    data?: ProductDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseProductResponseSchema_ = {
    /** Code */
    code: number
    data?: ProductResponseSchema | null
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

  type BoatCreateSchema = {
    /** Name 船只名称 */
    name: string
    /** License Number 船只证书号 */
    license_number: string
    /** 船只类型 */
    boat_type?: BoatType
    /** Capacity 载客量 */
    capacity: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number | string
    /** Description 船只描述 */
    description?: string | null
    /** Images 船只图片列表 */
    images?: string[] | null
    /** Current Location 当前位置 */
    current_location?: string | null
  }

  type BoatDetailSchema = {
    /** Id 船只ID */
    id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Name 船只名称 */
    name: string
    /** License Number 船只证书号 */
    license_number: string
    /** 船只类型 */
    boat_type: BoatType
    /** Capacity 载客量 */
    capacity: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number
    /** Description 船只描述 */
    description?: string | null
    /** Images 船只图片列表 */
    images?: string[]
    /** 状态 */
    status: BoatStatus
    /** Current Location 当前位置 */
    current_location?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Merchant 商家信息 */
    merchant?: Record<string, any> | null
  }

  type BoatListItemSchema = {
    /** Id 船只ID */
    id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Name 船只名称 */
    name: string
    /** 船只类型 */
    boat_type: BoatType
    /** Capacity 载客量 */
    capacity: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number
    /** 状态 */
    status: BoatStatus
    /** Current Location 当前位置 */
    current_location?: string | null
    /** Images 船只图片列表 */
    images?: string[]
    /** Created At 创建时间 */
    created_at: string
  }

  type BoatResponseSchema = {
    /** Id 船只ID */
    id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Name 船只名称 */
    name: string
    /** License Number 船只证书号 */
    license_number: string
    /** 船只类型 */
    boat_type: BoatType
    /** Capacity 载客量 */
    capacity: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number
    /** Description 船只描述 */
    description?: string | null
    /** Images 船只图片列表 */
    images?: string[]
    /** 状态 */
    status: BoatStatus
    /** Current Location 当前位置 */
    current_location?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
  }

  type BoatStatus = 'available' | 'in_use' | 'maintenance' | 'inactive'

  type BoatStatusUpdateSchema = {
    /** 状态 */
    status: BoatStatus
    /** Current Location 当前位置 */
    current_location?: string | null
  }

  type BoatType = 'passenger' | 'sightseeing' | 'fishing'

  type BoatUpdateSchema = {
    /** Name 船只名称 */
    name?: string | null
    /** 船只类型 */
    boat_type?: BoatType | null
    /** Capacity 载客量 */
    capacity?: number | null
    /** Hourly Rate 小时费率 */
    hourly_rate?: number | string | null
    /** Description 船只描述 */
    description?: string | null
    /** Images 船只图片列表 */
    images?: string[] | null
    /** Current Location 当前位置 */
    current_location?: string | null
    /** 状态 */
    status?: BoatStatus | null
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

  type BodyUploadBoatImageApiV1BoatsUploadImagePost = {
    /** File 船只图片文件 */
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

  type BodyUploadProductImageApiV1ProductsUploadImagePost = {
    /** File 商品图片文件 */
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

  type deleteMyBoatApiV1BoatsMyBoatIdDeleteParams = {
    /** 船只ID */
    boat_id: number
  }

  type deleteMyProductApiV1ProductsMyProductIdDeleteParams = {
    /** 商品ID */
    product_id: number
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

  type getAvailableBoatsApiV1BoatsAvailableGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 船只类型过滤 */
    boat_type?: BoatType | null
    /** 最小载客量 */
    min_capacity?: number | null
    /** 最大小时费率 */
    max_hourly_rate?: number | null
  }

  type getAvailableMerchantsApiV1CrewMerchantsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getBoatDetailApiV1BoatsBoatIdGetParams = {
    /** 船只ID */
    boat_id: number
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

  type getMyBoatDetailApiV1BoatsMyBoatIdGetParams = {
    /** 船只ID */
    boat_id: number
  }

  type getMyBoatsApiV1BoatsMyGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: BoatStatus | null
  }

  type getMyCrewApplicationsApiV1CrewMyApplicationsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getMyProductDetailApiV1ProductsMyProductIdGetParams = {
    /** 商品ID */
    product_id: number
  }

  type getMyProductsApiV1ProductsMyGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: ProductStatus | null
    /** 分类过滤 */
    category?: ProductCategory | null
  }

  type getPendingMerchantsApiV1MerchantsPendingGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getPopularProductsApiV1ProductsPopularGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getProductDetailApiV1ProductsProductIdGetParams = {
    /** 商品ID */
    product_id: number
  }

  type getProductsByCategoryApiV1ProductsCategoryCategoryGetParams = {
    /** 商品分类 */
    category: ProductCategory
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

  type PaginatedDataBoatListItemSchema_ = {
    /** Items */
    items: BoatListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
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

  type PaginatedDataProductListItemSchema_ = {
    /** Items */
    items: ProductListItemSchema[]
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

  type ProductCategory = 'fruit' | 'vegetable' | 'grain' | 'seafood' | 'other'

  type ProductCreateSchema = {
    /** Name 商品名称 */
    name: string
    /** 商品分类 */
    category?: ProductCategory
    /** Description 商品描述 */
    description?: string | null
    /** Price 商品价格 */
    price: number | string
    /** Stock 库存数量 */
    stock: number
    /** Unit 计量单位 */
    unit?: string
    /** Images 商品图片列表 */
    images?: string[] | null
  }

  type ProductDetailSchema = {
    /** Id 商品ID */
    id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Name 商品名称 */
    name: string
    /** 商品分类 */
    category: ProductCategory
    /** Description 商品描述 */
    description?: string | null
    /** Price 商品价格 */
    price: number
    /** Stock 库存数量 */
    stock: number
    /** Unit 计量单位 */
    unit: string
    /** Images 商品图片列表 */
    images?: string[]
    /** Rating 评分 */
    rating: number
    /** Sales Count 销售数量 */
    sales_count: number
    /** 状态 */
    status: ProductStatus
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Merchant 商家信息 */
    merchant?: Record<string, any> | null
  }

  type ProductListItemSchema = {
    /** Id 商品ID */
    id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Name 商品名称 */
    name: string
    /** 商品分类 */
    category: ProductCategory
    /** Price 商品价格 */
    price: number
    /** Stock 库存数量 */
    stock: number
    /** Unit 计量单位 */
    unit: string
    /** Images 商品图片列表 */
    images?: string[]
    /** Rating 评分 */
    rating: number
    /** Sales Count 销售数量 */
    sales_count: number
    /** 状态 */
    status: ProductStatus
    /** Created At 创建时间 */
    created_at: string
  }

  type ProductResponseSchema = {
    /** Id 商品ID */
    id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Name 商品名称 */
    name: string
    /** 商品分类 */
    category: ProductCategory
    /** Description 商品描述 */
    description?: string | null
    /** Price 商品价格 */
    price: number
    /** Stock 库存数量 */
    stock: number
    /** Unit 计量单位 */
    unit: string
    /** Images 商品图片列表 */
    images?: string[]
    /** Rating 评分 */
    rating: number
    /** Sales Count 销售数量 */
    sales_count: number
    /** 状态 */
    status: ProductStatus
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
  }

  type ProductStatus = 'available' | 'sold_out' | 'inactive'

  type ProductStockUpdateSchema = {
    /** Stock 库存数量 */
    stock: number
    /** 状态 */
    status?: ProductStatus | null
  }

  type ProductUpdateSchema = {
    /** Name 商品名称 */
    name?: string | null
    /** 商品分类 */
    category?: ProductCategory | null
    /** Description 商品描述 */
    description?: string | null
    /** Price 商品价格 */
    price?: number | string | null
    /** Stock 库存数量 */
    stock?: number | null
    /** Unit 计量单位 */
    unit?: string | null
    /** Images 商品图片列表 */
    images?: string[] | null
    /** 状态 */
    status?: ProductStatus | null
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

  type searchProductsApiV1ProductsSearchGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 搜索关键词 */
    keyword?: string | null
    /** 商品分类 */
    category?: ProductCategory | null
    /** 最低价格 */
    min_price?: number | null
    /** 最高价格 */
    max_price?: number | null
    /** 商家ID */
    merchant_id?: number | null
  }

  type SendVerificationCodeSchema = {
    /** Email */
    email: string
  }

  type updateBoatStatusApiV1BoatsMyBoatIdStatusPatchParams = {
    /** 船只ID */
    boat_id: number
  }

  type updateCrewApiV1CrewCrewIdPutParams = {
    crew_id: number
  }

  type updateMyBoatApiV1BoatsMyBoatIdPutParams = {
    /** 船只ID */
    boat_id: number
  }

  type updateMyProductApiV1ProductsMyProductIdPutParams = {
    /** 商品ID */
    product_id: number
  }

  type updateProductStockApiV1ProductsMyProductIdStockPatchParams = {
    /** 商品ID */
    product_id: number
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
