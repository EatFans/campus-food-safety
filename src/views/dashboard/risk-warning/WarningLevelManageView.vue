<template>
  <div class="warning-level-manage-view">
    <div class="page-header">
      <h2>预警级别管理</h2>
      <el-space>
        <el-button type="primary" :icon="Plus" @click="showAddDialog = true">新增级别</el-button>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
        <el-button :icon="Download" @click="exportConfig">导出配置</el-button>
      </el-space>
    </div>

    <!-- 预警级别概览 -->
    <el-row :gutter="16" class="level-overview">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="overview-card critical">
          <div class="card-header">
            <el-icon class="header-icon" color="#F56C6C"><CircleCloseFilled /></el-icon>
            <span class="header-title">严重级别</span>
          </div>
          <div class="card-content">
            <div class="level-count">{{ criticalLevels.length }}</div>
            <div class="level-desc">需要立即处理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="overview-card warning">
          <div class="card-header">
            <el-icon class="header-icon" color="#E6A23C"><WarningFilled /></el-icon>
            <span class="header-title">警告级别</span>
          </div>
          <div class="card-content">
            <div class="level-count">{{ warningLevels.length }}</div>
            <div class="level-desc">需要关注处理</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="overview-card info">
          <div class="card-header">
            <el-icon class="header-icon" color="#409EFF"><InfoFilled /></el-icon>
            <span class="header-title">提醒级别</span>
          </div>
          <div class="card-content">
            <div class="level-count">{{ infoLevels.length }}</div>
            <div class="level-desc">需要了解关注</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警级别配置列表 -->
    <el-card shadow="hover" class="config-card">
      <template #header>
        <div class="card-header-content">
          <span>预警级别配置</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索级别名称或描述"
            :prefix-icon="Search"
            style="width: 250px;"
            @input="handleSearch"
          />
        </div>
      </template>

      <el-table :data="filteredLevelList" v-loading="loading" style="width: 100%">
        <el-table-column label="级别名称" prop="name" width="150">
          <template #default="{ row }">
            <div class="level-name">
              <el-icon :color="row.color" :style="{ marginRight: '8px' }">
                <CircleCheckFilled />
              </el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="级别代码" prop="code" width="120" />
        <el-table-column label="级别类型" prop="type" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)" size="small">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优先级" prop="priority" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityTagType(row.priority)" size="small">
              {{ row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="触发条件" prop="conditions" width="200">
          <template #default="{ row }">
            <div class="conditions-list">
              <el-tag 
                v-for="condition in row.conditions" 
                :key="condition"
                size="small"
                style="margin: 2px;"
              >
                {{ condition }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="通知方式" prop="notificationMethods" width="180">
          <template #default="{ row }">
            <div class="notification-methods">
              <el-icon v-if="row.notificationMethods.includes('system')" color="#409EFF" style="margin-right: 4px;">
                <Monitor />
              </el-icon>
              <el-icon v-if="row.notificationMethods.includes('email')" color="#67C23A" style="margin-right: 4px;">
                <Message />
              </el-icon>
              <el-icon v-if="row.notificationMethods.includes('sms')" color="#E6A23C" style="margin-right: 4px;">
                <Cellphone />
              </el-icon>
              <el-icon v-if="row.notificationMethods.includes('wechat')" color="#07C160" style="margin-right: 4px;">
                <ChatDotRound />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="处理时限" prop="deadline" width="120">
          <template #default="{ row }">
            {{ row.deadline }}小时
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-text="启用"
              inactive-text="禁用"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewLevel(row)">查看</el-button>
            <el-button link type="warning" size="small" @click="editLevel(row)">编辑</el-button>
            <el-button link type="info" size="small" @click="copyLevel(row)">复制</el-button>
            <el-button link type="danger" size="small" @click="deleteLevel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑预警级别对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑预警级别' : '新增预警级别'" 
      width="800px"
      @close="resetForm"
    >
      <el-form :model="levelForm" :rules="formRules" ref="formRef" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="级别名称" prop="name">
              <el-input v-model="levelForm.name" placeholder="请输入级别名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别代码" prop="code">
              <el-input v-model="levelForm.code" placeholder="请输入级别代码" :disabled="isEditing" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="级别类型" prop="type">
              <el-select v-model="levelForm.type" placeholder="选择级别类型" style="width: 100%">
                <el-option label="严重" value="critical" />
                <el-option label="警告" value="warning" />
                <el-option label="提醒" value="info" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-input-number v-model="levelForm.priority" :min="1" :max="10" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="显示颜色" prop="color">
              <el-color-picker v-model="levelForm.color" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时限" prop="deadline">
              <el-input-number v-model="levelForm.deadline" :min="1" :max="168" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">小时</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="触发条件" prop="conditions">
          <el-select v-model="levelForm.conditions" multiple placeholder="选择触发条件" style="width: 100%">
            <el-option label="温度异常" value="temperature_abnormal" />
            <el-option label="湿度异常" value="humidity_abnormal" />
            <el-option label="设备故障" value="equipment_failure" />
            <el-option label="快检不合格" value="test_fail" />
            <el-option label="食材过期" value="food_expired" />
            <el-option label="库存不足" value="stock_shortage" />
            <el-option label="卫生问题" value="hygiene_issue" />
            <el-option label="操作违规" value="operation_violation" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知方式" prop="notificationMethods">
          <el-checkbox-group v-model="levelForm.notificationMethods">
            <el-checkbox label="system">系统通知</el-checkbox>
            <el-checkbox label="email">邮件通知</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
            <el-checkbox label="wechat">微信通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知人员" prop="notificationUsers">
          <el-select v-model="levelForm.notificationUsers" multiple placeholder="选择通知人员" style="width: 100%">
            <el-option label="食品安全主管" value="safety_manager" />
            <el-option label="仓库管理员" value="warehouse_manager" />
            <el-option label="厨房主管" value="kitchen_manager" />
            <el-option label="采购经理" value="purchase_manager" />
            <el-option label="设备维护员" value="maintenance_staff" />
            <el-option label="质量检验员" value="quality_inspector" />
          </el-select>
        </el-form-item>
        <el-form-item label="升级规则" prop="escalationRules">
          <el-input v-model="levelForm.escalationRules" type="textarea" :rows="3" placeholder="请输入升级规则说明" />
        </el-form-item>
        <el-form-item label="级别描述" prop="description">
          <el-input v-model="levelForm.description" type="textarea" :rows="3" placeholder="请输入级别描述" />
        </el-form-item>
        <el-form-item label="处理建议" prop="suggestions">
          <el-input v-model="levelForm.suggestions" type="textarea" :rows="3" placeholder="请输入处理建议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveLevel">保存</el-button>
      </template>
    </el-dialog>

    <!-- 查看级别详情对话框 -->
    <el-dialog v-model="showViewDialog" title="预警级别详情" width="700px">
      <el-descriptions :column="2" border v-if="currentLevel">
        <el-descriptions-item label="级别名称">{{ currentLevel.name }}</el-descriptions-item>
        <el-descriptions-item label="级别代码">{{ currentLevel.code }}</el-descriptions-item>
        <el-descriptions-item label="级别类型">
          <el-tag :type="getTypeTagType(currentLevel.type)" size="small">
            {{ getTypeText(currentLevel.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityTagType(currentLevel.priority)" size="small">
            {{ currentLevel.priority }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="显示颜色">
          <el-color-picker v-model="currentLevel.color" disabled />
        </el-descriptions-item>
        <el-descriptions-item label="处理时限">{{ currentLevel.deadline }}小时</el-descriptions-item>
        <el-descriptions-item label="触发条件" :span="2">
          <div class="conditions-list">
            <el-tag v-for="condition in currentLevel.conditions" :key="condition" size="small" style="margin: 2px;">
              {{ getConditionText(condition) }}
            </el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="通知方式" :span="2">
          <div class="notification-methods">
            <el-tag v-for="method in currentLevel.notificationMethods" :key="method" size="small" style="margin: 2px;">
              {{ getNotificationMethodText(method) }}
            </el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="通知人员" :span="2">
          <div class="notification-users">
            <el-tag v-for="user in currentLevel.notificationUsers" :key="user" size="small" style="margin: 2px;">
              {{ getNotificationUserText(user) }}
            </el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="升级规则" :span="2">{{ currentLevel.escalationRules }}</el-descriptions-item>
        <el-descriptions-item label="级别描述" :span="2">{{ currentLevel.description }}</el-descriptions-item>
        <el-descriptions-item label="处理建议" :span="2">{{ currentLevel.suggestions }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentLevel.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentLevel.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentLevel.status ? 'success' : 'danger'" size="small">
            {{ currentLevel.status ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentLevel.creator }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  Plus, Refresh, Download, Search, CircleCloseFilled, 
  WarningFilled, InfoFilled, CircleCheckFilled, Monitor, 
  Message, Cellphone, ChatDotRound
} from '@element-plus/icons-vue'

interface WarningLevel {
  id: string
  name: string
  code: string
  type: 'critical' | 'warning' | 'info'
  priority: number
  color: string
  conditions: string[]
  notificationMethods: string[]
  notificationUsers: string[]
  deadline: number
  escalationRules: string
  description: string
  suggestions: string
  status: boolean
  createTime: string
  updateTime: string
  creator: string
}

const loading = ref(false)
const showAddDialog = ref(false)
const showViewDialog = ref(false)
const isEditing = ref(false)
const searchKeyword = ref('')
const formRef = ref<FormInstance>()

const levelForm = reactive({
  id: '',
  name: '',
  code: '',
  type: 'critical' as 'critical' | 'warning' | 'info',
  priority: 1,
  color: '#F56C6C',
  conditions: [] as string[],
  notificationMethods: [] as string[],
  notificationUsers: [] as string[],
  deadline: 24,
  escalationRules: '',
  description: '',
  suggestions: '',
  status: true
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入级别名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入级别代码', trigger: 'blur' },
    { pattern: /^[A-Z0-9_]+$/, message: '级别代码只能包含大写字母、数字和下划线', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择级别类型', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请输入优先级', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请输入处理时限', trigger: 'blur' }
  ],
  conditions: [
    { required: true, message: '请选择触发条件', trigger: 'change' }
  ],
  notificationMethods: [
    { required: true, message: '请选择通知方式', trigger: 'change' }
  ]
}

const levelList = ref<WarningLevel[]>([
  {
    id: '1',
    name: '严重食品安全风险',
    code: 'CRITICAL_FOOD_SAFETY',
    type: 'critical',
    priority: 1,
    color: '#F56C6C',
    conditions: ['test_fail', 'food_expired'],
    notificationMethods: ['system', 'email', 'sms', 'wechat'],
    notificationUsers: ['safety_manager', 'kitchen_manager', 'quality_inspector'],
    deadline: 2,
    escalationRules: '2小时内未处理自动升级至主管领导',
    description: '涉及食品安全严重问题，可能造成严重后果',
    suggestions: '立即停止相关食材使用，进行全面检查，上报主管部门',
    status: true,
    createTime: '2025-11-01 10:00:00',
    updateTime: '2025-11-15 14:30:00',
    creator: '系统管理员'
  },
  {
    id: '2',
    name: '设备紧急故障',
    code: 'EQUIPMENT_EMERGENCY',
    type: 'critical',
    priority: 2,
    color: '#F56C6C',
    conditions: ['equipment_failure'],
    notificationMethods: ['system', 'email', 'sms'],
    notificationUsers: ['maintenance_staff', 'kitchen_manager'],
    deadline: 4,
    escalationRules: '4小时内未处理自动升级至设备主管',
    description: '关键设备出现故障，影响正常运营',
    suggestions: '立即联系维修人员，启用备用设备，记录故障情况',
    status: true,
    createTime: '2025-11-02 09:00:00',
    updateTime: '2025-11-10 16:20:00',
    creator: '设备主管'
  },
  {
    id: '3',
    name: '库存预警',
    code: 'INVENTORY_WARNING',
    type: 'warning',
    priority: 3,
    color: '#E6A23C',
    conditions: ['stock_shortage', 'food_expired'],
    notificationMethods: ['system', 'email'],
    notificationUsers: ['warehouse_manager', 'purchase_manager'],
    deadline: 24,
    escalationRules: '24小时内未处理自动升级至采购经理',
    description: '库存不足或即将过期，需要及时补货或处理',
    suggestions: '检查库存情况，联系供应商补货，制定食材使用计划',
    status: true,
    createTime: '2025-11-03 11:00:00',
    updateTime: '2025-11-12 10:15:00',
    creator: '仓库主管'
  },
  {
    id: '4',
    name: '环境异常提醒',
    code: 'ENVIRONMENT_ALERT',
    type: 'info',
    priority: 4,
    color: '#409EFF',
    conditions: ['temperature_abnormal', 'humidity_abnormal'],
    notificationMethods: ['system'],
    notificationUsers: ['warehouse_manager', 'kitchen_manager'],
    deadline: 48,
    escalationRules: '48小时内未处理自动升级至部门主管',
    description: '存储环境参数异常，可能影响食材质量',
    suggestions: '检查环境控制设备，调整温湿度设置，加强监控',
    status: true,
    createTime: '2025-11-04 14:00:00',
    updateTime: '2025-11-08 09:45:00',
    creator: '质量主管'
  },
  {
    id: '5',
    name: '卫生检查提醒',
    code: 'HYGIENE_REMINDER',
    type: 'info',
    priority: 5,
    color: '#409EFF',
    conditions: ['hygiene_issue'],
    notificationMethods: ['system'],
    notificationUsers: ['kitchen_manager'],
    deadline: 72,
    escalationRules: '72小时内未处理自动升级至食品安全主管',
    description: '卫生检查发现问题，需要及时整改',
    suggestions: '加强清洁工作，完善卫生管理制度，定期检查',
    status: false,
    createTime: '2025-11-05 15:30:00',
    updateTime: '2025-11-05 15:30:00',
    creator: '卫生主管'
  }
])

const currentLevel = ref<WarningLevel | null>(null)

const criticalLevels = computed(() => levelList.value.filter(item => item.type === 'critical'))
const warningLevels = computed(() => levelList.value.filter(item => item.type === 'warning'))
const infoLevels = computed(() => levelList.value.filter(item => item.type === 'info'))

const filteredLevelList = computed(() => {
  if (!searchKeyword.value) return levelList.value
  return levelList.value.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.code.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const getTypeTagType = (type: string) => {
  const types = {
    critical: 'danger',
    warning: 'warning',
    info: 'info'
  }
  return types[type as keyof typeof types] || 'info'
}

const getTypeText = (type: string) => {
  const texts = {
    critical: '严重',
    warning: '警告',
    info: '提醒'
  }
  return texts[type as keyof typeof texts] || '未知'
}

const getPriorityTagType = (priority: number) => {
  if (priority <= 2) return 'danger'
  if (priority <= 4) return 'warning'
  return 'info'
}

const getConditionText = (condition: string) => {
  const texts = {
    temperature_abnormal: '温度异常',
    humidity_abnormal: '湿度异常',
    equipment_failure: '设备故障',
    test_fail: '快检不合格',
    food_expired: '食材过期',
    stock_shortage: '库存不足',
    hygiene_issue: '卫生问题',
    operation_violation: '操作违规'
  }
  return texts[condition as keyof typeof texts] || condition
}

const getNotificationMethodText = (method: string) => {
  const texts = {
    system: '系统通知',
    email: '邮件通知',
    sms: '短信通知',
    wechat: '微信通知'
  }
  return texts[method as keyof typeof texts] || method
}

const getNotificationUserText = (user: string) => {
  const texts = {
    safety_manager: '食品安全主管',
    warehouse_manager: '仓库管理员',
    kitchen_manager: '厨房主管',
    purchase_manager: '采购经理',
    maintenance_staff: '设备维护员',
    quality_inspector: '质量检验员'
  }
  return texts[user as keyof typeof texts] || user
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

const exportConfig = () => {
  ElMessage.success('配置导出功能开发中...')
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
}

const handleStatusChange = (row: WarningLevel) => {
  ElMessage.success(`级别 ${row.name} 已${row.status ? '启用' : '禁用'}`)
}

const viewLevel = (row: WarningLevel) => {
  currentLevel.value = row
  showViewDialog.value = true
}

const editLevel = (row: WarningLevel) => {
  isEditing.value = true
  Object.assign(levelForm, row)
  showAddDialog.value = true
}

const copyLevel = (row: WarningLevel) => {
  isEditing.value = false
  Object.assign(levelForm, {
    ...row,
    id: '',
    code: row.code + '_COPY',
    name: row.name + '(副本)'
  })
  showAddDialog.value = true
  ElMessage.info('已复制级别配置，请修改后保存')
}

const deleteLevel = (row: WarningLevel) => {
  ElMessageBox.confirm(
    `确认删除预警级别 "${row.name}" 吗？删除后将无法恢复。`,
    '删除确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    const index = levelList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      levelList.value.splice(index, 1)
      ElMessage.success('预警级别已删除')
    }
  })
}

const resetForm = () => {
  Object.assign(levelForm, {
    id: '',
    name: '',
    code: '',
    type: 'critical',
    priority: 1,
    color: '#F56C6C',
    conditions: [],
    notificationMethods: [],
    notificationUsers: [],
    deadline: 24,
    escalationRules: '',
    description: '',
    suggestions: '',
    status: true
  })
  isEditing.value = false
  formRef.value?.resetFields()
}

const saveLevel = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (isEditing.value) {
      // 编辑模式
      const index = levelList.value.findIndex(item => item.id === levelForm.id)
      if (index > -1) {
        const originalItem = levelList.value[index]
        if (originalItem) {
          levelList.value[index] = {
            ...levelForm,
            status: true,
            createTime: originalItem.createTime,
            creator: originalItem.creator,
            updateTime: new Date().toLocaleString()
          }
          ElMessage.success('预警级别已更新')
        }
      }
    } else {
      // 新增模式
      const newLevel: WarningLevel = {
        ...levelForm,
        id: Date.now().toString(),
        status: true,
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        creator: '当前用户'
      }
      levelList.value.push(newLevel)
      ElMessage.success('预警级别已创建')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.level-overview {
  margin-bottom: 16px;
}

.overview-card {
  transition: transform 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.header-icon {
  font-size: 20px;
  margin-right: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  text-align: center;
}

.level-count {
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 4px;
}

.overview-card.critical .level-count {
  color: #F56C6C;
}

.overview-card.warning .level-count {
  color: #E6A23C;
}

.overview-card.info .level-count {
  color: #409EFF;
}

.level-desc {
  font-size: 14px;
  color: #909399;
}

.config-card {
  margin-bottom: 16px;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level-name {
  display: flex;
  align-items: center;
}

.conditions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.notification-methods {
  display: flex;
  align-items: center;
}

.notification-users {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
