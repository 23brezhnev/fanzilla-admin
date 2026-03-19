<template>
  <div>
    <n-space vertical :size="24">
      <!-- Header -->
      <n-space justify="space-between" align="center">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700">Объекты</h2>
        <n-button type="primary" @click="router.push('/venues/create')">Создать объект</n-button>
      </n-space>

      <!-- Filters -->
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
import { NTag, NButton, NDropdown, NIcon, NSpace } from 'naive-ui'
import { EllipsisVertical, BusinessOutline, CreateOutline, TrashOutline, CopyOutline } from '@vicons/ionicons5'
import { venues, venueTypes, venueStatuses } from '../../data/mock.js'

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
  return venues.filter(v => {
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
    key: 'name',
    render(row) {
      return h(NSpace, { align: 'center', size: 12 }, () => [
        h(NIcon, { component: BusinessOutline, size: 20, color: '#999' }),
        h('span', { style: 'font-weight: 500' }, row.name)
      ])
    }
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
    title: '',
    key: 'actions',
    width: 60,
    render(row) {
      const options = [
        { label: 'Редактировать', key: 'edit', icon: () => h(NIcon, { component: CreateOutline }) },
        { label: 'Дублировать', key: 'duplicate', icon: () => h(NIcon, { component: CopyOutline }) },
        { type: 'divider', key: 'd1' },
        { label: 'Удалить', key: 'delete', icon: () => h(NIcon, { component: TrashOutline }) }
      ]
      return h(NDropdown, {
        trigger: 'click',
        options,
        onSelect: (key) => handleAction(key, row)
      }, () => h(NButton, { quaternary: true, circle: true, size: 'small' }, () =>
        h(NIcon, { component: EllipsisVertical })
      ))
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
