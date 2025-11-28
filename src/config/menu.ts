// 菜单配置文件
// 图标使用 Iconify 图标库，可在 https://icon-sets.iconify.design/ 查找图标
export interface MenuItem {
  path: string
  title: string
  icon: string  // Iconify 图标名称，格式: 'collection:icon-name'
  hot?: boolean
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  // 数据总览
  {
    path: '/dashboard/overview',
    title: '数据总览',
    icon: 'mdi:view-dashboard-outline',
    hot: true
  },
  
  // 通知中心
  {
    path: '/dashboard/notification',
    title: '通知中心',
    icon: 'mdi:bell-outline',
    children: [
      {
        path: '/dashboard/notification/message',
        title: '消息通知',
        icon: 'mdi:message-text-outline'
      },
      {
        path: '/dashboard/notification/announcement',
        title: '公告管理',
        icon: 'mdi:bullhorn-outline'
      },
      {
        path: '/dashboard/notification/warning',
        title: '预警提醒',
        icon: 'mdi:alert-circle-outline'
      }
    ]
  },

  // 订单管理
  {
    path: '/dashboard/order',
    title: '订单管理',
    icon: 'mdi:cart-outline',
    children: [
      {
        path: '/dashboard/order/list',
        title: '订单列表',
        icon: 'mdi:format-list-bulleted'
      },
      {
        path: '/dashboard/order/pending',
        title: '待处理订单',
        icon: 'mdi:clock-outline'
      },
      {
        path: '/dashboard/order/completed',
        title: '已完成订单',
        icon: 'mdi:check-circle-outline'
      },
      {
        path: '/dashboard/order/refund',
        title: '退款管理',
        icon: 'mdi:cash-refund'
      }
    ]
  },

  // 菜品菜谱
  {
    path: '/dashboard/dish',
    title: '菜品菜谱',
    icon: 'mdi:food',
    children: [
      {
        path: '/dashboard/dish/list',
        title: '菜品列表',
        icon: 'mdi:food-variant'
      },
      {
        path: '/dashboard/dish/category',
        title: '菜品分类',
        icon: 'mdi:folder-outline'
      },
      {
        path: '/dashboard/dish/recipe',
        title: '菜谱管理',
        icon: 'mdi:book-open-variant'
      },
      {
        path: '/dashboard/dish/nutrition',
        title: '营养分析',
        icon: 'mdi:chart-pie'
      }
    ]
  },

  // 食品安全
  {
    path: '/dashboard/food-safety',
    title: '食品安全',
    icon: 'mdi:shield-check-outline',
    children: [
      {
        path: '/dashboard/food-safety/inspection',
        title: '安全检查',
        icon: 'mdi:clipboard-check-outline'
      },
      {
        path: '/dashboard/food-safety/traceability',
        title: '食材溯源',
        icon: 'mdi:map-marker-path'
      },
      {
        path: '/dashboard/food-safety/quality',
        title: '质量检测',
        icon: 'mdi:test-tube'
      },
      {
        path: '/dashboard/food-safety/certificate',
        title: '证照管理',
        icon: 'mdi:certificate-outline'
      }
    ]
  },

  // 健康管理
  {
    path: '/dashboard/health',
    title: '健康管理',
    icon: 'mdi:heart-pulse',
    children: [
      {
        path: '/dashboard/health/employee',
        title: '员工健康',
        icon: 'mdi:account-heart-outline'
      },
      {
        path: '/dashboard/health/check',
        title: '健康检查',
        icon: 'mdi:stethoscope'
      },
      {
        path: '/dashboard/health/record',
        title: '健康档案',
        icon: 'mdi:file-document-outline'
      }
    ]
  },

  // 商超管理
  {
    path: '/dashboard/supermarket',
    title: '商超管理',
    icon: 'mdi:store-outline',
    children: [
      {
        path: '/dashboard/supermarket/goods',
        title: '商品管理',
        icon: 'mdi:package-variant'
      },
      {
        path: '/dashboard/supermarket/inventory',
        title: '库存管理',
        icon: 'mdi:warehouse'
      },
      {
        path: '/dashboard/supermarket/supplier',
        title: '供应商管理',
        icon: 'mdi:truck-delivery-outline'
      },
      {
        path: '/dashboard/supermarket/purchase',
        title: '采购管理',
        icon: 'mdi:cart-plus'
      }
    ]
  },

  // 营销中心
  {
    path: '/dashboard/marketing',
    title: '营销中心',
    icon: 'mdi:bullseye-arrow',
    children: [
      {
        path: '/dashboard/marketing/activity',
        title: '营销活动',
        icon: 'mdi:gift-outline'
      },
      {
        path: '/dashboard/marketing/coupon',
        title: '优惠券管理',
        icon: 'mdi:ticket-percent-outline'
      },
      {
        path: '/dashboard/marketing/member',
        title: '会员管理',
        icon: 'mdi:account-star-outline'
      },
      {
        path: '/dashboard/marketing/points',
        title: '积分管理',
        icon: 'mdi:star-circle-outline'
      }
    ]
  },

  // 员工管理
  {
    path: '/dashboard/employee',
    title: '员工管理',
    icon: 'mdi:account-group-outline',
    children: [
      {
        path: '/dashboard/employee/list',
        title: '员工列表',
        icon: 'mdi:account-multiple-outline'
      },
      {
        path: '/dashboard/employee/department',
        title: '部门管理',
        icon: 'mdi:office-building-outline'
      },
      {
        path: '/dashboard/employee/position',
        title: '岗位管理',
        icon: 'mdi:briefcase-outline'
      },
      {
        path: '/dashboard/employee/training',
        title: '培训管理',
        icon: 'mdi:school-outline'
      }
    ]
  },

  // 考勤管理
  {
    path: '/dashboard/attendance',
    title: '考勤管理',
    icon: 'mdi:calendar-check-outline',
    children: [
      {
        path: '/dashboard/attendance/record',
        title: '考勤记录',
        icon: 'mdi:clipboard-text-clock-outline'
      },
      {
        path: '/dashboard/attendance/leave',
        title: '请假管理',
        icon: 'mdi:calendar-remove-outline'
      },
      {
        path: '/dashboard/attendance/overtime',
        title: '加班管理',
        icon: 'mdi:clock-plus-outline'
      },
      {
        path: '/dashboard/attendance/schedule',
        title: '排班管理',
        icon: 'mdi:calendar-clock'
      }
    ]
  },

  // 审批中心
  {
    path: '/dashboard/approval',
    title: '审批中心',
    icon: 'mdi:file-check-outline',
    children: [
      {
        path: '/dashboard/approval/pending',
        title: '待审批',
        icon: 'mdi:clock-alert-outline'
      },
      {
        path: '/dashboard/approval/approved',
        title: '已审批',
        icon: 'mdi:check-all'
      },
      {
        path: '/dashboard/approval/initiated',
        title: '我发起的',
        icon: 'mdi:send-outline'
      },
      {
        path: '/dashboard/approval/flow',
        title: '审批流程',
        icon: 'mdi:sitemap-outline'
      }
    ]
  },

  // 设备管理
  {
    path: '/dashboard/device',
    title: '设备管理',
    icon: 'mdi:devices',
    children: [
      {
        path: '/dashboard/device/list',
        title: '设备列表',
        icon: 'mdi:format-list-checkbox'
      },
      {
        path: '/dashboard/device/monitor',
        title: '设备监控',
        icon: 'mdi:monitor-dashboard'
      },
      {
        path: '/dashboard/device/maintenance',
        title: '维护保养',
        icon: 'mdi:tools'
      },
      {
        path: '/dashboard/device/repair',
        title: '维修记录',
        icon: 'mdi:wrench-outline'
      }
    ]
  },

  // 能源管理
  {
    path: '/dashboard/energy',
    title: '能源管理',
    icon: 'mdi:lightning-bolt-outline',
    children: [
      {
        path: '/dashboard/energy/consumption',
        title: '能耗统计',
        icon: 'mdi:chart-line'
      },
      {
        path: '/dashboard/energy/water',
        title: '用水管理',
        icon: 'mdi:water-outline'
      },
      {
        path: '/dashboard/energy/electricity',
        title: '用电管理',
        icon: 'mdi:flash-outline'
      },
      {
        path: '/dashboard/energy/gas',
        title: '燃气管理',
        icon: 'mdi:fire'
      }
    ]
  },

  // 安全管理
  {
    path: '/dashboard/security',
    title: '安全管理',
    icon: 'mdi:security',
    children: [
      {
        path: '/dashboard/security/video',
        title: '视频监控',
        icon: 'mdi:cctv'
      },
      {
        path: '/dashboard/security/access',
        title: '门禁管理',
        icon: 'mdi:door-closed-lock'
      },
      {
        path: '/dashboard/security/fire',
        title: '消防管理',
        icon: 'mdi:fire-extinguisher'
      },
      {
        path: '/dashboard/security/emergency',
        title: '应急预案',
        icon: 'mdi:alert-octagon-outline'
      }
    ]
  },

  // 报表中心
  {
    path: '/dashboard/report',
    title: '报表中心',
    icon: 'mdi:chart-box-outline',
    children: [
      {
        path: '/dashboard/report/sales',
        title: '销售报表',
        icon: 'mdi:chart-bar'
      },
      {
        path: '/dashboard/report/financial',
        title: '财务报表',
        icon: 'mdi:currency-usd'
      },
      {
        path: '/dashboard/report/operation',
        title: '运营报表',
        icon: 'mdi:chart-timeline-variant'
      },
      {
        path: '/dashboard/report/custom',
        title: '自定义报表',
        icon: 'mdi:file-chart-outline'
      }
    ]
  },

  // 账户管理
  {
    path: '/dashboard/account',
    title: '账户管理',
    icon: 'mdi:account-cog-outline',
    children: [
      {
        path: '/dashboard/account/profile',
        title: '个人信息',
        icon: 'mdi:account-circle-outline'
      },
      {
        path: '/dashboard/account/security',
        title: '安全设置',
        icon: 'mdi:shield-lock-outline'
      },
      {
        path: '/dashboard/account/notification',
        title: '通知设置',
        icon: 'mdi:bell-cog-outline'
      }
    ]
  },

  // 系统管理
  {
    path: '/dashboard/system',
    title: '系统管理',
    icon: 'mdi:cog-outline',
    children: [
      {
        path: '/dashboard/system/user',
        title: '用户管理',
        icon: 'mdi:account-multiple'
      },
      {
        path: '/dashboard/system/role',
        title: '角色管理',
        icon: 'mdi:shield-account-outline'
      },
      {
        path: '/dashboard/system/permission',
        title: '权限管理',
        icon: 'mdi:key-variant'
      },
      {
        path: '/dashboard/system/menu',
        title: '菜单管理',
        icon: 'mdi:menu'
      },
      {
        path: '/dashboard/system/log',
        title: '操作日志',
        icon: 'mdi:text-box-search-outline'
      },
      {
        path: '/dashboard/system/dict',
        title: '数据字典',
        icon: 'mdi:book-alphabet'
      }
    ]
  },

  // 基础设置
  {
    path: '/dashboard/settings',
    title: '基础设置',
    icon: 'mdi:tune',
    children: [
      {
        path: '/dashboard/settings/basic',
        title: '基本设置',
        icon: 'mdi:cog'
      },
      {
        path: '/dashboard/settings/parameter',
        title: '参数配置',
        icon: 'mdi:tune-vertical'
      },
      {
        path: '/dashboard/settings/template',
        title: '模板管理',
        icon: 'mdi:file-document-edit-outline'
      },
      {
        path: '/dashboard/settings/backup',
        title: '备份恢复',
        icon: 'mdi:backup-restore'
      }
    ]
  }
]
