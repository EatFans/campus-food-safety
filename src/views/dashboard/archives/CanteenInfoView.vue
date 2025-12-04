<template>
  <div class="canteen-info-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><Shop /></el-icon>
        </div>
        <div class="header-content">
          <h2>食堂基本信息管理</h2>
          <p class="header-desc">管理食堂名称、位置、面积、资质证书等基本信息</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd" size="default">
          新增食堂
        </el-button>
        <el-button :icon="Download" size="default">导出数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <el-icon :size="32"><Shop /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.total }}</div>
            <div class="stat-label">食堂总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.operating }}</div>
            <div class="stat-label">营业中</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.certified }}%</div>
            <div class="stat-label">资质合格率</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-cyan">
          <div class="stat-icon">
            <el-icon :size="32"><Grid /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.totalArea }}</div>
            <div class="stat-label">总面积(㎡)</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="食堂名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入食堂名称" 
            clearable 
            :prefix-icon="Search"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="所属学校">
          <el-select v-model="searchForm.schoolId" placeholder="请选择学校" clearable style="width: 180px">
            <el-option label="阳光小学" value="1" />
            <el-option label="实验中学" value="2" />
            <el-option label="第一高级中学" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="营业状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="营业中" value="operating" />
            <el-option label="装修中" value="renovating" />
            <el-option label="暂停营业" value="closed" />
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
        <el-table-column prop="name" label="食堂名称" min-width="120" />
        <el-table-column prop="schoolName" label="所属学校" min-width="120" />
        <el-table-column prop="location" label="位置" min-width="150" />
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="license" label="资质证书" width="120">
          <template #default="{ row }">
            <el-tag :type="row.license ? 'success' : 'danger'">
              {{ row.license ? '已上传' : '未上传' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '营业中' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
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
import { Plus, Download, Search, Refresh, View, Edit, Delete, Shop, CircleCheck, Document, Grid } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  total: 12,
  operating: 11,
  certified: 100,
  totalArea: 4200
})

const searchForm = reactive({
  name: '',
  schoolId: '',
  status: ''
})

const tableData = ref([
  {
    id: 1,
    name: '第一食堂',
    schoolName: '阳光小学',
    location: '教学楼东侧',
    area: '500',
    license: true,
    status: '营业中'
  },
  {
    id: 2,
    name: '第二食堂',
    schoolName: '阳光小学',
    location: '宿舍楼一层',
    area: '400',
    license: true,
    status: '营业中'
  },
  {
    id: 3,
    name: '教工食堂',
    schoolName: '实验中学',
    location: '行政楼二层',
    area: '300',
    license: false,
    status: '装修中'
  }
])

const loading = ref(false)

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.schoolId = ''
}

const handleAdd = () => {
  ElMessage.info('打开新增对话框')
}

const handleView = (row: any) => {
  ElMessage.info(`查看食堂: ${row.name}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑食堂: ${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除食堂"${row.name}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.canteen-info-view {
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
