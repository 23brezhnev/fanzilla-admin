<template>
  <div v-if="ticket">
    <!-- Header -->
    <n-page-header
      :title="ticket.id"
      @back="router.push('/sales/tickets')"
      style="margin-bottom: 24px"
    >
      <template #subtitle>
        <n-space align="center" :size="12">
          <n-tag :type="statusInfo.type" size="small" :bordered="false">{{ statusInfo.label }}</n-tag>
          <n-tag size="small" :bordered="false">{{ ticket.tariff }}</n-tag>
          <span style="color: #999; font-size: 13px">Заказ #{{ ticket.orderId }}</span>
        </n-space>
      </template>
      <template #extra>
        <n-space>
          <n-button size="small" secondary>Печать</n-button>
          <n-button size="small" secondary>Переотправить</n-button>
        </n-space>
      </template>
    </n-page-header>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px; margin-bottom: 24px">
      <!-- QR Code Placeholder -->
      <n-card size="small">
        <div style="
          width: 100%;
          aspect-ratio: 1;
          background: #f0f0f0;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 13px;
          gap: 8px;
        ">
          <div style="
            width: 160px;
            height: 160px;
            background: #e0e0e0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 11px;
            color: #888;
          ">
            QR-код
          </div>
          <span style="font-weight: 600; color: #333; font-family: monospace">{{ ticket.id }}</span>
        </div>
      </n-card>

      <!-- Ticket Info -->
      <div style="display: flex; flex-direction: column; gap: 16px">
        <!-- Event Info -->
        <n-card title="Событие" size="small">
          <n-descriptions :column="2" label-placement="left" size="small" bordered>
            <n-descriptions-item label="Название">
              <span style="font-weight: 500">{{ ticket.event }}</span>
            </n-descriptions-item>
            <n-descriptions-item label="Тип">
              <n-tag size="small" :bordered="false">{{ eventTypeLabel }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item v-if="ticket.sector" label="Сектор">{{ ticket.sector }}</n-descriptions-item>
            <n-descriptions-item v-if="ticket.row" label="Ряд">{{ ticket.row }}</n-descriptions-item>
            <n-descriptions-item v-if="ticket.seat" label="Место">{{ ticket.seat }}</n-descriptions-item>
          </n-descriptions>
        </n-card>

        <!-- Tariff & Price -->
        <n-card title="Тариф и стоимость" size="small">
          <n-descriptions :column="2" label-placement="left" size="small" bordered>
            <n-descriptions-item label="Тариф">
              <n-tag size="small" :bordered="false">{{ ticket.tariff }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Тип билета">
              {{ ticket.ticketType || '\u2014' }}
            </n-descriptions-item>
            <n-descriptions-item label="Цена">
              <span style="font-weight: 600; font-size: 15px">{{ formatMoney(ticket.price) }}</span>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>
    </div>

    <!-- Customer Info -->
    <n-card title="Клиент" size="small" style="margin-bottom: 24px">
      <n-descriptions :column="3" label-placement="left" size="small" bordered>
        <n-descriptions-item label="Имя">
          <span style="font-weight: 500">{{ ticket.customer }}</span>
        </n-descriptions-item>
        <n-descriptions-item label="Заказ">
          <n-button text type="primary" size="small" @click="router.push(`/sales/orders/${ticket.orderId}`)">
            #{{ ticket.orderId }}
          </n-button>
        </n-descriptions-item>
        <n-descriptions-item label="Все билеты клиента">
          <n-button text type="primary" size="small" @click="goToCustomerTickets">
            Посмотреть
          </n-button>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <!-- Entry / Exit Log -->
    <n-card title="Журнал проходов" size="small" style="margin-bottom: 24px">
      <div v-if="ticket.entry || ticket.exit">
        <n-descriptions :column="2" label-placement="left" size="small" bordered>
          <n-descriptions-item label="Вход">
            <n-tag v-if="ticket.entry" type="success" size="small" :bordered="false">{{ ticket.entry }}</n-tag>
            <span v-else style="color: #ccc">&mdash;</span>
          </n-descriptions-item>
          <n-descriptions-item label="Выход">
            <n-tag v-if="ticket.exit" type="info" size="small" :bordered="false">{{ ticket.exit }}</n-tag>
            <span v-else style="color: #ccc">&mdash;</span>
          </n-descriptions-item>
        </n-descriptions>
      </div>
      <div v-else style="color: #999; font-size: 13px; padding: 8px 0">
        Проходы не зафиксированы
      </div>
    </n-card>

    <!-- Services -->
    <n-card title="Услуги" size="small" style="margin-bottom: 24px">
      <div v-if="ticketServices.length > 0">
        <div
          v-for="svc in ticketServices"
          :key="svc.id"
          style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0"
        >
          <n-space align="center" :size="8">
            <span>{{ svc.item }}</span>
          </n-space>
          <n-tag :type="rentalStatusType(svc.status)" size="small" :bordered="false">
            {{ rentalStatusLabel(svc.status) }}
          </n-tag>
        </div>
      </div>
      <div v-else style="color: #999; font-size: 13px; padding: 8px 0">
        Нет привязанных услуг
      </div>
    </n-card>

    <!-- Action Buttons -->
    <n-card size="small" style="margin-bottom: 24px">
      <n-space>
        <n-button type="error" ghost>Возврат</n-button>
        <n-button type="warning" ghost>Перенос</n-button>
        <n-button secondary>Заблокировать</n-button>
        <n-button secondary>Переотправить</n-button>
        <n-button secondary>Ручной проход</n-button>
        <n-button secondary>Печать</n-button>
      </n-space>
    </n-card>

    <!-- History Timeline -->
    <n-card title="История" size="small">
      <n-timeline>
        <n-timeline-item
          v-for="item in ticketHistory"
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
      <p style="font-size: 16px; color: #999">Билет не найден</p>
      <n-button type="primary" @click="router.push('/sales/tickets')" style="margin-top: 12px">
        Вернуться к списку билетов
      </n-button>
    </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { tickets, ticketStatuses, rentalItems } from '../../data/mock.js'

const router = useRouter()
const route = useRoute()

const ticket = computed(() => {
  const id = route.params.id
  return tickets.find(t => t.id === id) || null
})

const statusInfo = computed(() => {
  if (!ticket.value) return { label: '', type: 'default' }
  return ticketStatuses[ticket.value.status] || { label: ticket.value.status, type: 'default' }
})

const eventTypeLabel = computed(() => {
  if (!ticket.value) return ''
  const map = {
    session: 'Сеанс',
    match: 'Матч',
    standard: 'Стандартное'
  }
  return map[ticket.value.eventType] || ticket.value.eventType
})

const ticketServices = computed(() => {
  if (!ticket.value) return []
  return rentalItems.filter(r => r.ticketId === ticket.value.id)
})

function formatMoney(val) {
  return val.toLocaleString('ru-RU') + ' \u20BD'
}

function rentalStatusType(status) {
  const map = {
    returned: 'success',
    completed: 'info',
    pending: 'warning',
    overdue: 'error'
  }
  return map[status] || 'default'
}

function rentalStatusLabel(status) {
  const map = {
    returned: 'Возвращено',
    completed: 'Выполнено',
    pending: 'Ожидание',
    overdue: 'Просрочено'
  }
  return map[status] || status
}

function goToCustomerTickets() {
  if (!ticket.value) return
  // Navigate to tickets list -- the search would filter by customer name in a real app
  router.push('/sales/tickets')
}

// --- History (mock) ---
const ticketHistory = computed(() => {
  if (!ticket.value) return []
  const items = [
    {
      id: 1,
      type: 'success',
      title: 'Билет создан',
      content: `Заказ #${ticket.value.orderId}, тариф "${ticket.value.tariff}"`,
      time: '15.12.2024 14:32'
    }
  ]

  if (ticket.value.status === 'used' || ticket.value.entry) {
    items.push({
      id: 2,
      type: 'info',
      title: 'Вход зафиксирован',
      content: `Проход через турникет, время: ${ticket.value.entry}`,
      time: `20.12.2024 ${ticket.value.entry}`
    })
  }

  if (ticket.value.exit) {
    items.push({
      id: 3,
      type: 'info',
      title: 'Выход зафиксирован',
      content: `Проход через турникет, время: ${ticket.value.exit}`,
      time: `20.12.2024 ${ticket.value.exit}`
    })
  }

  if (ticket.value.status === 'refunded') {
    items.push({
      id: 4,
      type: 'error',
      title: 'Билет возвращён',
      content: `Возврат на сумму ${formatMoney(ticket.value.price)}`,
      time: '16.12.2024 10:00'
    })
  }

  if (ticket.value.status === 'blocked') {
    items.push({
      id: 5,
      type: 'warning',
      title: 'Билет заблокирован',
      content: 'Заблокирован администратором',
      time: '17.12.2024 09:00'
    })
  }

  return items
})
</script>
