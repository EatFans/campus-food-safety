# 图标使用指南

## Iconify 图标库

项目使用 [Iconify](https://iconify.design/) 图标库,这是一个统一的图标框架,包含超过 150,000+ 个开源图标。

## 安装

```bash
npm install @iconify/vue
```

## 使用方式

### 在 Vue 组件中使用

```vue
<template>
  <Icon icon="mdi:home" />
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>
```

### 自定义大小和颜色

```vue
<Icon icon="mdi:home" :width="24" :height="24" color="#1890ff" />
```

## 推荐的图标集合

### Material Design Icons (mdi)
最全面的图标集,推荐优先使用

```typescript
'mdi:home'              // 首页
'mdi:account'           // 用户
'mdi:cog'               // 设置
'mdi:file-document'     // 文档
'mdi:chart-line'        // 图表
'mdi:bell'              // 通知
'mdi:email'             // 邮件
'mdi:calendar'          // 日历
'mdi:folder'            // 文件夹
'mdi:image'             // 图片
```

### Carbon Design (carbon)
IBM 的设计系统图标

```typescript
'carbon:dashboard'      // 仪表盘
'carbon:user-avatar'    // 用户头像
'carbon:settings'       // 设置
'carbon:document'       // 文档
```

### Ant Design Icons (ant-design)
Ant Design 官方图标

```typescript
'ant-design:home-outlined'
'ant-design:user-outlined'
'ant-design:setting-outlined'
```

## 常用业务图标

### 导航类
```typescript
'mdi:view-dashboard'        // 工作台
'mdi:home'                  // 首页
'mdi:menu'                  // 菜单
'mdi:arrow-left'            // 返回
'mdi:chevron-right'         // 右箭头
'mdi:chevron-down'          // 下箭头
```

### 用户类
```typescript
'mdi:account'               // 用户
'mdi:account-group'         // 用户组
'mdi:account-circle'        // 用户头像
'mdi:shield-account'        // 角色
'mdi:key'                   // 权限
```

### 文件类
```typescript
'mdi:file-document'         // 文档
'mdi:folder'                // 文件夹
'mdi:folder-outline'        // 文件夹(空心)
'mdi:file-pdf'              // PDF
'mdi:file-excel'            // Excel
'mdi:file-image'            // 图片
```

### 操作类
```typescript
'mdi:plus'                  // 添加
'mdi:pencil'                // 编辑
'mdi:delete'                // 删除
'mdi:content-save'          // 保存
'mdi:refresh'               // 刷新
'mdi:magnify'               // 搜索
'mdi:filter'                // 筛选
'mdi:download'              // 下载
'mdi:upload'                // 上传
```

### 状态类
```typescript
'mdi:check-circle'          // 成功
'mdi:alert-circle'          // 警告
'mdi:close-circle'          // 错误
'mdi:information'           // 信息
'mdi:help-circle'           // 帮助
```

### 系统类
```typescript
'mdi:cog'                   // 设置
'mdi:bell'                  // 通知
'mdi:email'                 // 邮件
'mdi:calendar'              // 日历
'mdi:clock'                 // 时间
'mdi:map-marker'            // 位置
```

### 数据类
```typescript
'mdi:chart-line'            // 折线图
'mdi:chart-bar'             // 柱状图
'mdi:chart-pie'             // 饼图
'mdi:table'                 // 表格
'mdi:database'              // 数据库
```

### 食品安全相关
```typescript
'mdi:food'                  // 食品
'mdi:food-apple'            // 水果
'mdi:silverware-fork-knife' // 餐具
'mdi:shield-check'          // 安全检查
'mdi:clipboard-check'       // 检查清单
'mdi:alert'                 // 警告
'mdi:test-tube'             // 检测
'mdi:microscope'            // 显微镜
'mdi:certificate'           // 证书
```

## 查找图标

### 在线搜索
访问 [Iconify Icon Sets](https://icon-sets.iconify.design/) 搜索图标

### 搜索技巧
1. 使用英文关键词搜索
2. 尝试同义词(如: user/account/person)
3. 优先选择 outline 版本(更清晰)
4. 注意图标风格统一

## 在菜单配置中使用

```typescript
// src/config/menu.ts
export const menuConfig: MenuItem[] = [
  {
    path: '/dashboard/food',
    title: '食品管理',
    icon: 'mdi:food',  // 使用 Iconify 图标
    children: [
      {
        path: '/dashboard/food/list',
        title: '食品列表',
        icon: 'mdi:format-list-bulleted'
      }
    ]
  }
]
```

## 性能优化

Iconify 会自动按需加载图标,只有使用到的图标才会被下载,无需担心包体积问题。

## 注意事项

1. 图标名称格式: `collection:icon-name`
2. 建议在同一项目中使用同一图标集(如 mdi)保持风格统一
3. 图标会继承父元素的字体大小和颜色
4. 可以通过 CSS 调整图标样式
