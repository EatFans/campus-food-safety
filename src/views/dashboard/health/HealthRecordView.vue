<template>
  <div class="health-record-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>健康档案</h2>
        <span class="subtitle">共 {{ pagination.total }} 份档案</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">创建档案</el-button>
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
            <el-form-item label="所属部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="厨房部" value="厨房部" />
                <el-option label="服务部" value="服务部" />
                <el-option label="采购部" value="采购部" />
                <el-option label="管理部" value="管理部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="血型">
              <el-select v-model="searchForm.bloodType" placeholder="请选择血型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="A型" value="A型" />
                <el-option label="B型" value="B型" />
                <el-option label="O型" value="O型" />
                <el-option label="AB型" value="AB型" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="创建时间">
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
        :data="records" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="档案编号" prop="recordNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.recordNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="性别" prop="gender" width="80" align="center" />
        <el-table-column label="年龄" prop="age" width="80" align="center" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="血型" prop="bloodType" width="80" align="center">
          <template #default="{ row }">
            <el-tag type="danger" size="small">{{ row.bloodType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="身高(cm)" prop="height" width="100" align="center" />
        <el-table-column label="体重(kg)" prop="weight" width="100" align="center" />
        <el-table-column label="过敏史" prop="allergies" min-width="150" show-overflow-tooltip />
        <el-table-column label="既往病史" prop="medicalHistory" min-width="150" show-overflow-tooltip />
        <el-table-column label="紧急联系人" prop="emergencyContact" width="120" />
        <el-table-column label="联系电话" prop="emergencyPhone" width="130" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
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
  department: '',
  bloodType: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 35
})

// 健康档案数据
const records = ref([
  { id: 1, recordNo: 'HR202511280001', name: '张三', gender: '男', age: 28, department: '厨房部', bloodType: 'A型', height: 175, weight: 70, allergies: '青霉素过敏', medicalHistory: '无', emergencyContact: '张某某', emergencyPhone: '13900139001', createTime: '2025-01-15 10:00' },
  { id: 2, recordNo: 'HR202511280002', name: '李四', gender: '女', age: 25, department: '服务部', bloodType: 'B型', height: 165, weight: 55, allergies: '无', medicalHistory: '无', emergencyContact: '李某某', emergencyPhone: '13900139002', createTime: '2025-02-20 11:00' },
  { id: 3, recordNo: 'HR202511280003', name: '王五', gender: '男', age: 32, department: '采购部', bloodType: 'O型', height: 178, weight: 75, allergies: '海鲜过敏', medicalHistory: '高血压', emergencyContact: '王某某', emergencyPhone: '13900139003', createTime: '2025-03-10 14:00' },
  { id: 4, recordNo: 'HR202511280004', name: '赵六', gender: '男', age: 35, department: '管理部', bloodType: 'AB型', height: 172, weight: 68, allergies: '无', medicalHistory: '无', emergencyContact: '赵某某', emergencyPhone: '13900139004', createTime: '2025-04-05 09:00' },
  { id: 5, recordNo: 'HR202511280005', name: '孙七', gender: '男', age: 30, department: '厨房部', bloodType: 'A型', height: 180, weight: 80, allergies: '花粉过敏', medicalHistory: '无', emergencyContact: '孙某某', emergencyPhone: '13900139005', createTime: '2025-05-12 10:30' },
  { id: 6, recordNo: 'HR202511280006', name: '周八', gender: '女', age: 27, department: '服务部', bloodType: 'B型', height: 168, weight: 58, allergies: '无', medicalHistory: '无', emergencyContact: '周某某', emergencyPhone: '13900139006', createTime: '2025-06-18 13:00' },
  { id: 7, recordNo: 'HR202511280007', name: '吴九', gender: '男', age: 29, department: '厨房部', bloodType: 'O型', height: 176, weight: 72, allergies: '无', medicalHistory: '无', emergencyContact: '吴某某', emergencyPhone: '13900139007', createTime: '2025-07-22 15:00' },
  { id: 8, recordNo: 'HR202511280008', name: '郑十', gender: '男', age: 31, department: '采购部', bloodType: 'A型', height: 174, weight: 69, allergies: '芒果过敏', medicalHistory: '无', emergencyContact: '郑某某', emergencyPhone: '13900139008', createTime: '2025-08-15 11:30' },
  { id: 9, recordNo: 'HR202511280009', name: '钱一', gender: '女', age: 26, department: '管理部', bloodType: 'B型', height: 162, weight: 52, allergies: '无', medicalHistory: '无', emergencyContact: '钱某某', emergencyPhone: '13900139009', createTime: '2025-09-10 09:30' },
  { id: 10, recordNo: 'HR202511280010', name: '陈二', gender: '女', age: 24, department: '服务部', bloodType: 'O型', height: 166, weight: 54, allergies: '无', medicalHistory: '无', emergencyContact: '陈某某', emergencyPhone: '13900139010', createTime: '2025-10-05 14:30' }
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
  searchForm.department = ''
  searchForm.bloodType = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开创建档案对话框')
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
</script>

<style scoped>
.health-record-view {
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
