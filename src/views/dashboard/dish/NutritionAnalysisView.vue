<template>
  <div class="nutrition-analysis-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>营养分析</h2>
        <span class="subtitle">共 {{ pagination.total }} 条营养数据</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">添加营养数据</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="菜品名称">
              <el-input 
                v-model="searchForm.dishName" 
                placeholder="请输入菜品名称" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="热量范围">
              <el-select v-model="searchForm.calorieRange" placeholder="请选择范围" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="低热量(0-200)" value="low" />
                <el-option label="中热量(200-500)" value="medium" />
                <el-option label="高热量(500+)" value="high" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="营养标签">
              <el-select v-model="searchForm.tag" placeholder="请选择标签" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="高蛋白" value="高蛋白" />
                <el-option label="低脂肪" value="低脂肪" />
                <el-option label="高纤维" value="高纤维" />
                <el-option label="低糖" value="低糖" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="更新时间">
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
        :data="nutritionData" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="菜品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              :src="row.image" 
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column label="菜品名称" prop="dishName" width="150" />
        <el-table-column label="热量(kcal)" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="getCalorieType(row.calories)">{{ row.calories }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="蛋白质(g)" prop="protein" width="100" align="center" />
        <el-table-column label="脂肪(g)" prop="fat" width="100" align="center" />
        <el-table-column label="碳水(g)" prop="carbs" width="100" align="center" />
        <el-table-column label="纤维(g)" prop="fiber" width="100" align="center" />
        <el-table-column label="钠(mg)" prop="sodium" width="100" align="center" />
        <el-table-column label="营养标签" width="200">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 4px;">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="180" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">详情</el-button>
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
  dishName: '',
  calorieRange: '',
  tag: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 32
})

// 营养数据
const nutritionData = ref([
  { id: 1, dishName: '宫保鸡丁', image: 'https://via.placeholder.com/60', calories: 285, protein: 28, fat: 15, carbs: 12, fiber: 3, sodium: 850, tags: ['高蛋白'], updateTime: '2025-11-26 10:00' },
  { id: 2, dishName: '红烧肉', image: 'https://via.placeholder.com/60', calories: 520, protein: 25, fat: 42, carbs: 8, fiber: 1, sodium: 1200, tags: ['高蛋白', '高脂肪'], updateTime: '2025-11-26 10:05' },
  { id: 3, dishName: '鱼香肉丝', image: 'https://via.placeholder.com/60', calories: 320, protein: 22, fat: 18, carbs: 20, fiber: 4, sodium: 920, tags: ['高蛋白'], updateTime: '2025-11-26 10:10' },
  { id: 4, dishName: '麻婆豆腐', image: 'https://via.placeholder.com/60', calories: 180, protein: 15, fat: 8, carbs: 12, fiber: 5, sodium: 680, tags: ['高蛋白', '低脂肪'], updateTime: '2025-11-26 10:15' },
  { id: 5, dishName: '糖醋排骨', image: 'https://via.placeholder.com/60', calories: 450, protein: 30, fat: 25, carbs: 28, fiber: 2, sodium: 980, tags: ['高蛋白'], updateTime: '2025-11-26 10:20' },
  { id: 6, dishName: '水煮鱼', image: 'https://via.placeholder.com/60', calories: 380, protein: 35, fat: 22, carbs: 8, fiber: 3, sodium: 1500, tags: ['高蛋白'], updateTime: '2025-11-26 10:25' },
  { id: 7, dishName: '酸菜鱼', image: 'https://via.placeholder.com/60', calories: 350, protein: 32, fat: 18, carbs: 15, fiber: 4, sodium: 1350, tags: ['高蛋白', '低脂肪'], updateTime: '2025-11-26 10:30' },
  { id: 8, dishName: '清蒸鲈鱼', image: 'https://via.placeholder.com/60', calories: 150, protein: 28, fat: 3, carbs: 2, fiber: 0, sodium: 420, tags: ['高蛋白', '低脂肪', '低糖'], updateTime: '2025-11-26 10:35' },
  { id: 9, dishName: '凉拌黄瓜', image: 'https://via.placeholder.com/60', calories: 45, protein: 2, fat: 1, carbs: 8, fiber: 2, sodium: 320, tags: ['低脂肪', '高纤维', '低糖'], updateTime: '2025-11-26 10:40' },
  { id: 10, dishName: '西红柿炒蛋', image: 'https://via.placeholder.com/60', calories: 220, protein: 12, fat: 15, carbs: 10, fiber: 2, sodium: 580, tags: ['高蛋白'], updateTime: '2025-11-26 10:45' }
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
  searchForm.dishName = ''
  searchForm.calorieRange = ''
  searchForm.tag = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开添加营养数据对话框')
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

// 获取热量类型
const getCalorieType = (calories: number) => {
  if (calories < 200) return 'success'
  if (calories < 500) return 'warning'
  return 'danger'
}
</script>

<style scoped>
.nutrition-analysis-view {
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
