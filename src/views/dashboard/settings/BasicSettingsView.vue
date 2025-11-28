<template>
  <div class="basic-settings-view">
    <div class="page-header">
      <h2>基本设置</h2>
      <el-button type="primary" :icon="Check">保存设置</el-button>
    </div>

    <el-card shadow="hover">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="系统信息" name="system">
          <el-form :model="systemForm" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="systemForm.name" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="系统简称">
              <el-input v-model="systemForm.shortName" placeholder="请输入系统简称" />
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                class="logo-uploader"
                action="#"
                :show-file-list="false"
              >
                <el-image
                  v-if="systemForm.logo"
                  :src="systemForm.logo"
                  class="logo"
                />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="systemForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="systemForm.email" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="系统地址">
              <el-input v-model="systemForm.address" type="textarea" :rows="3" placeholder="请输入系统地址" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="业务设置" name="business">
          <el-form :model="businessForm" label-width="120px">
            <el-form-item label="营业时间">
              <el-time-picker
                v-model="businessForm.businessHours"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="配送范围">
              <el-input-number v-model="businessForm.deliveryRange" :min="1" :max="50" />
              <span style="margin-left: 10px;">公里</span>
            </el-form-item>
            <el-form-item label="起送金额">
              <el-input-number v-model="businessForm.minOrderAmount" :min="0" :precision="2" />
              <span style="margin-left: 10px;">元</span>
            </el-form-item>
            <el-form-item label="配送费">
              <el-input-number v-model="businessForm.deliveryFee" :min="0" :precision="2" />
              <span style="margin-left: 10px;">元</span>
            </el-form-item>
            <el-form-item label="自动接单">
              <el-switch v-model="businessForm.autoAccept" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="notificationForm" label-width="120px">
            <el-form-item label="订单通知">
              <el-switch v-model="notificationForm.orderNotify" />
            </el-form-item>
            <el-form-item label="库存预警">
              <el-switch v-model="notificationForm.stockAlert" />
            </el-form-item>
            <el-form-item label="设备异常">
              <el-switch v-model="notificationForm.deviceAlert" />
            </el-form-item>
            <el-form-item label="安全检查">
              <el-switch v-model="notificationForm.safetyAlert" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Check, Plus } from '@element-plus/icons-vue'

const activeTab = ref('system')

const systemForm = reactive({
  name: '云食堂智慧管理系统',
  shortName: '云食堂',
  logo: '',
  phone: '400-888-8888',
  email: 'contact@example.com',
  address: '某某市某某区某某街道123号'
})

const businessForm = reactive({
  businessHours: [new Date(2025, 0, 1, 8, 0), new Date(2025, 0, 1, 20, 0)],
  deliveryRange: 5,
  minOrderAmount: 20,
  deliveryFee: 5,
  autoAccept: true
})

const notificationForm = reactive({
  orderNotify: true,
  stockAlert: true,
  deviceAlert: true,
  safetyAlert: true
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

.logo-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.logo-uploader:hover {
  border-color: var(--el-color-primary);
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.logo {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
