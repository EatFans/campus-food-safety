<template>
  <div class="inventory-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>库存管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条库存记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">库存盘点</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品名称">
              <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="库存状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="充足" value="充足" />
                <el-option label="预警" value="预警" />
                <el-option label="不足" value="不足" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="仓库">
              <el-select v-model="searchForm.warehouse" placeholder="请选择仓库" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="主仓库" value="主仓库" />
                <el-option label="冷藏仓" value="冷藏仓" />
                <el-option label="干货仓" value="干货仓" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="更新时间">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="large" style="width: 100%;" />
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

    <el-card shadow="never" class="table-card">
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="warning" :icon="Warning" :disabled="selectedIds.length === 0">库存预警</el-button>
          <el-button type="success" :icon="ShoppingCart" :disabled="selectedIds.length === 0">批量补货</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="inventory" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="商品名称" prop="name" width="150" />
        <el-table-column label="商品分类" prop="category" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="getStockType(row.currentStock, row.minStock)">{{ row.currentStock }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="最低库存" prop="minStock" width="100" align="center" />
        <el-table-column label="最高库存" prop="maxStock" width="100" align="center" />
        <el-table-column label="仓库位置" prop="warehouse" width="120" />
        <el-table-column label="货架号" prop="shelfNo" width="100" />
        <el-table-column label="库存状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">调整</el-button>
            <el-button link type="warning" size="small" :icon="ShoppingCart">补货</el-button>
            <el-button link type="success" size="small" :icon="View">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Refresh, Download, Edit, View, Warning, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  status: '',
  warehouse: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 52
})

const inventory = ref([
  { id: 1, name: '新鲜鸡蛋', category: '蛋类', currentStock: 500, minStock: 200, maxStock: 1000, warehouse: '主仓库', shelfNo: 'A-01', status: '充足', updateTime: '2025-11-28 10:00' },
  { id: 2, name: '有机蔬菜包', category: '蔬菜', currentStock: 200, minStock: 150, maxStock: 500, warehouse: '冷藏仓', shelfNo: 'B-05', status: '充足', updateTime: '2025-11-28 09:30' },
  { id: 3, name: '优质大米', category: '粮油', currentStock: 150, minStock: 100, maxStock: 300, warehouse: '干货仓', shelfNo: 'C-12', status: '充足', updateTime: '2025-11-28 09:00' },
  { id: 4, name: '新鲜猪肉', category: '肉类', currentStock: 80, minStock: 100, maxStock: 200, warehouse: '冷藏仓', shelfNo: 'B-08', status: '预警', updateTime: '2025-11-28 08:45' },
  { id: 5, name: '土鸡蛋', category: '蛋类', currentStock: 300, minStock: 200, maxStock: 800, warehouse: '主仓库', shelfNo: 'A-02', status: '充足', updateTime: '2025-11-28 08:30' },
  { id: 6, name: '新鲜西红柿', category: '蔬菜', currentStock: 400, minStock: 150, maxStock: 600, warehouse: '冷藏仓', shelfNo: 'B-03', status: '充足', updateTime: '2025-11-28 08:15' },
  { id: 7, name: '食用油', category: '粮油', currentStock: 120, minStock: 80, maxStock: 200, warehouse: '干货仓', shelfNo: 'C-08', status: '充足', updateTime: '2025-11-28 08:00' },
  { id: 8, name: '新鲜牛肉', category: '肉类', currentStock: 60, minStock: 80, maxStock: 150, warehouse: '冷藏仓', shelfNo: 'B-10', status: '预警', updateTime: '2025-11-28 07:45' },
  { id: 9, name: '鹌鹑蛋', category: '蛋类', currentStock: 8, minStock: 50, maxStock: 200, warehouse: '主仓库', shelfNo: 'A-03', status: '不足', updateTime: '2025-11-28 07:30' },
  { id: 10, name: '有机黄瓜', category: '蔬菜', currentStock: 350, minStock: 150, maxStock: 500, warehouse: '冷藏仓', shelfNo: 'B-04', status: '充足', updateTime: '2025-11-28 07:15' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  searchForm.warehouse = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleRefresh = () => {
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  handleSearch()
}

const getStockType = (current: number, min: number) => {
  if (current < min * 0.5) return 'danger'
  if (current < min) return 'warning'
  return 'success'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '充足': 'success',
    '预警': 'warning',
    '不足': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.inventory-manage-view {
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
