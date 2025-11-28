<template>
  <div class="quality-test-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>质量检测</h2>
        <span class="subtitle">共 {{ pagination.total }} 条检测记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">新增检测</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检测项目">
              <el-input 
                v-model="searchForm.project" 
                placeholder="请输入检测项目" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检测类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="农药残留" value="农药残留" />
                <el-option label="微生物" value="微生物" />
                <el-option label="重金属" value="重金属" />
                <el-option label="添加剂" value="添加剂" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检测结果">
              <el-select v-model="searchForm.result" placeholder="请选择结果" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="合格" value="合格" />
                <el-option label="不合格" value="不合格" />
                <el-option label="待检测" value="待检测" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="检测时间">
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
        :data="tests" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="检测编号" prop="testNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.testNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="检测项目" prop="project" width="180" />
        <el-table-column label="检测类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="样品名称" prop="sampleName" width="150" />
        <el-table-column label="检测指标" prop="indicator" width="150" />
        <el-table-column label="检测值" prop="testValue" width="120" align="center" />
        <el-table-column label="标准值" prop="standardValue" width="120" align="center" />
        <el-table-column label="检测结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getResultColor(row.result)" effect="dark">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检测人员" prop="tester" width="100" />
        <el-table-column label="检测时间" prop="testTime" width="180" />
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
  project: '',
  type: '',
  result: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 42
})

// 质量检测数据
const tests = ref([
  { id: 1, testNo: 'QT202511280001', project: '蔬菜农药残留检测', type: '农药残留', sampleName: '西红柿', indicator: '有机磷', testValue: '0.02mg/kg', standardValue: '≤0.5mg/kg', result: '合格', tester: '张三', testTime: '2025-11-28 09:00' },
  { id: 2, testNo: 'QT202511280002', project: '肉类微生物检测', type: '微生物', sampleName: '猪肉', indicator: '菌落总数', testValue: '8×10³CFU/g', standardValue: '≤1×10⁴CFU/g', result: '合格', tester: '李四', testTime: '2025-11-28 09:15' },
  { id: 3, testNo: 'QT202511280003', project: '水产重金属检测', type: '重金属', sampleName: '鲈鱼', indicator: '汞含量', testValue: '0.08mg/kg', standardValue: '≤0.5mg/kg', result: '合格', tester: '王五', testTime: '2025-11-28 09:30' },
  { id: 4, testNo: 'QT202511280004', project: '食品添加剂检测', type: '添加剂', sampleName: '豆腐', indicator: '苯甲酸', testValue: '0.15g/kg', standardValue: '≤1.0g/kg', result: '合格', tester: '赵六', testTime: '2025-11-28 09:45' },
  { id: 5, testNo: 'QT202511280005', project: '蔬菜农药残留检测', type: '农药残留', sampleName: '黄瓜', indicator: '有机磷', testValue: '0.03mg/kg', standardValue: '≤0.5mg/kg', result: '合格', tester: '张三', testTime: '2025-11-28 10:00' },
  { id: 6, testNo: 'QT202511280006', project: '肉类微生物检测', type: '微生物', sampleName: '鸡肉', indicator: '大肠菌群', testValue: '2×10²MPN/g', standardValue: '≤1×10³MPN/g', result: '合格', tester: '李四', testTime: '2025-11-28 10:15' },
  { id: 7, testNo: 'QT202511280007', project: '水产重金属检测', type: '重金属', sampleName: '虾仁', indicator: '铅含量', testValue: '0.12mg/kg', standardValue: '≤0.5mg/kg', result: '合格', tester: '王五', testTime: '2025-11-28 10:30' },
  { id: 8, testNo: 'QT202511280008', project: '蔬菜农药残留检测', type: '农药残留', sampleName: '青菜', indicator: '有机磷', testValue: '0.65mg/kg', standardValue: '≤0.5mg/kg', result: '不合格', tester: '张三', testTime: '2025-11-28 10:45' },
  { id: 9, testNo: 'QT202511280009', project: '食品添加剂检测', type: '添加剂', sampleName: '腌菜', indicator: '亚硝酸盐', testValue: '8mg/kg', standardValue: '≤20mg/kg', result: '合格', tester: '赵六', testTime: '2025-11-28 11:00' },
  { id: 10, testNo: 'QT202511280010', project: '肉类微生物检测', type: '微生物', sampleName: '牛肉', indicator: '菌落总数', testValue: '待检测', standardValue: '≤1×10⁴CFU/g', result: '待检测', tester: '李四', testTime: '2025-11-28 11:15' }
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
  searchForm.project = ''
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
  ElMessage.info('打开新增检测对话框')
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
    '农药残留': 'success',
    '微生物': 'warning',
    '重金属': 'danger',
    '添加剂': 'primary'
  }
  return colors[type] || 'info'
}

// 获取结果颜色
const getResultColor = (result: string) => {
  const colors: Record<string, string> = {
    '合格': 'success',
    '不合格': 'danger',
    '待检测': 'info'
  }
  return colors[result] || 'info'
}
</script>

<style scoped>
.quality-test-view {
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
