<template>
  <div class="announcement-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>公告管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条公告</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">发布公告</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="公告标题">
              <el-input 
                v-model="searchForm.title" 
                placeholder="请输入公告标题" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布人">
              <el-input 
                v-model="searchForm.publisher" 
                placeholder="请输入发布人" 
                clearable
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="公告状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="已发布" value="已发布" />
                <el-option label="草稿" value="草稿" />
                <el-option label="已下线" value="已下线" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" size="large" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button size="large" :icon="Download">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格区域 -->
    <el-card shadow="never" class="table-card">
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">
            批量删除
          </el-button>
          <el-button :icon="Download" :disabled="selectedIds.length === 0">
            批量导出
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
          <el-tooltip content="列设置" placement="top">
            <el-button circle :icon="Setting" />
          </el-tooltip>
        </div>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="announcements" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="公告标题" prop="title" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="title-cell">
              <el-icon v-if="row.important" color="#F56C6C" :size="16"><Warning /></el-icon>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="公告类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布人" prop="publisher" width="120" />
        <el-table-column label="发布时间" prop="publishTime" width="180" />
        <el-table-column label="阅读量" prop="views" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.views }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="Top" v-if="row.status === '已发布'">
              置顶
            </el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Search, Refresh, Download, Delete, Setting, View, Edit, Top, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  title: '',
  publisher: '',
  status: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 15
})

// 公告数据
const announcements = ref([
  { 
    id: 1, 
    title: '关于加强食品安全管理的通知', 
    type: '通知',
    publisher: '管理员', 
    publishTime: '2025-11-28 10:00', 
    views: 1285,
    status: '已发布',
    important: true
  },
  { 
    id: 2, 
    title: '春节放假安排通知', 
    type: '通知',
    publisher: '人事部', 
    publishTime: '2025-11-25 14:30', 
    views: 856,
    status: '已发布',
    important: false
  },
  { 
    id: 3, 
    title: '新菜品上线公告', 
    type: '公告',
    publisher: '运营部', 
    publishTime: '2025-11-20 09:00', 
    views: 652,
    status: '已发布',
    important: false
  },
  { 
    id: 4, 
    title: '系统维护升级通知', 
    type: '通知',
    publisher: '技术部', 
    publishTime: '2025-11-18 16:00', 
    views: 423,
    status: '已发布',
    important: true
  },
  { 
    id: 5, 
    title: '员工培训计划安排', 
    type: '通知',
    publisher: '人事部', 
    publishTime: '2025-11-15 11:30', 
    views: 385,
    status: '已发布',
    important: false
  },
  { 
    id: 6, 
    title: '双十一促销活动方案', 
    type: '活动',
    publisher: '营销部', 
    publishTime: '2025-11-10 09:00', 
    views: 1523,
    status: '已下线',
    important: false
  },
  { 
    id: 7, 
    title: '食品安全自查报告', 
    type: '报告',
    publisher: '安全部', 
    publishTime: '2025-11-08 14:00', 
    views: 256,
    status: '已发布',
    important: false
  },
  { 
    id: 8, 
    title: '设备维护保养提醒', 
    type: '提醒',
    publisher: '设备部', 
    publishTime: '2025-11-05 10:30', 
    views: 198,
    status: '已发布',
    important: false
  },
  { 
    id: 9, 
    title: '月度优秀员工表彰', 
    type: '公告',
    publisher: '人事部', 
    publishTime: '2025-11-01 15:00', 
    views: 742,
    status: '已发布',
    important: false
  },
  { 
    id: 10, 
    title: '新员工入职培训通知', 
    type: '通知',
    publisher: '人事部', 
    publishTime: '2025-10-28 09:30', 
    views: 325,
    status: '草稿',
    important: false
  }
])

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.publisher = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增公告
const handleAdd = () => {
  ElMessage.info('打开发布公告对话框')
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  handleSearch()
}

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '通知': '',
    '公告': 'success',
    '活动': 'warning',
    '报告': 'info',
    '提醒': 'danger'
  }
  return colors[type] || 'info'
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '已发布': 'success',
    '草稿': 'info',
    '已下线': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.announcement-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.search-card :deep(.el-card__body) {
  padding: 20px;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.table-card {
  border-radius: 8px;
}

.table-card :deep(.el-card__body) {
  padding: 20px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}
</style>
