<template>
  <div class="dish-category-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>菜品分类</h2>
        <span class="subtitle">共 {{ pagination.total }} 个分类</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">新增分类</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="分类名称">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入分类名称" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="分类状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜系类型">
              <el-select v-model="searchForm.cuisine" placeholder="请选择菜系" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="川菜" value="川菜" />
                <el-option label="粤菜" value="粤菜" />
                <el-option label="湘菜" value="湘菜" />
                <el-option label="鲁菜" value="鲁菜" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="创建时间">
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
        </div>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="categories" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="分类图片" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              :src="row.image" 
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="name" width="150" />
        <el-table-column label="菜系类型" prop="cuisine" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getCuisineColor(row.cuisine)" size="small">{{ row.cuisine }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="菜品数量" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.dishCount }}个</el-text>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="分类描述" prop="description" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch 
              v-model="row.status" 
              active-value="启用"
              inactive-value="禁用"
              active-color="#67c23a"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">查看</el-button>
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
import { Search, Refresh, Download, Plus, Delete, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  status: '',
  cuisine: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 15
})

// 分类数据
const categories = ref([
  { id: 1, name: '热菜', cuisine: '川菜', image: 'https://via.placeholder.com/60', dishCount: 45, sort: 1, description: '各类热菜,口味丰富', status: '启用', createTime: '2025-11-20 10:00' },
  { id: 2, name: '凉菜', cuisine: '川菜', image: 'https://via.placeholder.com/60', dishCount: 28, sort: 2, description: '爽口凉菜,开胃解腻', status: '启用', createTime: '2025-11-20 10:05' },
  { id: 3, name: '汤羹', cuisine: '粤菜', image: 'https://via.placeholder.com/60', dishCount: 18, sort: 3, description: '营养汤品,滋补养生', status: '启用', createTime: '2025-11-20 10:10' },
  { id: 4, name: '主食', cuisine: '鲁菜', image: 'https://via.placeholder.com/60', dishCount: 32, sort: 4, description: '米饭面食,主食类', status: '启用', createTime: '2025-11-20 10:15' },
  { id: 5, name: '小吃', cuisine: '湘菜', image: 'https://via.placeholder.com/60', dishCount: 25, sort: 5, description: '特色小吃,风味独特', status: '启用', createTime: '2025-11-20 10:20' },
  { id: 6, name: '海鲜', cuisine: '粤菜', image: 'https://via.placeholder.com/60', dishCount: 22, sort: 6, description: '新鲜海鲜,营养丰富', status: '启用', createTime: '2025-11-20 10:25' },
  { id: 7, name: '烧烤', cuisine: '川菜', image: 'https://via.placeholder.com/60', dishCount: 15, sort: 7, description: '炭火烧烤,香气扑鼻', status: '启用', createTime: '2025-11-20 10:30' },
  { id: 8, name: '甜品', cuisine: '粤菜', image: 'https://via.placeholder.com/60', dishCount: 20, sort: 8, description: '精致甜品,甜蜜可口', status: '启用', createTime: '2025-11-20 10:35' },
  { id: 9, name: '饮品', cuisine: '川菜', image: 'https://via.placeholder.com/60', dishCount: 30, sort: 9, description: '各类饮品,清凉解渴', status: '启用', createTime: '2025-11-20 10:40' },
  { id: 10, name: '素菜', cuisine: '鲁菜', image: 'https://via.placeholder.com/60', dishCount: 12, sort: 10, description: '健康素食,营养均衡', status: '禁用', createTime: '2025-11-20 10:45' }
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
  searchForm.name = ''
  searchForm.status = ''
  searchForm.cuisine = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开新增分类对话框')
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

// 获取菜系颜色
const getCuisineColor = (cuisine: string) => {
  const colors: Record<string, string> = {
    '川菜': 'danger',
    '粤菜': 'success',
    '湘菜': 'warning',
    '鲁菜': 'primary'
  }
  return colors[cuisine] || 'info'
}
</script>

<style scoped>
.dish-category-view {
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
