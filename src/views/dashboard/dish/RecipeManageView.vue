<template>
  <div class="recipe-manage-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>菜谱管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 个菜谱</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">新增菜谱</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜谱名称">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入菜谱名称" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="难度等级">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="简单" value="简单" />
                <el-option label="中等" value="中等" />
                <el-option label="困难" value="困难" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="烹饪时间">
              <el-select v-model="searchForm.cookTime" placeholder="请选择时间" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="30分钟内" value="30" />
                <el-option label="30-60分钟" value="60" />
                <el-option label="60分钟以上" value="120" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜谱状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="已发布" value="已发布" />
                <el-option label="草稿" value="草稿" />
              </el-select>
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
        :data="recipes" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="菜谱封面" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              :src="row.cover" 
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.cover]"
            />
          </template>
        </el-table-column>
        <el-table-column label="菜谱名称" prop="name" width="180" show-overflow-tooltip />
        <el-table-column label="难度等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getDifficultyColor(row.difficulty)" size="small">{{ row.difficulty }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="烹饪时间" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.cookTime }}分钟</span>
          </template>
        </el-table-column>
        <el-table-column label="食材数量" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.ingredients }}种</el-text>
          </template>
        </el-table-column>
        <el-table-column label="步骤数" width="80" align="center">
          <template #default="{ row }">
            <span>{{ row.steps }}步</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.views }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收藏数" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.favorites }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : 'info'" effect="dark">
              {{ row.status }}
            </el-tag>
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
  difficulty: '',
  cookTime: '',
  status: ''
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 28
})

// 菜谱数据
const recipes = ref([
  { id: 1, name: '宫保鸡丁', cover: 'https://via.placeholder.com/60', difficulty: '中等', cookTime: 30, ingredients: 8, steps: 6, views: 1285, favorites: 256, status: '已发布', createTime: '2025-11-25 10:00' },
  { id: 2, name: '红烧肉', cover: 'https://via.placeholder.com/60', difficulty: '困难', cookTime: 90, ingredients: 10, steps: 8, views: 2156, favorites: 485, status: '已发布', createTime: '2025-11-25 10:05' },
  { id: 3, name: '鱼香肉丝', cover: 'https://via.placeholder.com/60', difficulty: '中等', cookTime: 25, ingredients: 9, steps: 7, views: 1856, favorites: 368, status: '已发布', createTime: '2025-11-25 10:10' },
  { id: 4, name: '麻婆豆腐', cover: 'https://via.placeholder.com/60', difficulty: '简单', cookTime: 20, ingredients: 6, steps: 5, views: 3256, favorites: 625, status: '已发布', createTime: '2025-11-25 10:15' },
  { id: 5, name: '糖醋排骨', cover: 'https://via.placeholder.com/60', difficulty: '中等', cookTime: 45, ingredients: 7, steps: 6, views: 2856, favorites: 512, status: '已发布', createTime: '2025-11-25 10:20' },
  { id: 6, name: '水煮鱼', cover: 'https://via.placeholder.com/60', difficulty: '困难', cookTime: 60, ingredients: 12, steps: 9, views: 1956, favorites: 425, status: '已发布', createTime: '2025-11-25 10:25' },
  { id: 7, name: '酸菜鱼', cover: 'https://via.placeholder.com/60', difficulty: '中等', cookTime: 50, ingredients: 11, steps: 8, views: 2256, favorites: 468, status: '已发布', createTime: '2025-11-25 10:30' },
  { id: 8, name: '回锅肉', cover: 'https://via.placeholder.com/60', difficulty: '简单', cookTime: 25, ingredients: 6, steps: 5, views: 1685, favorites: 325, status: '草稿', createTime: '2025-11-25 10:35' },
  { id: 9, name: '清蒸鲈鱼', cover: 'https://via.placeholder.com/60', difficulty: '简单', cookTime: 15, ingredients: 5, steps: 4, views: 2685, favorites: 556, status: '已发布', createTime: '2025-11-25 10:40' },
  { id: 10, name: '东坡肉', cover: 'https://via.placeholder.com/60', difficulty: '困难', cookTime: 120, ingredients: 8, steps: 10, views: 1256, favorites: 285, status: '已发布', createTime: '2025-11-25 10:45' }
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
  searchForm.difficulty = ''
  searchForm.cookTime = ''
  searchForm.status = ''
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开新增菜谱对话框')
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

// 获取难度颜色
const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return colors[difficulty] || 'info'
}
</script>

<style scoped>
.recipe-manage-view {
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
