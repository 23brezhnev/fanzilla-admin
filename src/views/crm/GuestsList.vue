<template>
  <div>
    <n-space justify="space-between" align="center" style="margin-bottom: 20px">
      <n-space align="center">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700">База гостей</h2>
        <n-tag :bordered="false" type="info" size="small">{{ filteredGuests.length }}</n-tag>
      </n-space>
      <n-button size="small" secondary @click="handleExport">Экспорт</n-button>
    </n-space>

    <!-- Filters -->
    <n-card size="small" style="margin-bottom: 16px">
      <n-space wrap :size="12">
        <n-input
          v-model:value="searchQuery"
          placeholder="Поиск по имени, телефону, email..."
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <span style="font-size: 14px; opacity: 0.5">&#128269;</span>
          </template>
        </n-input>
        <n-select
          v-model:value="selectedSegment"
          :options="segmentOptions"
          placeholder="Сегмент"
          clearable
          style="width: 200px"
        />
      </n-space>
    </n-card>

    <!-- Table -->
    <n-data-table
      :columns="columns"
      :data="filteredGuests"
      :row-key="row => row.id"
      :row-props="getRowProps"
      :bordered="false"
      striped
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, NButton } from 'naive-ui'
import { guests } from '../../data/mock.js'

const router = useRouter()

// --- Filters ---
const searchQuery = ref('')
const selectedSegment = ref(null)

const segmentOptions = computed(() => {
  const unique = [...new Set(guests.map(g => g.segment))]
  return unique.map(s => ({ label: s, value: s }))
})

const filteredGuests = computed(() => {
  let result = [...guests]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.email.toLowerCase().includes(q)
    )
  }

  if (selectedSegment.value) {
    result = result.filter(g => g.segment === selectedSegment.value)
  }

  return result
})

// --- Helpers ---
const segmentColorMap = {
  'VIP': 'error',
  'Постоянный клиент': 'success',
  'Новый': 'info',
  'Корпоративный': 'warning',
  'Абонемент': 'default'
}

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// --- Table Columns ---
const columns = [
  {
    title: 'Имя',
    key: 'name',
    render(row) {
      return h(NButton, {
        text: true, type: 'primary', strong: true,
        onClick: (e) => { e.stopPropagation(); router.push(`/crm/guests/${row.id}`) }
      }, { default: () => row.name })
    }
  },
  {
    title: 'Телефон',
    key: 'phone',
    width: 180
  },
  {
    title: 'Email',
    key: 'email',
    width: 200
  },
  {
    title: 'Сегмент',
    key: 'segment',
    width: 180,
    render(row) {
      return h(NTag, {
        type: segmentColorMap[row.segment] || 'default',
        size: 'small',
        round: true,
        bordered: false
      }, () => row.segment)
    }
  },
  {
    title: 'Заказы',
    key: 'ordersCount',
    width: 90,
    align: 'center',
    sorter: (a, b) => a.ordersCount - b.ordersCount
  },
  {
    title: 'Потрачено',
    key: 'totalSpent',
    width: 150,
    align: 'right',
    sorter: (a, b) => a.totalSpent - b.totalSpent,
    render(row) {
      return h('span', { style: { fontWeight: 500 } }, formatNumber(row.totalSpent) + ' \u20BD')
    }
  },
  {
    title: 'Последний визит',
    key: 'lastVisit',
    width: 150,
    sorter: (a, b) => new Date(a.lastVisit || 0) - new Date(b.lastVisit || 0),
    render(row) {
      return formatDateShort(row.lastVisit)
    }
  }
]

// --- Row Click ---
function getRowProps(row) {
  return {
    style: 'cursor: pointer',
    onClick: () => router.push(`/crm/guests/${row.id}`)
  }
}

function handleExport() {
  window.$message?.success('Экспорт гостей запущен (демо)')
}
</script>
