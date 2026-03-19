<template>
  <div v-if="guest">
    <!-- Header -->
    <n-page-header
      :title="guest.name"
      @back="router.push('/crm/guests')"
      style="margin-bottom: 24px"
    >
      <template #subtitle>
        <n-space align="center" :size="12">
          <n-tag :type="segmentTagType(guest.segment)" size="small" :bordered="false" round>
            {{ guest.segment }}
          </n-tag>
          <span style="color: #999; font-size: 13px">Клиент с {{ formatDateShort(guest.registeredAt) }}</span>
        </n-space>
      </template>
      <template #extra>
        <n-space>
          <n-button size="small" secondary>Изменить сегмент</n-button>
          <n-button size="small" secondary>Добавить заметку</n-button>
        </n-space>
      </template>
    </n-page-header>

    <!-- Profile + Metrics Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px">
      <!-- Contact Info -->
      <n-card title="Контактная информация" size="small">
        <template #header-extra>
          <n-tag :type="segmentTagType(guest.segment)" size="small" :bordered="false" round>
            {{ guest.segment }}
          </n-tag>
        </template>
        <n-descriptions :column="1" label-placement="left" size="small" bordered>
          <n-descriptions-item label="Имя">
            <span style="font-weight: 500">{{ guest.name }}</span>
          </n-descriptions-item>
          <n-descriptions-item label="Телефон">
            <span style="font-family: monospace">{{ guest.phone }}</span>
          </n-descriptions-item>
          <n-descriptions-item label="Email">{{ guest.email }}</n-descriptions-item>
          <n-descriptions-item label="Дата регистрации">{{ formatDateShort(guest.registeredAt) }}</n-descriptions-item>
          <n-descriptions-item label="Последний визит">
            <span v-if="guest.lastVisit">{{ formatDateShort(guest.lastVisit) }}</span>
            <span v-else style="color: #ccc">Нет визитов</span>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- Business Metrics -->
      <n-card title="Бизнес-показатели" size="small">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
          <div class="metric-box">
            <div class="metric-label">Всего заказов</div>
            <div class="metric-value">{{ guest.ordersCount }}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Сумма расходов</div>
            <div class="metric-value">{{ formatMoney(guest.totalSpent) }}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Средний чек</div>
            <div class="metric-value">{{ guest.ordersCount > 0 ? formatMoney(Math.round(guest.totalSpent / guest.ordersCount)) : '—' }}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Частота визитов</div>
            <div class="metric-value">
              {{ visitFrequency }}
              <span class="metric-suffix">в мес.</span>
            </div>
          </div>
        </div>
        <n-divider style="margin: 16px 0 12px" />
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 13px; color: #999">Активность:</span>
          <n-progress
            type="line"
            :percentage="activityPercentage"
            :indicator-placement="'inside'"
            :height="18"
            :border-radius="4"
            style="flex: 1"
          />
        </div>
      </n-card>
    </div>

    <!-- Orders Table -->
    <n-card title="История заказов" size="small" style="margin-bottom: 24px">
      <template #header-extra>
        <n-tag :bordered="false" type="info" size="small">{{ guestOrders.length }}</n-tag>
      </template>
      <n-data-table
        v-if="guestOrders.length > 0"
        :columns="orderColumns"
        :data="guestOrders"
        :row-key="row => row.id"
        :row-props="getOrderRowProps"
        :bordered="false"
        size="small"
        striped
      />
      <n-empty v-else description="Нет заказов" style="padding: 24px 0" />
    </n-card>

    <!-- Tickets Table -->
    <n-card title="Билеты" size="small" style="margin-bottom: 24px">
      <template #header-extra>
        <n-tag :bordered="false" type="info" size="small">{{ guestTickets.length }}</n-tag>
      </template>
      <n-data-table
        v-if="guestTickets.length > 0"
        :columns="ticketColumns"
        :data="guestTickets"
        :row-key="row => row.id"
        :row-props="getTicketRowProps"
        :bordered="false"
        size="small"
        striped
      />
      <n-empty v-else description="Нет билетов" style="padding: 24px 0" />
    </n-card>
  </div>

  <div v-else style="padding: 60px; text-align: center">
    <n-card>
      <p style="font-size: 16px; color: #999">Гость не найден</p>
      <n-button type="primary" @click="router.push('/crm/guests')" style="margin-top: 12px">
        Вернуться к списку гостей
      </n-button>
    </n-card>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTag, NButton } from 'naive-ui'
import { guests, orders, tickets, orderStatuses, ticketStatuses } from '../../data/mock.js'

const router = useRouter()
const route = useRoute()

const guest = computed(() => {
  const id = Number(route.params.id)
  return guests.find(g => g.id === id) || null
})

// --- Business Metrics ---
const visitFrequency = computed(() => {
  if (!guest.value || !guest.value.registeredAt) return '—'
  const regDate = new Date(guest.value.registeredAt)
  const now = new Date()
  const months = Math.max(1, (now.getFullYear() - regDate.getFullYear()) * 12 + now.getMonth() - regDate.getMonth())
  const freq = guest.value.ordersCount / months
  return freq >= 1 ? freq.toFixed(1) : freq.toFixed(2)
})

const activityPercentage = computed(() => {
  if (!guest.value) return 0
  // Simple activity score based on orders and recency
  const ordersScore = Math.min(guest.value.ordersCount / 20, 1) * 50
  const recencyScore = guest.value.lastVisit
    ? Math.max(0, 50 - Math.floor((Date.now() - new Date(guest.value.lastVisit).getTime()) / (86400000 * 7)) * 5)
    : 0
  return Math.min(100, Math.round(ordersScore + recencyScore))
})

// --- Guest Orders ---
const guestOrders = computed(() => {
  if (!guest.value) return []
  return orders.filter(o =>
    o.customer.name === guest.value.name && o.customer.phone === guest.value.phone
  )
})

// --- Guest Tickets ---
const guestTickets = computed(() => {
  if (!guest.value) return []
  return tickets.filter(t => t.customer === guest.value.name)
})

// --- Formatters ---
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatMoney(val) {
  return val.toLocaleString('ru-RU') + ' \u20BD'
}

function segmentTagType(segment) {
  const map = {
    'VIP': 'error',
    'Постоянный клиент': 'success',
    'Новый': 'info',
    'Корпоративный': 'warning',
    'Абонемент': 'default'
  }
  return map[segment] || 'default'
}

// --- Order Columns ---
const orderColumns = [
  {
    title: '# Заказ',
    key: 'id',
    width: 110,
    render(row) {
      return h(NButton, {
        text: true, type: 'primary', strong: true, size: 'small',
        onClick: (e) => { e.stopPropagation(); router.push(`/sales/orders/${row.id}`) }
      }, { default: () => `#${row.id}` })
    }
  },
  {
    title: 'Дата',
    key: 'date',
    width: 150,
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
    render(row) { return formatDate(row.date) }
  },
  {
    title: 'Событие',
    key: 'event',
    ellipsis: { tooltip: true },
    width: 220
  },
  {
    title: 'Билеты',
    key: 'ticketsCount',
    width: 80,
    align: 'center'
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
    title: 'Статус',
    key: 'status',
    width: 160,
    render(row) {
      const st = orderStatuses[row.status]
      if (!st) return row.status
      return h(NTag, { type: st.type, size: 'small', bordered: false }, { default: () => st.label })
    }
  },
  {
    title: 'Канал',
    key: 'channel',
    width: 120,
    render(row) {
      return h('span', { style: { fontSize: '13px' } }, row.channel)
    }
  },
]

// --- Ticket Columns ---
const ticketColumns = [
  {
    title: '# Билет',
    key: 'id',
    width: 130,
    render(row) {
      return h(NButton, {
        text: true, type: 'primary', strong: true, size: 'small',
        onClick: (e) => { e.stopPropagation(); router.push(`/sales/tickets/${row.id}`) }
      }, { default: () => row.id })
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
    render(row) { return row.ticketType || '\u2014' }
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
    title: 'Цена',
    key: 'price',
    width: 110,
    align: 'right',
    render(row) {
      return h('span', { style: { fontWeight: 500 } }, formatMoney(row.price))
    }
  },
]

// --- Row Click ---
function getOrderRowProps(row) {
  return {
    style: 'cursor: pointer',
    onClick: () => router.push(`/sales/orders/${row.id}`)
  }
}

function getTicketRowProps(row) {
  return {
    style: 'cursor: pointer',
    onClick: () => router.push(`/sales/tickets/${row.id}`)
  }
}
</script>

<style scoped>
.metric-box {
  background: #f9f9fb;
  border-radius: 8px;
  padding: 12px 16px;
}
.metric-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}
.metric-suffix {
  font-size: 12px;
  font-weight: 400;
  color: #999;
}
</style>
