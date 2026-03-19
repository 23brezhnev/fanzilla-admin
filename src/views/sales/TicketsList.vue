<template>
  <div>
    <n-space justify="space-between" align="center" style="margin-bottom: 20px">
      <n-space align="center">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700">Билеты</h2>
        <n-tag :bordered="false" type="info" size="small">{{ filteredTickets.length }}</n-tag>
      </n-space>
    </n-space>

    <!-- Filters -->
    <n-card size="small" style="margin-bottom: 16px">
      <n-space wrap :size="12">
        <n-input
          v-model:value="searchQuery"
          placeholder="Поиск по номеру билета, телефону..."
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <span style="font-size: 14px; opacity: 0.5">&#128269;</span>
          </template>
        </n-input>
        <n-select
          v-model:value="selectedEvent"
          :options="eventOptions"
          placeholder="Событие"
          clearable
          style="width: 260px"
        />
        <n-select
          v-model:value="selectedStatuses"
          multiple
          :options="statusOptions"
          placeholder="Статус"
          clearable
          style="width: 220px"
        />
        <n-select
          v-model:value="selectedTariff"
          :options="tariffOptions"
          placeholder="Тариф"
          clearable
          style="width: 180px"
        />
      </n-space>
    </n-card>

    <!-- Table -->
    <n-data-table
      :columns="columns"
      :data="paginatedTickets"
      :row-key="row => row.id"
      :row-props="getRowProps"
      :bordered="false"
      :pagination="false"
      striped
      size="small"
    />

    <!-- Pagination -->
    <n-space justify="space-between" align="center" style="margin-top: 16px">
      <span style="font-size: 13px; color: #999">
        Показано {{ paginationStart }}–{{ paginationEnd }} из {{ filteredTickets.length }}
      </span>
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
import { NTag, NButton } from 'naive-ui'
import { tickets, ticketStatuses } from '../../data/mock.js'

const router = useRouter()

// --- Filters ---
const searchQuery = ref('')
const selectedEvent = ref(null)
const selectedStatuses = ref(null)
const selectedTariff = ref(null)

// Unique events from tickets
const eventOptions = computed(() => {
  const unique = [...new Set(tickets.map(t => t.event))]
  return unique.map(e => ({ label: e, value: e }))
})

const statusOptions = Object.entries(ticketStatuses).map(([value, s]) => ({
  label: s.label,
  value
}))

// Unique tariffs from tickets
const tariffOptions = computed(() => {
  const unique = [...new Set(tickets.map(t => t.tariff))]
  return unique.map(t => ({ label: t, value: t }))
})

// --- Filtered data ---
const filteredTickets = computed(() => {
  let result = [...tickets]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q)
    )
  }

  if (selectedEvent.value) {
    result = result.filter(t => t.event === selectedEvent.value)
  }

  if (selectedStatuses.value && selectedStatuses.value.length > 0) {
    result = result.filter(t => selectedStatuses.value.includes(t.status))
  }

  if (selectedTariff.value) {
    result = result.filter(t => t.tariff === selectedTariff.value)
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

const pageCount = computed(() => Math.ceil(filteredTickets.value.length / pageSize.value) || 1)

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTickets.value.slice(start, start + pageSize.value)
})

const paginationStart = computed(() =>
  filteredTickets.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
)

const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredTickets.value.length)
)

// --- Table columns ---
function formatMoney(val) {
  return val.toLocaleString('ru-RU') + ' \u20BD'
}

const columns = [
  {
    title: '# Билет',
    key: 'id',
    width: 130,
    render(row) {
      return h(
        NButton,
        {
          text: true,
          type: 'primary',
          strong: true,
          size: 'small',
          onClick: (e) => {
            e.stopPropagation()
            router.push(`/sales/tickets/${row.id}`)
          }
        },
        { default: () => row.id }
      )
    }
  },
  {
    title: 'Событие',
    key: 'event',
    ellipsis: { tooltip: true },
    width: 220
  },
  {
    title: 'Тариф',
    key: 'tariff',
    width: 120,
    render(row) {
      return h(NTag, { size: 'small', bordered: false }, { default: () => row.tariff })
    }
  },
  {
    title: 'Тип',
    key: 'ticketType',
    width: 100,
    render(row) {
      return row.ticketType || '\u2014'
    }
  },
  {
    title: 'Клиент',
    key: 'customer',
    width: 160
  },
  {
    title: '# Заказ',
    key: 'orderId',
    width: 100,
    render(row) {
      return h(
        NButton,
        {
          text: true,
          type: 'primary',
          size: 'small',
          onClick: (e) => {
            e.stopPropagation()
            router.push(`/sales/orders/${row.orderId}`)
          }
        },
        { default: () => `#${row.orderId}` }
      )
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 140,
    render(row) {
      const st = ticketStatuses[row.status]
      if (!st) return row.status
      return h(NTag, { type: st.type, size: 'small', bordered: false }, { default: () => st.label })
    }
  },
  {
    title: 'Вход',
    key: 'entry',
    width: 80,
    render(row) {
      return row.entry || '\u2014'
    }
  },
  {
    title: 'Выход',
    key: 'exit',
    width: 80,
    render(row) {
      return row.exit || '\u2014'
    }
  },
  {
    title: 'Место',
    key: 'seat',
    width: 140,
    render(row) {
      if (row.sector || row.row || row.seat) {
        const parts = []
        if (row.sector) parts.push(row.sector)
        if (row.row) parts.push(`Р${row.row}`)
        if (row.seat) parts.push(`М${row.seat}`)
        return parts.join(' / ')
      }
      return '\u2014'
    }
  },
  {
    title: 'Цена',
    key: 'price',
    width: 110,
    align: 'right',
    sorter: (a, b) => a.price - b.price,
    render(row) {
      return h('span', { style: { fontWeight: 500 } }, formatMoney(row.price))
    }
  }
]

// --- Row click ---
function getRowProps(row) {
  return {
    style: 'cursor: pointer',
    onClick: () => {
      router.push(`/sales/tickets/${row.id}`)
    }
  }
}
</script>
