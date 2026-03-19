<template>
  <div>
    <n-space vertical :size="20">
      <!-- Header -->
      <n-space justify="space-between" align="center">
        <n-space align="center" :size="12">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700">Управление событиями</h2>
          <n-radio-group v-model:value="viewMode" size="small">
            <n-radio-button value="list">Список</n-radio-button>
            <n-radio-button value="calendar">Календарь</n-radio-button>
          </n-radio-group>
        </n-space>
        <n-button type="primary" @click="router.push('/events/create')">Создать событие</n-button>
      </n-space>

      <!-- Filters -->
      <n-card>
        <n-space :size="12" align="center" wrap>
          <n-input
            v-model:value="filters.search"
            placeholder="Поиск по названию..."
            clearable
            style="width: 240px"
          />
          <n-select
            v-model:value="filters.types"
            :options="eventTypeOptions"
            placeholder="Тип события"
            multiple
            clearable
            style="width: 220px"
          />
          <n-select
            v-model:value="filters.statuses"
            :options="statusOptions"
            placeholder="Статус"
            multiple
            clearable
            style="width: 220px"
          />
          <n-date-picker
            v-model:value="filters.dateRange"
            type="daterange"
            clearable
            style="width: 280px"
          />
        </n-space>
      </n-card>

      <template v-if="viewMode === 'list'">
        <n-data-table
          :columns="columns"
          :data="tableData"
          :bordered="false"
          :single-line="false"
          :row-class-name="rowClassName"
          :row-key="row => row._rowKey"
          :pagination="false"
        />

        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 13px; color: #999">Всего: {{ filteredEvents.length }}</span>
          <n-pagination
            v-model:page="currentPage"
            :page-count="pageCount"
            :page-slot="7"
          />
        </div>
      </template>

      <template v-else>
        <n-card>
          <n-space justify="space-between" align="center" style="margin-bottom: 16px">
            <n-space align="center" :size="8">
              <n-button quaternary circle @click="goToPreviousMonth">‹</n-button>
              <div style="font-size: 18px; font-weight: 700; min-width: 180px">{{ visibleMonthLabel }}</div>
              <n-button quaternary circle @click="goToNextMonth">›</n-button>
            </n-space>
            <n-button quaternary @click="goToCurrentMonth">Текущий месяц</n-button>
          </n-space>

          <div class="calendar-grid calendar-grid--head">
            <div v-for="dayName in calendarWeekdays" :key="dayName" class="calendar-head-cell">
              {{ dayName }}
            </div>
          </div>

          <div class="calendar-grid">
            <div
              v-for="day in calendarDays"
              :key="day.key"
              class="calendar-cell"
              :class="{
                'calendar-cell--muted': !day.isCurrentMonth,
                'calendar-cell--today': day.isToday
              }"
            >
              <div class="calendar-cell__date">{{ day.dayNumber }}</div>

              <div v-if="day.events.length === 0" class="calendar-cell__empty">
                —
              </div>

              <div v-else class="calendar-cell__events">
                <button
                  v-for="event in day.events"
                  :key="event.id"
                  type="button"
                  class="calendar-event"
                  :class="`calendar-event--${event.status}`"
                  @click="router.push(`/events/${event.id}`)"
                >
                  <span class="calendar-event__time">{{ event.timeStart }}</span>
                  <span class="calendar-event__name">{{ event.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </n-card>
      </template>
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, NProgress, NButton } from 'naive-ui'
import { events, eventTypes, eventStatuses, filterByVenueContext } from '../../data/mock.js'

const router = useRouter()
const viewMode = ref('list')

const filters = ref({
  search: '',
  types: null,
  statuses: null,
  dateRange: null
})

const currentPage = ref(1)
const pageSize = 20
const calendarWeekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const currentMonthCursor = ref(createMonthCursor())

// Track which date groups are collapsed
const collapsedDates = reactive(new Set())

function toggleCollapse(date) {
  if (collapsedDates.has(date)) {
    collapsedDates.delete(date)
  } else {
    collapsedDates.add(date)
  }
}

const eventTypeOptions = eventTypes.map(t => ({
  label: `${t.icon} ${t.label}`,
  value: t.value
}))

const statusOptions = Object.entries(eventStatuses).map(([value, s]) => ({
  label: s.label,
  value
}))

const eventTypeMap = Object.fromEntries(eventTypes.map(t => [t.value, t]))

const filteredEvents = computed(() => {
  let result = filterByVenueContext(events)

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(e => e.name.toLowerCase().includes(q))
  }

  if (filters.value.types && filters.value.types.length > 0) {
    result = result.filter(e => filters.value.types.includes(e.type))
  }

  if (filters.value.statuses && filters.value.statuses.length > 0) {
    result = result.filter(e => filters.value.statuses.includes(e.status))
  }

  if (filters.value.dateRange) {
    const [start, end] = filters.value.dateRange
    result = result.filter(e => {
      const d = new Date(e.date).getTime()
      return d >= start && d <= end
    })
  }

  result.sort((a, b) => {
    const da = new Date(a.date + 'T' + a.timeStart)
    const db = new Date(b.date + 'T' + b.timeStart)
    return da - db
  })

  return result
})

const pageCount = computed(() => Math.ceil(filteredEvents.value.length / pageSize) || 1)

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEvents.value.slice(start, start + pageSize)
})

const hasMultipleDays = computed(() => {
  const dates = new Set(paginatedEvents.value.map(e => e.date))
  return dates.size > 1
})

function pluralEvents(n) {
  if (n === 1) return 'событие'
  if (n >= 2 && n <= 4) return 'события'
  return 'событий'
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function createMonthCursor(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isSameDay(left, right) {
  return toDateKey(left) === toDateKey(right)
}

function goToPreviousMonth() {
  currentMonthCursor.value = new Date(
    currentMonthCursor.value.getFullYear(),
    currentMonthCursor.value.getMonth() - 1,
    1
  )
}

function goToNextMonth() {
  currentMonthCursor.value = new Date(
    currentMonthCursor.value.getFullYear(),
    currentMonthCursor.value.getMonth() + 1,
    1
  )
}

function goToCurrentMonth() {
  currentMonthCursor.value = createMonthCursor()
}

const visibleMonthLabel = computed(() =>
  currentMonthCursor.value.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  })
)

const eventsByDate = computed(() => {
  const grouped = new Map()

  for (const event of filteredEvents.value) {
    if (!grouped.has(event.date)) grouped.set(event.date, [])
    grouped.get(event.date).push(event)
  }

  return grouped
})

const calendarDays = computed(() => {
  const cursor = currentMonthCursor.value
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
  const startOffset = (start.getDay() + 6) % 7
  const gridStart = new Date(start)
  gridStart.setDate(start.getDate() - startOffset)

  const endOffset = 6 - ((end.getDay() + 6) % 7)
  const gridEnd = new Date(end)
  gridEnd.setDate(end.getDate() + endOffset)

  const days = []
  const today = new Date()

  for (let day = new Date(gridStart); day <= gridEnd; day.setDate(day.getDate() + 1)) {
    const copy = new Date(day)
    const key = toDateKey(copy)
    days.push({
      key,
      dayNumber: copy.getDate(),
      isCurrentMonth: copy.getMonth() === cursor.getMonth(),
      isToday: isSameDay(copy, today),
      events: eventsByDate.value.get(key) || [],
    })
  }

  return days
})

// Build flat data: separator rows only for dates with 2+ events
const tableData = computed(() => {
  if (!hasMultipleDays.value) {
    return paginatedEvents.value.map(e => ({ ...e, _rowKey: `evt-${e.id}` }))
  }

  // Count events per date
  const dateCounts = {}
  for (const evt of paginatedEvents.value) {
    dateCounts[evt.date] = (dateCounts[evt.date] || 0) + 1
  }

  const rows = []
  let currentDate = null

  for (const evt of paginatedEvents.value) {
    if (evt.date !== currentDate) {
      currentDate = evt.date
      const count = dateCounts[evt.date]

      // Only add separator for days with 2+ events
      if (count >= 2) {
        const d = new Date(evt.date)
        const dayOfWeek = d.toLocaleDateString('ru-RU', { weekday: 'short' })
        const dateStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
        const isCollapsed = collapsedDates.has(evt.date)
        rows.push({
          _isSeparator: true,
          _rowKey: `sep-${evt.date}`,
          _date: evt.date,
          _dateLabel: `${dayOfWeek}, ${dateStr}`,
          _eventCount: `${count} ${pluralEvents(count)}`,
          _isCollapsed: isCollapsed,
        })
      }
    }

    // Skip event rows if their day group is collapsed
    const count = dateCounts[evt.date]
    if (count >= 2 && collapsedDates.has(evt.date)) {
      continue
    }

    // For single-event days, mark it so we show date in the time column
    rows.push({
      ...evt,
      _rowKey: `evt-${evt.id}`,
      _showDate: count === 1,
    })
  }
  return rows
})

function rowClassName(row) {
  if (row._isSeparator) return 'row-day-separator'
  if (row.status === 'completed' || row.status === 'cancelled') return 'row-dimmed'
  return ''
}

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

const columns = [
  {
    title: 'Название',
    key: 'name',
    render(row) {
      if (row._isSeparator) {
        const chevron = row._isCollapsed ? '▸' : '▾'
        return h('div', {
          style: 'display: flex; align-items: center; gap: 8px; padding: 2px 0; cursor: pointer; user-select: none',
          onClick: () => toggleCollapse(row._date)
        }, [
          h('span', { style: 'font-size: 11px; color: #999; width: 12px' }, chevron),
          h('span', { style: 'font-weight: 600; font-size: 13px; color: #333; text-transform: capitalize' }, row._dateLabel),
          h('span', { style: 'font-size: 12px; color: #999' }, row._eventCount),
        ])
      }
      const typeInfo = eventTypeMap[row.type]
      const icon = typeInfo ? typeInfo.icon : ''
      return h(
        'a',
        {
          style: 'cursor: pointer; color: inherit; text-decoration: none; display: flex; align-items: center; gap: 8px',
          onClick: () => router.push(`/events/${row.id}`)
        },
        [
          h('span', { style: 'font-size: 16px' }, icon),
          h('span', { style: 'font-weight: 500' }, row.name)
        ]
      )
    }
  },
  {
    title: 'Тип',
    key: 'type',
    width: 160,
    render(row) {
      if (row._isSeparator) return null
      const typeInfo = eventTypeMap[row.type]
      return typeInfo ? typeInfo.label : row.type
    }
  },
  {
    title: 'Дата / Время',
    key: 'time',
    width: 140,
    render(row) {
      if (row._isSeparator) return null
      const timeStr = row.timeEnd ? `${row.timeStart}–${row.timeEnd}` : row.timeStart
      // If single event on this day, show date too
      if (row._showDate) {
        return h('div', [
          h('div', { style: 'font-weight: 500' }, formatDateShort(row.date)),
          h('div', { style: 'color: #999; font-size: 12px' }, timeStr)
        ])
      }
      return h('span', { style: 'font-weight: 500' }, timeStr)
    }
  },
  {
    title: 'Заполнение',
    key: 'capacity',
    width: 180,
    render(row) {
      if (row._isSeparator) return null
      const pct = Math.round((row.sold / row.capacity) * 100)
      return h('div', { style: 'min-width: 120px' }, [
        h('div', { style: 'font-size: 12px; margin-bottom: 4px' },
          `${formatNumber(row.sold)} / ${formatNumber(row.capacity)} (${pct}%)`
        ),
        h(NProgress, {
          type: 'line',
          percentage: pct,
          showIndicator: false,
          status: pct >= 90 ? 'success' : pct >= 50 ? 'default' : 'warning'
        })
      ])
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 140,
    render(row) {
      if (row._isSeparator) return null
      const s = eventStatuses[row.status]
      if (!s) return row.status
      return h(NTag, { type: s.type, size: 'small', round: true }, { default: () => s.label })
    }
  }
]
</script>

<style>
.row-dimmed td {
  opacity: 0.5;
}
.row-day-separator td {
  background: #f8f8fa !important;
  border-bottom: none !important;
  padding-top: 6px !important;
  padding-bottom: 4px !important;
}
.row-day-separator:hover td {
  background: #f0f0f2 !important;
  cursor: pointer;
}
</style>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.calendar-grid--head {
  margin-bottom: 10px;
}

.calendar-head-cell {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0 4px;
}

.calendar-cell {
  min-height: 148px;
  background: #fff;
  border: 1px solid #eceef3;
  border-radius: 16px;
  padding: 12px;
}

.calendar-cell--muted {
  background: #f8fafc;
}

.calendar-cell--today {
  border-color: #1a56ff;
  box-shadow: 0 0 0 1px rgba(26, 86, 255, 0.08);
}

.calendar-cell__date {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
}

.calendar-cell__empty {
  font-size: 13px;
  color: #c0c4cc;
}

.calendar-cell__events {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendar-event {
  border: none;
  width: 100%;
  text-align: left;
  border-radius: 12px;
  padding: 9px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calendar-event__time {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.75;
}

.calendar-event__name {
  font-size: 12px;
  line-height: 1.35;
  font-weight: 600;
}

.calendar-event--published {
  background: #ecfdf3;
  color: #0f7b47;
}

.calendar-event--draft {
  background: #f3f4f6;
  color: #4b5563;
}

.calendar-event--paused {
  background: #fff7ed;
  color: #b45309;
}

.calendar-event--completed {
  background: #eff6ff;
  color: #1d4ed8;
}

.calendar-event--cancelled {
  background: #fef2f2;
  color: #b91c1c;
}
</style>
