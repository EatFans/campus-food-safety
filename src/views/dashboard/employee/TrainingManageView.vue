<template>
  <div class="training-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>培训管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条培训记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建培训</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="培训主题">
              <el-input v-model="searchForm.topic" placeholder="请输入培训主题" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="培训类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="岗前培训" value="岗前培训" />
                <el-option label="技能培训" value="技能培训" />
                <el-option label="安全培训" value="安全培训" />
                <el-option label="管理培训" value="管理培训" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="培训状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="未开始" value="未开始" />
                <el-option label="进行中" value="进行中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="培训时间">
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

      <el-table :data="trainings" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="培训主题" prop="topic" width="200" show-overflow-tooltip />
        <el-table-column label="培训类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="培训讲师" prop="trainer" width="120" />
        <el-table-column label="培训地点" prop="location" width="150" />
        <el-table-column label="培训时间" prop="trainingTime" width="180" />
        <el-table-column label="参训人数" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.participants }}人</el-text>
          </template>
        </el-table-column>
        <el-table-column label="通过率" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="getPassRateType(row.passRate)">{{ row.passRate }}%</el-text>
          </template>
        </el-table-column>
        <el-table-column label="培训状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
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
import { Search, Plus, Refresh, Download, Delete, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  topic: '',
  type: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 35
})

const trainings = ref([
  { id: 1, topic: '食品安全法律法规培训', type: '安全培训', trainer: '张教授', location: '培训室A', trainingTime: '2025-11-20 09:00', participants: 45, passRate: 95, status: '已完成' },
  { id: 2, topic: '新员工岗前培训', type: '岗前培训', trainer: '李主管', location: '培训室B', trainingTime: '2025-11-25 14:00', participants: 12, passRate: 100, status: '已完成' },
  { id: 3, topic: '厨师技能提升培训', type: '技能培训', trainer: '王厨师长', location: '厨房', trainingTime: '2025-11-28 10:00', participants: 18, passRate: 0, status: '进行中' },
  { id: 4, topic: '消防安全知识培训', type: '安全培训', trainer: '消防队长', location: '培训室A', trainingTime: '2025-12-01 09:00', participants: 0, passRate: 0, status: '未开始' },
  { id: 5, topic: '服务礼仪培训', type: '技能培训', trainer: '赵老师', location: '培训室B', trainingTime: '2025-11-22 14:00', participants: 20, passRate: 90, status: '已完成' },
  { id: 6, topic: '食材采购管理培训', type: '管理培训', trainer: '孙经理', location: '会议室', trainingTime: '2025-11-18 10:00', participants: 8, passRate: 100, status: '已完成' },
  { id: 7, topic: '卫生清洁标准培训', type: '安全培训', trainer: '周主管', location: '培训室A', trainingTime: '2025-11-15 15:00', participants: 15, passRate: 93, status: '已完成' },
  { id: 8, topic: '财务管理基础培训', type: '管理培训', trainer: '吴会计', location: '财务部', trainingTime: '2025-11-28 14:00', participants: 6, passRate: 0, status: '进行中' },
  { id: 9, topic: '应急处理培训', type: '安全培训', trainer: '郑队长', location: '培训室B', trainingTime: '2025-12-05 09:00', participants: 0, passRate: 0, status: '未开始' },
  { id: 10, topic: '团队协作培训', type: '管理培训', trainer: '钱老师', location: '会议室', trainingTime: '2025-11-12 10:00', participants: 30, passRate: 87, status: '已完成' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.topic = ''
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
    '岗前培训': 'primary',
    '技能培训': 'success',
    '安全培训': 'danger',
    '管理培训': 'warning'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success'
  }
  return colors[status] || 'info'
}

const getPassRateType = (rate: number) => {
  if (rate >= 90) return 'success'
  if (rate >= 80) return 'warning'
  if (rate > 0) return 'danger'
  return 'info'
}
</script>

<style scoped>
.training-manage-view {
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
