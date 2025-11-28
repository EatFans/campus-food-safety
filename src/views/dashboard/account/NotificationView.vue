<template>
  <div class="notification-view">
    <el-card shadow="never">
      <template #header>
        <h3>通知设置</h3>
      </template>

      <div class="notification-section">
        <h4>系统通知</h4>
        <div class="notification-item">
          <div class="item-info">
            <span>订单通知</span>
            <p>新订单、订单状态变更时通知</p>
          </div>
          <el-switch v-model="settings.orderNotify" />
        </div>
        <div class="notification-item">
          <div class="item-info">
            <span>审批通知</span>
            <p>待审批、审批结果通知</p>
          </div>
          <el-switch v-model="settings.approvalNotify" />
        </div>
        <div class="notification-item">
          <div class="item-info">
            <span>库存预警</span>
            <p>库存不足时通知</p>
          </div>
          <el-switch v-model="settings.stockNotify" />
        </div>
      </div>

      <el-divider />

      <div class="notification-section">
        <h4>消息推送</h4>
        <div class="notification-item">
          <div class="item-info">
            <span>站内信</span>
            <p>系统内消息通知</p>
          </div>
          <el-switch v-model="settings.siteMessage" />
        </div>
        <div class="notification-item">
          <div class="item-info">
            <span>邮件通知</span>
            <p>通过邮件接收通知</p>
          </div>
          <el-switch v-model="settings.emailNotify" />
        </div>
        <div class="notification-item">
          <div class="item-info">
            <span>短信通知</span>
            <p>通过短信接收重要通知</p>
          </div>
          <el-switch v-model="settings.smsNotify" />
        </div>
      </div>

      <el-divider />

      <el-button type="primary" @click="handleSave">保存设置</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const settings = reactive({
  orderNotify: true,
  approvalNotify: true,
  stockNotify: true,
  siteMessage: true,
  emailNotify: false,
  smsNotify: false
})

const handleSave = () => {
  ElMessage.success('设置已保存')
}
</script>

<style scoped>
.notification-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.notification-view :deep(.el-card) {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
}

.notification-view h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.notification-section {
  margin-bottom: 20px;
}

.notification-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.item-info span {
  font-size: 15px;
  font-weight: 500;
}

.item-info p {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 13px;
}
</style>
