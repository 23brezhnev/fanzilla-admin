<template>
  <div v-if="event">
    <n-space vertical :size="24">
      <!-- Header -->
      <n-page-header @back="router.push('/events')">
        <template #title>
          <n-space align="center" :size="12">
            <span>{{ eventIcon }} {{ event.name }}</span>
            <n-tag :type="statusInfo.type" size="small" round>{{ statusInfo.label }}</n-tag>
          </n-space>
        </template>
        <template #extra>
          <n-space :size="8">
            <n-dropdown :options="actionOptions" @select="handleAction">
              <n-button>
                Действия &#9662;
              </n-button>
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>

      <!-- Event Info -->
      <n-card title="Информация о событии">
        <n-descriptions bordered :column="2" label-placement="left">
          <n-descriptions-item label="Тип">
            {{ eventIcon }} {{ eventTypeLabel }}
          </n-descriptions-item>
          <n-descriptions-item label="Статус">
            <n-tag :type="statusInfo.type" size="small" round>{{ statusInfo.label }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="Площадка">
            {{ event.venueName }}
          </n-descriptions-item>
          <n-descriptions-item label="Дата">
            {{ formatDate(event.date) }}
          </n-descriptions-item>
          <n-descriptions-item label="Время">
            {{ event.timeStart }}{{ event.timeEnd ? ' \u2013 ' + event.timeEnd : '' }}
            {{ event.duration ? ' (' + event.duration + ' мин)' : '' }}
          </n-descriptions-item>
          <n-descriptions-item label="Ценовой шаблон">
            {{ templateName }}
          </n-descriptions-item>
          <n-descriptions-item label="Продано билетов">
            {{ formatNumber(event.sold) }} из {{ formatNumber(event.capacity) }}
          </n-descriptions-item>
          <n-descriptions-item label="Заполнение">
            <div style="min-width: 150px">
              <n-progress
                type="line"
                :percentage="fillPercent"
                :status="fillPercent >= 90 ? 'success' : fillPercent >= 50 ? 'default' : 'warning'"
              />
            </div>
          </n-descriptions-item>
          <!-- Match-specific fields -->
          <n-descriptions-item v-if="event.type === 'match'" label="Турнир">
            {{ event.tournament || '\u2014' }}
          </n-descriptions-item>
          <n-descriptions-item v-if="event.type === 'match'" label="Стадия">
            {{ event.stage || '\u2014' }}
          </n-descriptions-item>
          <n-descriptions-item v-if="event.type === 'match'" label="Команды">
            {{ event.teamHome }} vs {{ event.teamAway }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- Price Categories Table -->
      <n-card title="Ценовые категории">
        <n-data-table
          :columns="priceCatColumns"
          :data="priceCategoriesData"
          :bordered="false"
          :single-line="false"
        />
      </n-card>

      <!-- Sales Schedule (mock) -->
      <n-card title="Расписание продаж">
        <n-data-table
          :columns="salesScheduleColumns"
          :data="salesScheduleData"
          :bordered="false"
          :single-line="false"
        />
      </n-card>

      <n-divider />

      <!-- Bottom Actions -->
      <n-space justify="end" :size="12">
        <n-button @click="router.push('/events')">Назад к списку</n-button>
        <n-button type="primary" @click="router.push(`/events/create`)">Редактировать</n-button>
      </n-space>
    </n-space>
  </div>

  <div v-else>
    <n-card>
      <n-space vertical align="center" :size="16" style="padding: 48px 0; text-align: center">
        <div style="font-size: 48px">&#128533;</div>
        <h3>Событие не найдено</h3>
        <n-button type="primary" @click="router.push('/events')">Вернуться к списку</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NProgress, NTag } from 'naive-ui'
import { events, eventTypes, eventStatuses, pricingTemplates, priceCategories, tariffs, templatePrices } from '../../data/mock.js'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const eventId = computed(() => Number(route.params.id))
const event = computed(() => events.find(e => e.id === eventId.value))

const eventTypeMap = Object.fromEntries(eventTypes.map(t => [t.value, t]))

const eventIcon = computed(() => {
  if (!event.value) return ''
  return eventTypeMap[event.value.type]?.icon || ''
})

const eventTypeLabel = computed(() => {
  if (!event.value) return ''
  return eventTypeMap[event.value.type]?.label || event.value.type
})

const statusInfo = computed(() => {
  if (!event.value) return { label: '', type: 'default' }
  return eventStatuses[event.value.status] || { label: event.value.status, type: 'default' }
})

const templateName = computed(() => {
  if (!event.value) return '\u2014'
  const tpl = pricingTemplates.find(t => t.id === event.value.pricingTemplate)
  return tpl ? tpl.name : '\u2014'
})

const fillPercent = computed(() => {
  if (!event.value) return 0
  return Math.round((event.value.sold / event.value.capacity) * 100)
})

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Action dropdown options based on current status
const actionOptions = computed(() => {
  if (!event.value) return []
  const status = event.value.status
  const opts = []

  if (status === 'draft') {
    opts.push({ label: 'Опубликовать', key: 'publish' })
  }
  if (status === 'published') {
    opts.push({ label: 'Приостановить', key: 'pause' })
    opts.push({ label: 'Отменить', key: 'cancel' })
  }
  if (status === 'paused') {
    opts.push({ label: 'Опубликовать', key: 'publish' })
    opts.push({ label: 'Отменить', key: 'cancel' })
  }
  return opts
})

function handleAction(key) {
  const labels = {
    publish: 'Опубликовано',
    pause: 'Приостановлено',
    cancel: 'Отменено'
  }
  message.success(`Статус изменён: ${labels[key]} (mock)`)
}

// Price categories for the event
const priceCategoriesData = computed(() => {
  if (!event.value) return []
  const venueId = event.value.venue

  // For stadium venues, use priceCategories
  const venueCats = priceCategories.filter(c => c.venueId === venueId)
  if (venueCats.length > 0) {
    // Generate mock sold/available data
    const totalSold = event.value.sold
    const totalCap = event.value.capacity
    let remaining = totalSold

    return venueCats.map((c, idx) => {
      const cap = c.seatsCount || Math.round(totalCap / venueCats.length)
      const soldHere = idx < venueCats.length - 1
        ? Math.min(Math.round(remaining * 0.3), cap)
        : Math.min(remaining, cap)
      remaining -= soldHere
      const avail = cap - soldHere
      const pct = cap > 0 ? Math.round((soldHere / cap) * 100) : 0

      return {
        name: c.name,
        color: c.color,
        capacity: cap,
        sold: soldHere,
        available: avail,
        fillPercent: pct
      }
    })
  }

  // For non-stadium, use tariffs
  const totalSold = event.value.sold
  const totalCap = event.value.capacity
  let remaining = totalSold

  return tariffs.slice(0, 3).map((t, idx) => {
    const cap = Math.round(totalCap / 3)
    const soldHere = idx < 2
      ? Math.min(Math.round(remaining * 0.4), cap)
      : Math.min(remaining, cap)
    remaining -= soldHere
    const avail = cap - soldHere
    const pct = cap > 0 ? Math.round((soldHere / cap) * 100) : 0

    return {
      name: t.name,
      color: t.color,
      capacity: cap,
      sold: soldHere,
      available: avail,
      fillPercent: pct
    }
  })
})

const priceCatColumns = [
  {
    title: 'Категория',
    key: 'name',
    render(row) {
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h('div', {
          style: `width: 12px; height: 12px; border-radius: 50%; background: ${row.color}`
        }),
        h('span', { style: 'font-weight: 500' }, row.name)
      ])
    }
  },
  {
    title: 'Вместимость',
    key: 'capacity',
    width: 120,
    render(row) {
      return formatNumber(row.capacity)
    }
  },
  {
    title: 'Продано',
    key: 'sold',
    width: 100,
    render(row) {
      return formatNumber(row.sold)
    }
  },
  {
    title: 'Доступно',
    key: 'available',
    width: 100,
    render(row) {
      return formatNumber(row.available)
    }
  },
  {
    title: 'Заполнение',
    key: 'fillPercent',
    width: 180,
    render(row) {
      return h('div', { style: 'min-width: 120px' }, [
        h(NProgress, {
          type: 'line',
          percentage: row.fillPercent,
          status: row.fillPercent >= 90 ? 'success' : row.fillPercent >= 50 ? 'default' : 'warning'
        })
      ])
    }
  }
]

// Sales schedule mock data
const salesScheduleData = computed(() => {
  if (!event.value) return []
  return [
    { channel: 'Сайт', status: 'active', startDate: '01.03.2025', endDate: event.value.date.split('-').reverse().join('.'), soldCount: Math.round(event.value.sold * 0.6) },
    { channel: 'Мобильное приложение', status: 'active', startDate: '01.03.2025', endDate: event.value.date.split('-').reverse().join('.'), soldCount: Math.round(event.value.sold * 0.25) },
    { channel: 'Касса', status: 'active', startDate: '10.03.2025', endDate: event.value.date.split('-').reverse().join('.'), soldCount: Math.round(event.value.sold * 0.1) },
    { channel: 'Партнёр', status: 'paused', startDate: '05.03.2025', endDate: event.value.date.split('-').reverse().join('.'), soldCount: Math.round(event.value.sold * 0.05) },
  ]
})

const salesScheduleColumns = [
  {
    title: 'Канал продаж',
    key: 'channel'
  },
  {
    title: 'Статус',
    key: 'status',
    width: 140,
    render(row) {
      const map = {
        active: { label: 'Активен', type: 'success' },
        paused: { label: 'Приостановлен', type: 'warning' },
        stopped: { label: 'Остановлен', type: 'error' }
      }
      const s = map[row.status] || { label: row.status, type: 'default' }
      return h(NTag, { type: s.type, size: 'small', round: true }, { default: () => s.label })
    }
  },
  {
    title: 'Начало',
    key: 'startDate',
    width: 120
  },
  {
    title: 'Окончание',
    key: 'endDate',
    width: 120
  },
  {
    title: 'Продано',
    key: 'soldCount',
    width: 100,
    render(row) {
      return formatNumber(row.soldCount)
    }
  }
]
</script>
