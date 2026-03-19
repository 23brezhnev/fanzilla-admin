<template>
  <div>
    <n-space vertical :size="24">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Активный прокат</h2>

      <n-data-table
        :columns="columns"
        :data="rentalItems"
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
import { rentalItems } from '../../data/mock.js'

const statusMap = {
  pending: { label: 'Ожидает', type: 'warning' },
  returned: { label: 'Возвращено', type: 'success' },
  completed: { label: 'Завершено', type: 'info' }
}

function formatDateTime(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const columns = [
  {
    title: 'Билет',
    key: 'ticketId',
    width: 140
  },
  {
    title: 'Гость',
    key: 'guest'
  },
  {
    title: 'Предмет',
    key: 'item'
  },
  {
    title: 'Выдано',
    key: 'issuedAt',
    width: 180,
    render(row) {
      return formatDateTime(row.issuedAt)
    }
  },
  {
    title: 'Возвращено',
    key: 'returnedAt',
    width: 180,
    render(row) {
      return formatDateTime(row.returnedAt)
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 140,
    render(row) {
      const st = statusMap[row.status] || { label: row.status, type: 'default' }
      return h(NTag, { type: st.type, size: 'small', round: true }, () => st.label)
    }
  }
]
</script>
