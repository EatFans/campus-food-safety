<template>
  <div class="video-patrol-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><Monitor /></el-icon>
        </div>
        <div class="header-content">
          <h2>视频巡检管理</h2>
          <p class="header-desc">定时巡检食堂操作规范,记录违规行为和异常情况</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAddTask">新建巡检任务</el-button>
        <el-button :icon="Download">导出报告</el-button>
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
            <div class="stat-value">{{ statistics.totalTasks }}</div>
            <div class="stat-label">巡检任务总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.completedTasks }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.violations }}</div>
            <div class="stat-label">发现违规</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-cyan">
          <div class="stat-icon">
            <el-icon :size="32"><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.todayTasks }}</div>
            <div class="stat-label">今日巡检</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 巡检任务和结果 -->
    <el-row :gutter="16">
      <el-col :span="24">
        <el-card shadow="never" class="patrol-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">巡检任务列表</span>
              <el-radio-group v-model="taskStatus" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="pending">待执行</el-radio-button>
                <el-radio-button label="running">执行中</el-radio-button>
                <el-radio-button label="completed">已完成</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <!-- 搜索表单 -->
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="任务名称">
              <el-input 
                v-model="searchForm.taskName" 
                placeholder="请输入任务名称" 
                clearable 
                :prefix-icon="Search"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="巡检区域">
              <el-select v-model="searchForm.area" placeholder="请选择" clearable style="width: 150px">
                <el-option label="第一食堂" value="1" />
                <el-option label="第二食堂" value="2" />
                <el-option label="第三食堂" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="巡检类型">
              <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 150px">
                <el-option label="定时巡检" value="scheduled" />
                <el-option label="随机巡检" value="random" />
                <el-option label="专项巡检" value="special" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 任务列表 -->
          <el-table :data="filteredTasks" stripe style="width: 100%" v-loading="loading">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="taskName" label="任务名称" min-width="150" />
            <el-table-column prop="area" label="巡检区域" width="100" />
            <el-table-column prop="type" label="巡检类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="checkPoints" label="检查点" width="80" />
            <el-table-column prop="startTime" label="开始时间" width="150" />
            <el-table-column prop="endTime" label="结束时间" width="150" />
            <el-table-column prop="inspector" label="巡检人员" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="violations" label="违规数" width="80">
              <template #default="{ row }">
                <span :class="{ 'text-danger': row.violations > 0 }">{{ row.violations }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240" fixed="right">
              <template #default="{ row }">
                <el-button 
                  v-if="row.status === 'pending'" 
                  type="success" 
                  link 
                  @click="handleStart(row)"
                >
                  开始
                </el-button>
                <el-button type="primary" link :icon="View" @click="handleViewDetail(row)">详情</el-button>
                <el-button type="warning" link @click="handleViewReport(row)">报告</el-button>
                <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

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
      </el-col>
    </el-row>

    <!-- 违规记录 -->
    <el-card shadow="never" class="violation-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">违规记录</span>
          <el-tag type="danger">{{ violationData.length }} 条</el-tag>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="item in violationData"
          :key="item.id"
          :timestamp="item.time"
          placement="top"
          :type="item.level === 'high' ? 'danger' : 'warning'"
        >
          <el-card>
            <div class="violation-item">
              <div class="violation-header">
                <span class="violation-title">{{ item.title }}</span>
                <el-tag :type="item.level === 'high' ? 'danger' : 'warning'" size="small">
                  {{ item.level === 'high' ? '严重' : '一般' }}
                </el-tag>
              </div>
              <div class="violation-content">
                <p><strong>位置:</strong> {{ item.location }}</p>
                <p><strong>描述:</strong> {{ item.description }}</p>
                <p><strong>处理状态:</strong> 
                  <el-tag :type="item.handled ? 'success' : 'warning'" size="small">
                    {{ item.handled ? '已处理' : '待处理' }}
                  </el-tag>
                </p>
              </div>
              <div class="violation-actions">
                <el-button size="small" type="primary" @click="handleViolation(item)">
                  处理
                </el-button>
                <el-button size="small" @click="handleViewSnapshot(item)">
                  查看截图
                </el-button>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  Plus, Download, Search, Refresh, View, Delete, Monitor, 
  Document, CircleCheck, Warning, Calendar 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  totalTasks: 156,
  completedTasks: 142,
  violations: 23,
  todayTasks: 8
})

// 任务状态筛选
const taskStatus = ref('all')

// 搜索表单
const searchForm = reactive({
  taskName: '',
  area: '',
  type: ''
})

const loading = ref(false)

// 任务数据
const tasksData = ref([
  {
    id: 1,
    taskName: '早餐时段巡检',
    area: '第一食堂',
    type: '定时巡检',
    checkPoints: 8,
    startTime: '2024-12-04 07:00',
    endTime: '2024-12-04 09:00',
    inspector: '李巡检员',
    status: 'completed',
    statusText: '已完成',
    violations: 2
  },
  {
    id: 2,
    taskName: '午餐时段巡检',
    area: '第一食堂',
    type: '定时巡检',
    checkPoints: 10,
    startTime: '2024-12-04 11:00',
    endTime: '2024-12-04 13:00',
    inspector: '王巡检员',
    status: 'running',
    statusText: '执行中',
    violations: 0
  },
  {
    id: 3,
    taskName: '卫生专项检查',
    area: '第二食堂',
    type: '专项巡检',
    checkPoints: 15,
    startTime: '2024-12-04 14:00',
    endTime: '2024-12-04 16:00',
    inspector: '张巡检员',
    status: 'pending',
    statusText: '待执行',
    violations: 0
  }
])

// 过滤任务
const filteredTasks = computed(() => {
  let tasks = tasksData.value
  if (taskStatus.value !== 'all') {
    tasks = tasks.filter(task => task.status === taskStatus.value)
  }
  return tasks
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 违规记录
const violationData = ref([
  {
    id: 1,
    time: '2024-12-04 08:15',
    title: '未佩戴口罩',
    location: '第一食堂-操作间1',
    description: '发现1名工作人员在操作区域未按规定佩戴口罩',
    level: 'high',
    handled: false
  },
  {
    id: 2,
    time: '2024-12-04 08:30',
    title: '操作台未及时清理',
    location: '第一食堂-操作间2',
    description: '操作台有食材残留,未及时清理',
    level: 'normal',
    handled: true
  },
  {
    id: 3,
    time: '2024-12-04 09:00',
    title: '食材存放不规范',
    location: '第二食堂-仓库',
    description: '生熟食材未分开存放',
    level: 'high',
    handled: false
  }
])

const getTypeColor = (type: string) => {
  const map: Record<string, any> = {
    '定时巡检': '',
    '随机巡检': 'warning',
    '专项巡检': 'danger'
  }
  return map[type] || ''
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    'pending': 'info',
    'running': 'warning',
    'completed': 'success'
  }
  return map[status] || 'info'
}

const handleAddTask = () => {
  ElMessage.info('打开新建任务对话框')
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.taskName = ''
  searchForm.area = ''
  searchForm.type = ''
}

const handleStart = (row: any) => {
  ElMessage.success(`开始执行任务: ${row.taskName}`)
}

const handleViewDetail = (row: any) => {
  ElMessage.info(`查看任务详情: ${row.taskName}`)
}

const handleViewReport = (row: any) => {
  ElMessage.info(`查看巡检报告: ${row.taskName}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除任务"${row.taskName}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleViolation = (item: any) => {
  ElMessage.success(`处理违规记录: ${item.title}`)
}

const handleViewSnapshot = (item: any) => {
  ElMessage.info(`查看违规截图: ${item.title}`)
}
</script>

<style scoped>
.video-patrol-view {
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

/* 卡片 */
.patrol-card,
.violation-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

/* 搜索表单 */
.search-form {
  margin-bottom: 16px;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

/* 表格 */
.patrol-card :deep(.el-table) {
  font-size: 14px;
}

.patrol-card :deep(.el-table th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
}

.patrol-card :deep(.el-table td),
.patrol-card :deep(.el-table th) {
  padding: 14px 0;
}

.text-danger {
  color: #f56c6c;
  font-weight: 600;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 违规记录 */
.violation-item {
  padding: 8px 0;
}

.violation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.violation-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

.violation-content {
  margin-bottom: 12px;
  color: #6b7280;
  line-height: 1.8;
}

.violation-content p {
  margin: 4px 0;
}

.violation-actions {
  display: flex;
  gap: 8px;
}

:deep(.el-button.is-link) {
  padding: 4px 8px;
  font-size: 13px;
}
</style>
