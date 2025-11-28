<template>
  <div class="license-manage-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>证照管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 个证照</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">添加证照</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="证照名称">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入证照名称" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="证照类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="营业执照" value="营业执照" />
                <el-option label="食品经营许可证" value="食品经营许可证" />
                <el-option label="健康证" value="健康证" />
                <el-option label="培训证书" value="培训证书" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="证照状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="有效" value="有效" />
                <el-option label="即将到期" value="即将到期" />
                <el-option label="已过期" value="已过期" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="到期时间">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
                style="width: 100%;"
              />
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

    <!-- 数据表格区域 -->
    <el-card shadow="never" class="table-card">
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="warning" :icon="Bell" :disabled="selectedIds.length === 0">
            到期提醒
          </el-button>
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">
            批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="licenses" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="证照图片" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              :src="row.image" 
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column label="证照名称" prop="name" width="200" />
        <el-table-column label="证照类型" prop="type" width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="证照编号" prop="licenseNo" width="180" show-overflow-tooltip />
        <el-table-column label="持有人" prop="holder" width="120" />
        <el-table-column label="发证机关" prop="issuer" width="180" />
        <el-table-column label="发证日期" prop="issueDate" width="120" />
        <el-table-column label="到期日期" prop="expiryDate" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="getExpiryType(row.expiryDate)">{{ row.expiryDate }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="success" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="warning" size="small" :icon="Refresh">续期</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh, Download, Plus, Delete, Edit, View, Bell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 22
})

// 证照数据
const licenses = ref([
  { id: 1, name: '食品经营许可证', type: '食品经营许可证', image: 'https://via.placeholder.com/60', licenseNo: 'JY12345678901234567', holder: '校园食堂', issuer: '市场监督管理局', issueDate: '2024-01-15', expiryDate: '2026-01-14', status: '有效' },
  { id: 2, name: '营业执照', type: '营业执照', image: 'https://via.placeholder.com/60', licenseNo: '91110000MA01234567', holder: '校园食堂', issuer: '市场监督管理局', issueDate: '2023-05-20', expiryDate: '2033-05-19', status: '有效' },
  { id: 3, name: '张三健康证', type: '健康证', image: 'https://via.placeholder.com/60', licenseNo: 'JK202511280001', holder: '张三', issuer: '疾病预防控制中心', issueDate: '2025-05-28', expiryDate: '2026-05-27', status: '有效' },
  { id: 4, name: '李四健康证', type: '健康证', image: 'https://via.placeholder.com/60', licenseNo: 'JK202511280002', holder: '李四', issuer: '疾病预防控制中心', issueDate: '2025-06-15', expiryDate: '2026-06-14', status: '有效' },
  { id: 5, name: '王五健康证', type: '健康证', image: 'https://via.placeholder.com/60', licenseNo: 'JK202511280003', holder: '王五', issuer: '疾病预防控制中心', issueDate: '2024-12-10', expiryDate: '2025-12-09', status: '即将到期' },
  { id: 6, name: '食品安全管理员证', type: '培训证书', image: 'https://via.placeholder.com/60', licenseNo: 'PX202511280001', holder: '赵六', issuer: '食品药品监督管理局', issueDate: '2024-03-20', expiryDate: '2027-03-19', status: '有效' },
  { id: 7, name: '厨师职业资格证', type: '培训证书', image: 'https://via.placeholder.com/60', licenseNo: 'CS202511280001', holder: '孙七', issuer: '人力资源和社会保障局', issueDate: '2023-08-15', expiryDate: '2028-08-14', status: '有效' },
  { id: 8, name: '周八健康证', type: '健康证', image: 'https://via.placeholder.com/60', licenseNo: 'JK202511280004', holder: '周八', issuer: '疾病预防控制中心', issueDate: '2024-11-20', expiryDate: '2025-11-19', status: '已过期' },
  { id: 9, name: '消防安全培训证', type: '培训证书', image: 'https://via.placeholder.com/60', licenseNo: 'XF202511280001', holder: '吴九', issuer: '消防救援大队', issueDate: '2024-09-10', expiryDate: '2027-09-09', status: '有效' },
  { id: 10, name: '郑十健康证', type: '健康证', image: 'https://via.placeholder.com/60', licenseNo: 'JK202511280005', holder: '郑十', issuer: '疾病预防控制中心', issueDate: '2025-07-25', expiryDate: '2026-07-24', status: '有效' }
])

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开添加证照对话框')
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  handleSearch()
}

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '营业执照': 'primary',
    '食品经营许可证': 'success',
    '健康证': 'warning',
    '培训证书': 'info'
  }
  return colors[type] || 'info'
}

// 获取到期类型
const getExpiryType = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'danger'
  if (diffDays < 30) return 'warning'
  return 'success'
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '有效': 'success',
    '即将到期': 'warning',
    '已过期': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.license-manage-view {
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
