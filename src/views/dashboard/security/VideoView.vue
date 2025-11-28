<template>
  <div class="video-view">
    <div class="page-header">
      <div class="header-left">
        <h2>视频监控</h2>
        <span class="subtitle">共 {{ pagination.total }} 个监控点</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加监控</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="监控名称">
              <el-input v-model="searchForm.name" placeholder="请输入监控名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="监控位置">
              <el-select v-model="searchForm.location" placeholder="请选择位置" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="大厅" value="大厅" />
                <el-option label="厨房" value="厨房" />
                <el-option label="仓库" value="仓库" />
                <el-option label="出入口" value="出入口" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="运行状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="在线" value="在线" />
                <el-option label="离线" value="离线" />
                <el-option label="故障" value="故障" />
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

      <el-table :data="cameras" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="监控编号" prop="cameraNo" width="120">
          <template #default="{ row }">
            <el-text type="primary">{{ row.cameraNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="监控名称" prop="name" width="180" />
        <el-table-column label="监控位置" prop="location" width="120" />
        <el-table-column label="IP地址" prop="ip" width="140" />
        <el-table-column label="运行状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="录像状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.recording ? 'success' : 'info'" size="small">{{ row.recording ? '录像中' : '未录像' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后在线" prop="lastOnline" width="180" />
        <el-table-column label="负责人" prop="manager" width="100" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="VideoCamera">查看</el-button>
            <el-button link type="success" size="small" :icon="VideoPlay">回放</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, VideoCamera, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  location: '',
  status: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 32
})

const cameras = ref([
  { id: 1, cameraNo: 'CAM001', name: '大厅监控1', location: '大厅', ip: '192.168.1.101', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '张三' },
  { id: 2, cameraNo: 'CAM002', name: '大厅监控2', location: '大厅', ip: '192.168.1.102', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '张三' },
  { id: 3, cameraNo: 'CAM003', name: '厨房监控1', location: '厨房', ip: '192.168.1.103', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '李四' },
  { id: 4, cameraNo: 'CAM004', name: '厨房监控2', location: '厨房', ip: '192.168.1.104', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '李四' },
  { id: 5, cameraNo: 'CAM005', name: '仓库监控1', location: '仓库', ip: '192.168.1.105', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '王五' },
  { id: 6, cameraNo: 'CAM006', name: '仓库监控2', location: '仓库', ip: '192.168.1.106', status: '离线', recording: false, lastOnline: '2025-11-27 18:00', manager: '王五' },
  { id: 7, cameraNo: 'CAM007', name: '出入口监控1', location: '出入口', ip: '192.168.1.107', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '赵六' },
  { id: 8, cameraNo: 'CAM008', name: '出入口监控2', location: '出入口', ip: '192.168.1.108', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '赵六' },
  { id: 9, cameraNo: 'CAM009', name: '后厨监控', location: '厨房', ip: '192.168.1.109', status: '故障', recording: false, lastOnline: '2025-11-26 15:30', manager: '李四' },
  { id: 10, cameraNo: 'CAM010', name: '停车场监控', location: '出入口', ip: '192.168.1.110', status: '在线', recording: true, lastOnline: '2025-11-28 10:30', manager: '赵六' }
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
  searchForm.location = ''
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '在线': 'success',
    '离线': 'info',
    '故障': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.video-view {
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
