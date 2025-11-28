<template>
  <div class="overtime-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>加班管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条加班记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">申请加班</el-button>
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
            <el-form-item label="加班类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="工作日加班" value="工作日加班" />
                <el-option label="周末加班" value="周末加班" />
                <el-option label="节假日加班" value="节假日加班" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审批状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待审批" value="待审批" />
                <el-option label="已通过" value="已通过" />
                <el-option label="已拒绝" value="已拒绝" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="加班日期">
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
          <el-button type="success" :icon="CircleCheck" :disabled="selectedIds.length === 0">批量通过</el-button>
          <el-button type="danger" :icon="Close" :disabled="selectedIds.length === 0">批量拒绝</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="overtimes" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="加班类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="加班日期" prop="date" width="120" />
        <el-table-column label="开始时间" prop="startTime" width="100" />
        <el-table-column label="结束时间" prop="endTime" width="100" />
        <el-table-column label="加班时长" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.hours }}小时</el-text>
          </template>
        </el-table-column>
        <el-table-column label="加班原因" prop="reason" min-width="180" show-overflow-tooltip />
        <el-table-column label="审批状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="CircleCheck" v-if="row.status === '待审批'">通过</el-button>
            <el-button link type="danger" size="small" :icon="Close" v-if="row.status === '待审批'">拒绝</el-button>
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
import { Search, Plus, Refresh, View, CircleCheck, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 52
})

const overtimes = ref([
  { id: 1, name: '张三', department: '厨房部', type: '工作日加班', date: '2025-11-27', startTime: '18:00', endTime: '21:00', hours: 3, reason: '准备明天活动餐食', status: '已通过' },
  { id: 2, name: '李四', department: '服务部', type: '周末加班', date: '2025-11-23', startTime: '09:00', endTime: '17:00', hours: 8, reason: '周末活动服务', status: '已通过' },
  { id: 3, name: '王五', department: '采购部', type: '工作日加班', date: '2025-11-28', startTime: '18:00', endTime: '20:00', hours: 2, reason: '紧急采购任务', status: '待审批' },
  { id: 4, name: '赵六', department: '管理部', type: '工作日加班', date: '2025-11-26', startTime: '18:00', endTime: '22:00', hours: 4, reason: '月度报表整理', status: '已通过' },
  { id: 5, name: '孙七', department: '厨房部', type: '节假日加班', date: '2025-11-24', startTime: '08:00', endTime: '17:00', hours: 9, reason: '节假日值班', status: '已通过' },
  { id: 6, name: '周八', department: '服务部', type: '周末加班', date: '2025-11-24', startTime: '10:00', endTime: '18:00', hours: 8, reason: '周末活动支持', status: '已通过' },
  { id: 7, name: '吴九', department: '厨房部', type: '工作日加班', date: '2025-11-28', startTime: '18:00', endTime: '20:30', hours: 2.5, reason: '菜品研发', status: '待审批' },
  { id: 8, name: '郑十', department: '采购部', type: '工作日加班', date: '2025-11-25', startTime: '18:00', endTime: '19:30', hours: 1.5, reason: '供应商对接', status: '已拒绝' },
  { id: 9, name: '钱一', department: '管理部', type: '周末加班', date: '2025-11-23', startTime: '09:00', endTime: '12:00', hours: 3, reason: '系统维护', status: '已通过' },
  { id: 10, name: '陈二', department: '服务部', type: '工作日加班', date: '2025-11-28', startTime: '18:00', endTime: '21:00', hours: 3, reason: '活动准备', status: '待审批' }
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

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '工作日加班': 'primary',
    '周末加班': 'warning',
    '节假日加班': 'danger'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '待审批': 'warning',
    '已通过': 'success',
    '已拒绝': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.overtime-manage-view {
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
