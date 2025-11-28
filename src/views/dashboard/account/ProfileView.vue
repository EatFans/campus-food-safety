<template>
  <div class="profile-view">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8">
        <el-card shadow="never" class="profile-card">
          <div class="avatar-section">
            <el-avatar :size="120" :src="userInfo.avatar" />
            <el-button type="primary" size="small" class="upload-btn" :icon="Upload">更换头像</el-button>
          </div>
          <div class="user-info">
            <h3>{{ userInfo.name }}</h3>
            <p class="role">{{ userInfo.role }}</p>
            <el-divider />
            <div class="info-item">
              <span class="label">员工编号:</span>
              <span class="value">{{ userInfo.employeeNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属部门:</span>
              <span class="value">{{ userInfo.department }}</span>
            </div>
            <div class="info-item">
              <span class="label">入职时间:</span>
              <span class="value">{{ userInfo.joinDate }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="16">
        <el-card shadow="never" class="form-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button type="primary" :icon="Edit" @click="handleEdit">编辑</el-button>
            </div>
          </template>

          <el-form :model="formData" label-width="100px" :disabled="!isEditing">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="formData.name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="formData.gender" style="width: 100%;">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号">
                  <el-input v-model="formData.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱">
                  <el-input v-model="formData.email" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期">
                  <el-date-picker v-model="formData.birthday" type="date" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号">
                  <el-input v-model="formData.idCard" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="家庭住址">
                  <el-input v-model="formData.address" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="个人简介">
                  <el-input v-model="formData.bio" type="textarea" :rows="4" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item v-if="isEditing">
              <el-button type="primary" @click="handleSave">保存</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Upload, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isEditing = ref(false)

const userInfo = reactive({
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  name: '张三',
  role: '系统管理员',
  employeeNo: 'EMP001',
  department: '管理部',
  joinDate: '2023-01-15'
})

const formData = reactive({
  name: '张三',
  gender: '男',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  birthday: '1990-01-01',
  idCard: '110101199001011234',
  address: '北京市朝阳区某某街道',
  bio: '热爱工作,积极向上'
})

const handleEdit = () => {
  isEditing.value = true
}

const handleSave = () => {
  ElMessage.success('保存成功')
  isEditing.value = false
}

const handleCancel = () => {
  isEditing.value = false
}
</script>

<style scoped>
.profile-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.profile-card {
  border-radius: 8px;
  text-align: center;
}

.avatar-section {
  padding: 20px 0;
}

.upload-btn {
  margin-top: 16px;
}

.user-info {
  padding: 0 20px 20px;
}

.user-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.role {
  color: #909399;
  margin: 0 0 16px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.info-item .label {
  color: #909399;
}

.info-item .value {
  font-weight: 500;
}

.form-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
