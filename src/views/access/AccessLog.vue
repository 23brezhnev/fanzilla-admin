<template>
  <div>
    <n-space vertical :size="24">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Журнал проходов</h2>

      <n-data-table
        :columns="columns"
        :data="filteredAccessLog"
        :bordered="false"
        :single-line="false"
        striped
      />
    </n-space>
  </div>
</template>

<script setup>
import { h, computed } from 'vue'
import { NTag } from 'naive-ui'
import { accessLog, filterByVenueContext } from '../../data/mock.js'

const filteredAccessLog = computed(() => filterByVenueContext(accessLog))

const directionMap = {
  in: { label: 'Вход', type: 'success' },
  out: { label: 'Выход', type: 'warning' }
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
    title: 'Событие',
    key: 'event'
  },
  {
    title: 'Зона',
    key: 'zone',
    width: 150
  },
  {
    title: 'Направление',
    key: 'direction',
    width: 130,
    render(row) {
      const dir = directionMap[row.direction] || { label: row.direction, type: 'default' }
      return h(NTag, { type: dir.type, size: 'small', round: true }, () => dir.label)
    }
  },
  {
    title: 'Время',
    key: 'time',
    width: 180,
    render(row) {
      return formatDateTime(row.time)
    }
  },
  {
    title: 'Устройство',
    key: 'device',
    width: 150
  }
]
</script>
