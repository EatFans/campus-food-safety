<template>
  <div class="employee-list-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>员工列表</h2>
        <span class="subtitle">共 {{ pagination.total }} 名员工</span>
      </div>
      <el-button type="primary" :icon="Plus">添加员工</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="员工姓名">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入员工姓名" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="员工编号">
              <el-input 
                v-model="searchForm.employeeNo" 
                placeholder="请输入员工编号" 
                clearable
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="部门">
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
            <el-form-item label="在职状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="在职" value="在职" />
                <el-option label="离职" value="离职" />
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
          <el-tooltip content="列设置" placement="top">
            <el-button circle :icon="Setting" />
          </el-tooltip>
        </div>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="employees" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="员工编号" prop="employeeNo" width="120" />
        <el-table-column label="姓名" prop="name" width="100" />
        <el-table-column label="部门" prop="department" width="120" />
        <el-table-column label="岗位" prop="position" width="120" />
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="邮箱" prop="email" min-width="180" show-overflow-tooltip />
        <el-table-column label="入职日期" prop="hireDate" width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'info'" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Plus, Refresh, Download, Delete, Setting, View, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  employeeNo: '',
  department: '',
  status: ''
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 50
})

// 员工数据
const employees = ref([
  { id: 1, employeeNo: 'EMP001', name: '张三', department: '厨房部', position: '厨师长', phone: '13800138001', email: 'zhangsan@example.com', hireDate: '2023-01-15', status: '在职' },
  { id: 2, employeeNo: 'EMP002', name: '李四', department: '服务部', position: '服务员', phone: '13800138002', email: 'lisi@example.com', hireDate: '2023-03-20', status: '在职' },
  { id: 3, employeeNo: 'EMP003', name: '王五', department: '采购部', position: '采购员', phone: '13800138003', email: 'wangwu@example.com', hireDate: '2023-05-10', status: '在职' },
  { id: 4, employeeNo: 'EMP004', name: '赵六', department: '管理部', position: '经理', phone: '13800138004', email: 'zhaoliu@example.com', hireDate: '2022-08-01', status: '在职' },
  { id: 5, employeeNo: 'EMP005', name: '孙七', department: '厨房部', position: '厨师', phone: '13800138005', email: 'sunqi@example.com', hireDate: '2023-06-15', status: '在职' },
  { id: 6, employeeNo: 'EMP006', name: '周八', department: '服务部', position: '领班', phone: '13800138006', email: 'zhouba@example.com', hireDate: '2023-02-10', status: '在职' },
  { id: 7, employeeNo: 'EMP007', name: '吴九', department: '采购部', position: '采购主管', phone: '13800138007', email: 'wujiu@example.com', hireDate: '2022-11-20', status: '在职' },
  { id: 8, employeeNo: 'EMP008', name: '郑十', department: '管理部', position: '行政专员', phone: '13800138008', email: 'zhengshi@example.com', hireDate: '2023-04-05', status: '离职' }
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
  searchForm.employeeNo = ''
  searchForm.department = ''
  searchForm.status = ''
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
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
</script>

<style scoped>
.employee-list-view {
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
