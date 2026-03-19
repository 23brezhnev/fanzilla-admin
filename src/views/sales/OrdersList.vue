<template>
  <div>
    <n-space justify="space-between" align="center" style="margin-bottom: 20px">
      <n-space align="center">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700">Заказы</h2>
        <n-tag :bordered="false" type="info" size="small">{{ filteredOrders.length }}</n-tag>
      </n-space>
      <n-space>
        <n-button @click="handleExport">
          <template #icon><span style="font-size: 14px">&#128229;</span></template>
          Экспорт
        </n-button>
      </n-space>
    </n-space>

    <!-- Quick Filters -->
    <n-space style="margin-bottom: 16px">
      <n-button
        :type="quickFilter === 'today' ? 'primary' : 'default'"
        size="small"
        @click="toggleQuickFilter('today')"
      >
        Сегодня
      </n-button>
      <n-button
        :type="quickFilter === 'refunds' ? 'primary' : 'default'"
        size="small"
        @click="toggleQuickFilter('refunds')"
      >
        Возвраты
      </n-button>
      <n-button
        :type="quickFilter === 'problems' ? 'primary' : 'default'"
        size="small"
        @click="toggleQuickFilter('problems')"
      >
        Проблемные
      </n-button>
    </n-space>

    <!-- Filters -->
    <n-card size="small" style="margin-bottom: 16px">
      <n-space wrap :size="12">
        <n-input
          v-model:value="searchQuery"
          placeholder="Поиск по номеру, телефону, email, имени..."
          clearable
          style="width: 320px"
        >
          <template #prefix>
            <span style="font-size: 14px; opacity: 0.5">&#128269;</span>
          </template>
        </n-input>
        <n-date-picker
          v-model:value="dateRange"
          type="daterange"
          clearable
          :shortcuts="dateShortcuts"
          style="width: 280px"
        />
        <n-select
          v-model:value="selectedStatuses"
          multiple
          :options="statusOptions"
          placeholder="Статус"
          clearable
          style="width: 240px"
        />
        <n-select
          v-model:value="selectedChannels"
          multiple
          :options="channelOptions"
          placeholder="Канал"
          clearable
          style="width: 200px"
        />
      </n-space>
    </n-card>

    <!-- Table -->
    <n-data-table
      :columns="columns"
      :data="paginatedOrders"
      :row-key="row => row.id"
      :row-props="getRowProps"
      :pagination="false"
      :bordered="false"
      striped
    />

    <!-- Pagination -->
    <n-space justify="space-between" align="center" style="margin-top: 16px">
      <n-space align="center" :size="8">
        <span style="font-size: 13px; color: #999">Показано {{ paginationStart }}–{{ paginationEnd }} из {{ filteredOrders.length }}</span>
      </n-space>
      <n-space align="center" :size="12">
        <n-select
          v-model:value="pageSize"
          :options="pageSizeOptions"
          size="small"
          style="width: 110px"
        />
        <n-pagination
          v-model:page="currentPage"
          :page-count="pageCount"
          :page-slot="7"
          size="small"
        />
      </n-space>
    </n-space>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, NButton, NSpace, NBadge } from 'naive-ui'
import { orders, orderStatuses, salesChannels } from '../../data/mock.js'

const router = useRouter()

// --- Filters ---
const searchQuery = ref('')
const dateRange = ref(null)
const selectedStatuses = ref(null)
const selectedChannels = ref(null)
const quickFilter = ref(null)

const statusOptions = Object.entries(orderStatuses).map(([value, s]) => ({
  label: s.label,
  value
}))

const channelOptions = salesChannels.map(c => ({
  label: c.label,
  value: c.label
}))

const dateShortcuts = {
  'Сегодня': () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return [start.getTime(), end.getTime()]
  },
  'Вчера': () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999)
    return [start.getTime(), end.getTime()]
  },
  'Последние 7 дней': () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return [start.getTime(), end.getTime()]
  },
  'Последние 30 дней': () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return [start.getTime(), end.getTime()]
  }
}

function toggleQuickFilter(filter) {
  quickFilter.value = quickFilter.value === filter ? null : filter
}

// --- Filtered data ---
const filteredOrders = computed(() => {
  let result = [...orders]

  // Quick filters
  if (quickFilter.value === 'today') {
    const today = new Date().toISOString().slice(0, 10)
    result = result.filter(o => o.date.startsWith(today))
  } else if (quickFilter.value === 'refunds') {
    result = result.filter(o => o.status === 'refunded' || o.status === 'partial_refund')
  } else if (quickFilter.value === 'problems') {
    result = result.filter(o => o.status === 'created' || o.status === 'partial_refund')
  }

  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o =>
      String(o.id).includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      o.customer.email.toLowerCase().includes(q)
    )
  }

  // Date range
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    result = result.filter(o => {
      const t = new Date(o.date).getTime()
      return t >= start && t <= end
    })
  }

  // Status
  if (selectedStatuses.value && selectedStatuses.value.length > 0) {
    result = result.filter(o => selectedStatuses.value.includes(o.status))
  }

  // Channel
  if (selectedChannels.value && selectedChannels.value.length > 0) {
    result = result.filter(o => selectedChannels.value.includes(o.channel))
  }

  return result
})

// --- Pagination ---
const currentPage = ref(1)
const pageSize = ref(20)

const pageSizeOptions = [
  { label: '20 на странице', value: 20 },
  { label: '50 на странице', value: 50 },
  { label: '100 на странице', value: 100 }
]

const pageCount = computed(() => Math.ceil(filteredOrders.value.length / pageSize.value) || 1)

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredOrders.value.slice(start, start + pageSize.value)
})

const paginationStart = computed(() =>
  filteredOrders.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
)

const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredOrders.value.length)
)

// --- Table columns ---
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatMoney(val) {
  return val.toLocaleString('ru-RU') + ' \u20BD'
}

const columns = [
  {
    title: '# Заказ',
    key: 'id',
    width: 110,
    render(row) {
      return h(
        NButton,
        {
          text: true,
          type: 'primary',
          strong: true,
          onClick: (e) => {
            e.stopPropagation()
            router.push(`/sales/orders/${row.id}`)
          }
        },
        { default: () => `#${row.id}` }
      )
    }
  },
  {
    title: 'Дата',
    key: 'date',
    width: 150,
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
    render(row) {
      return formatDate(row.date)
    }
  },
  {
    title: 'Клиент',
    key: 'customer',
    width: 200,
    render(row) {
      return h('div', [
        h('div', { style: { fontWeight: 500, fontSize: '13px' } }, row.customer.name),
        h('div', { style: { fontSize: '12px', color: '#999' } }, row.customer.phone)
      ])
    }
  },
  {
    title: 'Билеты',
    key: 'ticketsCount',
    width: 80,
    align: 'center',
    sorter: (a, b) => a.ticketsCount - b.ticketsCount
  },
  {
    title: 'Услуги',
    key: 'servicesCount',
    width: 80,
    align: 'center',
    render(row) {
      if (row.servicesCount === 0) {
        return h('span', { style: { color: '#ccc' } }, '—')
      }
      return h(NBadge, {
        value: row.servicesCount,
        type: 'info',
        showZero: false
      })
    }
  },
  {
    title: 'Сумма',
    key: 'total',
    width: 130,
    align: 'right',
    sorter: (a, b) => a.total - b.total,
    render(row) {
      if (row.discount > 0) {
        return h('div', { style: { textAlign: 'right' } }, [
          h('div', { style: { fontSize: '11px', color: '#999', textDecoration: 'line-through' } }, formatMoney(row.total + row.discount)),
          h('div', { style: { fontWeight: 600 } }, formatMoney(row.total))
        ])
      }
      return h('span', { style: { fontWeight: 600 } }, formatMoney(row.total))
    }
  },
  {
    title: 'Скидка / Промо',
    key: 'discount',
    width: 140,
    render(row) {
      const parts = []
      if (row.discount > 0) {
        parts.push(h('span', { style: { color: '#d03050', fontSize: '13px' } }, `-${formatMoney(row.discount)}`))
      }
      if (row.promoCode) {
        parts.push(
          h(NTag, { size: 'small', bordered: false, type: 'info', style: { marginLeft: row.discount > 0 ? '6px' : '0' } },
            { default: () => row.promoCode }
          )
        )
      }
      if (parts.length === 0) {
        return h('span', { style: { color: '#ccc' } }, '—')
      }
      return h(NSpace, { align: 'center', size: 4 }, { default: () => parts })
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 160,
    filterOptions: statusOptions.map(s => ({ label: s.label, value: s.value })),
    render(row) {
      const st = orderStatuses[row.status]
      if (!st) return row.status
      return h(NTag, { type: st.type, size: 'small', bordered: false }, { default: () => st.label })
    }
  },
  {
    title: 'Канал',
    key: 'channel',
    width: 130,
    render(row) {
      return h('span', { style: { fontSize: '13px' } }, row.channel)
    }
  },
  {
    title: '',
    key: 'actions',
    width: 50,
    render(row) {
      return h(
        NButton,
        {
          text: true,
          size: 'small',
          onClick: (e) => {
            e.stopPropagation()
            router.push(`/sales/orders/${row.id}`)
          }
        },
        { default: () => '...' }
      )
    }
  }
]

// --- Row click ---
function getRowProps(row) {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      router.push(`/sales/orders/${row.id}`)
    }
  }
}

function handleExport() {
  window.$message?.success('Экспорт заказов запущен (демо)')
}
</script>
