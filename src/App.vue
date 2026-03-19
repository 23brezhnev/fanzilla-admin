<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="ruRU" :date-locale="dateRuRU">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <AdminLayout />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { ruRU, dateRuRU } from 'naive-ui'
import AdminLayout from './layouts/AdminLayout.vue'

const themeOverrides = {
  common: {
    primaryColor: '#1A56FF',
    primaryColorHover: '#4070FF',
    primaryColorPressed: '#0040DD',
    primaryColorSuppl: '#1A56FF',
    borderRadius: '8px',
    borderRadiusSmall: '6px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  Menu: {
    itemHeight: '40px',
    borderRadius: '8px'
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f7;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}
</style>
