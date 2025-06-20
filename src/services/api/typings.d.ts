declare namespace API {
  type AdminBoatDetailSchema = {
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
    /** Booking Count 预约次数 */
    booking_count?: number
    /** Total Income 总收入 */
    total_income?: number
    /** Recent Bookings 最近预约记录 */
    recent_bookings?: Record<string, any>[]
  }

  type AdminBoatListItemSchema = {
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
    /** Merchant Name 商家名称 */
    merchant_name: string
    /** Booking Count 预约次数 */
    booking_count?: number
    /** Total Income 总收入 */
    total_income?: number
  }

  type AdminBoatOperationSchema = {
    /** Operation 操作类型：suspend（暂停）| activate（激活）| maintenance（维护） */
    operation: string
    /** Reason 操作原因 */
    reason: string
    /** Notes 管理员备注 */
    notes?: string | null
  }

  type adminGetAllBoatsApiV1BoatsAdminAllGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 商家ID过滤 */
    merchant_id?: number | null
    /** 船只类型过滤 */
    boat_type?: BoatType | null
    /** 状态过滤 */
    status?: BoatStatus | null
    /** 船只名称搜索 */
    name?: string | null
    /** 证书号搜索 */
    license_number?: string | null
  }

  type adminGetAllOrdersApiV1OrdersAdminAllGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: OrderStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
    /** 商家ID过滤 */
    merchant_id?: number | null
    /** 用户ID过滤 */
    user_id?: number | null
    /** 订单号搜索 */
    order_number?: string | null
  }

  type adminGetAllProductsApiV1ProductsAdminAllGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 商家ID过滤 */
    merchant_id?: number | null
    /** 商品分类过滤 */
    category?: ProductCategory | null
    /** 状态过滤 */
    status?: ProductStatus | null
    /** 商品名称搜索 */
    name?: string | null
    /** 最低价格 */
    min_price?: number | null
    /** 最高价格 */
    max_price?: number | null
    /** 低库存筛选（库存<10） */
    low_stock?: boolean | null
  }

  type adminGetBoatDetailApiV1BoatsAdminBoatIdGetParams = {
    /** 船只ID */
    boat_id: number
  }

  type adminGetOrderDetailApiV1OrdersAdminOrderIdGetParams = {
    /** 订单ID */
    order_id: number
  }

  type adminGetProductDetailApiV1ProductsAdminProductIdGetParams = {
    /** 商品ID */
    product_id: number
  }

  type adminOperateBoatApiV1BoatsAdminBoatIdOperatePostParams = {
    /** 船只ID */
    boat_id: number
  }

  type adminOperateOrderApiV1OrdersAdminOrderIdOperatePostParams = {
    /** 订单ID */
    order_id: number
  }

  type adminOperateProductApiV1ProductsAdminProductIdOperatePostParams = {
    /** 商品ID */
    product_id: number
  }

  type AdminOrderDetailSchema = {
    /** Id 订单ID */
    id: number
    /** Order Number 订单号 */
    order_number: string
    /** User Id 用户ID */
    user_id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Total Amount 订单总金额 */
    total_amount: number
    /** Discount Amount 优惠金额 */
    discount_amount: number
    /** Shipping Fee 运费 */
    shipping_fee: number
    /** Final Amount 实付金额 */
    final_amount: number
    /** 订单状态 */
    status: OrderStatus
    /** 支付方式 */
    payment_method?: PaymentMethod | null
    /** Receiver Name 收货人姓名 */
    receiver_name: string
    /** Receiver Phone 收货人电话 */
    receiver_phone: string
    /** Receiver Address 收货地址 */
    receiver_address: string
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Paid At 支付时间 */
    paid_at?: string | null
    /** Shipped At 发货时间 */
    shipped_at?: string | null
    /** Delivered At 送达时间 */
    delivered_at?: string | null
    /** Completed At 完成时间 */
    completed_at?: string | null
    /** Cancelled At 取消时间 */
    cancelled_at?: string | null
    /** User 用户信息 */
    user?: Record<string, any> | null
    /** Merchant 商家信息 */
    merchant?: Record<string, any> | null
    /** Order Items 订单项列表 */
    order_items?: OrderItemResponseSchema[]
    /** Payment Records 支付记录列表 */
    payment_records?: app_schemas_order_PaymentResponseSchema[]
  }

  type AdminOrderListItemSchema = {
    /** Id 订单ID */
    id: number
    /** Order Number 订单号 */
    order_number: string
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Merchant Name 商家名称 */
    merchant_name: string
    /** Total Amount 订单总金额 */
    total_amount: number
    /** Final Amount 实付金额 */
    final_amount: number
    /** 订单状态 */
    status: OrderStatus
    /** Item Count 商品种类数 */
    item_count: number
    /** Total Quantity 商品总数量 */
    total_quantity: number
    /** Created At 创建时间 */
    created_at: string
    /** User Name 用户名 */
    user_name: string
    /** User Phone 用户电话 */
    user_phone?: string | null
    /** 支付方式 */
    payment_method?: PaymentMethod | null
    /** Paid At 支付时间 */
    paid_at?: string | null
  }

  type AdminOrderOperationSchema = {
    /** Operation 操作类型：force_cancel（强制取消）| refund（退款） */
    operation: string
    /** Reason 操作原因 */
    reason: string
    /** Notes 管理员备注 */
    notes?: string | null
  }

  type AdminProductDetailSchema = {
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
    /** Order Count 订单数量 */
    order_count?: number
    /** Total Sales 总销售额 */
    total_sales?: number
    /** Recent Orders 最近订单记录 */
    recent_orders?: Record<string, any>[]
  }

  type AdminProductListItemSchema = {
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
    /** Merchant Name 商家名称 */
    merchant_name: string
    /** Order Count 订单数量 */
    order_count?: number
    /** Total Sales 总销售额 */
    total_sales?: number
  }

  type AdminProductOperationSchema = {
    /** Operation 操作类型：deactivate（下架）| activate（上架）| sold_out（售罄） */
    operation: string
    /** Reason 操作原因 */
    reason: string
    /** Notes 管理员备注 */
    notes?: string | null
  }

  type ApiResponse = {
    /** Code */
    code: number
    /** Data */
    data?: any | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseAdminBoatDetailSchema_ = {
    /** Code */
    code: number
    data?: AdminBoatDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseAdminOrderDetailSchema_ = {
    /** Code */
    code: number
    data?: AdminOrderDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseAdminProductDetailSchema_ = {
    /** Code */
    code: number
    data?: AdminProductDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

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

  type ApiResponseBookingAvailabilityResponseSchema_ = {
    /** Code */
    code: number
    data?: BookingAvailabilityResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseBookingDetailSchema_ = {
    /** Code */
    code: number
    data?: BookingDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseBookingResponseSchema_ = {
    /** Code */
    code: number
    data?: BookingResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseBookingStatsSchema_ = {
    /** Code */
    code: number
    data?: app_schemas_booking_BookingStatsSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseCartItemResponseSchema_ = {
    /** Code */
    code: number
    data?: CartItemResponseSchema | null
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

  type ApiResponseCrewRatingResponseSchema_ = {
    /** Code */
    code: number
    data?: CrewRatingResponseSchema | null
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

  type ApiResponseCrewTaskDetailSchema_ = {
    /** Code */
    code: number
    data?: CrewTaskDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseCrewTaskStatsSchema_ = {
    /** Code */
    code: number
    data?: CrewTaskStatsSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseDashboardChartsSchema_ = {
    /** Code */
    code: number
    data?: DashboardChartsSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseDashboardOverviewSchema_ = {
    /** Code */
    code: number
    data?: DashboardOverviewSchema | null
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

  type ApiResponseListCrewTaskListItemSchema_ = {
    /** Code */
    code: number
    /** Data */
    data?: CrewTaskListItemSchema[] | null
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

  type ApiResponseOrderDetailSchema_ = {
    /** Code */
    code: number
    data?: OrderDetailSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseOrderResponseSchema_ = {
    /** Code */
    code: number
    data?: OrderResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponseOrderStatsSchema_ = {
    /** Code */
    code: number
    data?: app_schemas_order_OrderStatsSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataAdminBoatListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataAdminBoatListItemSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataAdminOrderListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataAdminOrderListItemSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataAdminProductListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataAdminProductListItemSchema_ | null
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

  type ApiResponsePaginatedDataBookingDetailSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataBookingDetailSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataBookingListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataBookingListItemSchema_ | null
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

  type ApiResponsePaginatedDataCrewTaskListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataCrewTaskListItemSchema_ | null
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

  type ApiResponsePaginatedDataOrderDetailSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataOrderDetailSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataOrderListItemSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataOrderListItemSchema_ | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type ApiResponsePaginatedDataPaymentStatusResponseSchema_ = {
    /** Code */
    code: number
    data?: PaginatedDataPaymentStatusResponseSchema_ | null
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

  type ApiResponsePaymentStatusResponseSchema_ = {
    /** Code */
    code: number
    data?: PaymentStatusResponseSchema | null
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

  type ApiResponseRefundResponseSchema_ = {
    /** Code */
    code: number
    data?: RefundResponseSchema | null
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

  type app_schemas_booking_BookingStatsSchema = {
    /** Total Bookings 总预约数 */
    total_bookings: number
    /** Pending Bookings 待确认预约数 */
    pending_bookings: number
    /** Confirmed Bookings 已确认预约数 */
    confirmed_bookings: number
    /** Completed Bookings 已完成预约数 */
    completed_bookings: number
    /** Cancelled Bookings 已取消预约数 */
    cancelled_bookings: number
    /** Total Revenue 总收入 */
    total_revenue: number
    /** Average Rating 平均评分 */
    average_rating: number
  }

  type app_schemas_booking_PaymentResponseSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** Total Amount 支付金额 */
    total_amount: number
    /** Payment Status 支付状态 */
    payment_status: string
    /** Payment Time 支付时间 */
    payment_time: string
    /** Payment Method 支付方式 */
    payment_method: string
    /** Payment Notes 支付备注 */
    payment_notes?: string | null
  }

  type app_schemas_dashboard_BookingStatsSchema = {
    /** Total Bookings 预约总数 */
    total_bookings: number
    /** Pending Bookings 待确认预约数 */
    pending_bookings: number
    /** Confirmed Bookings 已确认预约数 */
    confirmed_bookings: number
    /** Completed Bookings 已完成预约数 */
    completed_bookings: number
    /** Cancelled Bookings 已取消预约数 */
    cancelled_bookings: number
    /** Total Booking Amount 预约总金额 */
    total_booking_amount: number
    /** Paid Booking Amount 已支付预约金额 */
    paid_booking_amount: number
    /** Average Booking Duration 平均预约时长(小时) */
    average_booking_duration: number
    /** Recent Bookings 近7天预约数 */
    recent_bookings: number
  }

  type app_schemas_dashboard_OrderStatsSchema = {
    /** Total Orders 订单总数 */
    total_orders: number
    /** Pending Orders 待支付订单数 */
    pending_orders: number
    /** Paid Orders 已支付订单数 */
    paid_orders: number
    /** Completed Orders 已完成订单数 */
    completed_orders: number
    /** Cancelled Orders 已取消订单数 */
    cancelled_orders: number
    /** Total Order Amount 订单总金额 */
    total_order_amount: number
    /** Paid Amount 已支付金额 */
    paid_amount: number
    /** Platform Commission 平台抽成(5%) */
    platform_commission: number
    /** Recent Orders 近7天订单数 */
    recent_orders: number
  }

  type app_schemas_order_OrderStatsSchema = {
    /** Total Orders 订单总数 */
    total_orders: number
    /** Pending Orders 待支付订单数 */
    pending_orders: number
    /** Paid Orders 已支付订单数 */
    paid_orders: number
    /** Shipped Orders 已发货订单数 */
    shipped_orders: number
    /** Completed Orders 已完成订单数 */
    completed_orders: number
    /** Cancelled Orders 已取消订单数 */
    cancelled_orders: number
    /** Total Amount 订单总金额 */
    total_amount: number
    /** Paid Amount 已支付金额 */
    paid_amount: number
  }

  type app_schemas_order_PaymentResponseSchema = {
    /** Id 支付记录ID */
    id: number
    /** Payment Number 支付单号 */
    payment_number: string
    /** Order Id 订单ID */
    order_id: number
    /** Amount 支付金额 */
    amount: number
    /** 支付方式 */
    payment_method: PaymentMethod
    /** Is Success 是否支付成功 */
    is_success: boolean
    /** Third Party Number 第三方支付单号 */
    third_party_number?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Paid At 支付时间 */
    paid_at?: string | null
  }

  type app_schemas_response_ApiResponsePaymentResponseSchema_1 = {
    /** Code */
    code: number
    data?: app_schemas_booking_PaymentResponseSchema | null
    /** Message */
    message: string
    /** Success */
    success: boolean
  }

  type app_schemas_response_ApiResponsePaymentResponseSchema_2 = {
    /** Code */
    code: number
    data?: app_schemas_order_PaymentResponseSchema | null
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

  type BoatStatsSchema = {
    /** Total Boats 船舶总数 */
    total_boats: number
    /** Available Boats 可用船舶数 */
    available_boats: number
    /** In Use Boats 使用中船舶数 */
    in_use_boats: number
    /** Maintenance Boats 维护中船舶数 */
    maintenance_boats: number
    /** Inactive Boats 停用船舶数 */
    inactive_boats: number
    /** Type Distribution 类型分布 */
    type_distribution: Record<string, any>
    /** Average Hourly Rate 平均小时费率 */
    average_hourly_rate: number
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

  type BookingAvailabilityResponseSchema = {
    /** Available 是否可用 */
    available: boolean
    /** Reason 不可用原因 */
    reason?: string | null
    /** Conflicting Bookings 冲突预约列表 */
    conflicting_bookings?: Record<string, any>[]
  }

  type BookingCreateSchema = {
    /** Boat Id 船只ID */
    boat_id: number
    /** Start Time 开始时间 */
    start_time: string
    /** End Time 结束时间 */
    end_time: string
    /** Passenger Count 乘客人数 */
    passenger_count: number
    /** Contact Name 联系人姓名 */
    contact_name: string
    /** Contact Phone 联系电话 */
    contact_phone: string
    /** User Notes 用户备注 */
    user_notes?: string | null
  }

  type BookingDetailSchema = {
    /** Id 预约ID */
    id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** User Id 用户ID */
    user_id: number
    /** Boat Id 船只ID */
    boat_id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Assigned Crew Id 指派船员ID */
    assigned_crew_id?: number | null
    /** Start Time 开始时间 */
    start_time: string
    /** End Time 结束时间 */
    end_time: string
    /** Duration Hours 预约时长(小时) */
    duration_hours: number
    /** Passenger Count 乘客人数 */
    passenger_count: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number
    /** Total Amount 总金额 */
    total_amount: number
    /** 预约状态 */
    status: BookingStatus
    /** 支付状态 */
    payment_status: PaymentStatus
    /** Contact Name 联系人姓名 */
    contact_name: string
    /** Contact Phone 联系电话 */
    contact_phone: string
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Confirmed At 确认时间 */
    confirmed_at?: string | null
    /** Completed At 完成时间 */
    completed_at?: string | null
    /** Cancelled At 取消时间 */
    cancelled_at?: string | null
    /** User 用户信息 */
    user?: Record<string, any> | null
    /** Boat 船只信息 */
    boat?: Record<string, any> | null
    /** Merchant 商家信息 */
    merchant?: Record<string, any> | null
    /** Assigned Crew 船员信息 */
    assigned_crew?: Record<string, any> | null
    /** Crew Rating 船员评价 */
    crew_rating?: Record<string, any> | null
  }

  type BookingListItemSchema = {
    /** Id 预约ID */
    id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** Boat Name 船只名称 */
    boat_name: string
    /** Start Time 开始时间 */
    start_time: string
    /** End Time 结束时间 */
    end_time: string
    /** Passenger Count 乘客人数 */
    passenger_count: number
    /** Total Amount 总金额 */
    total_amount: number
    /** 预约状态 */
    status: BookingStatus
    /** 支付状态 */
    payment_status: PaymentStatus
    /** Contact Name 联系人姓名 */
    contact_name: string
    /** Contact Phone 联系电话 */
    contact_phone: string
    /** Created At 创建时间 */
    created_at: string
  }

  type BookingResponseSchema = {
    /** Id 预约ID */
    id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** User Id 用户ID */
    user_id: number
    /** Boat Id 船只ID */
    boat_id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Assigned Crew Id 指派船员ID */
    assigned_crew_id?: number | null
    /** Start Time 开始时间 */
    start_time: string
    /** End Time 结束时间 */
    end_time: string
    /** Duration Hours 预约时长(小时) */
    duration_hours: number
    /** Passenger Count 乘客人数 */
    passenger_count: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number
    /** Total Amount 总金额 */
    total_amount: number
    /** 预约状态 */
    status: BookingStatus
    /** 支付状态 */
    payment_status: PaymentStatus
    /** Contact Name 联系人姓名 */
    contact_name: string
    /** Contact Phone 联系电话 */
    contact_phone: string
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Confirmed At 确认时间 */
    confirmed_at?: string | null
    /** Completed At 完成时间 */
    completed_at?: string | null
    /** Cancelled At 取消时间 */
    cancelled_at?: string | null
  }

  type BookingStatus =
    | 'pending'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'rejected'

  type BookingStatusUpdateSchema = {
    /** 预约状态 */
    status: BookingStatus
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
  }

  type cancelBookingApiV1BookingsBookingIdCancelPatchParams = {
    /** 预约ID */
    booking_id: number
  }

  type cancelOrderApiV1OrdersOrderIdCancelPatchParams = {
    /** 订单ID */
    order_id: number
  }

  type CartAddSchema = {
    /** Product Id 商品ID */
    product_id: number
    /** Quantity 数量 */
    quantity: number
  }

  type CartItemResponseSchema = {
    /** Id 购物车项ID */
    id: number
    /** Product Id 商品ID */
    product_id: number
    /** Quantity 数量 */
    quantity: number
    /** Created At 添加时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Product 商品信息 */
    product?: Record<string, any> | null
    /** Subtotal 小计金额 */
    subtotal: number
  }

  type CartUpdateSchema = {
    /** Quantity 数量 */
    quantity: number
  }

  type ChangePasswordSchema = {
    /** Old Password */
    old_password: string
    /** New Password */
    new_password: string
    /** Confirm Password */
    confirm_password: string
  }

  type ChartDataSchema = {
    /** Labels 标签列表 */
    labels: string[]
    /** Data 数据列表 */
    data: number[]
    /** Title 图表标题 */
    title: string
  }

  type checkBoatAvailabilityApiV1BookingsAvailabilityGetParams = {
    /** 船只ID */
    boat_id: number
    /** 开始时间 */
    start_time: string
    /** 结束时间 */
    end_time: string
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

  type confirmReceiptApiV1OrdersOrderIdConfirmReceiptPatchParams = {
    /** 订单ID */
    order_id: number
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

  type CrewAssignmentSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Crew Id 船员ID */
    crew_id: number
    /** Notes 派单备注 */
    notes?: string | null
  }

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

  type CrewRatingCreateSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Rating 评分(1-5) */
    rating: number
    /** Comment 评价内容 */
    comment?: string | null
  }

  type CrewRatingResponseSchema = {
    /** Id 评价ID */
    id: number
    /** Booking Id 预约ID */
    booking_id: number
    /** User Id 用户ID */
    user_id: number
    /** Crew Id 船员ID */
    crew_id: number
    /** Rating 评分 */
    rating: number
    /** Comment 评价内容 */
    comment?: string | null
    /** Created At 创建时间 */
    created_at: string
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

  type CrewStatsSchema = {
    /** Total Crews 船员总数 */
    total_crews: number
    /** Active Crews 活跃船员数 */
    active_crews: number
    /** Inactive Crews 非活跃船员数 */
    inactive_crews: number
    /** Average Rating 平均评分 */
    average_rating: number
    /** Total Ratings 评价总数 */
    total_ratings: number
  }

  type CrewStatus = 'active' | 'inactive'

  type CrewTaskDetailSchema = {
    /** Id 预约ID */
    id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** Boat 船只信息 */
    boat: Record<string, any>
    /** Customer 客户信息 */
    customer: Record<string, any>
    /** Merchant 商家信息 */
    merchant: Record<string, any>
    /** Start Time 开始时间 */
    start_time: string
    /** End Time 结束时间 */
    end_time: string
    /** Duration Hours 预约时长(小时) */
    duration_hours: number
    /** Passenger Count 乘客人数 */
    passenger_count: number
    /** Hourly Rate 小时费率 */
    hourly_rate: number
    /** Total Amount 总金额 */
    total_amount: number
    /** 预约状态 */
    status: BookingStatus
    /** 支付状态 */
    payment_status: PaymentStatus
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Confirmed At 确认时间 */
    confirmed_at?: string | null
    /** Completed At 完成时间 */
    completed_at?: string | null
    /** Crew Rating 船员评价 */
    crew_rating?: Record<string, any> | null
  }

  type CrewTaskListItemSchema = {
    /** Id 预约ID */
    id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** Boat Name 船只名称 */
    boat_name: string
    /** Customer Name 客户姓名 */
    customer_name: string
    /** Customer Phone 客户电话 */
    customer_phone: string
    /** Start Time 开始时间 */
    start_time: string
    /** End Time 结束时间 */
    end_time: string
    /** Passenger Count 乘客人数 */
    passenger_count: number
    /** Total Amount 总金额 */
    total_amount: number
    /** 预约状态 */
    status: BookingStatus
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Created At 创建时间 */
    created_at: string
  }

  type CrewTaskStatsSchema = {
    /** Total Tasks 总任务数 */
    total_tasks: number
    /** Confirmed Tasks 已确认任务数 */
    confirmed_tasks: number
    /** In Progress Tasks 进行中任务数 */
    in_progress_tasks: number
    /** Completed Tasks 已完成任务数 */
    completed_tasks: number
    /** Total Earnings 总收入 */
    total_earnings: number
    /** Average Rating 平均评分 */
    average_rating: number
    /** Current Month Tasks 本月任务数 */
    current_month_tasks: number
    /** Current Month Earnings 本月收入 */
    current_month_earnings: number
  }

  type CrewTaskStatusUpdateSchema = {
    /** 任务状态 */
    status: BookingStatus
    /** Notes 船员备注 */
    notes?: string | null
  }

  type CrewUpdateSchema = {
    /** Boat License */
    boat_license?: string | null
    status?: CrewStatus | null
    /** Rating */
    rating?: number | null
  }

  type DashboardChartsSchema = {
    /** 用户增长图表 */
    user_growth_chart: ChartDataSchema
    /** 订单趋势图表 */
    order_trend_chart: ChartDataSchema
    /** 预约趋势图表 */
    booking_trend_chart: ChartDataSchema
    /** 收入图表 */
    revenue_chart: ChartDataSchema
    /** 商品分类饼图 */
    category_pie_chart: ChartDataSchema
    /** 船舶类型饼图 */
    boat_type_pie_chart: ChartDataSchema
  }

  type DashboardOverviewSchema = {
    /** 用户统计 */
    user_stats: UserStatsSchema
    /** 商家统计 */
    merchant_stats: MerchantStatsSchema
    /** 商品统计 */
    product_stats: ProductStatsSchema
    /** 船舶统计 */
    boat_stats: BoatStatsSchema
    /** 订单统计 */
    order_stats: app_schemas_dashboard_OrderStatsSchema
    /** 预约统计 */
    booking_stats: app_schemas_dashboard_BookingStatsSchema
    /** 船员统计 */
    crew_stats: CrewStatsSchema
    /** 财务统计 */
    financial_stats: FinancialStatsSchema
    /** 近期活动 */
    recent_activity: RecentActivitySchema
    /** Last Updated 最后更新时间 */
    last_updated: string
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

  type DirectOrderCreateSchema = {
    /** Product Id 商品ID */
    product_id: number
    /** Quantity 数量 */
    quantity: number
    /** Receiver Name 收货人姓名 */
    receiver_name: string
    /** Receiver Phone 收货人电话 */
    receiver_phone: string
    /** Receiver Address 收货地址 */
    receiver_address: string
    /** User Notes 用户备注 */
    user_notes?: string | null
  }

  type FinancialStatsSchema = {
    /** Total Revenue 总收入 */
    total_revenue: number
    /** Order Revenue 订单收入 */
    order_revenue: number
    /** Booking Revenue 预约收入 */
    booking_revenue: number
    /** Platform Commission 平台抽成 */
    platform_commission: number
    /** Merchant Earnings 商家收入 */
    merchant_earnings: number
    /** Crew Earnings 船员收入 */
    crew_earnings: number
  }

  type ForgotPasswordSchema = {
    /** Email */
    email: string
  }

  type getAllBookingsApiV1BookingsAdminAllGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: BookingStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
    /** 商家ID过滤 */
    merchant_id?: number | null
    /** 用户ID过滤 */
    user_id?: number | null
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

  type getBookingDetailApiV1BookingsBookingIdGetParams = {
    /** 预约ID */
    booking_id: number
  }

  type getBookingRatingApiV1BookingsRatingsBookingIdGetParams = {
    /** 预约ID */
    booking_id: number
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

  type getCrewTaskDetailApiV1BookingsCrewTasksBookingIdGetParams = {
    /** 预约任务ID */
    booking_id: number
  }

  type getCrewTasksApiV1BookingsCrewTasksGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: BookingStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
  }

  type getMerchantAuditHistoryApiV1MerchantsMerchantIdAuditHistoryGetParams = {
    merchant_id: number
  }

  type getMerchantBookingsApiV1BookingsMerchantListGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: BookingStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
    /** 船只ID过滤 */
    boat_id?: number | null
    /** 用户ID过滤 */
    user_id?: number | null
  }

  type getMerchantByIdApiV1MerchantsMerchantIdGetParams = {
    merchant_id: number
  }

  type getMerchantOrderDetailApiV1OrdersMerchantOrderIdGetParams = {
    /** 订单ID */
    order_id: number
  }

  type getMerchantOrdersApiV1OrdersMerchantListGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: OrderStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
    /** 用户ID过滤 */
    user_id?: number | null
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

  type getMyBookingsApiV1BookingsMyGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: BookingStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
    /** 船只ID过滤 */
    boat_id?: number | null
  }

  type getMyCrewApplicationsApiV1CrewMyApplicationsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
  }

  type getMyOrdersApiV1OrdersMyGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 状态过滤 */
    status?: OrderStatus | null
    /** 开始日期 */
    start_date?: string | null
    /** 结束日期 */
    end_date?: string | null
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

  type getOrderDetailApiV1OrdersOrderIdGetParams = {
    /** 订单ID */
    order_id: number
  }

  type getPaymentStatusApiV1BookingsPaymentStatusBookingIdGetParams = {
    /** 预约ID */
    booking_id: number
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

  type getUserInfoByCrewApiV1UsersInfoByCrewGetParams = {
    /** 船员ID */
    crew_id: number
  }

  type getUserInfoByMerchantApiV1UsersInfoByMerchantGetParams = {
    /** 商家ID */
    merchant_id: number
  }

  type getUserInfoByRoleApiV1UsersInfoByRoleGetParams = {
    /** 商家ID */
    merchant_id?: number | null
    /** 船员ID */
    crew_id?: number | null
  }

  type getUserPaymentRecordsApiV1BookingsPaymentRecordsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
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

  type MerchantStatsSchema = {
    /** Total Merchants 商家总数 */
    total_merchants: number
    /** Active Merchants 活跃商家数 */
    active_merchants: number
    /** Pending Merchants 待审核商家数 */
    pending_merchants: number
    /** Suspended Merchants 暂停商家数 */
    suspended_merchants: number
    /** Recent Applications 近7天申请数 */
    recent_applications: number
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

  type OrderCreateSchema = {
    /** Cart Item Ids 购物车商品ID列表 */
    cart_item_ids: number[]
    /** Receiver Name 收货人姓名 */
    receiver_name: string
    /** Receiver Phone 收货人电话 */
    receiver_phone: string
    /** Receiver Address 收货地址 */
    receiver_address: string
    /** User Notes 用户备注 */
    user_notes?: string | null
  }

  type OrderDetailSchema = {
    /** Id 订单ID */
    id: number
    /** Order Number 订单号 */
    order_number: string
    /** User Id 用户ID */
    user_id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Total Amount 订单总金额 */
    total_amount: number
    /** Discount Amount 优惠金额 */
    discount_amount: number
    /** Shipping Fee 运费 */
    shipping_fee: number
    /** Final Amount 实付金额 */
    final_amount: number
    /** 订单状态 */
    status: OrderStatus
    /** 支付方式 */
    payment_method?: PaymentMethod | null
    /** Receiver Name 收货人姓名 */
    receiver_name: string
    /** Receiver Phone 收货人电话 */
    receiver_phone: string
    /** Receiver Address 收货地址 */
    receiver_address: string
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Paid At 支付时间 */
    paid_at?: string | null
    /** Shipped At 发货时间 */
    shipped_at?: string | null
    /** Delivered At 送达时间 */
    delivered_at?: string | null
    /** Completed At 完成时间 */
    completed_at?: string | null
    /** Cancelled At 取消时间 */
    cancelled_at?: string | null
    /** User 用户信息 */
    user?: Record<string, any> | null
    /** Merchant 商家信息 */
    merchant?: Record<string, any> | null
    /** Order Items 订单项列表 */
    order_items?: OrderItemResponseSchema[]
  }

  type OrderItemResponseSchema = {
    /** Id 订单项ID */
    id: number
    /** Product Id 商品ID */
    product_id: number
    /** Quantity 数量 */
    quantity: number
    /** Unit Price 单价 */
    unit_price: number
    /** Total Price 小计 */
    total_price: number
    /** Product Name 商品名称 */
    product_name: string
    /** Product Unit 计量单位 */
    product_unit: string
    /** Product Image 商品图片 */
    product_image?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Product 商品信息 */
    product?: Record<string, any> | null
  }

  type OrderListItemSchema = {
    /** Id 订单ID */
    id: number
    /** Order Number 订单号 */
    order_number: string
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Merchant Name 商家名称 */
    merchant_name: string
    /** Total Amount 订单总金额 */
    total_amount: number
    /** Final Amount 实付金额 */
    final_amount: number
    /** 订单状态 */
    status: OrderStatus
    /** Item Count 商品种类数 */
    item_count: number
    /** Total Quantity 商品总数量 */
    total_quantity: number
    /** Created At 创建时间 */
    created_at: string
  }

  type OrderResponseSchema = {
    /** Id 订单ID */
    id: number
    /** Order Number 订单号 */
    order_number: string
    /** User Id 用户ID */
    user_id: number
    /** Merchant Id 商家ID */
    merchant_id: number
    /** Total Amount 订单总金额 */
    total_amount: number
    /** Discount Amount 优惠金额 */
    discount_amount: number
    /** Shipping Fee 运费 */
    shipping_fee: number
    /** Final Amount 实付金额 */
    final_amount: number
    /** 订单状态 */
    status: OrderStatus
    /** 支付方式 */
    payment_method?: PaymentMethod | null
    /** Receiver Name 收货人姓名 */
    receiver_name: string
    /** Receiver Phone 收货人电话 */
    receiver_phone: string
    /** Receiver Address 收货地址 */
    receiver_address: string
    /** User Notes 用户备注 */
    user_notes?: string | null
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
    /** Created At 创建时间 */
    created_at: string
    /** Updated At 更新时间 */
    updated_at: string
    /** Paid At 支付时间 */
    paid_at?: string | null
    /** Shipped At 发货时间 */
    shipped_at?: string | null
    /** Delivered At 送达时间 */
    delivered_at?: string | null
    /** Completed At 完成时间 */
    completed_at?: string | null
    /** Cancelled At 取消时间 */
    cancelled_at?: string | null
  }

  type OrderStatus =
    | 'pending'
    | 'paid'
    | 'shipped'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'refunded'

  type OrderStatusUpdateSchema = {
    /** 订单状态 */
    status: OrderStatus
    /** Merchant Notes 商家备注 */
    merchant_notes?: string | null
    /** Cancel Reason 取消原因 */
    cancel_reason?: string | null
  }

  type PaginatedDataAdminBoatListItemSchema_ = {
    /** Items */
    items: AdminBoatListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataAdminOrderListItemSchema_ = {
    /** Items */
    items: AdminOrderListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataAdminProductListItemSchema_ = {
    /** Items */
    items: AdminProductListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
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

  type PaginatedDataBookingDetailSchema_ = {
    /** Items */
    items: BookingDetailSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataBookingListItemSchema_ = {
    /** Items */
    items: BookingListItemSchema[]
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

  type PaginatedDataCrewTaskListItemSchema_ = {
    /** Items */
    items: CrewTaskListItemSchema[]
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

  type PaginatedDataOrderDetailSchema_ = {
    /** Items */
    items: OrderDetailSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataOrderListItemSchema_ = {
    /** Items */
    items: OrderListItemSchema[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Total Pages */
    total_pages: number
  }

  type PaginatedDataPaymentStatusResponseSchema_ = {
    /** Items */
    items: PaymentStatusResponseSchema[]
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

  type PaymentCreateSchema = {
    /** Order Id 订单ID */
    order_id: number
    /** 支付方式 */
    payment_method: PaymentMethod
  }

  type PaymentMethod = 'alipay' | 'wechat' | 'bankcard' | 'balance'

  type PaymentRequestSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Payment Method 支付方式（模拟支付） */
    payment_method?: string
    /** Payment Notes 支付备注 */
    payment_notes?: string | null
  }

  type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'refunding'

  type PaymentStatusResponseSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** Total Amount 订单金额 */
    total_amount: number
    /** Payment Status 支付状态 */
    payment_status: string
    /** Booking Status 预约状态 */
    booking_status: string
    /** Created At 创建时间 */
    created_at: string
    /** Payment Time 支付时间 */
    payment_time?: string | null
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

  type ProductStatsSchema = {
    /** Total Products 商品总数 */
    total_products: number
    /** Available Products 可售商品数 */
    available_products: number
    /** Sold Out Products 售罄商品数 */
    sold_out_products: number
    /** Inactive Products 下架商品数 */
    inactive_products: number
    /** Low Stock Products 低库存商品数(<=10) */
    low_stock_products: number
    /** Category Distribution 分类分布 */
    category_distribution: Record<string, any>
    /** Total Sales Amount 总销售额 */
    total_sales_amount: number
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

  type RecentActivitySchema = {
    /** Recent Users 近7天新用户 */
    recent_users: number
    /** Recent Merchants 近7天新商家 */
    recent_merchants: number
    /** Recent Orders 近7天新订单 */
    recent_orders: number
    /** Recent Bookings 近7天新预约 */
    recent_bookings: number
    /** Recent Products 近7天新商品 */
    recent_products: number
  }

  type RefundRequestSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Refund Reason 退款原因 */
    refund_reason: string
  }

  type RefundResponseSchema = {
    /** Booking Id 预约ID */
    booking_id: number
    /** Booking Number 预约单号 */
    booking_number: string
    /** Refund Amount 退款金额 */
    refund_amount: number
    /** Refund Status 退款状态 */
    refund_status: string
    /** Refund Time 退款时间 */
    refund_time: string
    /** Refund Reason 退款原因 */
    refund_reason: string
  }

  type removeCartItemApiV1CartCartItemIdDeleteParams = {
    /** 购物车项ID */
    cart_item_id: number
  }

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

  type updateBookingStatusApiV1BookingsBookingIdStatusPatchParams = {
    /** 预约ID */
    booking_id: number
  }

  type updateCartItemApiV1CartCartItemIdPutParams = {
    /** 购物车项ID */
    cart_item_id: number
  }

  type updateCrewApiV1CrewCrewIdPutParams = {
    crew_id: number
  }

  type updateCrewTaskStatusApiV1BookingsCrewTasksBookingIdStatusPatchParams = {
    /** 预约任务ID */
    booking_id: number
  }

  type updateMyBoatApiV1BoatsMyBoatIdPutParams = {
    /** 船只ID */
    boat_id: number
  }

  type updateMyProductApiV1ProductsMyProductIdPutParams = {
    /** 商品ID */
    product_id: number
  }

  type updateOrderStatusApiV1OrdersOrderIdStatusPatchParams = {
    /** 订单ID */
    order_id: number
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

  type UserStatsSchema = {
    /** Total Users 用户总数 */
    total_users: number
    /** Active Users 活跃用户数 */
    active_users: number
    /** Inactive Users 非活跃用户数 */
    inactive_users: number
    /** Verified Users 实名认证用户数 */
    verified_users: number
    /** Pending Verification 待认证用户数 */
    pending_verification: number
    /** Role Distribution 角色分布 */
    role_distribution: Record<string, any>
    /** Recent Registrations 近7天注册用户数 */
    recent_registrations: number
  }

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
