<template>
  <div class="list-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>设备列表</h2>
        <span class="subtitle">共 {{ pagination.total }} 台设备</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加设备</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设备名称">
              <el-input v-model="searchForm.name" placeholder="请输入设备名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设备类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="厨房设备" value="厨房设备" />
                <el-option label="制冷设备" value="制冷设备" />
                <el-option label="消毒设备" value="消毒设备" />
                <el-option label="监控设备" value="监控设备" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设备状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
                <el-option label="维修中" value="维修中" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="购买时间">
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

      <el-table :data="devices" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="设备编号" prop="deviceNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.deviceNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="name" width="180" />
        <el-table-column label="设备类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所在位置" prop="location" width="150" />
        <el-table-column label="购买日期" prop="purchaseDate" width="120" />
        <el-table-column label="使用年限" width="100" align="center">
          <template #default="{ row }">
            <el-text type="info">{{ row.usageYears }}年</el-text>
          </template>
        </el-table-column>
        <el-table-column label="设备状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="manager" width="100" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="warning" size="small" :icon="Tools">维护</el-button>
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
import { Search, Plus, Refresh, Download, Delete, Edit, View, Tools } from '@element-plus/icons-vue'
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
  total: 45
})

const devices = ref([
  { id: 1, deviceNo: 'DEV001', name: '商用燃气灶', type: '厨房设备', location: '厨房A区', purchaseDate: '2022-03-15', usageYears: 2.7, status: '正常', manager: '张三' },
  { id: 2, deviceNo: 'DEV002', name: '冷藏柜', type: '制冷设备', location: '仓库1号', purchaseDate: '2021-06-20', usageYears: 3.4, status: '正常', manager: '李四' },
  { id: 3, deviceNo: 'DEV003', name: '消毒柜', type: '消毒设备', location: '厨房B区', purchaseDate: '2023-01-10', usageYears: 1.9, status: '正常', manager: '王五' },
  { id: 4, deviceNo: 'DEV004', name: '监控摄像头', type: '监控设备', location: '大厅', purchaseDate: '2020-09-05', usageYears: 4.2, status: '正常', manager: '赵六' },
  { id: 5, deviceNo: 'DEV005', name: '油烟机', type: '厨房设备', location: '厨房A区', purchaseDate: '2022-03-15', usageYears: 2.7, status: '维修中', manager: '张三' },
  { id: 6, deviceNo: 'DEV006', name: '冷冻柜', type: '制冷设备', location: '仓库2号', purchaseDate: '2021-08-12', usageYears: 3.3, status: '正常', manager: '李四' },
  { id: 7, deviceNo: 'DEV007', name: '洗碗机', type: '厨房设备', location: '厨房C区', purchaseDate: '2023-05-20', usageYears: 1.5, status: '正常', manager: '孙七' },
  { id: 8, deviceNo: 'DEV008', name: '紫外线消毒灯', type: '消毒设备', location: '餐厅', purchaseDate: '2022-11-08', usageYears: 2.0, status: '正常', manager: '王五' },
  { id: 9, deviceNo: 'DEV009', name: '电磁炉', type: '厨房设备', location: '厨房B区', purchaseDate: '2023-02-15', usageYears: 1.8, status: '停用', manager: '周八' },
  { id: 10, deviceNo: 'DEV010', name: '保鲜柜', type: '制冷设备', location: '展示区', purchaseDate: '2022-07-22', usageYears: 2.3, status: '正常', manager: '李四' }
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
    '厨房设备': 'warning',
    '制冷设备': 'primary',
    '消毒设备': 'success',
    '监控设备': 'info'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '正常': 'success',
    '维修中': 'warning',
    '停用': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.list-manage-view {
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
