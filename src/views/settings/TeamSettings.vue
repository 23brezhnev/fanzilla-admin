<template>
  <div>
    <n-space vertical :size="24">
      <n-space justify="space-between" align="center">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700">Команда</h2>
        <n-button type="primary">Пригласить сотрудника</n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="teamMembers"
        :bordered="false"
        :single-line="false"
        striped
      />
    </n-space>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { NTag } from 'naive-ui'
import { teamMembers } from '../../data/mock.js'

const roleColorMap = {
  'Владелец': 'error',
  'Администратор': 'warning',
  'Менеджер билетов': 'info',
  'Кассир': 'success',
  'Контролёр': 'default'
}

function formatDateTime(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  {
    title: 'Имя',
    key: 'name',
    render(row) {
      return h('span', { style: 'font-weight: 500' }, row.name)
    }
  },
  {
    title: 'Email',
    key: 'email',
    width: 220
  },
  {
    title: 'Роль',
    key: 'role',
    width: 180,
    render(row) {
      return h(NTag, {
        type: roleColorMap[row.role] || 'default',
        size: 'small',
        round: true
      }, () => row.role)
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 130,
    render(row) {
      return h(NTag, {
        type: row.status === 'active' ? 'success' : 'default',
        size: 'small',
        round: true
      }, () => row.status === 'active' ? 'Активен' : 'Неактивен')
    }
  },
  {
    title: 'Последняя активность',
    key: 'lastActive',
    width: 200,
    render(row) {
      return formatDateTime(row.lastActive)
    }
  }
]
</script>
