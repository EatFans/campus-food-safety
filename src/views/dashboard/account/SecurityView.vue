<template>
  <div class="security-view">
    <el-card shadow="never" class="security-card">
      <template #header>
        <h3>安全设置</h3>
      </template>

      <div class="security-item">
        <div class="item-left">
          <el-icon :size="24" color="#409eff"><Lock /></el-icon>
          <div class="item-info">
            <h4>登录密码</h4>
            <p>定期更换密码可以提高账户安全性</p>
          </div>
        </div>
        <el-button type="primary" link @click="showPasswordDialog = true">修改</el-button>
      </div>

      <el-divider />

      <div class="security-item">
        <div class="item-left">
          <el-icon :size="24" color="#67c23a"><Iphone /></el-icon>
          <div class="item-info">
            <h4>手机绑定</h4>
            <p>已绑定手机: 138****8000</p>
          </div>
        </div>
        <el-button type="primary" link @click="showPhoneDialog = true">更换</el-button>
      </div>

      <el-divider />

      <div class="security-item">
        <div class="item-left">
          <el-icon :size="24" color="#e6a23c"><Message /></el-icon>
          <div class="item-info">
            <h4>邮箱绑定</h4>
            <p>已绑定邮箱: zhang***@example.com</p>
          </div>
        </div>
        <el-button type="primary" link @click="showEmailDialog = true">更换</el-button>
      </div>

      <el-divider />

      <div class="security-item">
        <div class="item-left">
          <el-icon :size="24" color="#f56c6c"><Key /></el-icon>
          <div class="item-info">
            <h4>双因素认证</h4>
            <p>{{ twoFactorEnabled ? '已开启' : '未开启' }}</p>
          </div>
        </div>
        <el-switch v-model="twoFactorEnabled" @change="handleTwoFactorChange" />
      </div>

      <el-divider />

      <div class="security-item">
        <div class="item-left">
          <el-icon :size="24" color="#909399"><Clock /></el-icon>
          <div class="item-info">
            <h4>登录记录</h4>
            <p>最近登录: 2025-11-28 10:30 (北京)</p>
          </div>
        </div>
        <el-button type="primary" link @click="showLoginHistory = true">查看</el-button>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="500px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordChange">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Lock, Iphone, Message, Key, Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const showPasswordDialog = ref(false)
const showPhoneDialog = ref(false)
const showEmailDialog = ref(false)
const showLoginHistory = ref(false)
const twoFactorEnabled = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handlePasswordChange = () => {
  ElMessage.success('密码修改成功')
  showPasswordDialog.value = false
}

const handleTwoFactorChange = (value: boolean) => {
  ElMessage.success(value ? '双因素认证已开启' : '双因素认证已关闭')
}
</script>

<style scoped>
.security-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.security-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
}

.security-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.item-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style>
