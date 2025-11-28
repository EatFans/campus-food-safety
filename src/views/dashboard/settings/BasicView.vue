<template>
  <div class="basic-view">
    <el-card shadow="never">
      <template #header>
        <h3>基本设置</h3>
      </template>

      <el-form :model="settings" label-width="120px">
        <el-divider content-position="left">系统信息</el-divider>
        <el-form-item label="系统名称">
          <el-input v-model="settings.systemName" size="large" />
        </el-form-item>
        <el-form-item label="系统Logo">
          <el-upload class="logo-uploader" action="#" :show-file-list="false">
            <img v-if="settings.logo" :src="settings.logo" class="logo" />
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="系统版本">
          <el-input v-model="settings.version" size="large" />
        </el-form-item>

        <el-divider content-position="left">联系信息</el-divider>
        <el-form-item label="联系电话">
          <el-input v-model="settings.phone" size="large" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="settings.email" size="large" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="settings.address" size="large" />
        </el-form-item>

        <el-divider content-position="left">功能开关</el-divider>
        <el-form-item label="用户注册">
          <el-switch v-model="settings.allowRegister" />
        </el-form-item>
        <el-form-item label="评论功能">
          <el-switch v-model="settings.allowComment" />
        </el-form-item>
        <el-form-item label="维护模式">
          <el-switch v-model="settings.maintenanceMode" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="handleSave">保存设置</el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const settings = reactive({
  systemName: '校园食品安全管理系统',
  logo: '',
  version: 'v1.0.0',
  phone: '400-123-4567',
  email: 'service@example.com',
  address: '北京市朝阳区某某街道',
  allowRegister: true,
  allowComment: true,
  maintenanceMode: false
})

const handleSave = () => {
  ElMessage.success('设置已保存')
}

const handleReset = () => {
  ElMessage.info('设置已重置')
}
</script>

<style scoped>
.basic-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.basic-view :deep(.el-card) {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
}

.basic-view h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.logo-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.logo-uploader:hover {
  border-color: #409eff;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.logo {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
