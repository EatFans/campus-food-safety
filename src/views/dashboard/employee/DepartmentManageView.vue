<template>
  <div class="department-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>部门管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 个部门</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加部门</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="部门名称">
              <el-input v-model="searchForm.name" placeholder="请输入部门名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="部门状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
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

      <el-table :data="departments" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="部门名称" prop="name" width="180" />
        <el-table-column label="部门负责人" prop="manager" width="120" />
        <el-table-column label="联系电话" prop="phone" width="130" />
        <el-table-column label="员工人数" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.employeeCount }}人</el-text>
          </template>
        </el-table-column>
        <el-table-column label="部门描述" prop="description" min-width="200" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
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
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 8
})

const departments = ref([
  { id: 1, name: '厨房部', manager: '张三', phone: '13800138001', employeeCount: 25, description: '负责食堂厨房的日常运营和菜品制作', createTime: '2023-01-15 10:00', status: '正常' },
  { id: 2, name: '服务部', manager: '李四', phone: '13800138002', employeeCount: 18, description: '负责食堂的服务接待和顾客服务', createTime: '2023-01-15 10:05', status: '正常' },
  { id: 3, name: '采购部', manager: '王五', phone: '13800138003', employeeCount: 8, description: '负责食材采购和供应商管理', createTime: '2023-01-15 10:10', status: '正常' },
  { id: 4, name: '管理部', manager: '赵六', phone: '13800138004', employeeCount: 12, description: '负责食堂的行政管理和人事管理', createTime: '2023-01-15 10:15', status: '正常' },
  { id: 5, name: '财务部', manager: '孙七', phone: '13800138005', employeeCount: 5, description: '负责食堂的财务管理和成本核算', createTime: '2023-01-15 10:20', status: '正常' },
  { id: 6, name: '仓储部', manager: '周八', phone: '13800138006', employeeCount: 6, description: '负责食材仓储和库存管理', createTime: '2023-01-15 10:25', status: '正常' },
  { id: 7, name: '保洁部', manager: '吴九', phone: '13800138007', employeeCount: 10, description: '负责食堂的卫生清洁工作', createTime: '2023-01-15 10:30', status: '正常' },
  { id: 8, name: '安保部', manager: '郑十', phone: '13800138008', employeeCount: 4, description: '负责食堂的安全保卫工作', createTime: '2023-01-15 10:35', status: '停用' }
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
</script>

<style scoped>
.department-manage-view {
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
