<template>
  <div v-if="venue">
    <n-space vertical :size="24">
      <!-- Header -->
      <n-page-header :title="venue.name" @back="router.push('/venues')">
        <template #subtitle>
          <n-space align="center" :size="8">
            <span>{{ venueTypes[venue.type] || venue.type }}</span>
            <n-tag :type="statusColorMap[venue.status]" size="small" round>
              {{ venueStatuses[venue.status]?.label || venue.status }}
            </n-tag>
          </n-space>
        </template>
        <template #extra>
          <n-space>
            <n-button @click="router.push(`/venues/${venue.id}`)">Редактировать</n-button>
            <n-dropdown :options="actionOptions" @select="handleAction">
              <n-button>Действия</n-button>
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>

      <!-- Stats -->
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-card>
            <n-statistic label="Событий" :value="stats.events" />
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Билетов продано" :value="formatNumber(stats.ticketsSold)" />
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Выручка" :value="formatNumber(stats.revenue)">
              <template #suffix>&nbsp;&#8381;</template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Средняя заполняемость" :value="stats.avgOccupancy">
              <template #suffix>%</template>
            </n-statistic>
          </n-card>
        </n-gi>
      </n-grid>

      <!-- Tabs -->
      <n-card>
        <n-tabs type="line" animated>
          <!-- Basic Info -->
          <n-tab-pane name="info" tab="Основная информация">
            <n-descriptions bordered :column="2" label-placement="left" style="margin-top: 16px">
              <n-descriptions-item label="Название">{{ venue.name }}</n-descriptions-item>
              <n-descriptions-item label="Тип">{{ venueTypes[venue.type] || venue.type }}</n-descriptions-item>
              <n-descriptions-item label="Адрес">{{ venue.address }}</n-descriptions-item>
              <n-descriptions-item label="Город">{{ venue.city }}</n-descriptions-item>
              <n-descriptions-item label="Вместимость">{{ venue.capacity ? venue.capacity.toLocaleString('ru-RU') : '—' }}</n-descriptions-item>
              <n-descriptions-item label="Статус">
                <n-tag :type="statusColorMap[venue.status]" size="small" round>
                  {{ venueStatuses[venue.status]?.label || venue.status }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="Зоны / Секторы">{{ venue.zones || venue.sectors || '—' }}</n-descriptions-item>
              <n-descriptions-item label="Яндекс.Карты">
                <a v-if="venue.yandexMaps" :href="venue.yandexMaps" target="_blank">Открыть на карте</a>
                <span v-else>—</span>
              </n-descriptions-item>
            </n-descriptions>
          </n-tab-pane>

          <!-- Map -->
          <n-tab-pane name="map" tab="Карта объекта">
            <div style="padding: 40px; text-align: center">
              <div style="background: #f5f5f5; border: 2px dashed #d9d9d9; border-radius: 12px; padding: 60px 40px; max-width: 600px; margin: 0 auto">
                <n-space vertical align="center" :size="16">
                  <span style="font-size: 48px">🗺️</span>
                  <n-text strong style="font-size: 16px">SVG-карта загружена</n-text>
                  <n-text depth="3">Интерактивная карта зон и секторов объекта</n-text>
                  <n-button>Загрузить SVG-карту</n-button>
                </n-space>
              </div>
            </div>
          </n-tab-pane>

          <!-- Price Categories -->
          <n-tab-pane name="prices" tab="Ценовые категории">
            <n-data-table
              :columns="priceCategoryColumns"
              :data="venuePriceCategories"
              :bordered="false"
              :single-line="false"
              style="margin-top: 16px"
            />
            <n-empty v-if="venuePriceCategories.length === 0" description="Ценовые категории не настроены" style="margin: 40px 0" />
          </n-tab-pane>

          <!-- Events -->
          <n-tab-pane name="events" tab="События">
            <n-data-table
              :columns="eventColumns"
              :data="venueEvents"
              :bordered="false"
              :single-line="false"
              style="margin-top: 16px"
            />
            <n-empty v-if="venueEvents.length === 0" description="Нет связанных событий" style="margin: 40px 0" />
          </n-tab-pane>

          <!-- History -->
          <n-tab-pane name="history" tab="История">
            <n-timeline style="margin-top: 16px; padding: 0 16px">
              <n-timeline-item
                v-for="item in historyItems"
                :key="item.id"
                :type="item.type"
                :title="item.title"
                :content="item.content"
                :time="item.time"
              />
            </n-timeline>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-space>
  </div>

  <div v-else>
    <n-result status="404" title="Объект не найден" description="Объект с указанным идентификатором не существует">
      <template #footer>
        <n-button @click="router.push('/venues')">Вернуться к списку</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTag } from 'naive-ui'
import { venues, venueTypes, venueStatuses, priceCategories, events, eventStatuses } from '../../data/mock.js'

const router = useRouter()
const route = useRoute()

const statusColorMap = {
  active: 'success',
  draft: 'default',
  paused: 'warning',
  archived: 'error'
}

const eventStatusColorMap = {
  draft: 'default',
  published: 'success',
  paused: 'warning',
  completed: 'info',
  cancelled: 'error'
}

const venue = computed(() => {
  const id = Number(route.params.id)
  return venues.find(v => v.id === id) || null
})

const stats = {
  events: 47,
  ticketsSold: 12840,
  revenue: 4250000,
  avgOccupancy: 78
}

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

const actionOptions = [
  { label: 'Опубликовать', key: 'publish' },
  { label: 'Приостановить', key: 'pause' },
  { type: 'divider', key: 'd1' },
  { label: 'В архив', key: 'archive' }
]

function handleAction(key) {
  // stub
}

// Price categories for this venue
const venuePriceCategories = computed(() => {
  if (!venue.value) return []
  return priceCategories.filter(pc => pc.venueId === venue.value.id)
})

const priceCategoryColumns = [
  {
    title: 'Категория',
    key: 'name',
    render(row) {
      return h('span', { style: `display: inline-flex; align-items: center; gap: 8px` }, [
        h('span', { style: `width: 12px; height: 12px; border-radius: 50%; background: ${row.color}; display: inline-block` }),
        row.name
      ])
    }
  },
  {
    title: 'Базовая цена',
    key: 'basePrice',
    width: 150,
    render(row) {
      return formatNumber(row.basePrice) + ' \u20BD'
    }
  },
  {
    title: 'Секторов',
    key: 'sectorsCount',
    width: 120
  },
  {
    title: 'Мест',
    key: 'seatsCount',
    width: 120,
    render(row) {
      return row.seatsCount ? formatNumber(row.seatsCount) : '—'
    }
  },
  {
    title: 'Порядок',
    key: 'sortOrder',
    width: 100
  }
]

// Events for this venue
const venueEvents = computed(() => {
  if (!venue.value) return []
  return events.filter(e => e.venue === venue.value.id)
})

const eventColumns = [
  {
    title: 'Название',
    key: 'name'
  },
  {
    title: 'Дата',
    key: 'date',
    width: 120
  },
  {
    title: 'Время',
    key: 'timeStart',
    width: 100,
    render(row) {
      return row.timeStart + (row.timeEnd ? ` — ${row.timeEnd}` : '')
    }
  },
  {
    title: 'Продано',
    key: 'sold',
    width: 130,
    render(row) {
      return `${row.sold} / ${row.capacity}`
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 150,
    render(row) {
      const st = eventStatuses[row.status]
      return h(NTag, { type: eventStatusColorMap[row.status] || 'default', size: 'small', round: true }, () => st ? st.label : row.status)
    }
  }
]

// Mock history
const historyItems = [
  { id: 1, type: 'success', title: 'Объект создан', content: 'Объект добавлен в систему', time: '2024-01-15 10:00' },
  { id: 2, type: 'info', title: 'Обновлены данные', content: 'Изменён адрес и контактная информация', time: '2024-02-20 14:30' },
  { id: 3, type: 'success', title: 'Опубликован', content: 'Объект переведён в статус «Активен»', time: '2024-03-01 09:00' },
  { id: 4, type: 'info', title: 'Загружена карта', content: 'Добавлена SVG-карта зон', time: '2024-03-05 16:45' },
  { id: 5, type: 'warning', title: 'Обновлены ценовые категории', content: 'Добавлена категория «Фан-зона»', time: '2024-03-10 11:20' }
]
</script>
