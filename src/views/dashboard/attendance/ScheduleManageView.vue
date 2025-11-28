<template>
  <div class="schedule-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>排班管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条排班记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建排班</el-button>
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
            <el-form-item label="班次类型">
              <el-select v-model="searchForm.shift" placeholder="请选择班次" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="早班" value="早班" />
                <el-option label="中班" value="中班" />
                <el-option label="晚班" value="晚班" />
              </el-select>
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
            <el-form-item label="排班日期">
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
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="schedules" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排班日期" prop="date" width="120" />
        <el-table-column label="班次类型" prop="shift" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getShiftColor(row.shift)" size="small">{{ row.shift }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上班时间" prop="startTime" width="100" />
        <el-table-column label="下班时间" prop="endTime" width="100" />
        <el-table-column label="工作时长" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.hours }}小时</el-text>
          </template>
        </el-table-column>
        <el-table-column label="岗位" prop="position" width="120" />
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
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
import { Search, Plus, Refresh, Download, Delete, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  shift: '',
  department: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 156
})

const schedules = ref([
  { id: 1, name: '张三', department: '厨房部', date: '2025-11-28', shift: '早班', startTime: '06:00', endTime: '14:00', hours: 8, position: '厨师', remark: '' },
  { id: 2, name: '李四', department: '服务部', date: '2025-11-28', shift: '中班', startTime: '10:00', endTime: '18:00', hours: 8, position: '服务员', remark: '' },
  { id: 3, name: '王五', department: '采购部', date: '2025-11-28', shift: '早班', startTime: '08:00', endTime: '17:00', hours: 9, position: '采购员', remark: '' },
  { id: 4, name: '赵六', department: '管理部', date: '2025-11-28', shift: '早班', startTime: '08:00', endTime: '17:00', hours: 9, position: '行政主管', remark: '' },
  { id: 5, name: '孙七', department: '厨房部', date: '2025-11-28', shift: '中班', startTime: '10:00', endTime: '18:00', hours: 8, position: '厨师', remark: '' },
  { id: 6, name: '周八', department: '服务部', date: '2025-11-28', shift: '晚班', startTime: '14:00', endTime: '22:00', hours: 8, position: '服务员', remark: '' },
  { id: 7, name: '吴九', department: '厨房部', date: '2025-11-28', shift: '晚班', startTime: '14:00', endTime: '22:00', hours: 8, position: '厨师', remark: '' },
  { id: 8, name: '郑十', department: '采购部', date: '2025-11-28', shift: '早班', startTime: '08:00', endTime: '17:00', hours: 9, position: '采购主管', remark: '' },
  { id: 9, name: '钱一', department: '管理部', date: '2025-11-28', shift: '早班', startTime: '08:00', endTime: '17:00', hours: 9, position: '财务会计', remark: '' },
  { id: 10, name: '陈二', department: '服务部', date: '2025-11-28', shift: '早班', startTime: '08:00', endTime: '16:00', hours: 8, position: '服务员', remark: '' }
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
  searchForm.shift = ''
  searchForm.department = ''
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

const getShiftColor = (shift: string) => {
  const colors: Record<string, string> = {
    '早班': 'success',
    '中班': 'warning',
    '晚班': 'danger'
  }
  return colors[shift] || 'info'
}
</script>

<style scoped>
.schedule-manage-view {
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
