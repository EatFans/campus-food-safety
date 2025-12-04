import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layout/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: MainLayout,
    meta: { requiresAuth: true },
    redirect: '/dashboard/overview',
    children: [
      // 数据总览
      {
        path: 'overview',
        name: 'overview',
        component: () => import('../views/dashboard/OverviewView.vue'),
        meta: { requiresAuth: true, title: '数据总览' }
      },

      // ==================== 校园食品安全管理系统 ====================
      
      // 基本档案系统
      {
        path: 'archives/school',
        name: 'archives-school',
        component: () => import('../views/dashboard/archives/SchoolInfoView.vue'),
        meta: { requiresAuth: true, title: '学校基本信息' }
      },
      {
        path: 'archives/canteen',
        name: 'archives-canteen',
        component: () => import('../views/dashboard/archives/CanteenInfoView.vue'),
        meta: { requiresAuth: true, title: '食堂基本信息' }
      },
      {
        path: 'archives/staff',
        name: 'archives-staff',
        component: () => import('../views/dashboard/archives/StaffInfoView.vue'),
        meta: { requiresAuth: true, title: '从业人员信息' }
      },
      {
        path: 'archives/merchant',
        name: 'archives-merchant',
        component: () => import('../views/dashboard/archives/MerchantInfoView.vue'),
        meta: { requiresAuth: true, title: '商家档案管理' }
      },

      // 溯源采购系统
      {
        path: 'traceability/production',
        name: 'traceability-production',
        component: () => import('../views/dashboard/traceability/ProductionView.vue'),
        meta: { requiresAuth: true, title: '生产环节信息' }
      },
      {
        path: 'traceability/storage',
        name: 'traceability-storage',
        component: () => import('../views/dashboard/traceability/StorageView.vue'),
        meta: { requiresAuth: true, title: '仓储环节信息' }
      },
      {
        path: 'traceability/processing',
        name: 'traceability-processing',
        component: () => import('../views/dashboard/traceability/ProcessingView.vue'),
        meta: { requiresAuth: true, title: '加工环节信息' }
      },
      {
        path: 'traceability/logistics',
        name: 'traceability-logistics',
        component: () => import('../views/dashboard/traceability/LogisticsView.vue'),
        meta: { requiresAuth: true, title: '物流环节信息' }
      },
      {
        path: 'traceability/distribution',
        name: 'traceability-distribution',
        component: () => import('../views/dashboard/traceability/DistributionView.vue'),
        meta: { requiresAuth: true, title: '分销环节信息' }
      },
      {
        path: 'traceability/sales',
        name: 'traceability-sales',
        component: () => import('../views/dashboard/traceability/SalesView.vue'),
        meta: { requiresAuth: true, title: '销售环节信息' }
      },
      {
        path: 'traceability/qrcode',
        name: 'traceability-qrcode',
        component: () => import('../views/dashboard/traceability/QRCodeView.vue'),
        meta: { requiresAuth: true, title: '二维码管理' }
      },

      // 过程管理系统
      {
        path: 'process/sample',
        name: 'process-sample',
        component: () => import('../views/dashboard/process/SampleView.vue'),
        meta: { requiresAuth: true, title: '留样记录' }
      },
      {
        path: 'process/waste',
        name: 'process-waste',
        component: () => import('../views/dashboard/process/WasteView.vue'),
        meta: { requiresAuth: true, title: '餐厨垃圾处理' }
      },
      {
        path: 'process/inspection',
        name: 'process-inspection',
        component: () => import('../views/dashboard/process/InspectionView.vue'),
        meta: { requiresAuth: true, title: '日常监督检查' }
      },
      {
        path: 'process/spotcheck',
        name: 'process-spotcheck',
        component: () => import('../views/dashboard/process/SpotCheckView.vue'),
        meta: { requiresAuth: true, title: '抽检记录' }
      },
      {
        path: 'process/quicktest',
        name: 'process-quicktest',
        component: () => import('../views/dashboard/process/QuickTestView.vue'),
        meta: { requiresAuth: true, title: '快检记录' }
      },

      // 明厨亮灶系统
      {
        path: 'kitchen-monitor/video-archive',
        name: 'kitchen-monitor-video-archive',
        component: () => import('../views/dashboard/kitchen-monitor/VideoArchiveView.vue'),
        meta: { requiresAuth: true, title: '影像留痕' }
      },
      {
        path: 'kitchen-monitor/video-patrol',
        name: 'kitchen-monitor-video-patrol',
        component: () => import('../views/dashboard/kitchen-monitor/VideoPatrolView.vue'),
        meta: { requiresAuth: true, title: '视频巡检' }
      },
      {
        path: 'kitchen-monitor/ai-analysis',
        name: 'kitchen-monitor-ai-analysis',
        component: () => import('../views/dashboard/kitchen-monitor/AIAnalysisView.vue'),
        meta: { requiresAuth: true, title: 'AI智能分析' }
      },

      // 风险预警系统
      {
        path: 'risk-warning/test-fail',
        name: 'risk-warning-test-fail',
        component: () => import(/* webpackChunkName: "risk-warning" */ '../views/dashboard/risk-warning/TestFailWarningView.vue'),
        meta: { requiresAuth: true, title: '快检不合格预警' }
      },
      {
        path: 'risk-warning/expiry',
        name: 'risk-warning-expiry',
        component: () => import(/* webpackChunkName: "risk-warning" */ '../views/dashboard/risk-warning/ExpiryWarningView.vue'),
        meta: { requiresAuth: true, title: '过期预警' }
      },
      {
        path: 'risk-warning/abnormal',
        name: 'risk-warning-abnormal',
        component: () => import(/* webpackChunkName: "risk-warning" */ '../views/dashboard/risk-warning/AbnormalReminderView.vue'),
        meta: { requiresAuth: true, title: '异常提醒' }
      },
      {
        path: 'risk-warning/level',
        name: 'risk-warning-level',
        component: () => import(/* webpackChunkName: "risk-warning" */ '../views/dashboard/risk-warning/WarningLevelManageView.vue'),
        meta: { requiresAuth: true, title: '预警级别管理' }
      },

      // 食品安全报表中心
      {
        path: 'food-report/inventory',
        name: 'food-report-inventory',
        component: () => import(/* webpackChunkName: "report" */ '../views/dashboard/report/InventoryReportView.vue'),
        meta: { requiresAuth: true, title: '出入库报表' }
      },
      {
        path: 'food-report/process',
        name: 'food-report-process',
        component: () => import(/* webpackChunkName: "report" */ '../views/dashboard/report/ProcessReportView.vue'),
        meta: { requiresAuth: true, title: '过程管理报表' }
      },
      {
        path: 'food-report/operation',
        name: 'food-report-operation',
        component: () => import(/* webpackChunkName: "report" */ '../views/dashboard/report/OperationReportView.vue'),
        meta: { requiresAuth: true, title: '运维报表' }
      },
      {
        path: 'food-report/data-quality',
        name: 'food-report-data-quality',
        component: () => import(/* webpackChunkName: "report" */ '../views/dashboard/report/DataQualityView.vue'),
        meta: { requiresAuth: true, title: '数据质量分析' }
      },

      // 大数据分析中心
      {
        path: 'big-data/inventory-analysis',
        name: 'big-data-inventory-analysis',
        component: () => import(/* webpackChunkName: "big-data" */ '../views/dashboard/big-data/InventoryAnalysisView.vue'),
        meta: { requiresAuth: true, title: '出入库分析' }
      },
      {
        path: 'big-data/purchase-analysis',
        name: 'big-data-purchase-analysis',
        component: () => import(/* webpackChunkName: "big-data" */ '../views/dashboard/big-data/PurchaseAnalysisView.vue'),
        meta: { requiresAuth: true, title: '采购分析' }
      },
      {
        path: 'big-data/supply-comparison',
        name: 'big-data-supply-comparison',
        component: () => import(/* webpackChunkName: "big-data" */ '../views/dashboard/big-data/SupplyComparisonView.vue'),
        meta: { requiresAuth: true, title: '供应量对比分析' }
      },
      {
        path: 'big-data/risk-analysis',
        name: 'big-data-risk-analysis',
        component: () => import(/* webpackChunkName: "big-data" */ '../views/dashboard/big-data/FoodSafetyAnalysisView.vue'),
        meta: { requiresAuth: true, title: '食品安全风险分析' }
      },

      // 通知中心
      {
        path: 'notification/message',
        name: 'notification-message',
        component: () => import('../views/dashboard/notification/MessageView.vue'),
        meta: { requiresAuth: true, title: '消息通知' }
      },
      {
        path: 'notification/announcement',
        name: 'notification-announcement',
        component: () => import('../views/dashboard/notification/AnnouncementView.vue'),
        meta: { requiresAuth: true, title: '公告管理' }
      },
      {
        path: 'notification/warning',
        name: 'notification-warning',
        component: () => import('../views/dashboard/notification/WarningView.vue'),
        meta: { requiresAuth: true, title: '预警提醒' }
      },

      // 订单管理
      {
        path: 'order/list',
        name: 'order-list',
        component: () => import('../views/dashboard/order/OrderListView.vue'),
        meta: { requiresAuth: true, title: '订单列表' }
      },
      {
        path: 'order/pending',
        name: 'order-pending',
        component: () => import('../views/dashboard/order/PendingOrderView.vue'),
        meta: { requiresAuth: true, title: '待处理订单' }
      },
      {
        path: 'order/completed',
        name: 'order-completed',
        component: () => import('../views/dashboard/order/CompletedOrderView.vue'),
        meta: { requiresAuth: true, title: '已完成订单' }
      },
      {
        path: 'order/refund',
        name: 'order-refund',
        component: () => import('../views/dashboard/order/RefundManageView.vue'),
        meta: { requiresAuth: true, title: '退款管理' }
      },

      // 菜品菜谱
      {
        path: 'dish/list',
        name: 'dish-list',
        component: () => import('../views/dashboard/dish/DishListView.vue'),
        meta: { requiresAuth: true, title: '菜品列表' }
      },
      {
        path: 'dish/category',
        name: 'dish-category',
        component: () => import('../views/dashboard/dish/DishCategoryView.vue'),
        meta: { requiresAuth: true, title: '菜品分类' }
      },
      {
        path: 'dish/recipe',
        name: 'dish-recipe',
        component: () => import('../views/dashboard/dish/RecipeManageView.vue'),
        meta: { requiresAuth: true, title: '菜谱管理' }
      },
      {
        path: 'dish/nutrition',
        name: 'dish-nutrition',
        component: () => import('../views/dashboard/dish/NutritionAnalysisView.vue'),
        meta: { requiresAuth: true, title: '营养分析' }
      },

      // 食品安全
      {
        path: 'food-safety/inspection',
        name: 'food-safety-inspection',
        component: () => import('../views/dashboard/food-safety/InspectionView.vue'),
        meta: { requiresAuth: true, title: '安全检查' }
      },
      {
        path: 'food-safety/traceability',
        name: 'food-safety-traceability',
        component: () => import('../views/dashboard/food-safety/IngredientTraceView.vue'),
        meta: { requiresAuth: true, title: '食材溯源' }
      },
      {
        path: 'food-safety/quality',
        name: 'food-safety-quality',
        component: () => import('../views/dashboard/food-safety/QualityTestView.vue'),
        meta: { requiresAuth: true, title: '质量检测' }
      },
      {
        path: 'food-safety/certificate',
        name: 'food-safety-certificate',
        component: () => import('../views/dashboard/food-safety/LicenseManageView.vue'),
        meta: { requiresAuth: true, title: '证照管理' }
      },

      // 健康管理
      {
        path: 'health/employee',
        name: 'health-employee',
        component: () => import('../views/dashboard/health/HealthEmployeeView.vue'),
        meta: { requiresAuth: true, title: '员工健康' }
      },
      {
        path: 'health/check',
        name: 'health-check',
        component: () => import('../views/dashboard/health/HealthCheckView.vue'),
        meta: { requiresAuth: true, title: '健康检查' }
      },
      {
        path: 'health/record',
        name: 'health-record',
        component: () => import('../views/dashboard/health/HealthRecordView.vue'),
        meta: { requiresAuth: true, title: '健康档案' }
      },

      // 商超管理
      {
        path: 'supermarket/goods',
        name: 'supermarket-goods',
        component: () => import('../views/dashboard/supermarket/GoodsManageView.vue'),
        meta: { requiresAuth: true, title: '商品管理' }
      },
      {
        path: 'supermarket/inventory',
        name: 'supermarket-inventory',
        component: () => import('../views/dashboard/supermarket/InventoryManageView.vue'),
        meta: { requiresAuth: true, title: '库存管理' }
      },
      {
        path: 'supermarket/supplier',
        name: 'supermarket-supplier',
        component: () => import('../views/dashboard/supermarket/SupplierManageView.vue'),
        meta: { requiresAuth: true, title: '供应商管理' }
      },
      {
        path: 'supermarket/purchase',
        name: 'supermarket-purchase',
        component: () => import('../views/dashboard/supermarket/PurchaseManageView.vue'),
        meta: { requiresAuth: true, title: '采购管理' }
      },

      // 营销中心
      {
        path: 'marketing/activity',
        name: 'marketing-activity',
        component: () => import('../views/dashboard/marketing/ActivityManageView.vue'),
        meta: { requiresAuth: true, title: '营销活动' }
      },
      {
        path: 'marketing/coupon',
        name: 'marketing-coupon',
        component: () => import('../views/dashboard/marketing/CouponManageView.vue'),
        meta: { requiresAuth: true, title: '优惠券管理' }
      },
      {
        path: 'marketing/member',
        name: 'marketing-member',
        component: () => import('../views/dashboard/marketing/MemberManageView.vue'),
        meta: { requiresAuth: true, title: '会员管理' }
      },
      {
        path: 'marketing/points',
        name: 'marketing-points',
        component: () => import('../views/dashboard/marketing/PointsManageView.vue'),
        meta: { requiresAuth: true, title: '积分管理' }
      },

      // 员工管理
      {
        path: 'employee/list',
        name: 'employee-list',
        component: () => import('../views/dashboard/employee/EmployeeListView.vue'),
        meta: { requiresAuth: true, title: '员工列表' }
      },
      {
        path: 'employee/department',
        name: 'employee-department',
        component: () => import('../views/dashboard/employee/DepartmentManageView.vue'),
        meta: { requiresAuth: true, title: '部门管理' }
      },
      {
        path: 'employee/position',
        name: 'employee-position',
        component: () => import('../views/dashboard/employee/PositionManageView.vue'),
        meta: { requiresAuth: true, title: '岗位管理' }
      },
      {
        path: 'employee/training',
        name: 'employee-training',
        component: () => import('../views/dashboard/employee/TrainingManageView.vue'),
        meta: { requiresAuth: true, title: '培训管理' }
      },

      // 考勤管理
      {
        path: 'attendance/record',
        name: 'attendance-record',
        component: () => import('../views/dashboard/attendance/RecordManageView.vue'),
        meta: { requiresAuth: true, title: '考勤记录' }
      },
      {
        path: 'attendance/leave',
        name: 'attendance-leave',
        component: () => import('../views/dashboard/attendance/LeaveManageView.vue'),
        meta: { requiresAuth: true, title: '请假管理' }
      },
      {
        path: 'attendance/overtime',
        name: 'attendance-overtime',
        component: () => import('../views/dashboard/attendance/OvertimeManageView.vue'),
        meta: { requiresAuth: true, title: '加班管理' }
      },
      {
        path: 'attendance/schedule',
        name: 'attendance-schedule',
        component: () => import('../views/dashboard/attendance/ScheduleManageView.vue'),
        meta: { requiresAuth: true, title: '排班管理' }
      },

      // 审批中心
      {
        path: 'approval/pending',
        name: 'approval-pending',
        component: () => import('../views/dashboard/approval/PendingApprovalView.vue'),
        meta: { requiresAuth: true, title: '待审批' }
      },
      {
        path: 'approval/approved',
        name: 'approval-approved',
        component: () => import('../views/dashboard/approval/ApprovedView.vue'),
        meta: { requiresAuth: true, title: '已审批' }
      },
      {
        path: 'approval/initiated',
        name: 'approval-initiated',
        component: () => import('../views/dashboard/approval/MyInitiatedView.vue'),
        meta: { requiresAuth: true, title: '我发起的' }
      },
      {
        path: 'approval/flow',
        name: 'approval-flow',
        component: () => import('../views/dashboard/approval/WorkflowView.vue'),
        meta: { requiresAuth: true, title: '审批流程' }
      },

      // 设备管理
      {
        path: 'device/list',
        name: 'device-list',
        component: () => import('../views/dashboard/device/ListManageView.vue'),
        meta: { requiresAuth: true, title: '设备列表' }
      },
      {
        path: 'device/monitor',
        name: 'device-monitor',
        component: () => import('../views/dashboard/device/MonitorView.vue'),
        meta: { requiresAuth: true, title: '设备监控' }
      },
      {
        path: 'device/maintenance',
        name: 'device-maintenance',
        component: () => import('../views/dashboard/device/MaintenanceView.vue'),
        meta: { requiresAuth: true, title: '维护保养' }
      },
      {
        path: 'device/repair',
        name: 'device-repair',
        component: () => import('../views/dashboard/device/RepairView.vue'),
        meta: { requiresAuth: true, title: '维修记录' }
      },

      // 能源管理
      {
        path: 'energy/consumption',
        name: 'energy-consumption',
        component: () => import('../views/dashboard/energy/ConsumptionView.vue'),
        meta: { requiresAuth: true, title: '能耗统计' }
      },
      {
        path: 'energy/water',
        name: 'energy-water',
        component: () => import('../views/dashboard/energy/WaterView.vue'),
        meta: { requiresAuth: true, title: '用水管理' }
      },
      {
        path: 'energy/electricity',
        name: 'energy-electricity',
        component: () => import('../views/dashboard/energy/ElectricityView.vue'),
        meta: { requiresAuth: true, title: '用电管理' }
      },
      {
        path: 'energy/gas',
        name: 'energy-gas',
        component: () => import('../views/dashboard/energy/GasView.vue'),
        meta: { requiresAuth: true, title: '燃气管理' }
      },

      // 安全管理
      {
        path: 'security/video',
        name: 'security-video',
        component: () => import('../views/dashboard/security/VideoView.vue'),
        meta: { requiresAuth: true, title: '视频监控' }
      },
      {
        path: 'security/access',
        name: 'security-access',
        component: () => import('../views/dashboard/security/AccessView.vue'),
        meta: { requiresAuth: true, title: '门禁管理' }
      },
      {
        path: 'security/fire',
        name: 'security-fire',
        component: () => import('../views/dashboard/security/FireView.vue'),
        meta: { requiresAuth: true, title: '消防管理' }
      },
      {
        path: 'security/emergency',
        name: 'security-emergency',
        component: () => import('../views/dashboard/security/EmergencyView.vue'),
        meta: { requiresAuth: true, title: '应急预案' }
      },

      // 报表中心
      {
        path: 'report/sales',
        name: 'report-sales',
        component: () => import('../views/dashboard/report/SalesView.vue'),
        meta: { requiresAuth: true, title: '销售报表' }
      },
      {
        path: 'report/financial',
        name: 'report-financial',
        component: () => import('../views/dashboard/report/FinanceView.vue'),
        meta: { requiresAuth: true, title: '财务报表' }
      },
      {
        path: 'report/operation',
        name: 'report-operation',
        component: () => import('../views/dashboard/report/OperationView.vue'),
        meta: { requiresAuth: true, title: '运营报表' }
      },
      {
        path: 'report/custom',
        name: 'report-custom',
        component: () => import('../views/dashboard/report/CustomView.vue'),
        meta: { requiresAuth: true, title: '自定义报表' }
      },

      // 账户管理
      {
        path: 'account/profile',
        name: 'account-profile',
        component: () => import('../views/dashboard/account/ProfileView.vue'),
        meta: { requiresAuth: true, title: '个人信息' }
      },
      {
        path: 'account/security',
        name: 'account-security',
        component: () => import('../views/dashboard/account/SecurityView.vue'),
        meta: { requiresAuth: true, title: '安全设置' }
      },
      {
        path: 'account/notification',
        name: 'account-notification',
        component: () => import('../views/dashboard/account/NotificationView.vue'),
        meta: { requiresAuth: true, title: '通知设置' }
      },

      // 系统管理
      {
        path: 'system/user',
        name: 'system-user',
        component: () => import('../views/dashboard/system/UserView.vue'),
        meta: { requiresAuth: true, title: '用户管理' }
      },
      {
        path: 'system/role',
        name: 'system-role',
        component: () => import('../views/dashboard/system/RoleView.vue'),
        meta: { requiresAuth: true, title: '角色管理' }
      },
      {
        path: 'system/permission',
        name: 'system-permission',
        component: () => import('../views/dashboard/system/PermissionView.vue'),
        meta: { requiresAuth: true, title: '权限管理' }
      },
      {
        path: 'system/menu',
        name: 'system-menu',
        component: () => import('../views/dashboard/system/MenuView.vue'),
        meta: { requiresAuth: true, title: '菜单管理' }
      },
      {
        path: 'system/log',
        name: 'system-log',
        component: () => import('../views/dashboard/system/LogView.vue'),
        meta: { requiresAuth: true, title: '操作日志' }
      },
      {
        path: 'system/dict',
        name: 'system-dict',
        component: () => import('../views/dashboard/system/DictView.vue'),
        meta: { requiresAuth: true, title: '数据字典' }
      },

      // 基础设置
      {
        path: 'settings/basic',
        name: 'settings-basic',
        component: () => import('../views/dashboard/settings/BasicView.vue'),
        meta: { requiresAuth: true, title: '基本设置' }
      },
      {
        path: 'settings/parameter',
        name: 'settings-parameter',
        component: () => import('../views/dashboard/settings/ParameterView.vue'),
        meta: { requiresAuth: true, title: '参数配置' }
      },
      {
        path: 'settings/template',
        name: 'settings-template',
        component: () => import('../views/dashboard/settings/TemplateView.vue'),
        meta: { requiresAuth: true, title: '模板管理' }
      },
      {
        path: 'settings/backup',
        name: 'settings-backup',
        component: () => import('../views/dashboard/settings/BackupView.vue'),
        meta: { requiresAuth: true, title: '备份恢复' }
      },

      // 保留旧路由以兼容
      {
        path: 'workplace',
        name: 'workplace',
        component: () => import('../views/dashboard/WorkplaceView.vue'),
        meta: { requiresAuth: true, title: '工作台' }
      }
    ]
  },
  {
    path: '/',
    redirect: '/dashboard/overview'
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard/workplace'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守护 - 检查登录状态
router.beforeEach((to, from, next) => {
  // 获取本地存储的登录状态
  const isLogin = localStorage.getItem('isLogin') === 'true'
  
  // 如果目标路由需要认证
  if (to.meta.requiresAuth) {
    if (isLogin) {
      // 已登录,允许访问
      next()
    } else {
      // 未登录,重定向到登录页
      next('/login')
    }
  } else {
    // 不需要认证的路由
    if (to.path === '/login' && isLogin) {
      // 如果已登录且访问登录页,重定向到后台首页
      next('/dashboard/workplace')
    } else {
      next()
    }
  }
})

export default router
