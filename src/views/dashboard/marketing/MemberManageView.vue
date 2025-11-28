<template>
  <div class="member-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>会员管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 名会员</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加会员</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="会员姓名">
              <el-input v-model="searchForm.name" placeholder="请输入会员姓名" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="会员等级">
              <el-select v-model="searchForm.level" placeholder="请选择等级" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="普通会员" value="普通会员" />
                <el-option label="银卡会员" value="银卡会员" />
                <el-option label="金卡会员" value="金卡会员" />
                <el-option label="钻石会员" value="钻石会员" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="会员状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="正常" value="正常" />
                <el-option label="冻结" value="冻结" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="注册时间">
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

      <el-table :data="members" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="会员姓名" prop="name" width="120" />
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="会员等级" prop="level" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelColor(row.level)" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="积分" width="100" align="center">
          <template #default="{ row }">
            <el-text type="warning">{{ row.points }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="消费金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.totalSpent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消费次数" prop="orderCount" width="100" align="center" />
        <el-table-column label="注册时间" prop="registerTime" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
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
  level: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 156
})

const members = ref([
  { id: 1, name: '张三', phone: '13800138001', level: '金卡会员', points: 2580, totalSpent: '15680.00', orderCount: 85, registerTime: '2024-01-15 10:00', status: '正常' },
  { id: 2, name: '李四', phone: '13800138002', level: '银卡会员', points: 1256, totalSpent: '8560.00', orderCount: 52, registerTime: '2024-03-20 11:00', status: '正常' },
  { id: 3, name: '王五', phone: '13800138003', level: '钻石会员', points: 5680, totalSpent: '35680.00', orderCount: 156, registerTime: '2023-08-10 14:00', status: '正常' },
  { id: 4, name: '赵六', phone: '13800138004', level: '普通会员', points: 568, totalSpent: '2560.00', orderCount: 18, registerTime: '2025-05-12 09:00', status: '正常' },
  { id: 5, name: '孙七', phone: '13800138005', level: '金卡会员', points: 3256, totalSpent: '18560.00', orderCount: 95, registerTime: '2024-02-20 10:30', status: '正常' },
  { id: 6, name: '周八', phone: '13800138006', level: '银卡会员', points: 1568, totalSpent: '9560.00', orderCount: 62, registerTime: '2024-06-15 13:00', status: '正常' },
  { id: 7, name: '吴九', phone: '13800138007', level: '普通会员', points: 256, totalSpent: '1560.00', orderCount: 12, registerTime: '2025-09-10 15:00', status: '冻结' },
  { id: 8, name: '郑十', phone: '13800138008', level: '金卡会员', points: 2856, totalSpent: '16560.00', orderCount: 88, registerTime: '2024-04-05 11:30', status: '正常' },
  { id: 9, name: '钱一', phone: '13800138009', level: '钻石会员', points: 6580, totalSpent: '45680.00', orderCount: 185, registerTime: '2023-05-20 09:30', status: '正常' },
  { id: 10, name: '陈二', phone: '13800138010', level: '银卡会员', points: 1856, totalSpent: '10560.00', orderCount: 68, registerTime: '2024-07-25 14:30', status: '正常' }
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
  searchForm.level = ''
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

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '普通会员': 'info',
    '银卡会员': '',
    '金卡会员': 'warning',
    '钻石会员': 'danger'
  }
  return colors[level] || 'info'
}
</script>

<style scoped>
.member-manage-view {
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

.amount-text {
  color: #f56c6c;
  font-weight: 600;
  font-size: 15px;
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
