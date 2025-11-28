// 菜单配置示例 - 展示更复杂的多级菜单结构
import type { MenuItem } from './menu'

export const menuConfigExample: MenuItem[] = [
  {
    path: '/dashboard/workplace',
    title: '工作台',
    icon: '📊'
  },
  {
    path: '/dashboard/data',
    title: '数据管理',
    icon: '📁',
    children: [
      {
        path: '/dashboard/data/overview',
        title: '数据概览',
        icon: '📈'
      },
      {
        path: '/dashboard/data/analysis',
        title: '数据分析',
        icon: '📊',
        children: [
          {
            path: '/dashboard/data/analysis/sales',
            title: '销售分析',
            icon: '💰'
          },
          {
            path: '/dashboard/data/analysis/user',
            title: '用户分析',
            icon: '👥'
          }
        ]
      },
      {
        path: '/dashboard/data/export',
        title: '数据导出',
        icon: '📤'
      }
    ]
  },
  {
    path: '/dashboard/food',
    title: '食品管理',
    icon: '🍱',
    children: [
      {
        path: '/dashboard/food/list',
        title: '食品列表',
        icon: '📋'
      },
      {
        path: '/dashboard/food/category',
        title: '食品分类',
        icon: '📁',
        children: [
          {
            path: '/dashboard/food/category/main',
            title: '主分类',
            icon: '📂'
          },
          {
            path: '/dashboard/food/category/sub',
            title: '子分类',
            icon: '📁'
          }
        ]
      },
      {
        path: '/dashboard/food/supplier',
        title: '供应商管理',
        icon: '🏢'
      }
    ]
  },
  {
    path: '/dashboard/safety',
    title: '安全检查',
    icon: '🛡️',
    children: [
      {
        path: '/dashboard/safety/inspection',
        title: '检查记录',
        icon: '📝'
      },
      {
        path: '/dashboard/safety/report',
        title: '检查报告',
        icon: '📄'
      },
      {
        path: '/dashboard/safety/warning',
        title: '预警管理',
        icon: '⚠️'
      }
    ]
  },
  {
    path: '/dashboard/system',
    title: '系统管理',
    icon: '⚙️',
    children: [
      {
        path: '/dashboard/system/user',
        title: '用户管理',
        icon: '👥',
        children: [
          {
            path: '/dashboard/system/user/list',
            title: '用户列表',
            icon: '📋'
          },
          {
            path: '/dashboard/system/user/group',
            title: '用户组',
            icon: '👨‍👩‍👧‍👦'
          }
        ]
      },
      {
        path: '/dashboard/system/role',
        title: '角色管理',
        icon: '🔐'
      },
      {
        path: '/dashboard/system/permission',
        title: '权限管理',
        icon: '🔑'
      },
      {
        path: '/dashboard/system/log',
        title: '操作日志',
        icon: '📋'
      }
    ]
  },
  {
    path: '/dashboard/storage',
    title: '图片云存储',
    icon: '📢',
    hot: true
  }
]
