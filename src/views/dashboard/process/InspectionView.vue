<template>
  <div class="inspection-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><Document /></el-icon>
        </div>
        <div class="header-content">
          <h2>日常监督检查管理</h2>
          <p class="header-desc">记录检查时间、检查内容、检查结果、整改措施等监督信息</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增检查</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.total }}</div>
            <div class="stat-label">检查记录总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.passed }}</div>
            <div class="stat-label">检查合格</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.issues }}</div>
            <div class="stat-label">发现问题</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-cyan">
          <div class="stat-icon">
            <el-icon :size="32"><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.today }}</div>
            <div class="stat-label">今日检查</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="食堂">
          <el-select v-model="searchForm.canteen" placeholder="请选择食堂" clearable style="width: 150px">
            <el-option label="第一食堂" value="1" />
            <el-option label="第二食堂" value="2" />
            <el-option label="第三食堂" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 150px">
            <el-option label="日常检查" value="daily" />
            <el-option label="专项检查" value="special" />
            <el-option label="突击检查" value="surprise" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查结果">
          <el-select v-model="searchForm.result" placeholder="请选择" clearable style="width: 120px">
            <el-option label="合格" value="passed" />
            <el-option label="基本合格" value="basically" />
            <el-option label="不合格" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="canteen" label="检查对象" width="100" />
        <el-table-column prop="type" label="检查类型" width="100" />
        <el-table-column prop="date" label="检查日期" width="120" />
        <el-table-column prop="inspector" label="检查人员" width="100" />
        <el-table-column prop="content" label="检查内容" min-width="180" show-overflow-tooltip />
        <el-table-column prop="score" label="评分" width="80" />
        <el-table-column prop="result" label="检查结果" width="100">
          <template #default="{ row }">
            <el-tag :type="getResultType(row.result)">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Download, Search, Refresh, View, Edit, Delete, Document, CircleCheck, Warning, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  total: 1856,
  passed: 1782,
  issues: 68,
  today: 8
})

// 搜索表单
const searchForm = reactive({
  canteen: '',
  type: '',
  result: ''
})

const loading = ref(false)

const tableData = ref([
  {
    id: 1,
    canteen: '第一食堂',
    type: '日常检查',
    date: '2024-12-04',
    inspector: '李检查员',
    content: '食品加工环境卫生、从业人员健康证、食品留样',
    score: 95,
    result: '合格'
  },
  {
    id: 2,
    canteen: '第二食堂',
    type: '专项检查',
    date: '2024-12-03',
    inspector: '王检查员',
    content: '食品原料采购、储存条件、加工流程规范',
    score: 88,
    result: '基本合格'
  },
  {
    id: 3,
    canteen: '第三食堂',
    type: '突击检查',
    date: '2024-12-02',
    inspector: '张检查员',
    content: '餐具消毒、食品留样、废弃物处理',
    score: 92,
    result: '合格'
  }
])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const getResultType = (result: string) => {
  const map: Record<string, any> = {
    '合格': 'success',
    '基本合格': 'warning',
    '不合格': 'danger'
  }
  return map[result] || 'info'
}

const handleAdd = () => {
  ElMessage.info('打开新增对话框')
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.canteen = ''
  searchForm.type = ''
  searchForm.result = ''
}

const handleView = (row: any) => {
  ElMessage.info(`查看检查记录: ${row.canteen}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑检查记录: ${row.canteen}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除检查记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.inspection-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f4ff;
  border-radius: 10px;
  color: #409EFF;
}

.header-content h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.header-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.stat-card-blue {
  border-left-color: #409EFF;
}

.stat-card-blue .stat-icon {
  background: #e8f4ff;
  color: #409EFF;
}

.stat-card-green {
  border-left-color: #67C23A;
}

.stat-card-green .stat-icon {
  background: #e8f8e8;
  color: #67C23A;
}

.stat-card-orange {
  border-left-color: #E6A23C;
}

.stat-card-orange .stat-icon {
  background: #fef3e8;
  color: #E6A23C;
}

.stat-card-cyan {
  border-left-color: #17a2b8;
}

.stat-card-cyan .stat-icon {
  background: #e8f8fa;
  color: #17a2b8;
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

/* 搜索卡片 */
.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

/* 表格卡片 */
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.table-card :deep(.el-table) {
  font-size: 14px;
}

.table-card :deep(.el-table th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
}

.table-card :deep(.el-table td),
.table-card :deep(.el-table th) {
  padding: 14px 0;
}

.table-card :deep(.el-table__row:hover) {
  background: #f9fafb;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button.is-link) {
  padding: 4px 8px;
  font-size: 13px;
}
</style>
