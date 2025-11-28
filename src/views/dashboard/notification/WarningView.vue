<template>
  <div class="warning-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>预警提醒</h2>
        <span class="subtitle">共 {{ pagination.total }} 条预警</span>
      </div>
      <el-space>
        <el-button type="danger" :icon="Bell" size="large">紧急预警</el-button>
        <el-button type="primary" :icon="Setting" size="large">预警设置</el-button>
      </el-space>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <div class="stat-content">
            <div class="stat-icon danger-icon">
              <el-icon :size="32"><WarningFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ urgentCount }}</div>
              <div class="stat-label">紧急预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <div class="stat-content">
            <div class="stat-icon warning-icon">
              <el-icon :size="32"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ importantCount }}</div>
              <div class="stat-label">重要预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card info">
          <div class="stat-content">
            <div class="stat-icon info-icon">
              <el-icon :size="32"><InfoFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ normalCount }}</div>
              <div class="stat-label">一般提醒</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <div class="stat-content">
            <div class="stat-icon success-icon">
              <el-icon :size="32"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ handledCount }}</div>
              <div class="stat-label">已处理</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预警内容">
              <el-input 
                v-model="searchForm.content" 
                placeholder="请输入预警内容" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预警级别">
              <el-select v-model="searchForm.level" placeholder="请选择级别" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="紧急" value="紧急" />
                <el-option label="重要" value="重要" />
                <el-option label="一般" value="一般" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预警类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="设备异常" value="设备异常" />
                <el-option label="库存预警" value="库存预警" />
                <el-option label="证照到期" value="证照到期" />
                <el-option label="安全隐患" value="安全隐患" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理状态">
              <el-select v-model="searchForm.handled" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待处理" :value="false" />
                <el-option label="已处理" :value="true" />
              </el-select>
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
          <el-button type="success" :icon="CircleCheck" :disabled="selectedIds.length === 0">
            批量处理
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
        :data="warnings" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="预警级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelColor(row.level)" effect="dark" size="large">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预警类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预警内容" prop="content" min-width="200" show-overflow-tooltip />
        <el-table-column label="详细描述" prop="description" min-width="250" show-overflow-tooltip />
        <el-table-column label="预警时间" prop="time" width="180" />
        <el-table-column label="处理人" prop="handler" width="100">
          <template #default="{ row }">
            <span>{{ row.handler || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.handled ? 'success' : 'danger'" effect="dark">
              {{ row.handled ? '已处理' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="success" size="small" :icon="CircleCheck" v-if="!row.handled">
              处理
            </el-button>
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
import { ref, reactive, computed } from 'vue'
import { Warning, Setting, WarningFilled, InfoFilled, Bell, Search, Refresh, Download, Delete, CircleCheck, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  content: '',
  level: '',
  type: '',
  handled: ''
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 18
})

// 预警数据
const warnings = ref([
  { 
    id: 1, 
    content: '冷藏设备温度异常', 
    description: '1号冷藏柜温度超过安全范围，当前温度12℃，标准温度应为0-4℃',
    level: '紧急', 
    type: '设备异常',
    time: '2025-11-28 09:15', 
    handler: null,
    handled: false 
  },
  { 
    id: 2, 
    content: '食材库存不足预警', 
    description: '新鲜鸡蛋库存仅剩50个，低于安全库存200个',
    level: '紧急', 
    type: '库存预警',
    time: '2025-11-28 08:45', 
    handler: null,
    handled: false 
  },
  { 
    id: 3, 
    content: '消防设备检查到期', 
    description: '消防灭火器已超过6个月未检查，需立即安排检查',
    level: '紧急', 
    type: '安全隐患',
    time: '2025-11-28 08:30', 
    handler: null,
    handled: false 
  },
  { 
    id: 4, 
    content: '员工健康证即将到期', 
    description: '员工张三的健康证将于7天后到期，请及时办理',
    level: '重要', 
    type: '证照到期',
    time: '2025-11-28 08:00', 
    handler: null,
    handled: false 
  },
  { 
    id: 5, 
    content: '食品安全许可证到期提醒', 
    description: '食品经营许可证将于30天后到期，请提前准备续期材料',
    level: '重要', 
    type: '证照到期',
    time: '2025-11-27 18:00', 
    handler: null,
    handled: false 
  },
  { 
    id: 6, 
    content: '油烟净化器需要清洗', 
    description: '油烟净化器已运行3个月，需要进行清洗维护',
    level: '重要', 
    type: '设备异常',
    time: '2025-11-27 16:30', 
    handler: null,
    handled: false 
  },
  { 
    id: 7, 
    content: '食材采购计划提醒', 
    description: '本周食材采购计划尚未制定，请及时安排',
    level: '重要', 
    type: '库存预警',
    time: '2025-11-27 15:00', 
    handler: null,
    handled: false 
  },
  { 
    id: 8, 
    content: '员工培训证书到期', 
    description: '员工李四的食品安全培训证书将于15天后到期',
    level: '一般', 
    type: '证照到期',
    time: '2025-11-27 14:00', 
    handler: null,
    handled: false 
  },
  { 
    id: 9, 
    content: '设备保养提醒', 
    description: '烤箱设备需要进行季度保养，请联系维修人员',
    level: '一般', 
    type: '设备异常',
    time: '2025-11-27 11:00', 
    handler: null,
    handled: false 
  },
  { 
    id: 10, 
    content: '库存盘点提醒', 
    description: '本月库存盘点工作尚未完成，请尽快安排',
    level: '一般', 
    type: '库存预警',
    time: '2025-11-27 10:00', 
    handler: null,
    handled: false 
  },
  { 
    id: 11, 
    content: '消防设备需要检查', 
    description: '消防栓水压检查已完成，设备运行正常',
    level: '重要', 
    type: '安全隐患',
    time: '2025-11-26 16:00', 
    handler: '王五',
    handled: true 
  },
  { 
    id: 12, 
    content: '冷藏设备温度恢复正常', 
    description: '2号冷藏柜温度已调整至正常范围',
    level: '紧急', 
    type: '设备异常',
    time: '2025-11-26 14:30', 
    handler: '赵六',
    handled: true 
  }
])

// 统计数据
const urgentCount = computed(() => warnings.value.filter(w => w.level === '紧急' && !w.handled).length)
const importantCount = computed(() => warnings.value.filter(w => w.level === '重要' && !w.handled).length)
const normalCount = computed(() => warnings.value.filter(w => w.level === '一般' && !w.handled).length)
const handledCount = computed(() => warnings.value.filter(w => w.handled).length)

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
  searchForm.content = ''
  searchForm.level = ''
  searchForm.type = ''
  searchForm.handled = ''
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
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

// 获取级别颜色
const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '紧急': 'danger',
    '重要': 'warning',
    '一般': 'info'
  }
  return colors[level] || 'info'
}
</script>

<style scoped>
.warning-view {
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

/* 统计卡片 */
.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card.danger {
  border-left: 4px solid #F56C6C;
}

.stat-card.warning {
  border-left: 4px solid #E6A23C;
}

.stat-card.info {
  border-left: 4px solid #909399;
}

.stat-card.success {
  border-left: 4px solid #67C23A;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.danger-icon {
  background: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.warning-icon {
  background: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.info-icon {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.success-icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
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
