<template>
  <div>
    <n-space vertical :size="24">
      <n-page-header title="Объекты">
        <template #extra>
          <n-button type="primary" @click="router.push('/venues/create')">Создать объект</n-button>
        </template>
      </n-page-header>

      <!-- Filters -->
      <n-card size="small">
        <n-space>
        <n-input
          v-model:value="searchQuery"
          placeholder="Поиск по названию или адресу"
          clearable
          style="width: 300px"
        />
        <n-select
          v-model:value="filterType"
          placeholder="Тип объекта"
          clearable
          :options="typeOptions"
          style="width: 220px"
        />
        <n-select
          v-model:value="filterStatus"
          placeholder="Статус"
          clearable
          :options="statusOptions"
          style="width: 180px"
        />
        </n-space>
      </n-card>

      <!-- Table -->
      <n-data-table
        :columns="columns"
        :data="filteredVenues"
        :bordered="false"
        :single-line="false"
        :row-props="rowProps"
        striped
      />
    </n-space>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, NButton, NSpace } from 'naive-ui'
import { venues, venueTypes, venueStatuses, filterByVenueContext } from '../../data/mock.js'

const router = useRouter()

const searchQuery = ref('')
const filterType = ref(null)
const filterStatus = ref(null)

const typeOptions = Object.entries(venueTypes).map(([value, label]) => ({ value, label }))
const statusOptions = Object.entries(venueStatuses).map(([value, info]) => ({ value, label: info.label }))

const statusColorMap = {
  active: 'success',
  draft: 'default',
  paused: 'warning',
  archived: 'error'
}

const filteredVenues = computed(() => {
  return filterByVenueContext(venues).filter(v => {
    const matchSearch = !searchQuery.value ||
      v.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = !filterType.value || v.type === filterType.value
    const matchStatus = !filterStatus.value || v.status === filterStatus.value
    return matchSearch && matchType && matchStatus
  })
})

const columns = [
  {
    title: 'Название',
    key: 'name'
  },
  {
    title: 'Тип',
    key: 'type',
    width: 200,
    render(row) {
      return venueTypes[row.type] || row.type
    }
  },
  {
    title: 'Адрес',
    key: 'address',
    ellipsis: { tooltip: true }
  },
  {
    title: 'Вместимость',
    key: 'capacity',
    width: 130,
    render(row) {
      return row.capacity ? row.capacity.toLocaleString('ru-RU') : '—'
    }
  },
  {
    title: 'События',
    key: 'events',
    width: 100,
    render(row) {
      return row.events || 0
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 150,
    render(row) {
      const status = venueStatuses[row.status]
      return h(NTag, {
        type: statusColorMap[row.status] || 'default',
        size: 'small',
        round: true
      }, () => status ? status.label : row.status)
    }
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 180,
    render(row) {
      return h(NSpace, { size: 8, justify: 'end' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            quaternary: true,
            onClick: () => handleAction('edit', row)
          }, { default: () => 'Изменить' }),
          h(NButton, {
            size: 'small',
            quaternary: true,
            onClick: () => handleAction('duplicate', row)
          }, { default: () => 'Дублировать' })
        ]
      })
    }
  }
]

function rowProps(row) {
  return {
    style: 'cursor: pointer',
    onClick: (e) => {
      if (e.target.closest('.n-dropdown') || e.target.closest('.n-button')) return
      router.push(`/venues/${row.id}`)
    }
  }
}

function handleAction(key, row) {
  if (key === 'edit') {
    router.push(`/venues/${row.id}`)
  }
}
</script>
