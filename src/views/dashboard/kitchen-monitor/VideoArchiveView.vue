<template>
  <div class="video-archive-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><VideoCamera /></el-icon>
        </div>
        <div class="header-content">
          <h2>影像留痕管理</h2>
          <p class="header-desc">实时监控和回放食堂操作间、加工区域的视频影像</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="VideoCamera">实时监控</el-button>
        <el-button :icon="Download">导出视频</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <el-icon :size="32"><VideoCamera /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.totalCameras }}</div>
            <div class="stat-label">摄像头总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.onlineCameras }}</div>
            <div class="stat-label">在线设备</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><FolderOpened /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.videoCount }}</div>
            <div class="stat-label">视频存档(条)</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-cyan">
          <div class="stat-icon">
            <el-icon :size="32"><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.storageTime }}</div>
            <div class="stat-label">存储时长(天)</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 视频监控区域 -->
    <el-row :gutter="16" class="video-section">
      <el-col :span="16">
        <el-card shadow="never" class="video-grid-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">实时监控画面</span>
              <div class="header-actions">
                <el-radio-group v-model="viewMode" size="small">
                  <el-radio-button :label="4">四宫格</el-radio-button>
                  <el-radio-button :label="9">九宫格</el-radio-button>
                  <el-radio-button :label="16">十六宫格</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          
          <div class="video-grid" :class="`grid-${viewMode}`">
            <div 
              v-for="(camera, index) in displayCameras" 
              :key="camera.id"
              class="video-item"
              :class="{ active: selectedCamera?.id === camera.id }"
              @click="selectCamera(camera)"
            >
              <div class="video-placeholder">
                <el-icon :size="48" class="video-icon"><VideoCamera /></el-icon>
                <div class="camera-info">
                  <div class="camera-name">{{ camera.name }}</div>
                  <el-tag :type="camera.status === 'online' ? 'success' : 'danger'" size="small">
                    {{ camera.status === 'online' ? '在线' : '离线' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" class="camera-list-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">摄像头列表</span>
            </div>
          </template>
          
          <el-input
            v-model="searchKeyword"
            placeholder="搜索摄像头"
            :prefix-icon="Search"
            clearable
            class="search-input"
          />

          <div class="camera-list">
            <div 
              v-for="camera in filteredCameras" 
              :key="camera.id"
              class="camera-item"
              :class="{ active: selectedCamera?.id === camera.id }"
              @click="selectCamera(camera)"
            >
              <div class="camera-item-icon">
                <el-icon :size="20"><VideoCamera /></el-icon>
              </div>
              <div class="camera-item-info">
                <div class="camera-item-name">{{ camera.name }}</div>
                <div class="camera-item-location">{{ camera.location }}</div>
              </div>
              <el-tag :type="camera.status === 'online' ? 'success' : 'danger'" size="small">
                {{ camera.status === 'online' ? '在线' : '离线' }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 视频回放记录 -->
    <el-card shadow="never" class="playback-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">视频回放记录</span>
          <el-button type="primary" size="small" :icon="Search">查询回放</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="playbackForm" class="playback-form">
        <el-form-item label="摄像头">
          <el-select v-model="playbackForm.cameraId" placeholder="请选择" clearable style="width: 180px">
            <el-option 
              v-for="camera in cameras" 
              :key="camera.id"
              :label="camera.name" 
              :value="camera.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="playbackForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handlePlaybackSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handlePlaybackReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="playbackData" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="cameraName" label="摄像头名称" min-width="150" />
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="fileSize" label="文件大小" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="VideoPlay" @click="handlePlay(row)">播放</el-button>
            <el-button type="success" link :icon="Download" @click="handleDownload(row)">下载</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  VideoCamera, Download, Search, Refresh, Delete, CircleCheck, 
  FolderOpened, Clock, VideoPlay 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  totalCameras: 24,
  onlineCameras: 23,
  videoCount: 15680,
  storageTime: 30
})

// 视图模式
const viewMode = ref(4)

// 摄像头数据
const cameras = ref([
  { id: 1, name: '第一食堂-操作间1', location: '第一食堂', status: 'online' },
  { id: 2, name: '第一食堂-操作间2', location: '第一食堂', status: 'online' },
  { id: 3, name: '第一食堂-洗消间', location: '第一食堂', status: 'online' },
  { id: 4, name: '第一食堂-仓库', location: '第一食堂', status: 'online' },
  { id: 5, name: '第二食堂-操作间1', location: '第二食堂', status: 'online' },
  { id: 6, name: '第二食堂-操作间2', location: '第二食堂', status: 'online' },
  { id: 7, name: '第二食堂-洗消间', location: '第二食堂', status: 'offline' },
  { id: 8, name: '第二食堂-仓库', location: '第二食堂', status: 'online' },
  { id: 9, name: '第三食堂-操作间', location: '第三食堂', status: 'online' }
])

const selectedCamera = ref(cameras.value[0])
const searchKeyword = ref('')

// 显示的摄像头(根据视图模式)
const displayCameras = computed(() => {
  return cameras.value.slice(0, viewMode.value)
})

// 过滤的摄像头列表
const filteredCameras = computed(() => {
  if (!searchKeyword.value) return cameras.value
  return cameras.value.filter(camera => 
    camera.name.includes(searchKeyword.value) || 
    camera.location.includes(searchKeyword.value)
  )
})

// 选择摄像头
const selectCamera = (camera: any) => {
  selectedCamera.value = camera
  ElMessage.success(`已选择: ${camera.name}`)
}

// 回放表单
const playbackForm = reactive({
  cameraId: '',
  timeRange: ''
})

const loading = ref(false)

const playbackData = ref([
  {
    id: 1,
    cameraName: '第一食堂-操作间1',
    location: '第一食堂',
    startTime: '2024-12-04 08:00:00',
    endTime: '2024-12-04 12:00:00',
    duration: '4小时',
    fileSize: '2.5GB'
  },
  {
    id: 2,
    cameraName: '第一食堂-操作间2',
    location: '第一食堂',
    startTime: '2024-12-04 08:00:00',
    endTime: '2024-12-04 12:00:00',
    duration: '4小时',
    fileSize: '2.3GB'
  },
  {
    id: 3,
    cameraName: '第二食堂-操作间1',
    location: '第二食堂',
    startTime: '2024-12-04 08:00:00',
    endTime: '2024-12-04 12:00:00',
    duration: '4小时',
    fileSize: '2.6GB'
  }
])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const handlePlaybackSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handlePlaybackReset = () => {
  playbackForm.cameraId = ''
  playbackForm.timeRange = ''
}

const handlePlay = (row: any) => {
  ElMessage.info(`播放视频: ${row.cameraName}`)
}

const handleDownload = (row: any) => {
  ElMessage.success(`开始下载: ${row.cameraName}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除视频记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.video-archive-view {
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

/* 视频监控区域 */
.video-section {
  margin-bottom: 24px;
}

.video-grid-card,
.camera-list-card,
.playback-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
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

.video-grid {
  display: grid;
  gap: 12px;
  min-height: 500px;
}

.grid-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-9 {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.grid-16 {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.video-item {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.video-item:hover {
  border-color: #409EFF;
  transform: scale(1.02);
}

.video-item.active {
  border-color: #67C23A;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  min-height: 200px;
}

.video-icon {
  margin-bottom: 12px;
}

.camera-info {
  text-align: center;
}

.camera-name {
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
}

/* 摄像头列表 */
.search-input {
  margin-bottom: 16px;
}

.camera-list {
  max-height: 500px;
  overflow-y: auto;
}

.camera-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.camera-item:hover {
  background: #f5f7fa;
}

.camera-item.active {
  background: #e8f4ff;
  border-left: 3px solid #409EFF;
}

.camera-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  color: #409EFF;
}

.camera-item-info {
  flex: 1;
}

.camera-item-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.camera-item-location {
  font-size: 12px;
  color: #6b7280;
}

/* 回放表单 */
.playback-form {
  margin-bottom: 16px;
}

.playback-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.playback-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

/* 表格 */
.playback-card :deep(.el-table) {
  font-size: 14px;
}

.playback-card :deep(.el-table th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
}

.playback-card :deep(.el-table td),
.playback-card :deep(.el-table th) {
  padding: 14px 0;
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
