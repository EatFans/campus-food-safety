<template>
  <div class="activity-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>营销活动</h2>
        <span class="subtitle">共 {{ pagination.total }} 个活动</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建活动</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="活动名称">
              <el-input v-model="searchForm.name" placeholder="请输入活动名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="活动类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="满减活动" value="满减活动" />
                <el-option label="折扣活动" value="折扣活动" />
                <el-option label="秒杀活动" value="秒杀活动" />
                <el-option label="赠品活动" value="赠品活动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="活动状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="未开始" value="未开始" />
                <el-option label="进行中" value="进行中" />
                <el-option label="已结束" value="已结束" />
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

      <el-table :data="activities" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="活动封面" width="100" align="center">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="cover" style="width: 60px; height: 60px; border-radius: 4px;" :preview-src-list="[row.cover]" />
          </template>
        </el-table-column>
        <el-table-column label="活动名称" prop="name" width="200" show-overflow-tooltip />
        <el-table-column label="活动类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="180" />
        <el-table-column label="结束时间" prop="endTime" width="180" />
        <el-table-column label="参与人数" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.participants }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" width="100" align="center">
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
  name: '',
  type: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 32
})

const activities = ref([
  { id: 1, name: '双十一狂欢购', type: '满减活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-11 00:00', endTime: '2025-11-11 23:59', participants: 1285, status: '已结束' },
  { id: 2, name: '周末特惠', type: '折扣活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-23 00:00', endTime: '2025-11-24 23:59', participants: 856, status: '已结束' },
  { id: 3, name: '新品秒杀', type: '秒杀活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-28 10:00', endTime: '2025-11-28 12:00', participants: 425, status: '进行中' },
  { id: 4, name: '满赠活动', type: '赠品活动', cover: 'https://via.placeholder.com/60', startTime: '2025-12-01 00:00', endTime: '2025-12-31 23:59', participants: 0, status: '未开始' },
  { id: 5, name: '会员专享', type: '折扣活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-25 00:00', endTime: '2025-11-30 23:59', participants: 652, status: '进行中' },
  { id: 6, name: '限时抢购', type: '秒杀活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-28 14:00', endTime: '2025-11-28 16:00', participants: 325, status: '进行中' },
  { id: 7, name: '满100减20', type: '满减活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-20 00:00', endTime: '2025-11-27 23:59', participants: 985, status: '已结束' },
  { id: 8, name: '买一送一', type: '赠品活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-26 00:00', endTime: '2025-11-29 23:59', participants: 568, status: '进行中' },
  { id: 9, name: '年终大促', type: '满减活动', cover: 'https://via.placeholder.com/60', startTime: '2025-12-20 00:00', endTime: '2025-12-31 23:59', participants: 0, status: '未开始' },
  { id: 10, name: '感恩回馈', type: '折扣活动', cover: 'https://via.placeholder.com/60', startTime: '2025-11-28 00:00', endTime: '2025-11-30 23:59', participants: 425, status: '进行中' }
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
    '满减活动': 'danger',
    '折扣活动': 'warning',
    '秒杀活动': 'success',
    '赠品活动': 'primary'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'success',
    '已结束': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.activity-manage-view {
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
