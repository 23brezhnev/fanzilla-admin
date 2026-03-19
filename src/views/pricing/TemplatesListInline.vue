<template>
  <div>
    <div style="display: flex; gap: 12px; margin-bottom: 16px">
      <n-input
        v-model:value="searchQuery"
        placeholder="Поиск по названию..."
        clearable
        style="max-width: 320px"
      >
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
      </n-input>
      <n-select
        v-model:value="statusFilter"
        :options="statusOptions"
        style="width: 180px"
        placeholder="Статус"
      />
    </div>

    <n-data-table
      :columns="columns"
      :data="filteredTemplates"
      :row-props="rowProps"
      :bordered="false"
      striped
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, NButton, NDropdown, NIcon } from 'naive-ui'
import { SearchOutline, EllipsisVertical } from '@vicons/ionicons5'
import { pricingTemplates } from '../../data/mock.js'

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref(null)

const statusOptions = [
  { label: 'Все', value: null },
  { label: 'Активные', value: 'active' },
  { label: 'Архивные', value: 'archived' }
]

const filteredTemplates = computed(() => {
  let result = [...pricingTemplates]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t => t.name.toLowerCase().includes(q))
  }
  if (statusFilter.value) {
    result = result.filter(t => t.status === statusFilter.value)
  }
  return result
})

const actionOptions = [
  { label: 'Редактировать', key: 'edit' },
  { label: 'Копировать', key: 'copy' },
  { label: 'События', key: 'events' },
  { type: 'divider', key: 'd1' },
  { label: 'Архивировать', key: 'archive' },
  { label: 'Удалить', key: 'delete' }
]

function handleAction(key, row) {
  if (key === 'edit') {
    router.push(`/pricing/templates/${row.id}`)
  }
}

const columns = [
  {
    title: 'Название',
    key: 'name',
    render(row) {
      return h(
        'span',
        { style: row.status === 'archived' ? 'color: #999' : 'font-weight: 500' },
        row.name
      )
    }
  },
  {
    title: 'Событий',
    key: 'eventsCount',
    width: 120,
    render(row) {
      return h('span', { style: row.status === 'archived' ? 'color: #999' : '' }, row.eventsCount)
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 140,
    render(row) {
      return h(NTag, {
        type: row.status === 'active' ? 'success' : 'default',
        size: 'small',
        bordered: false
      }, { default: () => row.status === 'active' ? 'Активен' : 'Архив' })
    }
  },
  {
    title: '',
    key: 'actions',
    width: 60,
    render(row) {
      return h(NDropdown, {
        options: row.status === 'archived'
          ? actionOptions.map(o => o.key === 'archive' ? { ...o, label: 'Восстановить', key: 'unarchive' } : o)
          : actionOptions,
        onSelect: (key) => handleAction(key, row),
        trigger: 'click'
      }, {
        default: () => h(NButton, {
          quaternary: true,
          circle: true,
          size: 'small'
        }, {
          icon: () => h(NIcon, { component: EllipsisVertical })
        })
      })
    }
  }
]

function rowProps(row) {
  return {
    style: row.status === 'archived' ? 'background: #fafafa; cursor: pointer' : 'cursor: pointer',
    onClick: (e) => {
      if (e.target.closest('.n-dropdown-menu') || e.target.closest('.n-button')) return
      router.push(`/pricing/templates/${row.id}`)
    }
  }
}
</script>
