<template>
  <div class="health-check-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>健康检查</h2>
        <span class="subtitle">共 {{ pagination.total }} 条检查记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">新增检查</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="员工姓名">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入员工姓名" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检查类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="入职体检" value="入职体检" />
                <el-option label="年度体检" value="年度体检" />
                <el-option label="专项检查" value="专项检查" />
                <el-option label="复查" value="复查" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检查结果">
              <el-select v-model="searchForm.result" placeholder="请选择结果" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="合格" value="合格" />
                <el-option label="不合格" value="不合格" />
                <el-option label="待复查" value="待复查" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检查时间">
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
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">
            批量删除
          </el-button>
          <el-button :icon="Download" :disabled="selectedIds.length === 0">
            批量导出
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
        :data="checks" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="检查编号" prop="checkNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.checkNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检查类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检查项目" prop="items" min-width="200" show-overflow-tooltip />
        <el-table-column label="检查机构" prop="institution" width="180" />
        <el-table-column label="检查时间" prop="checkTime" width="180" />
        <el-table-column label="检查结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getResultColor(row.result)" effect="dark">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">查看报告</el-button>
            <el-button link type="success" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Refresh, Download, Plus, Delete, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  result: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 48
})

// 健康检查数据
const checks = ref([
  { id: 1, checkNo: 'HC202511280001', name: '张三', department: '厨房部', type: '年度体检', items: '内科、外科、血常规、肝功能、胸透', institution: '市人民医院', checkTime: '2025-11-20 09:00', result: '合格' },
  { id: 2, checkNo: 'HC202511280002', name: '李四', department: '服务部', type: '入职体检', items: '内科、外科、血常规、肝功能', institution: '市人民医院', checkTime: '2025-11-18 10:00', result: '合格' },
  { id: 3, checkNo: 'HC202511280003', name: '王五', department: '采购部', type: '年度体检', items: '内科、外科、血常规、肝功能、胸透、心电图', institution: '市中心医院', checkTime: '2025-11-15 14:00', result: '待复查' },
  { id: 4, checkNo: 'HC202511280004', name: '赵六', department: '管理部', type: '专项检查', items: '肝功能、肾功能', institution: '市人民医院', checkTime: '2025-11-12 11:00', result: '合格' },
  { id: 5, checkNo: 'HC202511280005', name: '孙七', department: '厨房部', type: '年度体检', items: '内科、外科、血常规、肝功能、胸透', institution: '市人民医院', checkTime: '2025-11-10 09:30', result: '合格' },
  { id: 6, checkNo: 'HC202511280006', name: '周八', department: '服务部', type: '复查', items: '肝功能复查', institution: '市中心医院', checkTime: '2025-11-08 15:00', result: '合格' },
  { id: 7, checkNo: 'HC202511280007', name: '吴九', department: '厨房部', type: '年度体检', items: '内科、外科、血常规、肝功能、胸透', institution: '市人民医院', checkTime: '2025-11-05 10:00', result: '不合格' },
  { id: 8, checkNo: 'HC202511280008', name: '郑十', department: '采购部', type: '入职体检', items: '内科、外科、血常规、肝功能', institution: '市人民医院', checkTime: '2025-11-03 13:00', result: '合格' },
  { id: 9, checkNo: 'HC202511280009', name: '钱一', department: '管理部', type: '年度体检', items: '内科、外科、血常规、肝功能、胸透、心电图', institution: '市中心医院', checkTime: '2025-11-01 09:00', result: '合格' },
  { id: 10, checkNo: 'HC202511280010', name: '陈二', department: '服务部', type: '专项检查', items: '血常规、尿常规', institution: '市人民医院', checkTime: '2025-10-28 14:30', result: '合格' }
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
  searchForm.result = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开新增检查对话框')
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
    '入职体检': 'primary',
    '年度体检': 'success',
    '专项检查': 'warning',
    '复查': 'info'
  }
  return colors[type] || 'info'
}

// 获取结果颜色
const getResultColor = (result: string) => {
  const colors: Record<string, string> = {
    '合格': 'success',
    '不合格': 'danger',
    '待复查': 'warning'
  }
  return colors[result] || 'info'
}
</script>

<style scoped>
.health-check-view {
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
