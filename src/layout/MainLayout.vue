<template>
  <el-container class="main-layout" direction="horizontal">
    <Sidebar />
    <el-container direction="vertical">
      <Header />
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100%;
}

.main-content {
  background-color: var(--el-bg-color-page);
  padding: 20px;
}
</style>
