<template>
  <div class="my-initiated-view">
    <div class="page-header">
      <div class="header-left">
        <h2>我发起的</h2>
        <span class="subtitle">共 {{ pagination.total }} 条申请</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">发起申请</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审批类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="请假申请" value="请假申请" />
                <el-option label="加班申请" value="加班申请" />
                <el-option label="采购申请" value="采购申请" />
                <el-option label="报销申请" value="报销申请" />
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
            <el-form-item label="申请时间">
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
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">批量撤回</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="applications" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="审批编号" prop="approvalNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.approvalNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="审批类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请内容" prop="content" min-width="200" show-overflow-tooltip />
        <el-table-column label="当前审批人" prop="approver" width="120" />
        <el-table-column label="审批状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="warning" size="small" :icon="Edit" v-if="row.status === '待审批'">修改</el-button>
            <el-button link type="danger" size="small" :icon="Delete" v-if="row.status === '待审批'">撤回</el-button>
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
  type: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 45
})

const applications = ref([
  { id: 1, approvalNo: 'AP202511280011', type: '请假申请', content: '因病请假2天', approver: '部门主管', status: '待审批', applyTime: '2025-11-28 09:00' },
  { id: 2, approvalNo: 'AP202511280012', type: '加班申请', content: '周末活动加班8小时', approver: '部门主管', status: '待审批', applyTime: '2025-11-28 08:45' },
  { id: 3, approvalNo: 'AP202511270011', type: '采购申请', content: '紧急采购食材', approver: '-', status: '已通过', applyTime: '2025-11-27 16:30' },
  { id: 4, approvalNo: 'AP202511270012', type: '报销申请', content: '差旅费报销', approver: '-', status: '已拒绝', applyTime: '2025-11-27 15:45' },
  { id: 5, approvalNo: 'AP202511270013', type: '请假申请', content: '家中有事请假1天', approver: '-', status: '已通过', applyTime: '2025-11-27 15:00' },
  { id: 6, approvalNo: 'AP202511260011', type: '加班申请', content: '工作日加班3小时', approver: '-', status: '已通过', applyTime: '2025-11-26 14:30' },
  { id: 7, approvalNo: 'AP202511260012', type: '采购申请', content: '月度食材采购', approver: '-', status: '已通过', applyTime: '2025-11-26 14:00' },
  { id: 8, approvalNo: 'AP202511260013', type: '报销申请', content: '办公用品采购报销', approver: '-', status: '已拒绝', applyTime: '2025-11-26 13:30' },
  { id: 9, approvalNo: 'AP202511250011', type: '请假申请', content: '年假申请5天', approver: '-', status: '已通过', applyTime: '2025-11-25 10:00' },
  { id: 10, approvalNo: 'AP202511250012', type: '加班申请', content: '活动准备加班', approver: '部门主管', status: '待审批', applyTime: '2025-11-25 09:30' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
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
    '请假申请': 'primary',
    '加班申请': 'warning',
    '采购申请': 'success',
    '报销申请': 'info'
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
.my-initiated-view {
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
