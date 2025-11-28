<template>
  <div class="fire-view">
    <div class="page-header">
      <div class="header-left">
        <h2>消防管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 个消防设施</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加设施</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设施名称">
              <el-input v-model="searchForm.name" placeholder="请输入设施名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设施类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="灭火器" value="灭火器" />
                <el-option label="消防栓" value="消防栓" />
                <el-option label="烟雾报警器" value="烟雾报警器" />
                <el-option label="应急灯" value="应急灯" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设施状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
                <el-option label="待检" value="待检" />
                <el-option label="过期" value="过期" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" size="large" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="facilities" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="设施编号" prop="facilityNo" width="120">
          <template #default="{ row }">
            <el-text type="primary">{{ row.facilityNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="设施名称" prop="name" width="150" />
        <el-table-column label="设施类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="安装位置" prop="location" width="150" />
        <el-table-column label="安装日期" prop="installDate" width="120" />
        <el-table-column label="有效期至" prop="expiryDate" width="120" />
        <el-table-column label="最后检查" prop="lastCheck" width="120" />
        <el-table-column label="设施状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="manager" width="100" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="CircleCheck">检查</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, View, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 68
})

const facilities = ref([
  { id: 1, facilityNo: 'FIRE001', name: '干粉灭火器', type: '灭火器', location: '大厅1层', installDate: '2023-01-15', expiryDate: '2026-01-15', lastCheck: '2025-11-01', status: '正常', manager: '张三' },
  { id: 2, facilityNo: 'FIRE002', name: '干粉灭火器', type: '灭火器', location: '厨房A区', installDate: '2023-01-15', expiryDate: '2026-01-15', lastCheck: '2025-11-01', status: '正常', manager: '李四' },
  { id: 3, facilityNo: 'FIRE003', name: '消防栓', type: '消防栓', location: '走廊1层', installDate: '2022-06-20', expiryDate: '2027-06-20', lastCheck: '2025-10-15', status: '正常', manager: '王五' },
  { id: 4, facilityNo: 'FIRE004', name: '烟雾报警器', type: '烟雾报警器', location: '厨房B区', installDate: '2023-03-10', expiryDate: '2028-03-10', lastCheck: '2025-11-15', status: '正常', manager: '李四' },
  { id: 5, facilityNo: 'FIRE005', name: '应急照明灯', type: '应急灯', location: '安全出口', installDate: '2023-05-20', expiryDate: '2028-05-20', lastCheck: '2025-11-20', status: '正常', manager: '赵六' },
  { id: 6, facilityNo: 'FIRE006', name: '干粉灭火器', type: '灭火器', location: '仓库', installDate: '2022-12-01', expiryDate: '2025-12-01', lastCheck: '2025-06-01', status: '待检', manager: '王五' },
  { id: 7, facilityNo: 'FIRE007', name: '消防栓', type: '消防栓', location: '走廊2层', installDate: '2022-06-20', expiryDate: '2027-06-20', lastCheck: '2025-10-15', status: '正常', manager: '王五' },
  { id: 8, facilityNo: 'FIRE008', name: '烟雾报警器', type: '烟雾报警器', location: '餐厅', installDate: '2023-03-10', expiryDate: '2028-03-10', lastCheck: '2025-11-15', status: '正常', manager: '张三' },
  { id: 9, facilityNo: 'FIRE009', name: '干粉灭火器', type: '灭火器', location: '办公室', installDate: '2021-08-15', expiryDate: '2024-08-15', lastCheck: '2024-08-01', status: '过期', manager: '赵六' },
  { id: 10, facilityNo: 'FIRE010', name: '应急照明灯', type: '应急灯', location: '楼梯间', installDate: '2023-05-20', expiryDate: '2028-05-20', lastCheck: '2025-11-20', status: '正常', manager: '赵六' }
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
  searchForm.type = ''
  searchForm.status = ''
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

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '灭火器': 'danger',
    '消防栓': 'primary',
    '烟雾报警器': 'warning',
    '应急灯': 'success'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '正常': 'success',
    '待检': 'warning',
    '过期': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.fire-view {
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
