<template>
  <div class="workflow-view">
    <div class="page-header">
      <div class="header-left">
        <h2>审批流程</h2>
        <span class="subtitle">共 {{ pagination.total }} 个流程</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建流程</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="流程名称">
              <el-input v-model="searchForm.name" placeholder="请输入流程名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="流程类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="请假流程" value="请假流程" />
                <el-option label="加班流程" value="加班流程" />
                <el-option label="采购流程" value="采购流程" />
                <el-option label="报销流程" value="报销流程" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="流程状态">
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

      <el-table :data="workflows" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="流程名称" prop="name" width="180" />
        <el-table-column label="流程类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审批节点" prop="nodes" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.nodes }}个节点</el-text>
          </template>
        </el-table-column>
        <el-table-column label="审批人员" prop="approvers" min-width="200" show-overflow-tooltip />
        <el-table-column label="使用次数" width="100" align="center">
          <template #default="{ row }">
            <el-text type="success">{{ row.usageCount }}次</el-text>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="流程状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">查看</el-button>
            <el-button link type="warning" size="small" :icon="CopyDocument">复制</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, View, CopyDocument } from '@element-plus/icons-vue'
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
  total: 12
})

const workflows = ref([
  { id: 1, name: '员工请假审批流程', type: '请假流程', nodes: 3, approvers: '直属主管 → 部门经理 → 人事部', usageCount: 156, createTime: '2023-01-15 10:00', status: '启用' },
  { id: 2, name: '加班申请审批流程', type: '加班流程', nodes: 2, approvers: '直属主管 → 部门经理', usageCount: 89, createTime: '2023-01-15 10:05', status: '启用' },
  { id: 3, name: '食材采购审批流程', type: '采购流程', nodes: 4, approvers: '采购员 → 采购主管 → 财务部 → 总经理', usageCount: 245, createTime: '2023-01-15 10:10', status: '启用' },
  { id: 4, name: '费用报销审批流程', type: '报销流程', nodes: 3, approvers: '直属主管 → 财务部 → 总经理', usageCount: 312, createTime: '2023-01-15 10:15', status: '启用' },
  { id: 5, name: '紧急采购审批流程', type: '采购流程', nodes: 2, approvers: '采购主管 → 总经理', usageCount: 45, createTime: '2023-02-20 14:00', status: '启用' },
  { id: 6, name: '年假申请审批流程', type: '请假流程', nodes: 3, approvers: '直属主管 → 部门经理 → 人事部', usageCount: 68, createTime: '2023-03-10 09:00', status: '启用' },
  { id: 7, name: '病假申请审批流程', type: '请假流程', nodes: 2, approvers: '直属主管 → 人事部', usageCount: 92, createTime: '2023-03-15 10:30', status: '启用' },
  { id: 8, name: '设备采购审批流程', type: '采购流程', nodes: 4, approvers: '申请人 → 部门经理 → 财务部 → 总经理', usageCount: 28, createTime: '2023-04-05 11:00', status: '停用' },
  { id: 9, name: '差旅费报销流程', type: '报销流程', nodes: 3, approvers: '直属主管 → 财务部 → 总经理', usageCount: 156, createTime: '2023-05-12 13:00', status: '启用' },
  { id: 10, name: '节假日加班流程', type: '加班流程', nodes: 3, approvers: '直属主管 → 部门经理 → 人事部', usageCount: 34, createTime: '2023-06-18 15:00', status: '启用' }
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
    '请假流程': 'primary',
    '加班流程': 'warning',
    '采购流程': 'success',
    '报销流程': 'info'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.workflow-view {
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
