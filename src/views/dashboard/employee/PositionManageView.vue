<template>
  <div class="position-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>岗位管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 个岗位</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加岗位</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="岗位名称">
              <el-input v-model="searchForm.name" placeholder="请输入岗位名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="所属部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="厨房部" value="厨房部" />
                <el-option label="服务部" value="服务部" />
                <el-option label="采购部" value="采购部" />
                <el-option label="管理部" value="管理部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="岗位状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="启用" value="启用" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="创建时间">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="large" style="width: 100%;" />
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

      <el-table :data="positions" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="岗位名称" prop="name" width="150" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="岗位级别" prop="level" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelColor(row.level)" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="在职人数" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.employeeCount }}人</el-text>
          </template>
        </el-table-column>
        <el-table-column label="薪资范围" width="150" align="center">
          <template #default="{ row }">
            <span class="salary-text">{{ row.salaryRange }}</span>
          </template>
        </el-table-column>
        <el-table-column label="岗位职责" prop="responsibility" min-width="200" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">详情</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  department: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 18
})

const positions = ref([
  { id: 1, name: '厨师长', department: '厨房部', level: '高级', employeeCount: 2, salaryRange: '8000-12000元', responsibility: '负责厨房整体运营和菜品研发', createTime: '2023-01-15 10:00', status: '启用' },
  { id: 2, name: '厨师', department: '厨房部', level: '中级', employeeCount: 15, salaryRange: '5000-8000元', responsibility: '负责菜品制作和厨房日常工作', createTime: '2023-01-15 10:05', status: '启用' },
  { id: 3, name: '服务员', department: '服务部', level: '初级', employeeCount: 18, salaryRange: '3500-5000元', responsibility: '负责顾客服务和餐厅接待', createTime: '2023-01-15 10:10', status: '启用' },
  { id: 4, name: '采购主管', department: '采购部', level: '中级', employeeCount: 2, salaryRange: '6000-9000元', responsibility: '负责食材采购和供应商管理', createTime: '2023-01-15 10:15', status: '启用' },
  { id: 5, name: '采购员', department: '采购部', level: '初级', employeeCount: 6, salaryRange: '4000-6000元', responsibility: '负责日常食材采购工作', createTime: '2023-01-15 10:20', status: '启用' },
  { id: 6, name: '行政主管', department: '管理部', level: '中级', employeeCount: 3, salaryRange: '6000-9000元', responsibility: '负责行政管理和人事工作', createTime: '2023-01-15 10:25', status: '启用' },
  { id: 7, name: '财务会计', department: '管理部', level: '中级', employeeCount: 3, salaryRange: '5500-8500元', responsibility: '负责财务核算和成本管理', createTime: '2023-01-15 10:30', status: '启用' },
  { id: 8, name: '仓管员', department: '管理部', level: '初级', employeeCount: 6, salaryRange: '4000-6000元', responsibility: '负责仓库管理和库存盘点', createTime: '2023-01-15 10:35', status: '启用' },
  { id: 9, name: '保洁员', department: '管理部', level: '初级', employeeCount: 10, salaryRange: '3000-4500元', responsibility: '负责食堂卫生清洁工作', createTime: '2023-01-15 10:40', status: '启用' },
  { id: 10, name: '安保员', department: '管理部', level: '初级', employeeCount: 4, salaryRange: '3500-5000元', responsibility: '负责食堂安全保卫工作', createTime: '2023-01-15 10:45', status: '停用' }
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
  searchForm.department = ''
  searchForm.status = ''
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

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '初级': 'info',
    '中级': 'warning',
    '高级': 'danger'
  }
  return colors[level] || 'info'
}
</script>

<style scoped>
.position-manage-view {
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

.salary-text {
  color: #67c23a;
  font-weight: 600;
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
