<template>
  <div v-if="order">
    <!-- Header -->
    <n-page-header
      :title="`Заказ #${order.id}`"
      @back="router.push('/sales/orders')"
      style="margin-bottom: 24px"
    >
      <template #subtitle>
        <n-space align="center" :size="12">
          <n-tag :type="statusInfo.type" size="small" :bordered="false">{{ statusInfo.label }}</n-tag>
          <span style="color: #999; font-size: 13px">{{ formatDate(order.date) }}</span>
          <span style="color: #999; font-size: 13px">{{ order.channel }}</span>
        </n-space>
      </template>
      <template #extra>
        <n-space>
          <n-button size="small">Печать</n-button>
          <n-button size="small">Отправить билеты</n-button>
          <n-button size="small">Добавить комментарий</n-button>
        </n-space>
      </template>
    </n-page-header>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px">
      <!-- Customer Info -->
      <n-card title="Клиент" size="small">
        <template #header-extra>
          <n-tag :bordered="false" :type="segmentTagType(order.customer.segment)" size="small">
            {{ order.customer.segment }}
          </n-tag>
        </template>
        <n-descriptions :column="1" label-placement="left" size="small" bordered>
          <n-descriptions-item label="Имя">
            <span style="font-weight: 500">{{ order.customer.name }}</span>
          </n-descriptions-item>
          <n-descriptions-item label="Телефон">{{ order.customer.phone }}</n-descriptions-item>
          <n-descriptions-item label="Email">{{ order.customer.email }}</n-descriptions-item>
          <n-descriptions-item label="Всего заказов">
            <n-tag size="small" :bordered="false">{{ order.customer.ordersTotal }}</n-tag>
          </n-descriptions-item>
        </n-descriptions>
        <n-space style="margin-top: 12px" :size="8">
          <n-button size="tiny" secondary @click="router.push('/sales/orders')">Все заказы клиента</n-button>
          <n-button v-if="linkedGuest" size="tiny" secondary @click="router.push(`/crm/guests/${linkedGuest.id}`)">Профиль гостя</n-button>
        </n-space>
      </n-card>

      <!-- Order Composition -->
      <n-card title="Состав заказа" size="small">
        <n-descriptions :column="1" label-placement="left" size="small" bordered>
          <n-descriptions-item label="Билеты">
            {{ order.ticketsCount }} шт.
          </n-descriptions-item>
          <n-descriptions-item label="Услуги">
            {{ order.servicesCount }} шт.
          </n-descriptions-item>
          <n-descriptions-item v-if="order.promoCode" label="Промокод">
            <n-tag type="info" size="small" :bordered="false">{{ order.promoCode }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item v-if="order.discount > 0" label="Скидка">
            <span style="color: #d03050; font-weight: 500">-{{ formatMoney(order.discount) }}</span>
          </n-descriptions-item>
        </n-descriptions>
        <n-divider style="margin: 12px 0" />
        <div v-if="order.discount > 0" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px">
          <span style="font-size: 13px; color: #999">До скидки</span>
          <span style="font-size: 13px; color: #999; text-decoration: line-through">{{ formatMoney(order.total + order.discount) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 15px; font-weight: 500">Итого</span>
          <n-statistic :value="order.total" style="text-align: right">
            <template #suffix> &#8381;</template>
          </n-statistic>
        </div>
      </n-card>
    </div>

    <!-- Tickets + Services Table -->
    <n-card title="Билеты и услуги" size="small" style="margin-bottom: 24px">
      <template #header-extra>
        <n-space :size="8" align="center">
          <span v-if="checkedRows.length > 0" style="font-size: 13px; color: #666">
            Выбрано: {{ checkedRows.length }}
          </span>
          <n-button
            v-if="checkedRows.length > 0"
            type="error"
            size="small"
            ghost
            @click="handlePartialRefund"
          >
            Возврат выбранных ({{ formatMoney(checkedTotal) }})
          </n-button>
        </n-space>
      </template>
      <n-data-table
        :columns="unifiedColumns"
        :data="unifiedRows"
        :row-key="row => row._rowKey"
        :checked-row-keys="checkedRows"
        @update:checked-row-keys="handleCheck"
        :bordered="false"
        size="small"
        :row-class-name="unifiedRowClassName"
      />
    </n-card>

    <!-- Addon Orders (purchased later) -->
    <n-card v-if="orderAddons.length > 0" title="Докупленные услуги" size="small" style="margin-bottom: 24px">
      <template #header-extra>
        <n-tag :bordered="false" type="warning" size="small">Отдельные заказы</n-tag>
      </template>
      <n-data-table
        :columns="addonColumns"
        :data="orderAddons"
        :row-key="row => row.id"
        :bordered="false"
        size="small"
      />
    </n-card>

    <!-- Payment Info -->
    <n-card title="Оплата" size="small" style="margin-bottom: 24px">
      <n-descriptions :column="2" label-placement="left" size="small" bordered>
        <n-descriptions-item label="Способ оплаты">
          {{ order.paymentMethod || 'Не оплачен' }}
        </n-descriptions-item>
        <n-descriptions-item label="Статус">
          <n-tag :type="statusInfo.type" size="small" :bordered="false">{{ statusInfo.label }}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="Сумма">
          <span style="font-weight: 600">{{ formatMoney(order.total) }}</span>
        </n-descriptions-item>
        <n-descriptions-item label="Канал">{{ order.channel }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <!-- Action Buttons -->
    <n-card size="small" style="margin-bottom: 24px">
      <n-space>
        <n-button type="error" ghost>Возврат заказа</n-button>
        <n-button type="warning" ghost :disabled="checkedRows.length === 0" @click="handlePartialRefund">Возврат выбранных</n-button>
        <n-button secondary>Перенос</n-button>
        <n-button secondary>Отправить билеты</n-button>
        <n-button secondary>Печать</n-button>
        <n-button secondary>Добавить комментарий</n-button>
      </n-space>
    </n-card>

    <!-- History Timeline -->
    <n-card title="История" size="small">
      <n-timeline>
        <n-timeline-item
          v-for="item in orderHistory"
          :key="item.id"
          :type="item.type"
          :title="item.title"
          :content="item.content"
          :time="item.time"
        />
      </n-timeline>
    </n-card>
  </div>

  <div v-else style="padding: 60px; text-align: center">
    <n-card>
      <p style="font-size: 16px; color: #999">Заказ не найден</p>
      <n-button type="primary" @click="router.push('/sales/orders')" style="margin-top: 12px">
        Вернуться к списку заказов
      </n-button>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTag, NButton } from 'naive-ui'
import { orders, orderStatuses, tickets, ticketStatuses, orderServices, addonOrders, guests } from '../../data/mock.js'

const router = useRouter()
const route = useRoute()

const order = computed(() => {
  const id = Number(route.params.id)
  return orders.find(o => o.id === id) || null
})

const statusInfo = computed(() => {
  if (!order.value) return { label: '', type: 'default' }
  return orderStatuses[order.value.status] || { label: order.value.status, type: 'default' }
})

const orderTickets = computed(() => {
  if (!order.value) return []
  return tickets.filter(t => t.orderId === order.value.id)
})

const orderSvcs = computed(() => {
  if (!order.value) return []
  return orderServices.filter(s => s.orderId === order.value.id)
})

const orderAddons = computed(() => {
  if (!order.value) return []
  return addonOrders.filter(a => a.parentOrderId === order.value.id)
})

const linkedGuest = computed(() => {
  if (!order.value) return null
  return guests.find(g => g.name === order.value.customer.name && g.phone === order.value.customer.phone) || null
})

// --- Unified rows: tickets + services grouped ---
const unifiedRows = computed(() => {
  const rows = []
  for (const ticket of orderTickets.value) {
    // Ticket row
    rows.push({
      _rowKey: `ticket-${ticket.id}`,
      _type: 'ticket',
      _refundable: ticket.status === 'active' || ticket.status === 'used',
      ...ticket,
      _price: ticket.price,
    })
    // Services for this ticket
    const svcs = orderSvcs.value.filter(s => s.ticketId === ticket.id)
    for (const svc of svcs) {
      rows.push({
        _rowKey: `svc-${svc.id}`,
        _type: 'service',
        _refundable: true,
        _parentTicketId: svc.ticketId,
        id: svc.id,
        service: svc.service,
        icon: svc.icon,
        qty: svc.qty,
        unitPrice: svc.unitPrice,
        _price: svc.total,
        status: 'active',
      })
    }
  }
  return rows
})

// --- Checkboxes for partial refund ---
const checkedRows = ref([])

function handleCheck(keys) {
  // Only allow checking refundable rows
  checkedRows.value = keys.filter(key => {
    const row = unifiedRows.value.find(r => r._rowKey === key)
    return row && row._refundable
  })
}

const checkedTotal = computed(() => {
  return checkedRows.value.reduce((sum, key) => {
    const row = unifiedRows.value.find(r => r._rowKey === key)
    return sum + (row ? row._price : 0)
  }, 0)
})

function handlePartialRefund() {
  const count = checkedRows.value.length
  window.$message?.warning(`Возврат ${count} позиций на сумму ${formatMoney(checkedTotal.value)} (демо)`)
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatMoney(val) {
  return val.toLocaleString('ru-RU') + ' \u20BD'
}

function segmentTagType(segment) {
  const map = {
    'VIP': 'error',
    'Постоянный клиент': 'success',
    'Новый': 'info',
    'Корпоративный': 'warning'
  }
  return map[segment] || 'default'
}

function unifiedRowClassName(row) {
  if (row._type === 'service') return 'row-service-indent'
  return ''
}

// --- Unified columns ---
const unifiedColumns = [
  {
    type: 'selection',
    disabled(row) {
      return !row._refundable
    }
  },
  {
    title: 'Позиция',
    key: 'name',
    render(row) {
      if (row._type === 'ticket') {
        return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
          h(NButton, {
            text: true, type: 'primary', size: 'small',
            onClick: () => router.push(`/sales/tickets/${row.id}`)
          }, { default: () => row.id }),
          h('span', { style: 'color: #666; font-size: 12px' }, `${row.tariff} / ${row.ticketType}`)
        ])
      }
      // service
      return h('div', { style: 'display: flex; align-items: center; gap: 6px; padding-left: 20px' }, [
        h('span', { style: 'font-size: 14px' }, row.icon),
        h('span', { style: 'font-size: 13px; color: #555' }, row.service),
        row.qty > 1 ? h('span', { style: 'font-size: 12px; color: #999' }, `×${row.qty}`) : null,
      ])
    }
  },
  {
    title: 'Событие',
    key: 'event',
    ellipsis: { tooltip: true },
    width: 180,
    render(row) {
      if (row._type === 'service') return null
      return h('span', { style: 'font-size: 13px' }, row.event)
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 140,
    render(row) {
      if (row._type === 'service') return null
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
      if (row._type === 'service') return null
      return row.entry || '\u2014'
    }
  },
  {
    title: 'Выход',
    key: 'exit',
    width: 80,
    render(row) {
      if (row._type === 'service') return null
      return row.exit || '\u2014'
    }
  },
  {
    title: 'Сумма',
    key: 'price',
    width: 120,
    align: 'right',
    render(row) {
      return h('span', { style: { fontWeight: row._type === 'ticket' ? 600 : 400, color: row._type === 'service' ? '#666' : undefined } }, formatMoney(row._price))
    }
  },
]

// --- Addon columns ---
const addonColumns = [
  {
    title: '# Заказ',
    key: 'id',
    width: 100,
    render(row) {
      return h(NButton, {
        text: true, type: 'primary', size: 'small',
        onClick: () => router.push(`/sales/orders/${row.id}`)
      }, { default: () => `#${row.id}` })
    }
  },
  {
    title: 'Услуга',
    key: 'service',
    render(row) {
      return h('div', { style: 'display: flex; align-items: center; gap: 6px' }, [
        h('span', { style: 'font-size: 14px' }, row.icon),
        h('span', { style: 'font-weight: 500' }, row.service),
        row.qty > 1 ? h('span', { style: 'font-size: 12px; color: #999' }, `×${row.qty}`) : null,
      ])
    }
  },
  {
    title: 'К билету',
    key: 'ticketId',
    width: 140,
    render(row) {
      return h(NButton, {
        text: true, type: 'primary', size: 'small',
        onClick: () => router.push(`/sales/tickets/${row.ticketId}`)
      }, { default: () => row.ticketId })
    }
  },
  {
    title: 'Дата',
    key: 'date',
    width: 150,
    render(row) {
      return formatDate(row.date)
    }
  },
  {
    title: 'Сумма',
    key: 'total',
    width: 120,
    align: 'right',
    render(row) {
      return h('span', { style: { fontWeight: 500 } }, formatMoney(row.total))
    }
  },
  {
    title: 'Статус',
    key: 'status',
    width: 120,
    render(row) {
      const st = orderStatuses[row.status]
      if (!st) return row.status
      return h(NTag, { type: st.type, size: 'small', bordered: false }, { default: () => st.label })
    }
  },
]

// --- History (mock) ---
const orderHistory = computed(() => {
  if (!order.value) return []
  const items = [
    {
      id: 1,
      type: 'success',
      title: 'Заказ создан',
      content: `Клиент ${order.value.customer.name} оформил заказ через канал "${order.value.channel}"`,
      time: formatDate(order.value.date)
    },
  ]

  if (order.value.status === 'paid' || order.value.status === 'partial_refund') {
    const payDate = new Date(new Date(order.value.date).getTime() + 120000)
    items.push({
      id: 2,
      type: 'success',
      title: 'Оплата получена',
      content: `${order.value.paymentMethod}, сумма ${formatMoney(order.value.total)}`,
      time: formatDate(payDate.toISOString())
    })
  }

  if (order.value.status === 'paid' || order.value.status === 'partial_refund') {
    const sendDate = new Date(new Date(order.value.date).getTime() + 180000)
    items.push({
      id: 3,
      type: 'info',
      title: 'Билеты отправлены',
      content: `Отправлено на ${order.value.customer.email}`,
      time: formatDate(sendDate.toISOString())
    })
  }

  if (order.value.status === 'partial_refund') {
    const refDate = new Date(new Date(order.value.date).getTime() + 86400000)
    items.push({
      id: 4,
      type: 'warning',
      title: 'Частичный возврат',
      content: `Возвращён 1 билет, сумма ${formatMoney(order.value.discount || 0)}`,
      time: formatDate(refDate.toISOString())
    })
  }

  if (order.value.status === 'refunded') {
    const refDate = new Date(new Date(order.value.date).getTime() + 86400000)
    items.push({
      id: 5,
      type: 'error',
      title: 'Полный возврат',
      content: `Возврат всех билетов, сумма ${formatMoney(order.value.total)}`,
      time: formatDate(refDate.toISOString())
    })
  }

  // Addon order history
  for (const addon of orderAddons.value) {
    items.push({
      id: 100 + addon.id,
      type: 'info',
      title: `Докуплена услуга: ${addon.service}`,
      content: `К билету ${addon.ticketId}, ${formatMoney(addon.total)}, канал "${addon.channel}"`,
      time: formatDate(addon.date)
    })
  }

  return items
})
</script>

<style>
.row-service-indent td:first-child {
  padding-left: 28px !important;
}
.row-service-indent td {
  background: #fafafa !important;
}
</style>
