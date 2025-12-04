<template>
  <div class="waste-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><DeleteFilled /></el-icon>
        </div>
        <div class="header-content">
          <h2>餐厨垃圾处理管理</h2>
          <p class="header-desc">记录垃圾产生时间、数量、处理方式、处理单位等处理信息</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增记录</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <el-icon :size="32"><DeleteFilled /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.total }}</div>
            <div class="stat-label">处理记录总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.monthWeight }}</div>
            <div class="stat-label">本月处理量(吨)</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.compliance }}%</div>
            <div class="stat-label">合规处理率</div>
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
            <div class="stat-label">今日处理</div>
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
        <el-form-item label="处理单位">
          <el-input 
            v-model="searchForm.company" 
            placeholder="请输入处理单位" 
            clearable 
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="处理方式">
          <el-select v-model="searchForm.method" placeholder="请选择" clearable style="width: 140px">
            <el-option label="资源化利用" value="recycle" />
            <el-option label="无害化处理" value="harmless" />
            <el-option label="生物降解" value="biodegradation" />
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
        <el-table-column prop="canteen" label="所属食堂" width="100" />
        <el-table-column prop="date" label="产生日期" width="120" />
        <el-table-column prop="weight" label="重量(kg)" width="100" />
        <el-table-column prop="type" label="垃圾类型" width="120" />
        <el-table-column prop="method" label="处理方式" width="120" />
        <el-table-column prop="company" label="处理单位" min-width="150" />
        <el-table-column prop="operator" label="操作人员" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
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
import { Plus, Download, Search, Refresh, View, Edit, Delete, DeleteFilled, TrendCharts, CircleCheck, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  total: 2456,
  monthWeight: 15.8,
  compliance: 98.5,
  today: 12
})

// 搜索表单
const searchForm = reactive({
  canteen: '',
  company: '',
  method: ''
})

const loading = ref(false)

const tableData = ref([
  {
    id: 1,
    canteen: '第一食堂',
    date: '2024-12-04',
    weight: 185,
    type: '餐厨垃圾',
    method: '资源化利用',
    company: '绿色环保处理公司',
    operator: '张师傅',
    status: '已处理'
  },
  {
    id: 2,
    canteen: '第二食堂',
    date: '2024-12-04',
    weight: 156,
    type: '餐厨垃圾',
    method: '生物降解',
    company: '生态循环处理中心',
    operator: '李师傅',
    status: '已处理'
  },
  {
    id: 3,
    canteen: '第三食堂',
    date: '2024-12-04',
    weight: 142,
    type: '餐厨垃圾',
    method: '无害化处理',
    company: '城市垃圾处理厂',
    operator: '王师傅',
    status: '处理中'
  }
])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    '已处理': 'success',
    '处理中': 'warning',
    '待处理': 'info'
  }
  return map[status] || 'info'
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
  searchForm.company = ''
  searchForm.method = ''
}

const handleView = (row: any) => {
  ElMessage.info(`查看垃圾处理记录: ${row.canteen}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑垃圾处理记录: ${row.canteen}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除垃圾处理记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.waste-view {
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
