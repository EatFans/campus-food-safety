<template>
  <div class="record-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>考勤记录</h2>
        <span class="subtitle">共 {{ pagination.total }} 条记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加记录</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="员工姓名">
              <el-input v-model="searchForm.name" placeholder="请输入员工姓名" clearable size="large" :prefix-icon="Search" />
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
            <el-form-item label="考勤状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
                <el-option label="迟到" value="迟到" />
                <el-option label="早退" value="早退" />
                <el-option label="缺勤" value="缺勤" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="考勤日期">
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
          <el-button :icon="Download" :disabled="selectedIds.length === 0">批量导出</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="records" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="员工编号" prop="employeeNo" width="120" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="考勤日期" prop="date" width="120" />
        <el-table-column label="上班打卡" prop="checkIn" width="120" />
        <el-table-column label="下班打卡" prop="checkOut" width="120" />
        <el-table-column label="工作时长" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.workHours }}小时</el-text>
          </template>
        </el-table-column>
        <el-table-column label="考勤状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="Edit">修改</el-button>
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
import { Search, Plus, Refresh, Download, Edit, View } from '@element-plus/icons-vue'
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
  total: 285
})

const records = ref([
  { id: 1, name: '张三', employeeNo: 'EMP001', department: '厨房部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:30', workHours: 9.5, status: '正常', remark: '' },
  { id: 2, name: '李四', employeeNo: 'EMP002', department: '服务部', date: '2025-11-28', checkIn: '08:15', checkOut: '17:30', workHours: 9.25, status: '迟到', remark: '迟到15分钟' },
  { id: 3, name: '王五', employeeNo: 'EMP003', department: '采购部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:00', workHours: 9, status: '早退', remark: '早退30分钟' },
  { id: 4, name: '赵六', employeeNo: 'EMP004', department: '管理部', date: '2025-11-28', checkIn: '-', checkOut: '-', workHours: 0, status: '缺勤', remark: '未打卡' },
  { id: 5, name: '孙七', employeeNo: 'EMP005', department: '厨房部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:30', workHours: 9.5, status: '正常', remark: '' },
  { id: 6, name: '周八', employeeNo: 'EMP006', department: '服务部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:30', workHours: 9.5, status: '正常', remark: '' },
  { id: 7, name: '吴九', employeeNo: 'EMP007', department: '厨房部', date: '2025-11-28', checkIn: '08:20', checkOut: '17:30', workHours: 9.17, status: '迟到', remark: '迟到20分钟' },
  { id: 8, name: '郑十', employeeNo: 'EMP008', department: '采购部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:30', workHours: 9.5, status: '正常', remark: '' },
  { id: 9, name: '钱一', employeeNo: 'EMP009', department: '管理部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:30', workHours: 9.5, status: '正常', remark: '' },
  { id: 10, name: '陈二', employeeNo: 'EMP010', department: '服务部', date: '2025-11-28', checkIn: '08:00', checkOut: '17:30', workHours: 9.5, status: '正常', remark: '' }
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '正常': 'success',
    '迟到': 'warning',
    '早退': 'warning',
    '缺勤': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.record-manage-view {
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
