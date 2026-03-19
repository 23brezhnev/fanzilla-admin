<template>
  <div>
    <n-space justify="space-between" align="center" style="margin-bottom: 20px">
      <n-space align="center">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700">Промокоды</h2>
        <n-tag :bordered="false" type="info" size="small">{{ promoCodes.length }}</n-tag>
      </n-space>
      <n-button type="primary" @click="handleCreate">
        Создать промокод
      </n-button>
    </n-space>

    <!-- Table -->
    <n-data-table
      :columns="columns"
      :data="promoCodes"
      :row-key="row => row.id"
      :bordered="false"
      striped
    />
  </div>
</template>

<script setup>
import { h } from 'vue'
import { NTag, NButton, NProgress, NSpace } from 'naive-ui'
import { promoCodes } from '../../data/mock.js'

function formatMoney(val) {
  return val.toLocaleString('ru-RU') + ' \u20BD'
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014'
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const promoStatusMap = {
  active: { label: 'Активен', type: 'success' },
  paused: { label: 'Приостановлен', type: 'warning' },
  expired: { label: 'Истёк', type: 'default' },
  archived: { label: 'Архив', type: 'error' }
}

const columns = [
  {
    title: 'Код',
    key: 'code',
    width: 160,
    render(row) {
      return h('span', {
        style: {
          fontWeight: 600,
          fontFamily: 'monospace',
          fontSize: '14px',
          letterSpacing: '0.5px'
        }
      }, row.code)
    }
  },
  {
    title: 'Тип',
    key: 'type',
    width: 100,
    render(row) {
      const label = row.type === 'percent' ? 'Процент' : 'Фиксированная'
      const tagType = row.type === 'percent' ? 'info' : 'warning'
      return h(NTag, { type: tagType, size: 'small', bordered: false }, { default: () => label })
    }
  },
  {
    title: 'Значение',
    key: 'value',
    width: 120,
    render(row) {
      if (row.type === 'percent') {
        return h('span', { style: { fontWeight: 500 } }, `${row.value}%`)
      }
      return h('span', { style: { fontWeight: 500 } }, formatMoney(row.value))
    }
  },
  {
    title: 'Использование',
    key: 'usage',
    width: 220,
    render(row) {
      const percentage = row.usageLimit > 0
        ? Math.round((row.usageCount / row.usageLimit) * 100)
        : 0
      const progressStatus = percentage >= 100 ? 'error' : percentage >= 80 ? 'warning' : 'success'
      return h('div', { style: { minWidth: '160px' } }, [
        h('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginBottom: '4px',
            color: '#666'
          }
        }, [
          h('span', null, `${row.usageCount.toLocaleString('ru-RU')} из ${row.usageLimit.toLocaleString('ru-RU')}`),
          h('span', null, `${percentage}%`)
        ]),
        h(NProgress, {
          type: 'line',
          percentage,
          status: progressStatus,
          showIndicator: false,
          height: 6
        })
      ])
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 130,
    render(row) {
      const st = promoStatusMap[row.status]
      if (!st) return row.status
      return h(NTag, { type: st.type, size: 'small', bordered: false }, { default: () => st.label })
    }
  },
  {
    title: 'Период действия',
    key: 'dates',
    width: 220,
    render(row) {
      return h('span', { style: { fontSize: '13px' } },
        `${formatDate(row.startDate)} \u2014 ${formatDate(row.endDate)}`
      )
    }
  },
  {
    title: '',
    key: 'actions',
    width: 100,
    render(row) {
      return h(NSpace, { size: 4 }, {
        default: () => [
          h(NButton, { text: true, type: 'primary', size: 'small' }, { default: () => 'Изменить' }),
          h(NButton, {
            text: true,
            type: row.status === 'active' ? 'warning' : 'success',
            size: 'small'
          }, {
            default: () => row.status === 'active' ? 'Стоп' : 'Запуск'
          })
        ]
      })
    }
  }
]

function handleCreate() {
  window.$message?.info('Создание промокода (демо)')
}
</script>
