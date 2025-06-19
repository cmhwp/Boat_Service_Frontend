import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证相关路由
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/auth/login',
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: {
            title: '登录 - 绿色智能船艇农文旅平台',
            requiresGuest: true,
          },
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/auth/RegisterView.vue'),
          meta: {
            title: '注册 - 绿色智能船艇农文旅平台',
            requiresGuest: true,
          },
        },
      ],
    },
    // 主应用路由
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '首页 - 绿色智能船艇农文旅平台',
        requiresAuth: false,
      },
    },

    // 用户中心路由
    {
      path: '/user',
      component: () => import('@/layouts/UserLayout.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          redirect: '/user/dashboard',
        },
        {
          path: 'dashboard',
          name: 'UserDashboard',
          component: () => import('@/views/user/DashboardView.vue'),
          meta: {
            title: '用户中心 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'boats',
          name: 'UserBoats',
          component: () => import('@/views/user/BoatsView.vue'),
          meta: {
            title: '船舶预订 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'boats/:id',
          name: 'UserBoatDetail',
          component: () => import('@/views/user/BoatDetailView.vue'),
          meta: {
            title: '船舶详情 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'bookings',
          name: 'UserBookings',
          component: () => import('@/views/user/BookingsView.vue'),
          meta: {
            title: '我的预约 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'bookings/:id',
          name: 'UserBookingDetail',
          component: () => import('@/views/user/BookingDetailView.vue'),
          meta: {
            title: '预约详情 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: () => import('@/views/user/ProfileView.vue'),
          meta: {
            title: '个人中心 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'realname',
          name: 'UserRealname',
          component: () => import('@/views/user/ProfileView.vue'),
          meta: {
            title: '实名认证 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'qualification',
          name: 'UserQualification',
          component: () => import('@/views/user/QualificationView.vue'),
          meta: {
            title: '资格认证 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'products',
          name: 'UserProducts',
          component: () => import('@/views/user/ProductsView.vue'),
          meta: {
            title: '农产品采购 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'products/:id',
          name: 'UserProductDetail',
          component: () => import('@/views/user/ProductDetailView.vue'),
          meta: {
            title: '商品详情 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'cart',
          name: 'UserCart',
          component: () => import('@/views/user/CartView.vue'),
          meta: {
            title: '购物车 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'orders',
          name: 'UserOrders',
          component: () => import('@/views/user/OrdersView.vue'),
          meta: {
            title: '我的订单 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'orders/:id',
          name: 'UserOrderDetail',
          component: () => import('@/views/user/OrderDetailView.vue'),
          meta: {
            title: '订单详情 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
        {
          path: 'checkout',
          name: 'UserCheckout',
          component: () => import('@/views/user/CheckoutView.vue'),
          meta: {
            title: '订单结算 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
          },
        },
      ],
    },

    // 管理员路由
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'admin',
      },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: {
            title: '管理员仪表板 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'admin',
          },
        },
        {
          path: 'realname',
          name: 'AdminRealname',
          component: () => import('@/views/admin/RealNameView.vue'),
        },
        {
          path: 'merchantAudit',
          name: 'AdminMerchantAudit',
          component: () => import('@/views/admin/MerchantAduitView.vue'),
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('@/views/admin/UsersView.vue'),
        },
      ],
    },

    // 商家路由
    {
      path: '/merchant',
      component: () => import('@/layouts/MerchantLayout.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'merchant',
      },
      children: [
        {
          path: '',
          redirect: '/merchant/dashboard',
        },
        {
          path: 'dashboard',
          name: 'MerchantDashboard',
          component: () => import('@/views/merchant/DashboardView.vue'),
          meta: {
            title: '商家经营概况 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
        {
          path: 'crew',
          name: 'MerchantCrew',
          component: () => import('@/views/merchant/CrewView.vue'),
        },
        {
          path: 'boats',
          name: 'MerchantBoats',
          component: () => import('@/views/merchant/BoatsView.vue'),
          meta: {
            title: '我的船艇 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
        {
          path: 'boats/add',
          name: 'MerchantBoatAdd',
          component: () => import('@/views/merchant/BoatAddView.vue'),
          meta: {
            title: '添加船艇 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
        {
          path: 'boats/edit/:id',
          name: 'MerchantBoatEdit',
          component: () => import('@/views/merchant/BoatEditView.vue'),
          meta: {
            title: '编辑船艇 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
        {
          path: 'goods',
          name: 'MerchantGoods',
          component: () => import('@/views/merchant/GoodsView.vue'),
          meta: {
            title: '商品列表 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
        {
          path: 'goods/add',
          name: 'MerchantGoodsAdd',
          component: () => import('@/views/merchant/GoodsAddView.vue'),
          meta: {
            title: '添加商品 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
        {
          path: 'goods/edit/:id',
          name: 'MerchantGoodsEdit',
          component: () => import('@/views/merchant/GoodsEditView.vue'),
          meta: {
            title: '编辑商品 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'merchant',
          },
        },
      ],
    },

    // 船员路由
    {
      path: '/crew',
      component: () => import('@/layouts/CrewLayout.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'crew',
      },
      children: [
        {
          path: '',
          redirect: '/crew/dashboard',
        },
        {
          path: 'dashboard',
          name: 'CrewDashboard',
          component: () => import('@/views/crew/DashboardView.vue'),
          meta: {
            title: '船员工作台 - 绿色智能船艇农文旅平台',
            requiresAuth: true,
            requiredRole: 'crew',
          },
        },
      ],
    },

    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: '页面未找到 - 绿色智能船艇农文旅平台',
      },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }

  // 检查认证状态
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // 需要登录的页面
  if (to.meta?.requiresAuth && !isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 检查角色权限
  if (to.meta?.requiredRole && userRole !== to.meta.requiredRole) {
    // 如果用户角色不匹配，根据用户角色重定向到对应页面
    switch (userRole) {
      case 'admin':
        next('/admin')
        break
      case 'merchant':
        next('/merchant')
        break
      case 'crew':
        next('/crew')
        break
      case 'user':
        next('/user')
        break
      default:
        next('/')
    }
    return
  }

  // 已登录用户访问游客页面（如登录、注册）
  if (to.meta?.requiresGuest && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

// 路由后置守卫
router.afterEach(() => {
  // 页面切换后滚动到顶部
  window.scrollTo(0, 0)
})

export default router
