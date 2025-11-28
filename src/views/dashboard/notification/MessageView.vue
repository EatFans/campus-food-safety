<template>
  <div class="message-view">
    <div class="page-header">
      <div class="header-left">
        <h2>消息通知</h2>
        <span class="subtitle">共 {{ pagination.total }} 条消息</span>
      </div>
      <el-space>
        <el-button type="primary" :icon="Check" @click="markAllRead">全部已读</el-button>
        <el-button :icon="Delete" @click="deleteSelected" :disabled="selectedIds.length === 0">批量删除</el-button>
      </el-space>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card unread">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="32" color="#F56C6C"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ unreadCount }}</div>
              <div class="stat-label">未读消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card today">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="32" color="#409EFF"><Message /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayCount }}</div>
              <div class="stat-label">今日消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card system">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="32" color="#67C23A"><Setting /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ systemCount }}</div>
              <div class="stat-label">系统通知</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card order">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="32" color="#E6A23C"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ orderCount }}</div>
              <div class="stat-label">订单消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 消息列表 -->
    <el-card shadow="never" class="message-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane name="all">
          <template #label>
            <span class="tab-label">
              全部消息
              <el-badge :value="messages.length" :max="99" class="tab-badge" />
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="unread">
          <template #label>
            <span class="tab-label">
              未读消息
              <el-badge :value="unreadCount" :max="99" class="tab-badge" type="danger" />
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="system">
          <template #label>
            <span class="tab-label">系统消息</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="order">
          <template #label>
            <span class="tab-label">订单消息</span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 消息列表 -->
      <div class="message-list">
        <div 
          v-for="msg in displayMessages" 
          :key="msg.id" 
          class="message-item"
          :class="{ 'unread': !msg.read }"
          @click="handleMessageClick(msg)"
        >
          <el-checkbox 
            v-model="msg.selected" 
            @click.stop
            @change="handleSelectionChange"
          />
          <div class="message-icon">
            <el-icon :size="24" :color="getTypeIconColor(msg.type)">
              <component :is="getTypeIcon(msg.type)" />
            </el-icon>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-title">{{ msg.title }}</span>
              <el-tag :type="getTypeColor(msg.type)" size="small" effect="plain">
                {{ msg.type }}
              </el-tag>
            </div>
            <div class="message-desc">{{ msg.content }}</div>
            <div class="message-footer">
              <span class="message-time">
                <el-icon><Clock /></el-icon>
                {{ msg.time }}
              </span>
              <span class="message-from" v-if="msg.from">
                <el-icon><User /></el-icon>
                {{ msg.from }}
              </span>
            </div>
          </div>
          <div class="message-actions">
            <el-badge :is-dot="!msg.read" type="danger">
              <el-button link type="primary" size="small" @click.stop="markAsRead(msg)">
                {{ msg.read ? '已读' : '标记已读' }}
              </el-button>
            </el-badge>
            <el-button link type="danger" size="small" @click.stop="deleteMessage(msg)">
              删除
            </el-button>
          </div>
        </div>

        <el-empty v-if="displayMessages.length === 0" description="暂无消息" />
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="displayMessages.length > 0">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
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
import { ref, computed, reactive } from 'vue'
import { Check, Delete, Bell, Message, Setting, ShoppingCart, Clock, User, Warning, InfoFilled, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('all')
const selectedIds = ref<number[]>([])

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 消息数据
const messages = ref([
  { 
    id: 1, 
    title: '您有新的订单待处理', 
    content: '订单号 ORD202511280015，用户张三下单，金额¥128.50，请及时处理。', 
    type: '订单', 
    time: '2025-11-28 09:15', 
    from: '订单系统',
    read: false,
    selected: false
  },
  { 
    id: 2, 
    title: '食品安全检查提醒', 
    content: '今日需要进行食品安全检查，请准备相关材料和记录表。', 
    type: '安全', 
    time: '2025-11-28 08:30', 
    from: '安全管理系统',
    read: false,
    selected: false
  },
  { 
    id: 3, 
    title: '系统维护通知', 
    content: '系统将于今晚22:00-23:00进行维护升级，期间部分功能可能无法使用。', 
    type: '系统', 
    time: '2025-11-28 08:00', 
    from: '系统管理员',
    read: false,
    selected: false
  },
  { 
    id: 4, 
    title: '员工考勤异常提醒', 
    content: '员工李四今日未打卡，请及时联系确认情况。', 
    type: '考勤', 
    time: '2025-11-27 18:00', 
    from: '考勤系统',
    read: true,
    selected: false
  },
  { 
    id: 5, 
    title: '库存预警通知', 
    content: '食材"新鲜鸡蛋"库存不足，当前库存仅剩50个，请及时补货。', 
    type: '库存', 
    time: '2025-11-27 16:30', 
    from: '库存管理系统',
    read: true,
    selected: false
  },
  { 
    id: 6, 
    title: '新订单通知', 
    content: '订单号 ORD202511270089，用户王五下单，金额¥256.00。', 
    type: '订单', 
    time: '2025-11-27 15:20', 
    from: '订单系统',
    read: true,
    selected: false
  },
  { 
    id: 7, 
    title: '设备维护提醒', 
    content: '冷藏设备A1需要进行定期维护，请安排维护人员。', 
    type: '设备', 
    time: '2025-11-27 14:00', 
    from: '设备管理系统',
    read: true,
    selected: false
  },
  { 
    id: 8, 
    title: '审批通知', 
    content: '您有一条采购申请待审批，申请人：张三，金额：¥5,000。', 
    type: '审批', 
    time: '2025-11-27 11:30', 
    from: '审批系统',
    read: true,
    selected: false
  },
  { 
    id: 9, 
    title: '营销活动开始', 
    content: '双十一促销活动已开始，活动期间订单量预计增加，请做好准备。', 
    type: '营销', 
    time: '2025-11-27 10:00', 
    from: '营销中心',
    read: true,
    selected: false
  },
  { 
    id: 10, 
    title: '健康证到期提醒', 
    content: '员工赵六的健康证将于7天后到期，请提醒其及时更新。', 
    type: '健康', 
    time: '2025-11-27 09:00', 
    from: '健康管理系统',
    read: true,
    selected: false
  }
])

// 统计数据
const unreadCount = computed(() => messages.value.filter(m => !m.read).length)
const todayCount = computed(() => messages.value.filter(m => m.time.startsWith('2025-11-28')).length)
const systemCount = computed(() => messages.value.filter(m => m.type === '系统').length)
const orderCount = computed(() => messages.value.filter(m => m.type === '订单').length)

// 显示的消息列表
const displayMessages = computed(() => {
  let filtered = messages.value
  
  if (activeTab.value === 'unread') {
    filtered = filtered.filter(m => !m.read)
  } else if (activeTab.value === 'system') {
    filtered = filtered.filter(m => m.type === '系统')
  } else if (activeTab.value === 'order') {
    filtered = filtered.filter(m => m.type === '订单')
  }
  
  pagination.total = filtered.length
  return filtered
})

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '订单': '',
    '安全': 'danger',
    '系统': 'info',
    '考勤': 'warning',
    '库存': 'warning',
    '设备': 'info',
    '审批': 'primary',
    '营销': 'success',
    '健康': 'warning'
  }
  return colors[type] || 'info'
}

// 获取类型图标
const getTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    '订单': ShoppingCart,
    '安全': Warning,
    '系统': Setting,
    '考勤': Clock,
    '库存': InfoFilled,
    '设备': Setting,
    '审批': CircleCheck,
    '营销': Bell,
    '健康': User
  }
  return icons[type] || Bell
}

// 获取类型图标颜色
const getTypeIconColor = (type: string) => {
  const colors: Record<string, string> = {
    '订单': '#409EFF',
    '安全': '#F56C6C',
    '系统': '#909399',
    '考勤': '#E6A23C',
    '库存': '#E6A23C',
    '设备': '#67C23A',
    '审批': '#409EFF',
    '营销': '#67C23A',
    '健康': '#E6A23C'
  }
  return colors[type] || '#909399'
}

// 全部已读
const markAllRead = () => {
  ElMessageBox.confirm('确认将所有消息标记为已读?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    messages.value.forEach(m => m.read = true)
    ElMessage.success('已全部标记为已读')
  }).catch(() => {})
}

// 标记为已读
const markAsRead = (msg: any) => {
  msg.read = true
  ElMessage.success('已标记为已读')
}

// 删除消息
const deleteMessage = (msg: any) => {
  ElMessageBox.confirm('确认删除这条消息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = messages.value.findIndex(m => m.id === msg.id)
    if (index > -1) {
      messages.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 批量删除
const deleteSelected = () => {
  const selected = messages.value.filter(m => m.selected)
  if (selected.length === 0) {
    ElMessage.warning('请先选择要删除的消息')
    return
  }
  
  ElMessageBox.confirm(`确认删除选中的 ${selected.length} 条消息?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    messages.value = messages.value.filter(m => !m.selected)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 选择变化
const handleSelectionChange = () => {
  selectedIds.value = messages.value.filter(m => m.selected).map(m => m.id)
}

// 点击消息
const handleMessageClick = (msg: any) => {
  if (!msg.read) {
    msg.read = true
  }
  ElMessage.info('查看消息详情')
}

// 切换标签
const handleTabChange = () => {
  pagination.currentPage = 1
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}
</script>

<style scoped>
.message-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.stat-card.unread {
  border-left: 4px solid #F56C6C;
}

.stat-card.today {
  border-left: 4px solid #409EFF;
}

.stat-card.system {
  border-left: 4px solid #67C23A;
}

.stat-card.order {
  border-left: 4px solid #E6A23C;
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
  background: rgba(64, 158, 255, 0.1);
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

/* 消息卡片 */
.message-card {
  border-radius: 8px;
}

.message-card :deep(.el-card__body) {
  padding: 0;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-badge {
  margin-left: 4px;
}

/* 消息列表 */
.message-list {
  padding: 20px;
  min-height: 400px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
  cursor: pointer;
}

.message-item:hover {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  transform: translateX(4px);
}

.message-item.unread {
  background: #f0f9ff;
  border-left: 3px solid #409EFF;
}

.message-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.1);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.message-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #909399;
}

.message-time,
.message-from {
  display: flex;
  align-items: center;
  gap: 4px;
}

.message-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-tabs__header) {
  padding: 0 20px;
  margin: 0;
  background: #fafafa;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-checkbox) {
  margin-top: 4px;
}
</style>
