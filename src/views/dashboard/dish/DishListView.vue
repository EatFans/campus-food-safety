<template>
  <div class="dish-list-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>菜品列表</h2>
        <span class="subtitle">共 {{ pagination.total }} 个菜品</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">添加菜品</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜品名称">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入菜品名称" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜品分类">
              <el-select v-model="searchForm.category" placeholder="请选择分类" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="川菜" value="川菜" />
                <el-option label="粤菜" value="粤菜" />
                <el-option label="湘菜" value="湘菜" />
                <el-option label="家常菜" value="家常菜" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="价格区间">
              <el-select v-model="searchForm.priceRange" placeholder="请选择价格" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="0-20元" value="0-20" />
                <el-option label="20-50元" value="20-50" />
                <el-option label="50元以上" value="50+" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜品状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="上架" :value="true" />
                <el-option label="下架" :value="false" />
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
          <el-button type="success" :icon="Top" :disabled="selectedIds.length === 0">
            批量上架
          </el-button>
          <el-button type="warning" :icon="Bottom" :disabled="selectedIds.length === 0">
            批量下架
          </el-button>
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">
            批量删除
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
        :data="dishes" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="菜品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              :src="row.image" 
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column label="菜品名称" prop="name" width="180" show-overflow-tooltip />
        <el-table-column label="菜品分类" prop="category" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getCategoryColor(row.category)" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="right">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本" width="100" align="right">
          <template #default="{ row }">
            <span class="cost-text">¥{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="getStockType(row.stock)">{{ row.stock }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.sales }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="评分" width="120" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch 
              v-model="row.status" 
              active-color="#67c23a"
              inactive-color="#dcdfe6"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">详情</el-button>
            <el-button link type="warning" size="small" :icon="CopyDocument">复制</el-button>
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
import { Search, Plus, Refresh, Download, Delete, Edit, View, Setting, Top, Bottom, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  priceRange: '',
  status: ''
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 45
})

// 菜品数据
const dishes = ref([
  { id: 1, name: '宫保鸡丁', category: '川菜', image: 'https://via.placeholder.com/60', price: '28.00', cost: '12.00', stock: 50, sales: 1285, rating: 4.8, status: true, createTime: '2025-11-20 10:00' },
  { id: 2, name: '红烧肉', category: '家常菜', image: 'https://via.placeholder.com/60', price: '38.00', cost: '18.00', stock: 30, sales: 1089, rating: 4.9, status: true, createTime: '2025-11-20 10:05' },
  { id: 3, name: '鱼香肉丝', category: '川菜', image: 'https://via.placeholder.com/60', price: '26.00', cost: '11.00', stock: 45, sales: 956, rating: 4.7, status: true, createTime: '2025-11-20 10:10' },
  { id: 4, name: '麻婆豆腐', category: '川菜', image: 'https://via.placeholder.com/60', price: '18.00', cost: '6.00', stock: 60, sales: 832, rating: 4.6, status: true, createTime: '2025-11-20 10:15' },
  { id: 5, name: '糖醋排骨', category: '家常菜', image: 'https://via.placeholder.com/60', price: '42.00', cost: '22.00', stock: 25, sales: 728, rating: 4.9, status: true, createTime: '2025-11-20 10:20' },
  { id: 6, name: '水煮鱼', category: '川菜', image: 'https://via.placeholder.com/60', price: '58.00', cost: '28.00', stock: 20, sales: 685, rating: 4.8, status: true, createTime: '2025-11-20 10:25' },
  { id: 7, name: '酸菜鱼', category: '川菜', image: 'https://via.placeholder.com/60', price: '52.00', cost: '25.00', stock: 22, sales: 612, rating: 4.7, status: true, createTime: '2025-11-20 10:30' },
  { id: 8, name: '回锅肉', category: '川菜', image: 'https://via.placeholder.com/60', price: '32.00', cost: '15.00', stock: 35, sales: 568, rating: 4.6, status: true, createTime: '2025-11-20 10:35' },
  { id: 9, name: '清蒸鲈鱼', category: '粤菜', image: 'https://via.placeholder.com/60', price: '68.00', cost: '35.00', stock: 15, sales: 485, rating: 4.9, status: true, createTime: '2025-11-20 10:40' },
  { id: 10, name: '东坡肉', category: '家常菜', image: 'https://via.placeholder.com/60', price: '45.00', cost: '20.00', stock: 8, sales: 425, rating: 4.8, status: false, createTime: '2025-11-20 10:45' }
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
  searchForm.category = ''
  searchForm.priceRange = ''
  searchForm.status = ''
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开添加菜品对话框')
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

// 获取分类颜色
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    '川菜': 'danger',
    '粤菜': 'success',
    '湘菜': 'warning',
    '家常菜': ''
  }
  return colors[category] || 'info'
}

// 获取库存类型
const getStockType = (stock: number) => {
  if (stock < 10) return 'danger'
  if (stock < 30) return 'warning'
  return 'success'
}
</script>

<style scoped>
.dish-list-view {
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

.price-text {
  color: #f56c6c;
  font-weight: 600;
  font-size: 15px;
}

.cost-text {
  color: #909399;
  font-size: 14px;
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
