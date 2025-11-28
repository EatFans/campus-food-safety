<template>
  <div class="emergency-view">
    <div class="page-header">
      <div class="header-left">
        <h2>应急预案</h2>
        <span class="subtitle">共 {{ pagination.total }} 个预案</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建预案</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预案名称">
              <el-input v-model="searchForm.name" placeholder="请输入预案名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预案类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="火灾" value="火灾" />
                <el-option label="食物中毒" value="食物中毒" />
                <el-option label="停电" value="停电" />
                <el-option label="自然灾害" value="自然灾害" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预案状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="启用" value="启用" />
                <el-option label="停用" value="停用" />
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

      <el-table :data="plans" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="预案编号" prop="planNo" width="120">
          <template #default="{ row }">
            <el-text type="primary">{{ row.planNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="预案名称" prop="name" width="200" />
        <el-table-column label="预案类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="响应级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelColor(row.level)" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="manager" width="100" />
        <el-table-column label="联系电话" prop="phone" width="130" />
        <el-table-column label="最后演练" prop="lastDrill" width="120" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="预案状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="Promotion">启动</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, View, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 15
})

const plans = ref([
  { id: 1, planNo: 'PLAN001', name: '火灾应急预案', type: '火灾', level: '一级', manager: '张三', phone: '13800138001', lastDrill: '2025-10-15', createTime: '2023-01-15 10:00', status: '启用' },
  { id: 2, planNo: 'PLAN002', name: '食物中毒应急预案', type: '食物中毒', level: '一级', manager: '李四', phone: '13800138002', lastDrill: '2025-09-20', createTime: '2023-01-15 10:05', status: '启用' },
  { id: 3, planNo: 'PLAN003', name: '停电应急预案', type: '停电', level: '二级', manager: '王五', phone: '13800138003', lastDrill: '2025-11-01', createTime: '2023-01-15 10:10', status: '启用' },
  { id: 4, planNo: 'PLAN004', name: '地震应急预案', type: '自然灾害', level: '一级', manager: '赵六', phone: '13800138004', lastDrill: '2025-08-10', createTime: '2023-01-15 10:15', status: '启用' },
  { id: 5, planNo: 'PLAN005', name: '燃气泄漏应急预案', type: '火灾', level: '一级', manager: '张三', phone: '13800138001', lastDrill: '2025-10-20', createTime: '2023-02-20 14:00', status: '启用' },
  { id: 6, planNo: 'PLAN006', name: '暴雨应急预案', type: '自然灾害', level: '二级', manager: '赵六', phone: '13800138004', lastDrill: '2025-07-15', createTime: '2023-03-10 09:00', status: '启用' },
  { id: 7, planNo: 'PLAN007', name: '设备故障应急预案', type: '停电', level: '三级', manager: '王五', phone: '13800138003', lastDrill: '2025-11-05', createTime: '2023-04-05 11:00', status: '启用' },
  { id: 8, planNo: 'PLAN008', name: '群体性事件应急预案', type: '自然灾害', level: '一级', manager: '赵六', phone: '13800138004', lastDrill: '2025-06-20', createTime: '2023-05-12 13:00', status: '停用' },
  { id: 9, planNo: 'PLAN009', name: '水灾应急预案', type: '自然灾害', level: '二级', manager: '赵六', phone: '13800138004', lastDrill: '2025-07-25', createTime: '2023-06-18 15:00', status: '启用' },
  { id: 10, planNo: 'PLAN010', name: '传染病应急预案', type: '食物中毒', level: '一级', manager: '李四', phone: '13800138002', lastDrill: '2025-09-10', createTime: '2023-07-22 10:30', status: '启用' }
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
    '火灾': 'danger',
    '食物中毒': 'warning',
    '停电': 'primary',
    '自然灾害': 'info'
  }
  return colors[type] || 'info'
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '一级': 'danger',
    '二级': 'warning',
    '三级': 'success'
  }
  return colors[level] || 'info'
}
</script>

<style scoped>
.emergency-view {
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
