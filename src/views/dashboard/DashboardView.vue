<template>
  <div>
    <n-space vertical :size="24">
      <!-- Page Title -->
      <n-space justify="space-between" align="center">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700">Главная</h2>
        <n-space>
          <n-button type="primary" @click="router.push('/events/create')">Создать событие</n-button>
          <n-button @click="router.push('/sales/orders')">Ручная продажа</n-button>
          <n-button @click="router.push('/sales/orders')">Посмотреть заказы</n-button>
        </n-space>
      </n-space>

      <!-- Key Metrics -->
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-card>
            <n-statistic label="Выручка за сегодня" :value="formatNumber(metrics.today.revenue)">
              <template #suffix>&nbsp;&#8381;</template>
              <template #prefix>
                <n-tag :type="metrics.today.revenueDelta >= 0 ? 'success' : 'error'" size="small" round>
                  {{ metrics.today.revenueDelta >= 0 ? '+' : '' }}{{ metrics.today.revenueDelta }}%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Билетов продано" :value="formatNumber(metrics.today.ticketsSold)">
              <template #prefix>
                <n-tag :type="metrics.today.ticketsSoldDelta >= 0 ? 'success' : 'error'" size="small" round>
                  {{ metrics.today.ticketsSoldDelta >= 0 ? '+' : '' }}{{ metrics.today.ticketsSoldDelta }}%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Средний чек" :value="formatNumber(metrics.today.avgCheck)">
              <template #suffix>&nbsp;&#8381;</template>
              <template #prefix>
                <n-tag :type="metrics.today.avgCheckDelta >= 0 ? 'success' : 'error'" size="small" round>
                  {{ metrics.today.avgCheckDelta >= 0 ? '+' : '' }}{{ metrics.today.avgCheckDelta }}%
                </n-tag>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Заполняемость" :value="metrics.today.occupancy">
              <template #suffix>%</template>
              <template #prefix>
                <n-tag :type="metrics.today.occupancyDelta >= 0 ? 'success' : 'error'" size="small" round>
                  {{ metrics.today.occupancyDelta >= 0 ? '+' : '' }}{{ metrics.today.occupancyDelta }}%
                </n-tag>
              </template>
            </n-statistic>
            <n-progress
              type="line"
              :percentage="metrics.today.occupancy"
              :show-indicator="false"
              style="margin-top: 8px"
            />
          </n-card>
        </n-gi>
      </n-grid>

      <!-- Today's Summary -->
      <n-card title="Сводка за сегодня">
        <n-grid :cols="4" :x-gap="24">
          <n-gi>
            <n-statistic label="Событий сегодня" :value="metrics.today.eventsToday" />
          </n-gi>
          <n-gi>
            <n-statistic label="Активных заказов" :value="metrics.today.activeOrders" />
          </n-gi>
          <n-gi>
            <n-statistic label="Возвратов" :value="metrics.today.refundsToday" />
          </n-gi>
          <n-gi>
            <n-statistic label="Проходов" :value="metrics.today.passesToday" />
          </n-gi>
        </n-grid>
      </n-card>

      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <!-- Revenue Trend -->
        <n-gi>
          <n-card title="Выручка за 15 дней">
            <n-data-table
              :columns="revenueColumns"
              :data="metrics.revenueChart"
              :bordered="false"
              :single-line="false"
              size="small"
              :max-height="400"
            />
          </n-card>
        </n-gi>

        <!-- Top Events -->
        <n-gi>
          <n-card title="Топ событий">
            <n-data-table
              :columns="topEventsColumns"
              :data="metrics.topEvents"
              :bordered="false"
              :single-line="false"
              size="small"
            />
          </n-card>
        </n-gi>
      </n-grid>
    </n-space>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, NProgress } from 'naive-ui'
import { dashboardMetrics } from '../../data/mock.js'

const router = useRouter()
const metrics = dashboardMetrics

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

const revenueColumns = [
  {
    title: 'Дата',
    key: 'date',
    width: 100
  },
  {
    title: 'Выручка',
    key: 'value',
    render(row) {
      return formatNumber(row.value) + ' \u20BD'
    }
  },
  {
    title: '',
    key: 'bar',
    render(row) {
      const max = Math.max(...metrics.revenueChart.map(r => r.value))
      const pct = Math.round((row.value / max) * 100)
      return h(NProgress, {
        type: 'line',
        percentage: pct,
        showIndicator: false,
        status: pct > 70 ? 'success' : 'default'
      })
    }
  }
]

const topEventsColumns = [
  {
    title: 'Событие',
    key: 'name'
  },
  {
    title: 'Дата',
    key: 'date',
    width: 80
  },
  {
    title: 'Продано',
    key: 'sold',
    width: 100,
    render(row) {
      const pct = Math.round((row.sold / row.capacity) * 100)
      return h('div', [
        h('span', {}, `${formatNumber(row.sold)} / ${formatNumber(row.capacity)}`),
        h(NProgress, {
          type: 'line',
          percentage: pct,
          showIndicator: false,
          style: 'margin-top: 4px',
          status: pct >= 90 ? 'success' : pct >= 50 ? 'default' : 'warning'
        })
      ])
    }
  },
  {
    title: 'Выручка',
    key: 'revenue',
    width: 130,
    render(row) {
      return formatNumber(row.revenue) + ' \u20BD'
    }
  }
]
</script>
