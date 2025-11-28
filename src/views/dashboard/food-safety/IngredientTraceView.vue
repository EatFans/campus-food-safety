<template>
  <div class="ingredient-trace-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>食材溯源</h2>
        <span class="subtitle">共 {{ pagination.total }} 条溯源记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">添加溯源</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="食材名称">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入食材名称" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="供应商">
              <el-input 
                v-model="searchForm.supplier" 
                placeholder="请输入供应商" 
                clearable
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="食材分类">
              <el-select v-model="searchForm.category" placeholder="请选择分类" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="蔬菜类" value="蔬菜类" />
                <el-option label="肉类" value="肉类" />
                <el-option label="水产类" value="水产类" />
                <el-option label="调味品" value="调味品" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="入库时间">
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
        :data="ingredients" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="溯源码" prop="traceCode" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.traceCode }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="食材名称" prop="name" width="150" />
        <el-table-column label="食材分类" prop="category" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getCategoryColor(row.category)" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="supplier" width="180" />
        <el-table-column label="产地" prop="origin" width="150" />
        <el-table-column label="批次号" prop="batchNo" width="150" />
        <el-table-column label="数量" width="100" align="center">
          <template #default="{ row }">
            <span>{{ row.quantity }}{{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库时间" prop="inboundTime" width="180" />
        <el-table-column label="保质期至" prop="expiryDate" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="getExpiryType(row.expiryDate)">{{ row.expiryDate }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">溯源详情</el-button>
            <el-button link type="success" size="small" :icon="Edit">编辑</el-button>
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
  supplier: '',
  category: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 38
})

// 食材溯源数据
const ingredients = ref([
  { id: 1, traceCode: 'TR202511280001', name: '新鲜鸡蛋', category: '蔬菜类', supplier: '绿源农业合作社', origin: '山东济南', batchNo: 'B20251128001', quantity: 500, unit: '个', inboundTime: '2025-11-28 08:00', expiryDate: '2025-12-15' },
  { id: 2, traceCode: 'TR202511280002', name: '猪肉', category: '肉类', supplier: '优质肉类供应商', origin: '河南郑州', batchNo: 'B20251128002', quantity: 50, unit: 'kg', inboundTime: '2025-11-28 08:15', expiryDate: '2025-12-05' },
  { id: 3, traceCode: 'TR202511280003', name: '鲈鱼', category: '水产类', supplier: '海鲜水产公司', origin: '广东深圳', batchNo: 'B20251128003', quantity: 30, unit: 'kg', inboundTime: '2025-11-28 08:30', expiryDate: '2025-11-30' },
  { id: 4, traceCode: 'TR202511280004', name: '西红柿', category: '蔬菜类', supplier: '绿源农业合作社', origin: '山东寿光', batchNo: 'B20251128004', quantity: 100, unit: 'kg', inboundTime: '2025-11-28 08:45', expiryDate: '2025-12-10' },
  { id: 5, traceCode: 'TR202511280005', name: '鸡肉', category: '肉类', supplier: '优质肉类供应商', origin: '山东青岛', batchNo: 'B20251128005', quantity: 40, unit: 'kg', inboundTime: '2025-11-28 09:00', expiryDate: '2025-12-03' },
  { id: 6, traceCode: 'TR202511280006', name: '大米', category: '调味品', supplier: '粮油批发市场', origin: '黑龙江', batchNo: 'B20251128006', quantity: 200, unit: 'kg', inboundTime: '2025-11-28 09:15', expiryDate: '2026-05-28' },
  { id: 7, traceCode: 'TR202511280007', name: '黄瓜', category: '蔬菜类', supplier: '绿源农业合作社', origin: '山东寿光', batchNo: 'B20251128007', quantity: 80, unit: 'kg', inboundTime: '2025-11-28 09:30', expiryDate: '2025-12-08' },
  { id: 8, traceCode: 'TR202511280008', name: '虾仁', category: '水产类', supplier: '海鲜水产公司', origin: '福建厦门', batchNo: 'B20251128008', quantity: 25, unit: 'kg', inboundTime: '2025-11-28 09:45', expiryDate: '2025-11-29' },
  { id: 9, traceCode: 'TR202511280009', name: '食用油', category: '调味品', supplier: '粮油批发市场', origin: '山东', batchNo: 'B20251128009', quantity: 50, unit: 'L', inboundTime: '2025-11-28 10:00', expiryDate: '2026-11-28' },
  { id: 10, traceCode: 'TR202511280010', name: '牛肉', category: '肉类', supplier: '优质肉类供应商', origin: '内蒙古', batchNo: 'B20251128010', quantity: 35, unit: 'kg', inboundTime: '2025-11-28 10:15', expiryDate: '2025-12-06' }
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
  searchForm.supplier = ''
  searchForm.category = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开添加溯源对话框')
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
    '蔬菜类': 'success',
    '肉类': 'danger',
    '水产类': 'primary',
    '调味品': 'warning'
  }
  return colors[category] || 'info'
}

// 获取保质期类型
const getExpiryType = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 3) return 'danger'
  if (diffDays < 7) return 'warning'
  return 'success'
}
</script>

<style scoped>
.ingredient-trace-view {
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
